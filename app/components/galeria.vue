<script setup lang="ts">
import galeria from '~/assets/data/galeria.json'

const img = useImage()
const { trackEvent } = useAnalytics()

function aoClicarFoto (e: MouseEvent) {
  const alvo = (e.target as HTMLElement).closest('img')
  if (alvo) trackEvent('galeria_foto_click', { foto: alvo.getAttribute('alt') })
}

/** Embaralha com semente fixa: mistura as fotos sem diferir entre servidor e cliente (evita mismatch de hidratação). */
function embaralhar<T> (lista: T[], semente = 20260909): T[] {
  const copia = [...lista]
  let x = semente
  for (let i = copia.length - 1; i > 0; i--) {
    x = (x * 1103515245 + 12345) & 0x7fffffff
    const j = x % (i + 1)
    ;[copia[i], copia[j]] = [copia[j]!, copia[i]!]
  }
  return copia
}

/** Só as fotos grandes entram no domo; os "detalhes" pequenos ficam de fora. */
const fotos = embaralhar(galeria.filter(f => f.src.includes('/foto-')))

const imagensDomo = fotos.map((f, i) => ({
  src: img(f.src, { width: 640, quality: 74 }),
  alt: `Foto ${i + 1} do Expediente Bar`
}))

const amostra = fotos.slice(0, 8)

/** Celular (retrato): a esfera precisa crescer a partir da altura para cobrir a tela. */
const estreito = ref(false)
onMounted(() => {
  const mq = window.matchMedia('(max-width: 640px)')
  estreito.value = mq.matches
  mq.addEventListener('change', e => { estreito.value = e.matches })
})
</script>

<template>
  <section
    id="galeria"
    aria-label="Galeria de fotos do Expediente Bar"
    class="relative h-[100svh] w-full overflow-hidden bg-black"
    @click="aoClicarFoto"
  >
    <ClientOnly>
      <!-- A esfera é maior que a tela de propósito: o overflow corta as bordas e as fotos cobrem tudo.
           O wrapper é mais alto que a seção e começa acima dela porque o domo é levemente "top-heavy". -->
      <div class="absolute inset-x-0 -top-[6%] h-[118%]">
        <VueBitsDomeGallery
          :images="imagensDomo"
          fit-basis="max"
          :fit="estreito ? 1.1 : 0.8"
          :max-radius-factor="10"
          :min-radius="0"
          :pad-factor="0"
          :segments="estreito ? 34 : 30"
          :grayscale="false"
          overlay-blur-color="transparent"
          image-border-radius="12px"
          opened-image-border-radius="12px"
          opened-image-width="min(86vw, 440px)"
          opened-image-height="min(107vw, 550px)"
          :max-vertical-rotation-deg="6"
          :drag-sensitivity="18"
          auto-rotate
          :auto-rotate-speed="3.5"
        />
      </div>

      <template #fallback>
        <ul class="grid h-full grid-cols-2 gap-2 p-2 sm:grid-cols-4">
          <li
            v-for="(foto, i) in amostra"
            :key="foto.src"
            class="overflow-hidden rounded-xl"
          >
            <NuxtImg
              :src="foto.src"
              :alt="`Foto ${i + 1} do Expediente Bar`"
              width="420"
              height="525"
              sizes="xs:50vw sm:25vw"
              loading="lazy"
              class="h-full w-full object-cover"
            />
          </li>
        </ul>
      </template>
    </ClientOnly>
  </section>
</template>
