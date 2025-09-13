<script setup lang="ts">
import type { Review } from '~/types/reviews'

const { trackEvent } = useClarity()
const props = defineProps<{ item: Review }>()

const getStars = (rating: number) => {
  const fullStars = '★'.repeat(rating)
  const emptyStars = '☆'.repeat(5 - rating)
  return fullStars + emptyStars
}
</script>
<template>
  <UCard
    class="m-1 flex flex-col flex-1 h-[170px] md:h-[220px]"
  >
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-3">
        <UAvatar
          :src="props.item.authorAttribution.photoUri"
          :alt="props.item.authorAttribution.displayName"
          size="md"
        />
        <div>
          <UText
            tag="h3"
            weight="semi-bold"
            class="line-clamp-1 text-ellipsis"
          >
            {{ props.item.authorAttribution.displayName }}
          </UText>
          <UText
            color="gray"
            size="small"
            class="line-clamp-1 text-ellipsis"
          >
            {{ props.item.relativePublishTimeDescription }}
          </UText>
        </div>
      </div>
      <UText
        color="warning"
        size="extra-large"
      >
        {{ getStars(item.rating) }}
      </UText>
    </div>

    <div class="mb-4 flex-grow">
      <UText
        size="small"
        class="line-clamp-3 text-ellipsis"
      >
        {{ item.text.text }}
      </UText>
    </div>

    <div class="mt-auto">
      <UButton
        :to="item.googleMapsUri"
        target="_blank"
        variant="ghost"
        size="xs"
        icon="i-heroicons-arrow-top-right-on-square"
        trailing
        @click="trackEvent('read_review_button_click')"
      >
        Ver no Google Maps
      </UButton>
    </div>
  </UCard>
</template>
