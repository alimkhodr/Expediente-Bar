<script setup lang="ts">
/**
 * Iframe que só é criado quando entra na viewport (Canva, Google Maps).
 * Evita baixar scripts de terceiros no carregamento inicial.
 */
const props = withDefaults(defineProps<{
  src: string
  titulo: string
  /** Proporção CSS, ex.: '4 / 5' ou '16 / 9'. Sem valor, a altura vem da classe (ex.: h-full). */
  proporcao?: string
  classe?: string
  permitir?: string
  linkExterno?: string
  rotuloLink?: string
}>(), {
  proporcao: undefined,
  classe: '',
  permitir: 'fullscreen',
  linkExterno: undefined,
  rotuloLink: 'Abrir em nova aba'
})

const { trackEvent } = useAnalytics()
const alvo = ref<HTMLElement | null>(null)
const visivel = useVisivel(alvo, '300px')
const carregado = ref(false)
</script>

<template>
  <div
    ref="alvo"
    class="relative overflow-hidden rounded-xl bg-stone-900 ring-1 ring-white/10"
    :class="classe"
    :style="proporcao ? { aspectRatio: proporcao } : undefined"
  >
    <div
      v-if="!carregado"
      class="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted"
      aria-live="polite"
    >
      <USkeleton class="absolute inset-0 rounded-xl" />
      <UIcon
        name="i-lucide-loader-circle"
        class="relative size-8 animate-spin text-primary"
        aria-hidden="true"
      />
      <span class="relative text-sm">Carregando {{ props.titulo.toLowerCase() }}…</span>
    </div>
    <iframe
      v-if="visivel"
      :src="src"
      :title="titulo"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      :allow="permitir"
      allowfullscreen
      class="absolute inset-0 h-full w-full border-0 transition-opacity duration-500"
      :class="carregado ? 'opacity-100' : 'opacity-0'"
      @load="carregado = true"
    />
    <a
      v-if="linkExterno"
      :href="linkExterno"
      target="_blank"
      rel="noopener noreferrer"
      class="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white backdrop-blur hover:bg-black"
      @click="trackEvent('embed_link_click', { titulo: props.titulo })"
    >
      {{ rotuloLink }}
      <UIcon
        name="i-lucide-external-link"
        class="size-3.5"
        aria-hidden="true"
      />
    </a>
  </div>
</template>
