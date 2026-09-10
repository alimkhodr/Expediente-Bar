<script setup lang="ts">
import type { LinkHero } from '~/types/conteudo'
import type { EventosResponse } from '~/types/eventos'

const props = defineProps<{ itens: LinkHero[] }>()
const { trackEvent } = useAnalytics()

/** Fotos de fundo do hero: a primeira carrega com a página, as demais entram depois e alternam com transição. */
const fundos = [
  { src: '/images/hero/fachada.webp', alt: 'Fachada do Expediente Bar ao entardecer' }
  // { src: '/images/hero/mural.webp', alt: 'Mural do Expediente Bar' } — aguardando o arquivo em alta
]
const fundoAtual = ref(0)
const fundosCarregados = ref(false)
onMounted(() => {
  if (fundos.length < 2) return
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduzido) return
  // só começa a baixar as outras fotos depois que a página assentou
  const iniciar = () => {
    fundosCarregados.value = true
    const timer = setInterval(() => { fundoAtual.value = (fundoAtual.value + 1) % fundos.length }, 7000)
    onUnmounted(() => clearInterval(timer))
  }
  if ('requestIdleCallback' in window) window.requestIdleCallback(iniciar, { timeout: 4000 })
  else setTimeout(iniciar, 2500)
})

const externo = (url: string) => /^https?:\/\//.test(url)
const alvo = (url: string) => (externo(url) ? '_blank' : undefined)
const rel = (url: string) => (externo(url) ? 'noopener noreferrer' : undefined)

/** Próximo evento do Sympla (SSR; a API fica em cache por 1h). */
const { data: eventosData } = await useFetch<EventosResponse>('/api/eventos', { key: 'eventos-hero' })
const proximoEvento = computed(() => eventosData.value?.eventos[0] ?? null)

/** Dois primeiros links = botões; o link "eventos" vira o card largo; o resto forma o grid. */
const botoes = computed(() => props.itens.slice(0, 2))
const linkEventos = computed(() => props.itens.find(l => l.id === 'eventos') ?? null)
const cards = computed(() => props.itens.slice(2).filter(l => l.id !== 'eventos').slice(0, 4))

function clicar (id: string, titulo: string) {
  trackEvent('hero_link_click', { id, titulo })
}
</script>

