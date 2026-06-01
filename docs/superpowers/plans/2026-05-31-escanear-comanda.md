# Lançar senha com nome + escanear comanda — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir lançar senha no painel admin com nome (manual opcional) ou escaneando a comanda com a câmera (OCR local), com confirmação antes de lançar, e exibir nome pequeno no painel.

**Architecture:** Função pura `parseComanda` (TDD) extrai nome+número do texto OCR. Composable `useOcrComanda` encapsula Tesseract.js. Componente `PainelEscanearComanda` (UModal fullscreen) faz câmera → captura → OCR → confirmação. `painel/admin.vue` ganha campo nome e botão escanear. `senha-display` ganha nome pequeno opcional.

**Tech Stack:** Nuxt 4, @nuxt/ui v4, Supabase, tesseract.js, vitest, pnpm.

Nota MCP: a coluna `nome` será criada via MCP do Supabase; o `UModal` fullscreen segue a API v4 (`fullscreen`, `v-model:open`, slots `#body`/`#footer`).

---

### Task 1: Migração — coluna `nome` na tabela `senhas`

**Via MCP do Supabase** (não há migrations no repo):

- [ ] **Step 1:** Rodar via MCP Supabase: `alter table senhas add column if not exists nome text;`
- [ ] **Step 2:** Confirmar coluna criada (listar colunas de `senhas`).

---

### Task 2: `parseComanda` (TDD, função pura)

**Files:**
- Create: `app/utils/comanda.ts`
- Test: `app/utils/comanda.spec.ts` (vitest include = `app/**/*.spec.ts`)

- [ ] **Step 1: Escrever o teste que falha**

```ts
import { describe, it, expect } from 'vitest'
import { parseComanda } from '../app/utils/comanda'

describe('parseComanda', () => {
  it('extrai nome e numero da linha Cliente', () => {
    const txt = 'Pedido: 773210 Canal: Balcao\nCliente: Jihad 455\nHorario: 21:04'
    expect(parseComanda(txt)).toEqual({ nome: 'Jihad', numero: 455 })
  })

  it('aceita nome composto', () => {
    expect(parseComanda('Cliente: Ana Maria 12')).toEqual({ nome: 'Ana Maria', numero: 12 })
  })

  it('ignora o Pedido quando nao ha numero apos o nome', () => {
    expect(parseComanda('Pedido: 773210\nCliente: Jihad')).toEqual({ nome: 'Jihad', numero: null })
  })

  it('sem linha Cliente, usa numero isolado de ate 3 digitos', () => {
    expect(parseComanda('Senha 87 chamada')).toEqual({ nome: null, numero: 87 })
  })

  it('retorna nulos quando nao ha nada reconhecivel', () => {
    expect(parseComanda('texto lixo sem dados')).toEqual({ nome: null, numero: null })
  })

  it('nao confunde Pedido de 6 digitos com a senha', () => {
    expect(parseComanda('Pedido: 773210 Canal: Balcao')).toEqual({ nome: null, numero: null })
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `pnpm test -- comanda`
Expected: FAIL (`parseComanda is not a function`).

- [ ] **Step 3: Implementar**

```ts
export interface ComandaParseada {
  nome: string | null
  numero: number | null
}

export function parseComanda (texto: string): ComandaParseada {
  const linhaCliente = texto.match(/cliente:\s*(.+)/i)?.[1]?.trim()

  if (linhaCliente) {
    // último token só-dígitos (1-3) na linha = número da senha
    const m = linhaCliente.match(/^(.*?)[\s]*(\d{1,3})\s*$/)
    if (m) {
      const nome = m[1].trim()
      return { nome: nome || null, numero: parseInt(m[2], 10) }
    }
    return { nome: linhaCliente || null, numero: null }
  }

  // sem linha Cliente: procura número isolado de 1-3 dígitos
  const isolado = texto.match(/(?<!\d)(\d{1,3})(?!\d)/)
  return { nome: null, numero: isolado ? parseInt(isolado[1], 10) : null }
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `pnpm test -- comanda`
Expected: PASS (6 testes).

- [ ] **Step 5: Commit**

```bash
git add app/utils/comanda.ts test/comanda.test.ts
git commit -m "feat: parseComanda extrai nome e numero da comanda"
```

---

### Task 3: Dependência tesseract.js + composable `useOcrComanda`

**Files:**
- Modify: `package.json` (via pnpm add)
- Create: `app/composables/useOcrComanda.ts`

- [ ] **Step 1: Instalar dependência**

Run: `pnpm add tesseract.js`

- [ ] **Step 2: Criar composable**

```ts
import { createWorker, type Worker } from 'tesseract.js'

export function useOcrComanda () {
  const lendo = ref(false)
  let worker: Worker | null = null

  async function reconhecer (image: string | Blob): Promise<string> {
    lendo.value = true
    try {
      if (!worker) worker = await createWorker('por')
      const { data } = await worker.recognize(image)
      return data.text
    } finally {
      lendo.value = false
    }
  }

  onUnmounted(async () => {
    if (worker) { await worker.terminate(); worker = null }
  })

  return { lendo, reconhecer }
}
```

- [ ] **Step 3: Lint**

Run: `pnpm lint:fix`
Expected: sem erros no arquivo novo.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml app/composables/useOcrComanda.ts
git commit -m "feat: composable useOcrComanda com tesseract.js"
```

---

### Task 4: Tipo `Senha.nome`

**Files:**
- Modify: `app/composables/useSenhas.ts:1-5`

- [ ] **Step 1: Adicionar campo nome à interface**

```ts
export interface Senha {
  id: number
  numero: number
  nome: string | null
  criado_em: string
}
```

- [ ] **Step 2: Commit**

```bash
git add app/composables/useSenhas.ts
git commit -m "feat: Senha ganha campo nome"
```

---

### Task 5: Componente `PainelEscanearComanda` (UModal fullscreen)

**Files:**
- Create: `app/components/painel/escanear-comanda.vue`

Comportamento: modal fullscreen controlado por `v-model:open`. Etapa `camera`
mostra `<video>` com stream traseiro; botão "Escanear" desenha frame num
`<canvas>`, gera dataURL, roda OCR + parseComanda, vai pra etapa `confirmar` com
campos editáveis (nome/número). "Lançar" emite `confirm`. Libera o stream ao
fechar/desmontar. Trata permissão negada / sem câmera.

- [ ] **Step 1: Criar o componente**

```vue
<script setup lang="ts">
import { parseComanda } from '~/utils/comanda'

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ confirm: [{ nome: string | null, numero: number }] }>()

