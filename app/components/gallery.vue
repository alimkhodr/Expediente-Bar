<script setup lang="ts">
const items = [
  {
    alt: 'imagem 1',
    src: '/images/ROW_1.webp'
  },
  {
    alt: 'imagem 2',
    src: '/images/ROW_2.webp'
  },
  {
    alt: 'imagem 4',
    src: '/images/ROW_4.webp'
  },
  {
    alt: 'imagem 5',
    src: '/images/ROW_5.webp'
  },
  {
    alt: 'imagem 6',
    src: '/images/ROW_6.webp'
  },
  {
    alt: 'imagem 7',
    src: '/images/ROW_7.webp'
  },
  {
    alt: 'imagem 8',
    src: '/images/ROW_8.webp'
  },
  {
    alt: 'imagem 9',
    src: '/images/ROW_9.webp'
  },
  {
    alt: 'imagem 11',
    src: '/images/ROW_11.webp'
  },
  {
    alt: 'imagem 12',
    src: '/images/ROW_12.webp'
  },
  {
    alt: 'imagem 13',
    src: '/images/ROW_13.webp'
  },
  {
    alt: 'imagem 14',
    src: '/images/ROW_14.webp'
  },
  {
    alt: 'imagem 15',
    src: '/images/ROW_15.webp'
  },
  {
    alt: 'imagem 18',
    src: '/images/ROW_18.webp'
  },
  {
    alt: 'imagem 19',
    src: '/images/ROW_19.webp'
  },
  {
    alt: 'imagem 21',
    src: '/images/ROW_21.webp'
  },
  {
    alt: 'imagem 22',
    src: '/images/ROW_22.webp'
  },
  {
    alt: 'imagem 23',
    src: '/images/clientes.webp'
  },
  {
    alt: 'imagem 23',
    src: '/images/clientes2.webp'
  },
  {
    alt: 'imagem 23',
    src: '/images/chega-junto.webp'
  }
]
</script>
<template>
  <div class="grid grid-cols-2 lg:grid-cols-5 gap-5">
    <div
      v-for="item in items"
      :key="item.src"
      class="aspect-square overflow-hidden rounded-md"
    >
      <NuxtImg
        format="webp"
        :src="item.src"
        :alt="item.alt"
        class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
  </div>
</template>
