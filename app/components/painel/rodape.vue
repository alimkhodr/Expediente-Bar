<script setup lang="ts">
const { hora, data } = useRelogio()
</script>

<template>
  <footer class="w-full flex items-center justify-between text-muted text-[clamp(0.8rem,1.4cqi,1.5rem)]">
    <span class="flex items-center gap-2">
      <UBadge
        icon="i-heroicons-shopping-bag"
        variant="outline"
        size="xl"
      />
      Retire seu pedido no balcão
    </span>
    <span class="text-right flex gap-3 justify-center items-center">
      <span class="hidden md:block">{{ data }}</span>
      <span class="text-muted font-bold text-[clamp(1rem,2cqi,2.5rem)]">{{ hora }}</span>
    </span>
  </footer>
</template>
