<script setup lang="ts">
/**
 * Mural de fotos em tela cheia: grade plana, arrastável (com inércia) e com deslize
 * automático lento. Toque/clique numa foto abre o PhotoSwipe (mesmo visualizador do cardápio).
 *
 * Só usa `transform` num único elemento (composição na GPU), rAF apenas enquanto a seção está
 * visível, imagens com lazy loading e sem dependência de animação externa.
 */
import 'photoswipe/style.css'
import galleryManifest from '~/assets/data/galeria.json'

interface Photo { src: string, width: number, height: number, alt: string }

const ROWS = 4
const DRIFT_PX_PER_SECOND = 22
const FRICTION = 0.94
const DRAG_THRESHOLD_PX = 6

const img = useImage()
const { trackEvent } = useAnalytics()

/** Embaralha com semente fixa: mesma ordem no servidor e no cliente (evita mismatch de hidratação). */
function seededShuffle<T> (list: T[], seed = 20260909): T[] {
  const copy = [...list]
  let x = seed
  for (let i = copy.length - 1; i > 0; i--) {
    x = (x * 1103515245 + 12345) & 0x7fffffff
    const j = x % (i + 1)
    ;[copy[i], copy[j]] = [copy[j]!, copy[i]!]
  }
  return copy
}

/** Só as fotos grandes entram no mural; os "detalhes" pequenos ficam de fora. */
const photos: Photo[] = seededShuffle(galleryManifest.filter(f => f.src.includes('/foto-')))

const sectionRef = ref<HTMLElement | null>(null)
const wallRef = ref<HTMLElement | null>(null)
const copyRef = ref<HTMLElement | null>(null)

let x = 0
let velocityX = 0
let copyWidth = 0
let dragging = false
let dragged = false
let lastPointerX = 0
let pointerStartY = 0
let lastMoveAt = 0
let frame = 0
let lastFrameAt = 0
let visible = false
let reducedMotion = false
let pressedTile: HTMLElement | null = null
let lightbox: import('photoswipe/lightbox').default | null = null

function measure () {
  copyWidth = copyRef.value?.getBoundingClientRect().width ?? 0
  applyTransform()
}

function wrapX () {
  if (copyWidth <= 0) return
  // Duas cópias lado a lado: quando a primeira sai da tela, volta um ciclo (loop infinito)
  if (x <= -copyWidth) x += copyWidth
  else if (x > 0) x -= copyWidth
}

function applyTransform () {
  if (wallRef.value) wallRef.value.style.transform = `translate3d(${x}px, 0, 0)`
}

function tick (now: number) {
  const dt = Math.min(48, now - (lastFrameAt || now)) / 1000
  lastFrameAt = now

  if (!dragging) {
    if (Math.abs(velocityX) > 5) {
      x += velocityX * dt
      velocityX *= FRICTION
    } else {
      velocityX = 0
      if (!reducedMotion) x -= DRIFT_PX_PER_SECOND * dt
    }
    wrapX()
    applyTransform()
  }

  frame = visible ? requestAnimationFrame(tick) : 0
}

function startLoop () {
  if (!frame && visible) {
    lastFrameAt = 0
    frame = requestAnimationFrame(tick)
  }
}

function onPointerDown (e: PointerEvent) {
  if (e.button !== 0) return
  dragging = true
  dragged = false
  pressedTile = (e.target as HTMLElement).closest<HTMLElement>('button[data-index]')
  velocityX = 0
  lastPointerX = e.clientX
  pointerStartY = e.clientY
  lastMoveAt = e.timeStamp
  sectionRef.value?.setPointerCapture(e.pointerId)
}

function onPointerMove (e: PointerEvent) {
  if (!dragging) return
  const dx = e.clientX - lastPointerX
  // Só o eixo horizontal move o mural; o vertical continua rolando a página
  if (!dragged && Math.hypot(e.clientX - lastPointerX, e.clientY - pointerStartY) < DRAG_THRESHOLD_PX) return
  dragged = true
  const dt = Math.max(1, e.timeStamp - lastMoveAt)
  velocityX = (dx / dt) * 1000
  x += dx
  lastPointerX = e.clientX
  lastMoveAt = e.timeStamp
  wrapX()
  applyTransform()
}

function onPointerUp (e: PointerEvent) {
  if (!dragging) return
  dragging = false
  // Se parou o dedo antes de soltar, não há inércia
  if (e.timeStamp - lastMoveAt > 80) {
    velocityX = 0
  }
  velocityX = Math.max(-2500, Math.min(2500, velocityX))
  if (dragged) {
    trackEvent('galeria_arrastar')
  } else {
    // Com pointer capture o evento `click` cai na seção, não no botão: abrimos a foto pressionada
    if (pressedTile) openFromTile(Number(pressedTile.dataset.index))
  }
  pressedTile = null
  startLoop()
}

function openFromTile (index: number) {
  trackEvent('galeria_foto_click', { foto: index + 1 })
  openPhoto(index)
}

