<script setup lang="ts">
defineProps<{
  numero: number | null
  trocou: number
}>()
</script>

<template>
  <UCard :ui="{ body: 'flex flex-col items-center gap-3 py-8' }">
    <span class="text-primary text-sm flex items-center gap-[0.6em]">
      <PainelPontoPulsante />
      Chamando agora
    </span>
    <PainelSenhaDisplay
      :numero="numero"
      :trocou="trocou"
      class="h-32 w-full"
    />
  </UCard>
</template>
