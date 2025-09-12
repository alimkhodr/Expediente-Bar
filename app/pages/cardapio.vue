<script setup lang="ts">
definePageMeta({
  layout: 'cardapio'
})

const items = [
  '/images/cardapio/1.png',
  '/images/cardapio/2.png',
  '/images/cardapio/3.png',
  '/images/cardapio/4.png'
]
</script>

<template>
  <div class="h-screen w-full">
    <UCarousel
      v-slot="{ item }"
      arrows
      :items="items"
      class="h-full w-full"
      loop
      :ui="{
        prev: '-start-[-4px] sm:-start-[-40px] absolute rounded-full bg-black/50',
        next: '-end-[-4px] sm:-end-[-40px] absolute rounded-full bg-black/50',
      }"
    >
      <div class="h-screen w-full flex items-center justify-center bg-stone-900">
        <img
          :src="item"
          class="max-h-full max-w-full object-contain"
          alt="Cardápio"
        />
      </div>
    </UCarousel>
  </div>
</template>
