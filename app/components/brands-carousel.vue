<script setup lang="ts">
const items = [
  '/images/brands/1.png',
  '/images/brands/2.png',
  '/images/brands/3.png',
  '/images/brands/4.png',
  '/images/brands/1.png',
  '/images/brands/2.png',
  '/images/brands/5.png',
  '/images/brands/8.png',
  '/images/brands/7.png'

]
</script>

<template>
  <div class="bg-primary">
    <UCarousel
      v-slot="{ item }"
      :items="items"
      loop
      auto-scroll
      :ui="{
        item: 'basis-1/4 md:basis-1/4 lg:basis-1/8 flex-shrink-0',
        container: 'flex items-center gap-4'
      }"
      class="w-full"
    >
      <div class="flex justify-center items-center">
        <NuxtImg
          format="webp"
          :src="item"
          width="120"
          height="60"
          alt="Logo da marca"
        />
      </div>
    </UCarousel>
  </div>
</template>
