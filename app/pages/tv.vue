<script setup lang="ts">
definePageMeta({ layout: 'blank' })

useSeoMeta({ robots: 'noindex, nofollow' })

const { atual, historico, trocou } = useSenhas()

const emFullscreen = ref(false)

function fullscreenAtivo () {
  const doc = document as Document & { webkitFullscreenElement?: Element }
  return !!(document.fullscreenElement || doc.webkitFullscreenElement)
}

function toggleFullscreen () {
  const el = document.documentElement as HTMLElement & {
    webkitRequestFullscreen?: () => void
  }
  const doc = document as Document & { webkitExitFullscreen?: () => void }

  if (!fullscreenAtivo()) {
    (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el)
  } else {
    (document.exitFullscreen || doc.webkitExitFullscreen)?.call(document)
  }
}

function sincronizar () {
  emFullscreen.value = fullscreenAtivo()
}

onMounted(() => {
  document.addEventListener('fullscreenchange', sincronizar)
  document.addEventListener('webkitfullscreenchange', sincronizar)
})

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', sincronizar)
  document.removeEventListener('webkitfullscreenchange', sincronizar)
})
</script>

<template>
  <div class="painel-page">
    <button
      class="fs-btn"
      type="button"
      :title="emFullscreen ? 'Sair da tela cheia' : 'Tela cheia'"
      @click="toggleFullscreen"
    >
      {{ emFullscreen ? '✕' : '⛶' }}
    </button>

    <PainelPublico
      :atual="atual"
      :historico="historico"
      :trocou="trocou"
    />
  </div>
</template>

<style scoped>
/* CSS proprio (sem tokens oklch / container queries do Tailwind v4)
   para rodar em Chrome antigo da Fire TV. Ver components/painel/publico.vue. */
.painel-page {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: #09090b;
  color: #fafafa;
}

.fs-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 50;
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  line-height: 1;
  color: #fafafa;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.35;
  transition: opacity 0.2s ease, background 0.2s ease;
}

.fs-btn:hover,
.fs-btn:focus {
  opacity: 1;
  background: rgba(255, 255, 255, 0.16);
  outline: none;
}
</style>
