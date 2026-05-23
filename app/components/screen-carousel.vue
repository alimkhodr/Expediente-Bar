<script setup lang="ts">
const { trackEvent } = useAnalytics()

const items = [
  {
    image: '/images/copa-do-mundo.jpg',
    imageMobile: '/images/copa-do-mundo-mobile.jpg',
    title: 'Copa do Mundo',
    color: 'success' as const,
    text: 'Seremos o ponto de encontro de diferentes galera porém na mesma torcida, todos juntos pela nossa seleção',
    button: {
      label: 'Ver agenda',
      icon: 'mdi:calendar',
      to: 'https://www.canva.com/design/DAHJMeXi3DE/JtbzDwqxF-I_gmmJM23NBA/view'
    }
  },
  {
    image: '/images/birthday.jpg',
    imageMobile: '/images/birthday.jpg',
    title: 'Comemore seu aniversário!',
    text: 'Reserve sua mesa e aproveite condições especiais para tornar seu dia ainda mais inesquecível.',
    button: {
      label: 'Reservar',
      icon: 'mdi-party-popper',
      to: links.whatsapp('Olá! Gostaria de reservar para comemorar meu aniversário!')
    }
  },
  {
    image: '/images/batucada.webp',
    imageMobile: '/images/batucada.webp',
    title: 'O melhor do pagode!',
    text: 'A energia do pagode que você ama é aqui! Confira nossa agenda e venha curtir com a gente.',
    button: {
      label: 'Reservar',
      icon: 'mdi-party-popper',
      to: links.whatsapp('Olá! Gostaria de fazer uma reserva para curtir o pagode com vocês!')
    }
  },
  {
    image: '/images/contra-com-fritras.webp',
    imageMobile: '/images/contra-com-fritras.webp',
    title: 'Delivery no iFood',
    text: 'Sabores incríveis onde você estiver! Peça porções, lanches e bebidas no conforto da sua casa.',
    button: {
      label: 'Pedir no iFood',
      icon: 'simple-icons-ifood',
      to: links.ifood
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
    dots
    :autoplay="{ delay: 6000 }"
    :ui="{
      dots: '-bottom-[-20px]',

    }"
  >
    <div
      class="h-screen w-full flex items-center justify-start p-8 bg-cover bg-center bg-no-repeat bg-(image:--bg-mobile) md:bg-(image:--bg-desktop)"
      :style="`--bg-mobile: url(${item.imageMobile}); --bg-desktop: url(${item.image})`"
    >
      <UCard
        variant="solid"
        class="bg-stone-100 dark:bg-stone-950/85 backdrop-blur-md md:max-w-1/3"
      >
        <template #header>
          <UText
            size="title"
            weight="bold"
            :color="item.color || 'primary'"
            tag="h2"
          >
            {{ item.title }}
          </UText>
        </template>
        <UText
          tag="p"
          class="dark:text-white text-black"
        >
          {{ item.text }}
        </UText>
        <template #footer>
          <UButton
            size="xl"
            variant="solid"
            :label="item.button.label"
            :icon="item.button.icon"
            :to="item.button.to"
            :color="item.color || 'primary'"
            target="_blank"
            @click="trackEvent('carousel_button_click', { slide_title: item.title, button_label: item.button.label })"
          />
        </template>
      </UCard>
    </div>
  </UCarousel>
</template>
