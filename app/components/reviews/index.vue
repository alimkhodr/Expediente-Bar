<script setup lang="ts">
import type { ReviewsResponse } from '~/types/reviews'

const config = useRuntimeConfig()
const { trackEvent } = useClarity()

const { data: reviews } = await useAsyncData<ReviewsResponse>(
  'reviews',
  () => $fetch(`https://places.googleapis.com/v1/places/ChIJVx-dQk9LzJQR80Am0iwvW10?fields=reviews&languageCode=pt-BR&key=${config.apiKey}`)
)

const filteredReviews = computed(() => {
  if (!reviews.value?.reviews) return []

  return reviews.value.reviews.filter(review =>
    review.rating === 5
  )
})
</script>

<template>
  <UText
    size="title"
    weight="bold"
    tag="h2"
    color="primary"
    class="italic md:text-center"
  >
    Avaliações
  </UText>
  <UText
    tag="h2"
    class="md:text-center"
  >
    Algumas avaliações de nossos clientes
  </UText>
  <UAlert
    title="Nos Avalie!"
    description="Sua opinião é muito importante!"
    color="neutral"
    variant="outline"
    orientation="horizontal"
    :actions="[
      {
        label: 'Avaliar',
        to: links.review,
        target: '_blank',
        onClick: () => trackEvent('review_button_click')
      },
    ]"
    icon="ic-baseline-star-rate"
    :ui="{
      icon: 'size-11 text-primary',
    }"
    class="mt-6"
  />
  <UCarousel
    v-slot="{ item }"
    :items="filteredReviews"
    class="mt-4 mb-12"
    arrows
    dots
    :ui="{
      item: 'basis-1/1 md:basis-1/2 grid',
      container: 'transition-[height]',
      controls: 'absolute -bottom-8 inset-x-12',
      dots: '-top-7',
    }"
    :autoplay="{ delay: 4000 }"
  >
    <div class="flex">
      <ReviewsCard
        :key="item.name"
        :item="item"
      />
    </div>
  </UCarousel>
</template>
