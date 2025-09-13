<script setup lang="ts">
const { trackEvent } = useClarity()
const socialMedia = [
  {
    id: 'instagram',
    icon: 'mdi-instagram',
    title: 'Instagram',
    trackingText: 'instagram_button_click',
    to: links.instagram
  },
  {
    id: 'facebook',
    icon: 'mdi-facebook',
    title: 'Facebook',
    trackingText: 'facebook_button_click',
    to: links.facebook
  },
  {
    id: 'whatsapp',
    icon: 'mdi-whatsapp',
    title: 'WhatsApp',
    trackingText: 'whatsapp_button_click',
    to: links.whatsapp('Olá!')
  }
]
</script>
<template>
  <div class="flex flex-col w-full gap-4">
    <div>
      <UText
        size="title"
        weight="bold"
        tag="h2"
        color="primary"
        class="italic mb-2 md:text-center"
      >
        Redes <span class="dark:text-white text-black">Sociais</span>
      </UText>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
      <UButton
        v-for="value in socialMedia"
        :key="value.id"
        :icon="value.icon"
        size="xl"
        color="neutral"
        variant="outline"
        class="w-full justify-start"
        :to="value.to"
        :ui="{
          leadingIcon: 'text-primary'
        }"
        @click="trackEvent(value.trackingText)"
      >
        {{ value.title }}
      </UButton>
    </div>
  </div>
</template>
