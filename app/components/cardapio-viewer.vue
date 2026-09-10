<script setup lang="ts">
import 'photoswipe/style.css'

interface Pagina { src: string; largura: number; altura: number; titulo: string }

const props = defineProps<{ paginas: Pagina[] }>()
const { trackEvent } = useAnalytics()
const img = useImage()

const galeriaRef = ref<HTMLElement | null>(null)
const paginaAtual = ref(1)
/** Páginas além da primeira só baixam a imagem quando chegam perto da tela. */
const paginasVisiveis = ref<Set<number>>(new Set([0]))
const revelar = (i: number) => { if (!paginasVisiveis.value.has(i)) paginasVisiveis.value = new Set([...paginasVisiveis.value, i]) }
let lightbox: import('photoswipe/lightbox').default | null = null

onMounted(async () => {
  const { default: PhotoSwipeLightbox } = await import('photoswipe/lightbox')
  lightbox = new PhotoSwipeLightbox({
    gallery: galeriaRef.value!,
    children: 'a[data-pswp-width]',
    pswpModule: () => import('photoswipe'),
    initialZoomLevel: 'fit',
    secondaryZoomLevel: 2,
    maxZoomLevel: 5,
    wheelToZoom: true,
    bgOpacity: 0.95,
    padding: { top: 24, bottom: 24, left: 12, right: 12 },
    closeTitle: 'Fechar',
    zoomTitle: 'Ampliar',
    arrowPrevTitle: 'Página anterior',
    arrowNextTitle: 'Próxima página',
    errorMsg: 'Não foi possível carregar a página do cardápio.'
  })
  lightbox.on('change', () => {
    if (lightbox?.pswp) paginaAtual.value = lightbox.pswp.currIndex + 1
  })
  lightbox.init()

  // Acompanha qual página está visível na rolagem
  const observer = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (e.isIntersecting) paginaAtual.value = Number((e.target as HTMLElement).dataset.pagina)
    }
  }, { rootMargin: '-40% 0px -55% 0px' })
  // Revela as imagens das próximas páginas com antecedência de uma tela
  const revelador = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (e.isIntersecting) revelar(Number((e.target as HTMLElement).dataset.pagina) - 1)
    }
  }, { rootMargin: '100% 0px' })
  galeriaRef.value?.querySelectorAll<HTMLElement>('[data-pagina]').forEach((el) => {
    observer.observe(el)
    revelador.observe(el)
  })
  onUnmounted(() => {
    observer.disconnect()
    revelador.disconnect()
  })
})

onUnmounted(() => {
  lightbox?.destroy()
  lightbox = null
})

function abrir (indice: number) {
  trackEvent('cardapio_zoom', { pagina: indice + 1 })
}

function irPara (n: number) {
  const alvo = galeriaRef.value?.querySelector<HTMLElement>(`[data-pagina="${n}"]`)
  alvo?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function ampliarAtual () {
  lightbox?.loadAndOpen(paginaAtual.value - 1)
}
</script>

<template>
  <div class="relative">
    <div
      ref="galeriaRef"
      class="mx-auto flex max-w-3xl flex-col gap-6"
    >
      <figure
        v-for="(pagina, i) in props.paginas"
        :key="pagina.src"
        :data-pagina="i + 1"
        class="scroll-mt-28"
      >
        <a
          :href="pagina.src"
          :data-pswp-width="pagina.largura"
          :data-pswp-height="pagina.altura"
          :data-pswp-srcset="`${img(pagina.src, { width: 800 })} 800w, ${img(pagina.src, { width: 1414 })} 1414w`"
          target="_blank"
          rel="noreferrer"
          class="group relative block overflow-hidden rounded-2xl ring-1 ring-white/10 transition-shadow hover:ring-primary/60 focus-visible:ring-primary"
          :aria-label="`${pagina.titulo} – toque para ampliar`"
          @click="abrir(i)"
        >
          <NuxtImg
            v-if="paginasVisiveis.has(i)"
            :src="pagina.src"
            :alt="pagina.titulo"
            :width="pagina.largura"
            :height="pagina.altura"
            quality="72"
            sizes="xs:100vw md:768px"
            :loading="i === 0 ? 'eager' : 'lazy'"
            :preload="i === 0 ? { fetchPriority: 'high' } : false"
            :fetchpriority="i === 0 ? 'high' : undefined"
            class="h-auto w-full bg-stone-900"
          />
          <div
            v-else
            class="w-full bg-stone-900"
            :style="{ aspectRatio: `${pagina.largura} / ${pagina.altura}` }"
            aria-hidden="true"
          />
          <span
            class="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/75 px-3 py-1.5 text-xs text-white opacity-90 backdrop-blur transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          >
            <UIcon
              name="i-lucide-zoom-in"
              class="size-3.5"
            />
            Toque para ampliar
          </span>
        </a>
        <figcaption class="mt-2 text-center text-xs text-muted">
          {{ pagina.titulo }} · {{ i + 1 }} de {{ props.paginas.length }}
        </figcaption>
      </figure>
    </div>

    <!-- Barra de navegação fixa (mobile-first) -->
    <div class="pointer-events-none sticky bottom-4 z-30 mt-8 flex justify-center">
      <div
        class="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/85 p-1 shadow-xl backdrop-blur"
        role="group"
        aria-label="Navegação do cardápio"
      >
        <UButton
          icon="i-lucide-chevron-up"
          color="neutral"
          variant="ghost"
          size="lg"
          aria-label="Página anterior"
          :disabled="paginaAtual <= 1"
          @click="irPara(paginaAtual - 1)"
        />
        <span
          class="min-w-[6.5rem] text-center text-sm text-white"
          aria-live="polite"
        >
          Página {{ paginaAtual }} / {{ props.paginas.length }}
        </span>
        <UButton
          icon="i-lucide-chevron-down"
          color="neutral"
          variant="ghost"
          size="lg"
          aria-label="Próxima página"
          :disabled="paginaAtual >= props.paginas.length"
          @click="irPara(paginaAtual + 1)"
        />
        <UButton
          icon="i-lucide-maximize-2"
          color="primary"
          size="lg"
          class="rounded-full"
          aria-label="Ampliar página atual"
          @click="ampliarAtual"
        />
      </div>
    </div>
  </div>
</template>
