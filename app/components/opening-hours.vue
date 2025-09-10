<script setup lang="ts">
import type { CurrentOpeningHoursResponse } from '~/types/currentOpeningHours'
const config = useRuntimeConfig()

const { data: openingHours } = await useAsyncData<CurrentOpeningHoursResponse>(
  'currentOpeningHours',
  () => $fetch(`https://places.googleapis.com/v1/places/ChIJVx-dQk9LzJQR80Am0iwvW10?fields=currentOpeningHours&languageCode=pt-BR&key=${config.public.apiKey}`)
)
</script>
<template>

  <UChip
    :color="openingHours?.currentOpeningHours.openNow ? 'success' : 'error'"
    size="3xl"
  >
    <UCard class="w-full">
      <div class="flex items-center space-x-3">
        <UIcon
          name="material-symbols-alarm"
          class="size-10 text-primary"
        />
        <div>
          <UText
            tag="h3"
            weight="semi-bold"
            class="line-clamp-1 text-ellipsis"
          >
            Horario de funcionamento
          </UText>
          <UText
            color="gray"
            size="small"
            class="line-clamp-1 text-ellipsis"
          >
            Sincronizado com o Google
          </UText>
        </div>
      </div>

      <div class="w-full mt-2">
        <div
          v-for="(description, index) in openingHours?.currentOpeningHours.weekdayDescriptions"
          :key="index"
          class="flex items-center py-0.5"
        >
          <UText
            size="small"
            class="line-clamp-3 text-ellipsis capitalize"
          >
            {{ description.split(':')[0] }}:
          </UText>
          <USeparator
            class="flex-1 mx-2"
            type="dashed"
          />
          <UText
            :color="description.split(':').slice(1).join(':').trim() === 'Fechado' ? 'danger' : 'inherit'"
            size="small"
            class="line-clamp-3 text-ellipsis capitalize"
          >
            {{ description.split(':').slice(1).join(':').trim() }}
          </UText>
        </div>
      </div>
    </UCard>
  </UChip>
</template>
