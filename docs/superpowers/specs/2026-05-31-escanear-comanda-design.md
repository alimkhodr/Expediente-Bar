# Lançar senha com nome + escanear comanda

Data: 2026-05-31

## Objetivo

Permitir que o barman lance uma senha no painel admin de duas formas:

1. **Manual** (como hoje), agora com um campo **Nome (opcional)** além do número.
2. **Escaneando a comanda** com a câmera, dentro do próprio site, lendo o
   nome e o número via OCR e confirmando antes de lançar.

O painel público passa a exibir o **número grande + nome pequeno** quando houver
nome. Sem nome, o layout fica idêntico ao atual (só o número).

## Contexto atual

- `senhas` (Supabase): `id`, `numero`, `criado_em`. Sem nome.
- `painel/admin.vue`: formulário com um único campo `numero` → `insert({ numero })`.
- `useSenhas.ts`: carrega senhas, expõe `atual`/`historico`, realtime via channel.
- `senha-display.vue`: SVG com o número grande. Usado por `publico.vue` (atual)
  e `historico.vue` (últimas).
- Stack: Nuxt 4 + `@nuxt/ui` v4 + Supabase. Sem migrations no repo (dashboard).

## Decisões

- **OCR:** Tesseract.js, 100% local no navegador, gratuito, sem backend.
- **Captura:** tudo dentro do site. `UModal` em tela cheia com preview de câmera
  via `getUserMedia({ video: { facingMode: 'environment' } })`. Botão "Escanear"
  captura **um frame** (foto única) e roda o OCR — não há leitura contínua.
- **Confirmação obrigatória:** OCR nunca lança sozinho. Sempre passa por um passo
  de confirmação com campos editáveis. Se a leitura falhar, abre com campos vazios.
- **Sem nome → só o número** no painel (sem espaço reservado).

## Mudanças

### 1. Banco (rodar manualmente no Supabase SQL Editor)

```sql
alter table senhas add column nome text;
```

Coluna opcional (nullable). Registros antigos seguem válidos.

### 2. Camada de dados — `app/composables/useSenhas.ts`

- `Senha` ganha `nome: string | null`.

### 3. Parsing da comanda — `app/utils/comanda.ts` (novo)

`parseComanda(textoOcr: string): { nome: string | null, numero: number | null }`

- Procura a linha `Cliente:` via regex `/cliente:\s*(.+)/i`.
- Na captura: último token só-dígitos = número da senha; o restante (trim) = nome.
  - Ex.: `Cliente: Jihad 455` → `{ nome: 'Jihad', numero: 455 }`.
- Ignora `Pedido:` (não é a senha).
- Sem linha `Cliente:` → tenta achar um número isolado de 1–3 dígitos como número;
  nome fica `null`. Se nada bater, retorna `{ nome: null, numero: null }`.
- Função pura, testável isoladamente (TDD).

### 4. OCR — `app/composables/useOcrComanda.ts` (novo)

- Encapsula Tesseract.js (`createWorker('por')`), lazy: worker só é criado na
  primeira leitura. Expõe `reconhecer(imageData): Promise<string>` e `lendo` (ref).
- `tesseract.js` adicionado às dependências.

### 5. Modal de escanear — `app/components/painel/escanear-comanda.vue` (novo)

`UModal` fullscreen com duas etapas internas:

- **Etapa câmera:** `<video>` com o stream; botão "Escanear" desenha o frame num
  `<canvas>`, gera a imagem, chama `useOcrComanda` → `parseComanda`.
  Trata permissão negada / sem câmera com mensagem clara.
- **Etapa confirmação:** campos editáveis Nome e Número (pré-preenchidos pelo OCR),
  botões "Lançar" e "Voltar"/"Tentar de novo".
- Emite `confirm({ nome, numero })` para o pai lançar. Fecha e libera o stream
  (`getTracks().forEach(t => t.stop())`) ao fechar/desmontar.

### 6. Tela admin — `app/pages/painel/admin.vue`

- Form manual ganha campo **Nome (opcional)**.
- `chamarSenha` passa a enviar `{ numero, nome: nome || null }`.
- Botão "Escanear comanda" abre `PainelEscanearComanda`; no `confirm`, reusa o
  mesmo caminho de insert.

### 7. Display — `app/components/painel/senha-display.vue` + consumidores

- `senha-display` aceita prop opcional `nome`. Renderiza o número como hoje e,
  quando `nome` presente, um texto pequeno abaixo. Sem nome → inalterado.
- `publico.vue` passa `:nome="atual.nome"`; `historico.vue` passa `:nome="s.nome"`.

## Fluxo

```
Escanear comanda → UModal fullscreen
  → câmera (getUserMedia) → [Escanear] captura frame
  → Tesseract OCR → parseComanda → etapa confirmação (editável)
  → [Lançar] → insert({ numero, nome }) → realtime atualiza painel
```

## Testes

- `parseComanda`: casos `Cliente: Jihad 455`, nome composto, sem linha Cliente,
  número ausente, lixo de OCR. (Unitário, TDD.)
- Verificação manual no app: lançar manual com/sem nome; escanear uma foto da
  comanda; conferir exibição no painel com e sem nome.

## Fora de escopo

- Leitura contínua ao vivo.
- OCR em nuvem / QR na comanda.
- Histórico/edição de senhas já lançadas.
