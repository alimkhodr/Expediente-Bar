<script setup lang="ts">
import type { ReviewsResponse, Review } from '~/types/reviews'

const { trackEvent } = useAnalytics()

const { data, status } = useLazyFetch<ReviewsResponse>('/api/places/reviews', {
  key: 'avaliacoes',
  server: false
})

const avaliacoes = computed<Review[]>(() =>
  (data.value?.reviews ?? []).filter(r => r.rating >= 4 && r.text?.text)
)
const carregando = computed(() => status.value === 'pending' || status.value === 'idle')

</script>

<template>
  <Secao
    v-if="carregando || avaliacoes.length"
    id="avaliacoes"
    destaque="Avaliações"
    titulo="dos clientes"
    descricao="Direto do Google. Sua opinião ajuda a gente a melhorar."
    centralizado
  >
    <template #acoes>
      <UButton
        :to="links.review"
        target="_blank"
        rel="noopener noreferrer"
        color="primary"
        icon="i-lucide-star"
        @click="trackEvent('review_click', { source: 'avaliacoes' })"
      >
        Avaliar no Google
      </UButton>
    </template>

    <UPageGrid
      v-if="carregando"
      class="gap-4 lg:grid-cols-2"
      aria-busy="true"
    >
      <USkeleton
        v-for="n in 2"
        :key="n"
        class="h-48 rounded-xl"
      />
    </UPageGrid>

    <ul
      v-else-if="avaliacoes.length < 2"
      class="flex flex-wrap justify-center gap-4"
    >
      <li
        v-for="item in avaliacoes"
        :key="item.name"
        class="w-full md:w-[calc(50%_-_0.5rem)]"
      >
        <AvaliacaoCard :item="item" />
      </li>
    </ul>

    <UCarousel
      v-else
      v-slot="{ item }"
      :items="avaliacoes"
      arrows
      dots
      loop
      :autoplay="{ delay: 6000, stopOnInteraction: true }"
      :ui="{
        item: 'basis-full md:basis-1/2 px-2',
      }"
      aria-label="Avaliações de clientes"
    >
      <AvaliacaoCard :item="item" />
    </UCarousel>

  </Secao>
</template>
