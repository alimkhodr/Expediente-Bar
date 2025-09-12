<template>
  <div class="min-h-screen relative overflow-hidden">
    <UButton
      icon="material-symbols-arrow-left-alt"
      size="md"
      color="primary"
      variant="solid"
      class="fixed top-5 left-5 z-10 shadow-xl/30"
      to="/"
      label="Home"
    />
    <main class="h-screen w-full">
      <slot />
    </main>
  </div>
</template>
