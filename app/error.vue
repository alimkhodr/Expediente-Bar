<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: {
    type: Object as () => NuxtError,
    default: () => ({})
  }
})
</script>

<template>
  <div>
    <h1>{{ props.error?.statusCode ?? 'Error' }}</h1>
    <NuxtLink to="/">Go back home</NuxtLink>
  </div>
</template>