function onWheel (e: WheelEvent) {
  // Trackpad/scroll horizontal move o mural; vertical continua rolando a página
  if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
  e.preventDefault()
  x -= e.deltaX
  wrapX()
  applyTransform()
}

async function openPhoto (index: number) {
  if (!lightbox) {
    const { default: PhotoSwipeLightbox } = await import('photoswipe/lightbox')
    lightbox = new PhotoSwipeLightbox({
      dataSource: photos.map(photo => ({
        src: img(photo.src, { width: 1080, quality: 82 }),
        width: photo.width,
        height: photo.height,
        alt: photo.alt
      })),
      pswpModule: () => import('photoswipe'),
      bgOpacity: 0.95,
      closeTitle: 'Fechar',
      zoomTitle: 'Ampliar',
      arrowPrevTitle: 'Foto anterior',
      arrowNextTitle: 'Próxima foto',
      errorMsg: 'Não foi possível carregar a foto.'
    })
    lightbox.init()
  }
  lightbox.loadAndOpen(index)
}

/** Só o teclado (Enter/Espaço) chega aqui com detail 0; o mouse/toque é tratado no pointerup. */
function onTileClick (e: MouseEvent, index: number) {
  if (e.detail !== 0) return
  openFromTile(index)
}

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  measure()

  const resize = new ResizeObserver(measure)
  if (sectionRef.value) resize.observe(sectionRef.value)
  if (copyRef.value) resize.observe(copyRef.value)

  // Só anima enquanto a seção está na tela
  const intersection = new IntersectionObserver((entries) => {
    visible = entries.some(en => en.isIntersecting)
    if (visible) startLoop()
  }, { threshold: 0.05 })
  if (sectionRef.value) intersection.observe(sectionRef.value)

  sectionRef.value?.addEventListener('wheel', onWheel, { passive: false })

  onUnmounted(() => {
    resize.disconnect()
    intersection.disconnect()
    sectionRef.value?.removeEventListener('wheel', onWheel)
    if (frame) cancelAnimationFrame(frame)
    lightbox?.destroy()
    lightbox = null
  })
})
</script>

<template>
  <section
    id="galeria"
    ref="sectionRef"
    aria-label="Galeria de fotos do Expediente Bar"
    class="photo-wall relative h-[100svh] w-full select-none overflow-hidden bg-black"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <p class="sr-only">
      Arraste para o lado para ver mais fotos. Toque em uma foto para ampliar.
    </p>

    <div
      ref="wallRef"
      class="flex w-max will-change-transform"
    >
      <ul
        v-for="copy in 2"
        :key="copy"
        :ref="copy === 1 ? (el => { copyRef = el as HTMLElement }) : undefined"
        :aria-hidden="copy === 2 ? 'true' : undefined"
        class="photo-wall__grid grid pr-[var(--gap)]"
        :style="{ gridTemplateRows: `repeat(${ROWS}, var(--tile-h))` }"
      >
        <li
          v-for="(photo, i) in photos"
          :key="photo.src"
          class="w-[var(--tile-w)] overflow-hidden rounded-xl bg-stone-900"
          :class="Math.floor(i / ROWS) % 2 === 1 ? 'translate-y-[calc(var(--tile-h)/-2)]' : ''"
        >
          <button
            type="button"
            class="block h-full w-full cursor-grab active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-primary"
            :data-index="i"
            :aria-label="`Ampliar: ${photo.alt}`"
            :tabindex="copy === 2 ? -1 : 0"
            @click="onTileClick($event, i)"
          >
            <NuxtImg
              :src="photo.src"
              :alt="photo.alt"
              width="480"
              height="600"
              sizes="240px"
              densities="x1 x2"
              quality="72"
              loading="lazy"
              draggable="false"
              class="h-full w-full object-cover"
            />
          </button>
        </li>
      </ul>
    </div>

    <!-- Sombras nas bordas para as fotos "entrarem" e "saírem" suavemente -->
    <div
      class="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent sm:w-28"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent sm:w-28"
      aria-hidden="true"
    />
  </section>
</template>

<style scoped>
.photo-wall {
  --gap: 10px;
  /* 4 linhas com colunas alternadas deslocadas meia foto para cima:
     3,5 fotos + 3 vãos precisam cobrir a altura da seção (sem sobras no topo ou embaixo) */
  --tile-h: calc((100svh - 3 * var(--gap)) / 3.4);
  --tile-w: calc(var(--tile-h) * 4 / 5);
  /* O toque vertical continua rolando a página; o horizontal arrasta o mural */
  touch-action: pan-y pinch-zoom;
  contain: layout paint;
}

@media (min-width: 640px) {
  .photo-wall {
    --gap: 12px;
  }
}

.photo-wall__grid {
  grid-auto-flow: column;
  grid-auto-columns: var(--tile-w);
  gap: var(--gap);
}
</style>
