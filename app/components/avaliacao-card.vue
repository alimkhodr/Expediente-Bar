<script setup lang="ts">
import type { Review } from '~/types/reviews'

defineProps<{ item: Review }>()
const { trackEvent } = useAnalytics()
const estrelas = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)
</script>

<template>
  <UPageCard
    as="article"
    variant="subtle"
    :ui="{ root: 'h-full rounded-xl ring-white/10 text-left', container: 'h-full', wrapper: 'h-full gap-4 items-stretch', body: 'w-full', footer: 'pt-0' }"
  >
    <template #header>
      <div class="flex w-full items-start justify-between gap-3">
        <UUser
          :name="item.authorAttribution.displayName"
          :description="item.relativePublishTimeDescription"
          :avatar="{ src: item.authorAttribution.photoUri, alt: `Foto de ${item.authorAttribution.displayName}` }"
          size="lg"
        />
        <span
          class="whitespace-nowrap text-primary"
          :aria-label="`${item.rating} de 5 estrelas`"
        >{{ estrelas(item.rating) }}</span>
      </div>
    </template>
    <template #body>
      <blockquote class="line-clamp-4 text-sm text-toned">
        “{{ item.text?.text }}”
      </blockquote>
    </template>
    <template #footer>
      <UButton
        :to="item.googleMapsUri"
        target="_blank"
        rel="noopener noreferrer"
        variant="link"
        color="neutral"
        size="xs"
        trailing-icon="i-lucide-external-link"
        class="px-0"
        @click="trackEvent('read_review_click', { rating: item.rating })"
      >
        Ver no Google Maps
      </UButton>
    </template>
  </UPageCard>
</template>
