<script setup lang="ts">
defineProps<{ minhaSenha: number }>()

const emit = defineEmits<{ outra: [] }>()
</script>

<template>
  <UCard
    class="bg-primary/10 border border-primary/40"
    :ui="{ body: 'flex flex-col items-center gap-3 py-6 text-center' }"
  >
    <div class="size-14 rounded-full bg-primary flex items-center justify-center">
      <UIcon
        name="i-heroicons-check"
        class="size-8 text-black"
      />
    </div>
    <h2 class="text-2xl font-bold">É a sua vez! Senha {{ minhaSenha }}</h2>
    <p class="text-muted">Retire seu pedido no balcão</p>
    <UButton
      block
      size="xl"
      color="primary"
      variant="outline"
      @click="emit('outra')"
    >
      Acompanhar outra senha
    </UButton>
  </UCard>
</template>
