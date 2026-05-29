<script setup lang="ts">
import type { Senha } from '~/composables/useSenhas'

defineProps<{
  atual: Senha | null
  historico: Senha[]
  trocou: number
}>()
</script>

<template>
  <div class="@container h-full w-full flex flex-col gap-[clamp(1rem,2cqi,2.5rem)] p-[clamp(1rem,2.5cqi,3.5rem)]">
    <header class="flex items-center justify-between gap-6 shrink-0">
      <div class="flex items-center gap-[clamp(0.75rem,1.8cqi,2.5rem)]">
        <Logo
          icon
          class="h-[clamp(2.75rem,4cqi,4.5rem)]"
        />
        <USeparator
          orientation="vertical"
          class="hidden landscape:block h-[clamp(2rem,4cqi,4.5rem)]"
        />
        <h1 class="hidden landscape:block text-[clamp(1.25rem,3cqi,4rem)] leading-none text-muted">
          Painel de senhas
        </h1>
      </div>
      <PainelQrAcompanhe />
    </header>

    <div
      v-if="!atual"
      class="flex-1 flex items-center justify-center"
    >
      <UCard><span class="text-[clamp(1.5rem,3cqi,3rem)]">Nenhuma senha gerada ainda</span></UCard>
    </div>

    <div
      v-else
      class="flex-1 min-h-0 flex flex-col landscape:flex-row gap-[clamp(1rem,2cqi,2rem)]"
    >
      <UCard
        class="shrink-0 landscape:flex-2 landscape:min-w-0 overflow-hidden"
        :ui="{ body: 'h-full flex flex-col items-center justify-center gap-[clamp(0.5rem,1.5cqi,1.5rem)] py-[clamp(1rem,3cqi,2rem)]' }"
      >
        <PainelSenhaDisplay
          :numero="atual.numero"
          :trocou="trocou"
          class="w-full min-h-0 portrait:h-[clamp(8rem,30cqi,22rem)] landscape:flex-1"
        />
      </UCard>

      <div class="flex-1 min-h-0 landscape:flex-1">
        <PainelHistorico
          :senhas="historico"
          :limite="3"
        />
      </div>
    </div>

    <PainelRodape class="shrink-0" />
  </div>
</template>
