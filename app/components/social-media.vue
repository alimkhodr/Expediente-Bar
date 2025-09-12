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
        icon="mdi-instagram"
        size="xl"
        color="neutral"
        variant="outline"
        class="w-full justify-start"
        :to="links.instagram"
        :ui="{
          leadingIcon: 'text-primary'
        }"
      >
        Instagram
      </UButton>
      <UButton
        icon="mdi-facebook"
        size="xl"
        color="neutral"
        variant="outline"
        class="w-full justify-start"
        :to="links.facebook"
        :ui="{
          leadingIcon: 'text-primary'
        }"
      >
        Facebook
      </UButton>
      <UButton
        icon="mdi-whatsapp"
        size="xl"
        color="neutral"
        variant="outline"
        class="w-full justify-start"
        :to="links.whatsapp('Olá!')"
        :ui="{
          leadingIcon: 'text-primary'
        }"
      >
        WhatsApp
      </UButton>
    </div>
  </div>
</template>
