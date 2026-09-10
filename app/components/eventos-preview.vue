<script setup lang="ts">
import type { EventosResponse } from '~/types/eventos'

const { data, status } = useLazyFetch<EventosResponse>('/api/eventos', {
  key: 'eventos-preview',
  server: false
})

const eventos = computed(() => (data.value?.eventos ?? []).slice(0, 3))
const carregando = computed(() => status.value === 'pending' || status.value === 'idle')
</script>

<template>
  <Secao
    v-if="carregando || eventos.length"
    id="eventos"
    destaque="Próximos"
    titulo="eventos"
    descricao="Festas com ingresso: garanta o seu antes de esgotar."
    contraste
  >
    <template #acoes>
      <UButton
        to="/eventos"
        variant="outline"
        color="neutral"
        trailing-icon="i-lucide-arrow-right"
      >
        Ver todos os eventos
      </UButton>
    </template>

    <UPageGrid
      v-if="carregando"
      class="gap-5 lg:grid-cols-3"
      aria-busy="true"
      aria-label="Carregando eventos"
    >
      <UPageCard
        v-for="n in 3"
        :key="n"
        variant="subtle"
        :ui="{ root: 'rounded-xl overflow-hidden', container: 'p-0 sm:p-0 gap-0', wrapper: 'p-5 pt-0 w-full items-stretch' }"
      >
        <template #header>
          <USkeleton class="aspect-[16/9] w-full rounded-none" />
        </template>
        <template #body>
          <div class="flex h-[188px] flex-col gap-3 pt-1">
            <USkeleton class="h-6 w-3/4" />
            <USkeleton class="h-4 w-1/2" />
            <USkeleton class="h-4 w-1/3" />
            <USkeleton class="mt-auto h-11 w-full" />
          </div>
        </template>
      </UPageCard>
    </UPageGrid>

    <ul
      v-else
      class="flex flex-wrap justify-center gap-5"
    >
      <li
        v-for="evento in eventos"
        :key="evento.id"
        class="w-full sm:w-[calc(50%_-_0.625rem)] lg:w-[calc(33.333%_-_0.834rem)]"
      >
        <EventoCard :evento="evento" />
      </li>
    </ul>

  </Secao>
</template>
