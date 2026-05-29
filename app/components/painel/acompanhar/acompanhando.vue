<script setup lang="ts">
const props = defineProps<{
  minhaSenha: number
  faltam: number
}>()

const emit = defineEmits<{ alterar: [] }>()

// Barra enche conforme a vez se aproxima (janela de 5 senhas).
const progresso = computed(() => {
  const f = Math.max(0, props.faltam)
  return Math.round(Math.max(0, Math.min(1, 1 - f / 5)) * 100)
})
</script>

<template>
  <UCard :ui="{ body: 'flex flex-col gap-3 py-6' }">
    <div class="flex items-start justify-between">
      <div>
        <span class="text-4xl font-bold tabular-nums">{{ minhaSenha }}</span>
        <p class="text-muted uppercase tracking-widest text-xs font-bold">Sua senha</p>
      </div>
      <UButton
        color="primary"
        variant="link"
        @click="emit('alterar')"
      >
        Alterar
      </UButton>
    </div>
    <p class="text-default">
      Faltam <strong>{{ faltam }}</strong> senha{{ faltam === 1 ? '' : 's' }} para a sua vez
    </p>
    <UProgress
      :model-value="progresso"
      color="primary"
    />
  </UCard>
</template>
