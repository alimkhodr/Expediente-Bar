<script setup lang="ts">
import type { Senha } from '~/composables/useSenhas'

const props = withDefaults(defineProps<{
  senhas: Senha[]
  limite?: number
}>(), {
  limite: 0
})

const itens = computed(() => props.limite > 0 ? props.senhas.slice(0, props.limite) : props.senhas)
</script>

<template>
  <div class="w-full h-full flex flex-col gap-[clamp(0.5rem,1.2cqi,0.25rem)] min-h-0">
    <span class="text-muted text-[clamp(2rem,1.4cqi,1.4rem)]">
      Últimas senhas
    </span>
    <div class="flex-1 grid grid-flow-row auto-rows-fr gap-[clamp(0.5rem,1.2cqi,1.25rem)] min-h-0">
      <UCard
        v-for="s in itens"
        :key="s.id"
        :ui="{ body: 'h-full flex flex-col items-center justify-center p-[clamp(0.75rem,2.5cqi,2.5rem)]' }"
        class="overflow-hidden"
      >
        <PainelSenhaDisplay
          :numero="s.numero"
          variante="historico"
          class="flex-1 w-full min-h-0"
        />
      </UCard>
    </div>
  </div>
</template>
