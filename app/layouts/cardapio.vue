<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const items = ref<BreadcrumbItem[]>([
  {
    label: 'Home',
    to: '/'
  },
  {
    label: 'Cardápio',
    to: '/cardapio'
  }
])
</script>

<template>
  <div class="min-h-screen relative overflow-hidden">
    <UBreadcrumb
      :items="items"
      class="fixed top-5 left-5 z-10"
    />
    <main class="h-screen w-full">
      <slot />
    </main>
  </div>
</template>
