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
    <UMarquee
      pause-on-hover
      reverse
      :overlay="false"
      :ui="{ root: '[--gap:--spacing(4)]', content: 'w-auto py-1' }"
    >
      <NuxtImg
        v-for="(item, index) in items"
        :key="index"
        format="webp"
        :src="item"
        width="120"
        height="60"
        alt="Logo da marca"
        class="mr-8"
      />
    </UMarquee>
  </div>
</template>
