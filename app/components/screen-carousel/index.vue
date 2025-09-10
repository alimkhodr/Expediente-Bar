<script setup lang="ts">
const items = [
  { image: '/images/contra-com-fritras.webp',
    title: 'Agenda Semanal',
    text: 'A tasty dish combining contra with crispy fries.',
    button: {
      label: 'Order Now',
      icon: 'mdi-cart'
    }
  },
  { image: '/images/contra-com-fritras.webp',
    title: 'Reserve sua mesa',
    text: 'Entre em contato para mais informações.',
    button: {
      label: 'Order Now',
      icon: 'mdi-cart'
    }
  }
]
</script>

<template>
  <UCarousel
    v-slot="{ item }"
    :items="items"
    class="w-full h-screen"
    loop
    :autoplay="{ delay: 6000 }"
  >
    <div
      class="h-screen w-full flex items-center justify-start p-8 bg-cover bg-center bg-no-repeat"
      :style="`background-image: url(${item.image});`"
    >
      <UCard
        variant="solid"
        class="bg-stone-950/85 backdrop-blur-md md:max-w-1/3"
      >
        <template #header>
          <UText
            size="title"
            weight="bold"
            color="primary"
            tag="h2"
          >
            {{ item.title }}
          </UText>
        </template>
        <UText
          tag="p"
        >
          {{ item.text }}
        </UText>
        <template #footer>
          <UButton
            size="xl"
            variant="solid"
            :label="item.button.label"
            :ui="{
              label: 'text-black'
            }"
          />
        </template>
      </UCard>
    </div>
  </UCarousel>
</template>
