<script setup lang="ts">
definePageMeta({
  layout: 'cardapio'
})

const loaded = ref(false)
const iframeRef = ref<HTMLIFrameElement | null>(null)
</script>

<template>
  <div
    class="w-full bg-stone-900 flex justify-center relative"
    style="height: 100svh; padding: 3rem 1rem 1rem;"
  >
    <USkeleton
      v-if="!loaded"
      class="absolute w-full max-w-3xl rounded-lg"
      style="top: 3rem; bottom: 1rem; left: 50%; transform: translateX(-50%);"
    />

    <iframe
      ref="iframeRef"
      loading="lazy"
      class="w-full max-w-3xl rounded-lg transition-opacity duration-300"
      :class="loaded ? 'opacity-100' : 'opacity-0'"
      style="height: 100%; border: none; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16);"
      src="https://www.canva.com/design/DAGyopGCjLc/yBInJ25nigDwMw0uWRBlQg/view?embed"
      allowfullscreen
      allow="fullscreen"
      @load="loaded = true"
    />
  </div>
</template>
