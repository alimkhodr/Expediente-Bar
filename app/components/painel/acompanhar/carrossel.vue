<script setup lang="ts">
import type { Senha } from '~/composables/useSenhas'

defineProps<{ senhas: Senha[] }>()
</script>

<template>
  <div class="flex flex-col gap-2">
    <span class="text-muted font-bold text-sm">Últimas senhas</span>
    <UCarousel
      v-slot="{ item }"
      :items="senhas"
      align="start"
      drag-free
      dots
      :ui="{ item: 'basis-1/3 pl-3', container: 'p-2', dots: 'static mt-3' }"
    >
      <UCard :ui="{ body: 'h-24 flex flex-col items-center justify-center p-3' }">
        <PainelSenhaDisplay
          :numero="item.numero"
          variante="historico"
          class="flex-1 w-full min-h-0"
        />
      </UCard>
    </UCarousel>
  </div>
</template>