const { lendo, reconhecer } = useOcrComanda()

type Etapa = 'camera' | 'confirmar'
const etapa = ref<Etapa>('camera')
const erroCamera = ref('')
const videoEl = ref<HTMLVideoElement | null>(null)
let stream: MediaStream | null = null

const nome = ref('')
const numero = ref('')

async function iniciarCamera () {
  erroCamera.value = ''
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    if (videoEl.value) {
      videoEl.value.srcObject = stream
      await videoEl.value.play()
    }
  } catch {
    erroCamera.value = 'Não foi possível acessar a câmera. Verifique a permissão.'
  }
}

function pararCamera () {
  stream?.getTracks().forEach(t => t.stop())
  stream = null
}

async function escanear () {
  const video = videoEl.value
  if (!video) return
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  canvas.getContext('2d')?.drawImage(video, 0, 0)
  const dataUrl = canvas.toDataURL('image/png')

  const texto = await reconhecer(dataUrl)
  const r = parseComanda(texto)
  nome.value = r.nome ?? ''
  numero.value = r.numero != null ? String(r.numero) : ''
  pararCamera()
  etapa.value = 'confirmar'
}

function voltar () {
  etapa.value = 'camera'
  iniciarCamera()
}

function lancar () {
  const n = parseInt(numero.value, 10)
  if (!n || n < 1 || n > 999) return
  emit('confirm', { nome: nome.value.trim() || null, numero: n })
  open.value = false
}

watch(open, (v) => {
  if (v) {
    etapa.value = 'camera'
    nome.value = ''
    numero.value = ''
    nextTick(iniciarCamera)
  } else {
    pararCamera()
  }
})

onUnmounted(pararCamera)
</script>

<template>
  <UModal
    v-model:open="open"
    fullscreen
    title="Escanear comanda"
    :ui="{ body: 'flex flex-col' }"
  >
    <template #body>
      <div
        v-if="etapa === 'camera'"
        class="flex-1 flex flex-col items-center justify-center gap-4"
      >
        <div
          v-if="erroCamera"
          class="text-error text-center"
        >
          {{ erroCamera }}
        </div>
        <video
          ref="videoEl"
          playsinline
          muted
          class="max-h-[60vh] w-auto rounded-lg bg-black"
        />
        <UButton
          size="xl"
          icon="i-heroicons-camera"
          :loading="lendo"
          :label="lendo ? 'Lendo...' : 'Escanear'"
          @click="escanear"
        />
      </div>

      <div
        v-else
        class="flex-1 flex flex-col items-center justify-center gap-6 max-w-md mx-auto w-full"
      >
        <h3 class="text-lg font-semibold">Confirmar lançamento</h3>
        <UFormField label="Nome (opcional)" class="w-full">
          <UInput v-model="nome" size="xl" placeholder="Jihad" class="w-full" />
        </UFormField>
        <UFormField label="Número" required class="w-full">
          <UInput v-model="numero" type="number" size="xl" placeholder="455" class="w-full" />
        </UFormField>
        <div class="flex gap-3 w-full">
          <UButton color="neutral" variant="subtle" block label="Escanear de novo" @click="voltar" />
          <UButton block size="xl" icon="fluent:megaphone-loud-48-filled" label="Lançar" @click="lancar" />
        </div>
      </div>
    </template>
  </UModal>
</template>
```

- [ ] **Step 2: Lint**

Run: `pnpm lint:fix`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add app/components/painel/escanear-comanda.vue
git commit -m "feat: modal de escanear comanda com camera + OCR"
```

