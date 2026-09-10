# Expediente Bar

Site do [Expediente Bar](https://expedientebar.com.br) — bar com pagode ao vivo em São José dos Campos.
Nuxt 4 + Nuxt UI 4 + Tailwind 4, hospedado no Netlify, com CMS leve no Supabase.

[![Netlify Status](https://api.netlify.com/api/v1/badges/7b44803b-73ca-4892-ad8d-b4dade905c37/deploy-status)](https://app.netlify.com/sites/expedientebar/deploys)

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Nuxt 4 (SSR híbrido: home com cache na CDN, cardápio pré-renderizado, eventos com SWR) |
| UI | Nuxt UI 4 (todas as telas, exceto `/tv`) + [Vue Bits](https://vue-bits.dev) para animações (DomeGallery, LogoLoop, TiltedCard, BlurText) |
| Imagens | `@nuxt/image` (Netlify Image CDN em produção, IPX em dev) |
| SEO | `@nuxtjs/sitemap`, `@nuxtjs/robots`, JSON-LD (BarOrPub, Event, FAQPage, Menu, BreadcrumbList) |
| Dados | Supabase (CMS e senhas), Google Places (horário e avaliações), Sympla (eventos) |
| Analytics | PostHog |
| Testes | Vitest (unitário), Playwright (E2E), Lighthouse (script) |
| Deploy | Netlify (`netlify.toml`) |

## Rodando localmente

```bash
pnpm install
cp .env.example .env   # preencha as variáveis
pnpm dev               # http://localhost:3000
pnpm dev:netlify       # via Netlify CLI (redirects/headers/funções como em produção)
```

Sem `.env` o site público funciona com conteúdo padrão; admin, TV e integrações ficam desativados.

### Variáveis de ambiente

| Variável | Uso |
|---|---|
| `SUPABASE_URL`, `SUPABASE_KEY` | CMS (`/admin/cms`), painel de senhas (`/tv`, `/admin`) e login |
| `NUXT_GOOGLE_PLACES_KEY` | Horário de funcionamento e avaliações do Google (servidor) |
| `NUXT_SYMPLA_TOKEN` | Eventos do Sympla (servidor). Gere em *Minha Conta > Integrações* |
| `NUXT_PUBLIC_POSTHOG_KEY` | Analytics |
| `NUXT_PUBLIC_SITE_URL` | URL canônica (sitemap, canonical, Open Graph) |

## Estrutura

```
app/
  components/        seções da home (hero-links, destaques, agenda-semanal, galeria, …)
    vue-bits/        componentes do Vue Bits vendorizados (MIT)
    painel/          painel de senhas da TV (HTML puro: Chrome antigo)
    admin/           blocos do CMS
  composables/       usePaginaSeo, useSchemaOrg, useHorario, useConteudo, useVisivel
  pages/             index, cardapio, eventos, tv, login, admin/index, admin/cms
  utils/             site.ts (dados do negócio), links.ts, conteudo-padrao.ts, datas.ts
server/api/          eventos (Sympla), conteudo (CMS), places/* (Google)
supabase/migrations/ SQL do CMS
scripts/             otimizar-imagens, capturas, lighthouse
e2e/                 testes Playwright
```

## Conteúdo e CMS

- **Automático**: eventos (Sympla), horário e avaliações (Google), sitemap/robots.
- **Manual** em `/admin/cms` (login Supabase): links do início, destaques, agenda semanal e FAQ.
  A home tem cache de 5 min na CDN; edições aparecem sem redeploy.
- Padrões em `app/utils/conteudo-padrao.ts`. Dados fixos do negócio em `app/utils/site.ts`.

Para criar a tabela do CMS no Supabase, execute `supabase/migrations/20260909000000_conteudo_cms.sql`
no SQL Editor (cria `public.conteudo` com RLS: leitura pública, escrita autenticada).

## Imagens

```bash
pnpm imagens:galeria "/caminho/das/fotos"   # → public/images/galeria/*.webp + app/assets/data/galeria.json
pnpm imagens:cardapio                        # PNG → WebP em public/images/cardapio
pnpm imagens:marcas                          # logos → WebP 600px
pnpm imagens:favicons                        # favicons + apple-touch-icon + og-image a partir de public/favicon.svg
```

## Testes e qualidade

```bash
pnpm lint          # eslint
pnpm test          # vitest
pnpm test:e2e      # playwright (faz build node-server e sobe em :3100)
pnpm lighthouse    # BASE_URL=http://localhost:3100 (padrão) — exige notas ≥ 90
                   # Nota: o servidor local não comprime o HTML SSR nem cacheia imagens do IPX,
                   # então Performance local fica abaixo do Netlify. Meça em produção com
                   # BASE_URL=https://expedientebar.com.br pnpm lighthouse
pnpm build:local   # build com preset node-server para rodar `node .output/server/index.mjs`
node scripts/capturas.mjs   # capturas de tela em ./capturas
```

## Deploy (Netlify)

`netlify.toml` roda `npm run build` (preset `netlify`), publica `dist` e adiciona cabeçalhos de segurança.
Redirects e cache de `/_nuxt/*` são gerados pelo Nuxt. Configure as variáveis acima em
*Site configuration → Environment variables*.

## Rotas internas

| Rota | Função |
|---|---|
| `/tv` | Painel de senhas na TV (Fire TV, Chrome antigo — sem Nuxt UI) |
| `/admin` | Chamar senhas (login) |
| `/admin/cms` | Conteúdo do site (login) |
| `/login` | Autenticação Supabase |

Todas com `noindex` e bloqueadas no `robots.txt`. URLs antigas (`/painel*`, `/admin` de avisos) redirecionam.
