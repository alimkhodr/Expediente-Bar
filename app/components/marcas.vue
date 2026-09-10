<script setup lang="ts">
const logos = [
  { src: '/images/brands/1.webp', alt: 'Marca parceira 1' },
  { src: '/images/brands/2.webp', alt: 'Marca parceira 2' },
  { src: '/images/brands/3.webp', alt: 'Marca parceira 3' },
  { src: '/images/brands/4.webp', alt: 'Marca parceira 4' },
  { src: '/images/brands/5.webp', alt: 'Marca parceira 5' },
  { src: '/images/brands/6.webp', alt: 'Marca parceira 6' },
  { src: '/images/brands/7.webp', alt: 'Marca parceira 7' },
  { src: '/images/brands/8.webp', alt: 'Marca parceira 8' }
]
</script>

<template>
  <section
    aria-label="Marcas parceiras"
    class="border-y border-white/10 bg-yellow-500 py-4"
  >
    <ClientOnly>
      <div class="w-full overflow-hidden">
        <VueBitsLogoLoop
          :logos="logos"
          :speed="55"
          :logo-height="44"
          :gap="56"
          pause-on-hover
          fade-out
          fade-out-color="#ffa507"
          aria-label="Marcas parceiras do Expediente Bar"
        />
      </div>
      <template #fallback>
        <ul class="flex flex-wrap items-center justify-center gap-10 px-4">
          <li
            v-for="logo in logos"
            :key="logo.src"
          >
            <img
              :src="logo.src"
              :alt="logo.alt"
              width="120"
              height="44"
              loading="lazy"
              class="h-11 w-auto"
            />
          </li>
        </ul>
      </template>
    </ClientOnly>
  </section>
</template>