---

### Task 6: Tela admin — campo nome + botão escanear

**Files:**
- Modify: `app/pages/painel/admin.vue`

- [ ] **Step 1: Adicionar estado e ajustar `chamarSenha`**

No `<script setup>`, adicionar `const nome = ref('')` e `const escanearAberto = ref(false)`.
Trocar o insert por:

```ts
// @ts-expect-error - Supabase schema may not be defined
const { error } = await supabase.from('senhas').insert([{ numero: numeroInt, nome: nome.value.trim() || null }])
```

E no sucesso, limpar `nome.value = ''` junto com `numero.value = ''`.

- [ ] **Step 2: Função para lançar a partir do scan**

```ts
async function lancarDoScan (payload: { nome: string | null, numero: number }) {
  numero.value = String(payload.numero)
  nome.value = payload.nome ?? ''
  await chamarSenha()
}
```

- [ ] **Step 3: Adicionar campo Nome no form e botão escanear no template**

Após o `UFormField` do número, adicionar:

```vue
<UFormField label="Nome (opcional)" name="nome">
  <UInput
    v-model="nome"
    placeholder="Jihad"
    size="xl"
    :disabled="loading"
    class="w-full"
  />
</UFormField>
```

Após o botão "Chamar Senha" (dentro do `UForm` ou logo abaixo):

```vue
<UButton
  block
  size="xl"
  color="neutral"
  variant="subtle"
  icon="i-heroicons-qr-code"
  label="Escanear comanda"
  :disabled="loading"
  @click="escanearAberto = true"
/>
```

E ao final do `UPageCard`/template, o modal:

```vue
<PainelEscanearComanda v-model:open="escanearAberto" @confirm="lancarDoScan" />
```

- [ ] **Step 4: Lint**

Run: `pnpm lint:fix`

- [ ] **Step 5: Commit**

```bash
git add app/pages/painel/admin.vue
git commit -m "feat: admin com campo nome e botao escanear comanda"
```

---

### Task 7: Display — nome pequeno opcional

**Files:**
- Modify: `app/components/painel/senha-display.vue`
- Modify: `app/components/painel/publico.vue:45-49`
- Modify: `app/components/painel/historico.vue:26-31`

- [ ] **Step 1: `senha-display` aceita `nome` e renderiza pequeno**

Adicionar à `defineProps`: `nome?: string | null`.
Envolver o SVG num wrapper coluna e adicionar o nome abaixo quando presente:

```vue
<template>
  <div class="flex flex-col items-center justify-center w-full">
    <svg
      :viewBox="`0 0 ${VIEW_W} ${VIEW_H}`"
      preserveAspectRatio="xMidYMid meet"
      class="block max-w-full"
      :class="glow ? 'senha-glow' : ''"
    >
      <text
        :key="`${texto}-${trocou}`"
        x="50%"
        y="50%"
        text-anchor="middle"
        dominant-baseline="central"
        class="font-bold senha-text"
        :style="{
          animation: trocou ? 'senhaFlip 0.55s cubic-bezier(0.22,1,0.36,1)' : 'none',
          fill: variante === 'atual' ? 'var(--ui-primary)' : 'var(--ui-text-muted)'
        }"
      >{{ texto }}</text>
    </svg>
    <span
      v-if="nome"
      class="font-medium leading-none -mt-[6%] truncate max-w-full px-2"
      :class="variante === 'atual'
        ? 'text-[clamp(1rem,5cqi,2.5rem)] text-primary'
        : 'text-[clamp(0.75rem,3cqi,1.25rem)] text-muted'"
    >{{ nome }}</span>
  </div>
</template>
```

- [ ] **Step 2: `publico.vue` passa o nome**

Na `PainelSenhaDisplay` da senha atual, adicionar `:nome="atual.nome"`.

- [ ] **Step 3: `historico.vue` passa o nome**

Na `PainelSenhaDisplay` do loop, adicionar `:nome="s.nome"`.

- [ ] **Step 4: Lint**

Run: `pnpm lint:fix`

- [ ] **Step 5: Commit**

```bash
git add app/components/painel/senha-display.vue app/components/painel/publico.vue app/components/painel/historico.vue
git commit -m "feat: painel exibe nome pequeno junto da senha"
```

---

### Task 8: Verificação manual

- [ ] Rodar `pnpm dev`, abrir `/painel/admin`.
- [ ] Lançar manual só com número → painel mostra igual a hoje (sem nome).
- [ ] Lançar manual com nome → painel mostra número grande + nome pequeno.
- [ ] Clicar "Escanear comanda" → modal fullscreen abre, câmera aparece.
- [ ] Apontar pra uma foto da comanda, "Escanear" → confirmação com nome/número preenchidos (editáveis) → "Lançar" → aparece no painel.
- [ ] `pnpm test` verde; `pnpm lint:check` limpo.

---

## Fora de escopo

Leitura contínua ao vivo, OCR em nuvem, QR na comanda, edição de senhas lançadas.