<template>
  <UPageHero
    id="inicio"
    as="section"
    aria-labelledby="hero-titulo"
    orientation="horizontal"
    :ui="{
      root: 'relative isolate min-h-[100svh] flex items-center overflow-hidden bg-black',
      container: 'relative z-10 w-full max-w-6xl gap-10 px-8 pt-10 pb-16 sm:py-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-12 lg:py-10',
      wrapper: 'flex flex-col items-start text-left entrar',
      headline: 'mb-6 flex flex-col items-start gap-5',
      title: 'text-5xl sm:text-6xl lg:text-[4.25rem] font-bold leading-[1.02] tracking-tight text-white',
      description: 'mt-6 max-w-md text-base sm:text-lg text-white/80',
      links: 'mt-1 flex-wrap justify-start gap-3',
      body: 'mt-0'
    }"
  >
    <template #top>
      <div
        class="absolute inset-0 z-0"
        aria-hidden="true"
      >
        <NuxtImg
          v-for="(fundo, i) in fundos"
          v-show="i === 0 || fundosCarregados"
          :key="fundo.src"
          :src="fundo.src"
          alt=""
          width="1600"
          height="1717"
          sizes="xs:100vw md:1280px"
          densities="x1"
          quality="62"
          :fetchpriority="i === 0 ? 'high' : undefined"
          :loading="i === 0 ? 'eager' : 'lazy'"
          :preload="i === 0 ? { fetchPriority: 'high' } : false"
          class="absolute inset-0 h-full w-full object-cover object-[center_35%] transition-opacity duration-[1500ms] ease-in-out"
          :class="i === fundoAtual ? 'opacity-100' : 'opacity-0'"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/60" />
        <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black" />
        <div class="absolute inset-0 bg-[radial-gradient(50%_45%_at_20%_40%,rgba(255,165,7,0.16),transparent_70%)]" />
      </div>

    </template>

    <template #headline>
      <img
        src="/logo.svg"
        alt="Expediente Bar"
        width="476"
        height="151"
        class="h-11 w-auto sm:h-12"
        fetchpriority="high"
      />
    </template>

    <template #title>
      <span
        id="hero-titulo"
        class="block"
      >
        O melhor<br/>
        <span class="text-primary italic">expediente</span><br/>
        é aqui!
      </span>
    </template>

    <template #description>
      Pagode e sertanejo ao vivo, cerveja gelada, porções e drinks. Terça a sábado, a partir das 17h.
    </template>

    <template #links>
      <UButton
        v-for="(link, i) in botoes"
        :key="link.id"
        :to="link.url"
        :target="alvo(link.url)"
        :rel="rel(link.url)"
        :icon="link.icone"
        :color="i === 0 ? 'primary' : 'neutral'"
        :variant="i === 0 ? 'solid' : 'outline'"
        size="xl"
        class="min-h-12 rounded-full px-6 font-semibold"
        :class="i !== 0 ? 'bg-black/50 text-white backdrop-blur-sm hover:bg-white/10' : ''"
        :label="link.titulo"
        @click="clicar(link.id, link.titulo)"
      />
    </template>

    <!-- Grid "bento" à direita -->
    <nav
      aria-label="Atalhos"
      class="entrar entrar-2 w-full"
    >
      <ul class="grid grid-cols-2 gap-3 sm:gap-4">
        <!-- Card largo: próximo evento do Sympla (ou o link de eventos quando não há evento) -->
        <li
          v-if="proximoEvento || linkEventos"
          class="col-span-2"
        >
          <UPageCard
            v-if="proximoEvento"
            :to="proximoEvento.url"
            target="_blank"
            :ui="{
              root: 'group relative h-[13.5rem] sm:h-[15rem] overflow-hidden rounded-xl ring-white/15 bg-stone-900 text-left transition hover:ring-primary/70',
              container: 'h-full p-0 sm:p-0',
              wrapper: 'relative h-full justify-end items-stretch p-5 sm:p-6',
              body: 'flex-none w-full'
            }"
            @click="clicar('evento', proximoEvento.nome)"
          >
            <template #header>
              <NuxtImg
                v-if="proximoEvento.imagem"
                :src="proximoEvento.imagem"
                :alt="`Cartaz do evento ${proximoEvento.nome}`"
                width="960"
                height="540"
                sizes="xs:100vw lg:640px"
                densities="x1"
                format="webp"
                quality="70"
                loading="eager"
                fetchpriority="high"
                class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10"
                aria-hidden="true"
              />
              <UBadge
                color="primary"
                variant="solid"
                size="sm"
                class="absolute left-4 top-4 rounded-full font-semibold uppercase tracking-wide"
              >
                Próximo evento
              </UBadge>
              <span
                class="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors group-hover:bg-primary group-hover:text-black"
                aria-hidden="true"
              >
                <UIcon
                  name="i-lucide-arrow-up-right"
                  class="size-4"
                />
              </span>
            </template>
            <template #body>
              <div class="relative flex flex-col gap-1">
                <time
                  :datetime="comOffsetSaoPaulo(proximoEvento.inicio)"
                  class="text-xs font-medium text-white/80 sm:text-sm"
                >
                  {{ formatarLinhaEvento(proximoEvento.inicio) }}
                </time>
                <p class="text-xl font-bold leading-tight text-white sm:text-2xl">
                  {{ proximoEvento.nome }}
                </p>
                <NuxtLink
                  to="/eventos"
                  class="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  @click.stop="clicar('eventos', 'Eventos e ingressos')"
                >
                  Eventos e ingressos
                  <UIcon
                    name="i-lucide-arrow-right"
                    class="size-4"
                    aria-hidden="true"
                  />
                </NuxtLink>
              </div>
            </template>
          </UPageCard>

          <UPageCard
            v-else-if="linkEventos"
            :to="linkEventos.url"
            :target="alvo(linkEventos.url)"
            :icon="linkEventos.icone"
            :title="linkEventos.titulo"
            :description="linkEventos.descricao"
            orientation="horizontal"
            :ui="{
              root: 'rounded-xl ring-white/10 bg-stone-950/85 text-left transition hover:ring-primary/60 hover:-translate-y-0.5',
              container: 'p-5 sm:p-6',
              leadingIcon: 'size-7 text-primary',
              title: 'text-lg text-white',
              description: 'text-white/70'
            }"
            @click="clicar(linkEventos.id, linkEventos.titulo)"
          />
        </li>

        <li
          v-for="(link, i) in cards"
          :key="link.id"
        >
          <UPageCard
            :to="link.url"
            :target="alvo(link.url)"
            :rel="rel(link.url)"
            :icon="link.icone"
            :title="link.titulo"
            :description="link.descricao"
            :ui="{
              root: [
                'group relative h-full overflow-hidden rounded-xl text-left transition duration-300 hover:-translate-y-0.5',
                i === 0 ? 'bg-primary text-black ring-primary hover:bg-yellow-400' : 'bg-stone-950/85 ring-white/10 hover:ring-primary/60',
                i < 2 ? 'min-h-[9.5rem]' : ''
              ].join(' '),
              container: 'h-full p-4 sm:p-5',
              wrapper: 'relative h-full justify-end items-start',
              leading: [
                'mb-auto inline-flex size-10 items-center justify-center rounded-lg',
                i === 0 ? 'bg-black/10' : 'bg-white/10'
              ].join(' '),
              leadingIcon: i === 0 ? 'size-5 text-black' : 'size-5 text-primary',
              title: i === 0 ? 'text-base sm:text-lg font-bold text-black' : 'text-base sm:text-lg font-bold text-white',
              description: i === 0 ? 'text-black/75 text-xs sm:text-sm' : 'text-white/70 text-xs sm:text-sm'
            }"
            @click="clicar(link.id, link.titulo)"
          >
            <template
              v-if="link.imagem"
              #header
            >
              <NuxtImg
                :src="link.imagem"
                alt=""
                width="480"
                height="360"
                sizes="xs:50vw lg:320px"
                loading="eager"
                class="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20"
                aria-hidden="true"
              />
            </template>
          </UPageCard>
        </li>
      </ul>
    </nav>
  </UPageHero>
</template>
