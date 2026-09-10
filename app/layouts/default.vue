<script setup lang="ts">
useAncoraEstavel()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <SiteHeader />
    <main
      id="conteudo"
      class="flex-1"
    >
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
