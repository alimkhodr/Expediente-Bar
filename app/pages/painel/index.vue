<script setup lang="ts">
definePageMeta({ layout: 'blank' })

const { atual, historico, trocou } = useSenhas()
</script>

<template>
  <div class="h-screen w-full bg-default text-default overflow-hidden">
    <PainelPublico
      :atual="atual"
      :historico="historico"
      :trocou="trocou"
    />
  </div>
</template>
