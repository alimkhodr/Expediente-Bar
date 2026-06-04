<script setup lang="ts">
definePageMeta({ layout: 'blank' })

const { atual, historico, trocou } = useSenhas()
</script>

<template>
  <div class="painel-page">
    <TvPublico
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
</style>
