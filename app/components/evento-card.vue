<script setup lang="ts">
import type { Evento } from '~/types/eventos'

const props = defineProps<{ evento: Evento; prioridade?: boolean }>()
const { trackEvent } = useAnalytics()
const data = computed(() => formatarDiaMes(props.evento.inicio))
</script>

<template>
  <UPageCard
    as="article"
    :title="evento.nome"
    variant="subtle"
    highlight
    highlight-color="primary"
    :ui="{
      root: 'h-full rounded-xl overflow-hidden ring-white/10',
      container: 'p-0 sm:p-0 gap-0 h-full',
      wrapper: 'p-5 pt-0 h-full items-stretch',
      header: 'mb-5 -mx-5 relative',
      title: 'text-lg leading-snug',
      description: 'text-sm text-muted flex flex-col gap-1.5 mt-2',
      footer: 'pt-4 w-full'
    }"
  >
    <template #header>
      <div class="relative aspect-[16/9] overflow-hidden bg-elevated">
        <NuxtImg
          v-if="evento.imagem"
          :src="evento.imagem"
          :alt="`Cartaz do evento ${evento.nome}`"
          width="640"
          height="360"
          sizes="xs:100vw sm:50vw lg:33vw"
          densities="x1"
          format="webp"
          quality="70"
          :loading="prioridade ? 'eager' : 'lazy'"
          :fetchpriority="prioridade ? 'high' : undefined"
          :preload="prioridade ? { fetchPriority: 'high' } : false"
          class="h-full w-full object-cover"
        />
        <div
          v-else
          class="flex h-full w-full items-center justify-center text-primary/60"
          aria-hidden="true"
        >
          <UIcon
            name="i-lucide-ticket"
            class="size-12"
          />
        </div>
        <time
          :datetime="comOffsetSaoPaulo(evento.inicio)"
          class="absolute left-4 top-4"
        >
          <UBadge
            color="neutral"
            variant="solid"
            size="xl"
            class="flex-col rounded-lg bg-black/85 px-3 py-2 leading-none text-white backdrop-blur"
          >
            <span class="text-2xl font-bold">{{ data.dia }}</span>
            <span class="text-[11px] uppercase tracking-wide">{{ data.mes }}</span>
          </UBadge>
        </time>
      </div>
    </template>
    <template #description>
      <span class="flex items-center gap-2 capitalize">
        <UIcon
          name="i-lucide-clock"
          class="size-4 text-primary"
          aria-hidden="true"
        />
        {{ data.diaSemana }}, {{ data.hora }}
      </span>
      <span
        v-if="evento.local"
        class="flex items-center gap-2"
      >
        <UIcon
          name="i-lucide-map-pin"
          class="size-4 text-primary"
          aria-hidden="true"
        />
        {{ evento.local }}
      </span>
    </template>
    <template #footer>
      <UButton
        :to="evento.url"
        target="_blank"
        rel="noopener noreferrer"
        color="primary"
        size="lg"
        block
        class="font-semibold"
        icon="i-lucide-ticket"
        @click="trackEvent('evento_ingresso_click', { id: evento.id, nome: evento.nome })"
      >
        Comprar ingresso
      </UButton>
    </template>
  </UPageCard>
</template>
