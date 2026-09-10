<script setup lang="ts">
import type { Agenda } from '~/types/conteudo'

const props = defineProps<{ agenda: Agenda }>()
const { trackEvent } = useAnalytics()
const periodo = computed(() => intervaloAgendaSemana())
</script>

<template>
  <Secao
    id="agenda"
    destaque="Agenda"
    titulo="semanal"
    :descricao="`Programação de ${periodo}. Toda semana tem música ao vivo e promoção.`"
  >
    <template #acoes>
      <UButton
        :to="links.whatsapp(whatsappMessages.reserva)"
        target="_blank"
        rel="noopener noreferrer"
        color="primary"
        icon="i-simple-icons-whatsapp"
        @click="trackEvent('reserve_click', { source: 'agenda' })"
      >
        Reservar mesa
      </UButton>
      <UButton
        :to="props.agenda.linkPublico"
        target="_blank"
        rel="noopener noreferrer"
        color="neutral"
        variant="outline"
        icon="i-simple-icons-instagram"
        @click="trackEvent('agenda_instagram_click')"
      >
        Agenda no Instagram
      </UButton>
    </template>

    <div class="grid gap-8 lg:grid-cols-5 lg:items-start">
      <UPageList
        as="ol"
        class="gap-3 lg:col-span-2"
      >
        <UPageCard
          v-for="item in props.agenda.itens"
          :key="item.id"
          as="li"
          :title="item.dia"
          :description="item.descricao"
          :icon="item.icone"
          variant="subtle"
          :ui="{
            root: 'rounded-xl ring-white/10',
            container: 'p-4 sm:p-5',
            wrapper: 'flex-row items-start gap-4',
            leading: 'mb-0 mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30',
            leadingIcon: 'size-5',
            description: 'text-sm text-muted'
          }"
        />
      </UPageList>

      <div class="lg:col-span-3">
        <EmbedLazy
          :src="props.agenda.canvaEmbed"
          titulo="Agenda da semana do Expediente Bar"
          proporcao="4 / 5"
          classe="mx-auto max-w-xl lg:max-w-none"
          :link-externo="props.agenda.canvaEmbed.replace('?embed', '')"
          rotulo-link="Abrir agenda"
        />
      </div>
    </div>
  </Secao>
</template>
