<script setup lang="ts">
const props = defineProps<{
  base: number
  erro: string | null
}>()

const emit = defineEmits<{ acompanhar: [senha: number] }>()

// A senha já chamada (base) não pode ser a sua — começa na próxima.
const minimo = computed(() => Math.min(999, props.base + 1))
const valor = ref(minimo.value)

watch(minimo, (m) => {
  if (valor.value < m) valor.value = m
})
</script>

<template>
  <UCard :ui="{ body: 'flex flex-col gap-4 py-6' }">
    <span class="text-muted font-bold text-sm">Qual é a sua senha?</span>
    <div class="flex items-center justify-between gap-3">
      <UButton
        icon="i-heroicons-minus"
        size="xl"
        color="neutral"
        variant="soft"
        :disabled="valor <= minimo"
        @click="valor = Math.max(minimo, valor - 1)"
      />
      <span class="text-5xl font-bold tabular-nums">{{ valor }}</span>
      <UButton
        icon="i-heroicons-plus"
        size="xl"
        color="neutral"
        variant="soft"
        @click="valor = Math.min(999, valor + 1)"
      />
    </div>
    <p
      v-if="erro"
      class="text-error text-sm text-center"
    >
      {{ erro }}
    </p>
    <UButton
      block
      size="xl"
      color="primary"
      @click="emit('acompanhar', valor)"
    >
      Acompanhar
    </UButton>
  </UCard>
</template>
