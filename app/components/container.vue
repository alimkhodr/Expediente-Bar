<script setup lang="ts">
const props = defineProps<{ contrast?: boolean }>()
</script>

<template>
  <section
    id="faq"
    :class="props.contrast ? 'dark:bg-stone-950 light:bg-stone-100' : ''"
  >
    <UContainer>
      <slot />
    </UContainer>
  </section>
</template>
