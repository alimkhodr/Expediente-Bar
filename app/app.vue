<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'pt-BR' }
})
</script>

<template>
  <UApp
    :toaster="{ position: 'bottom-right', duration: 6000 }"
    :tooltip="{ delayDuration: 200 }"
  >
    <NuxtLoadingIndicator color="var(--ui-primary)" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
