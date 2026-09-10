<script setup lang="ts">
import type { EventosResponse } from '~/types/eventos'

const { data } = await useFetch<EventosResponse>('/api/eventos', { key: 'eventos-pagina' })
const eventos = computed(() => data.value?.eventos ?? [])

const descricao = computed(() => eventos.value.length
  ? `${eventos.value.length} evento${eventos.value.length > 1 ? 's' : ''} com ingresso no Expediente Bar, em São José dos Campos: ${eventos.value.slice(0, 3).map(e => e.nome).join(', ')}. Compre pelo Sympla.`
  : 'Próximos eventos e festas com ingresso do Expediente Bar, em São José dos Campos. Compre pelo Sympla.')

usePaginaSeo({
  titulo: 'Eventos e ingressos',
  descricao: descricao.value,
  caminho: '/eventos',
  imagem: eventos.value[0]?.imagem ?? undefined
})

useSchemaOrg([
  schemaPagina('/eventos', 'Eventos e ingressos · Expediente Bar', descricao.value),
  schemaBreadcrumb([{ nome: 'Início', caminho: '/' }, { nome: 'Eventos', caminho: '/eventos' }]),
  ...eventos.value.map(schemaEvento)
])

const breadcrumb = [
  { label: 'Início', to: '/', icon: 'i-lucide-house' },
  { label: 'Eventos', to: '/eventos' }
]
</script>

<template>
  <div class="pt-16">
    <Secao
      id="eventos"
      nivel="h1"
      destaque="Eventos"
      titulo="e ingressos"
      descricao="Festas com venda antecipada pelo Sympla. Os eventos aparecem aqui automaticamente assim que são publicados."
    >
      <template #topo>
        <UBreadcrumb :items="breadcrumb" />
      </template>
      <template #acoes/>

      <ul
        v-if="eventos.length"
        class="flex flex-wrap justify-center gap-5"
      >
        <li
          v-for="(evento, i) in eventos"
          :key="evento.id"
          class="w-full sm:w-[calc(50%_-_0.625rem)] lg:w-[calc(33.333%_-_0.834rem)]"
        >
          <EventoCard
            :evento="evento"
            :prioridade="i === 0"
          />
        </li>
      </ul>

      <div
        v-else
        class="flex flex-col items-start gap-5 rounded-xl border border-dashed border-white/15 p-8"
      >
        <div>
          <p class="text-xl font-semibold text-white">
            Nenhum evento com ingresso no momento.
          </p>
          <p class="mt-1 text-muted">
            A programação semanal continua normalmente: pagode e sertanejo ao vivo de sexta e sábado, promoções de terça a quinta.
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <UButton
            to="/#agenda"
            color="primary"
            icon="i-lucide-calendar-days"
          >
            Ver agenda da semana
          </UButton>
          <UButton
            :to="links.instagram"
            target="_blank"
            rel="noopener noreferrer"
            color="neutral"
            variant="outline"
            icon="i-simple-icons-instagram"
          >
            Acompanhar no Instagram
          </UButton>
        </div>
      </div>

      <p class="mt-10 text-sm text-muted">
        Quer reservar mesa para um evento? Fale com a gente no
        <a
          :href="links.whatsapp(whatsappMessages.reserva)"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary underline underline-offset-4 decoration-primary/50 hover:decoration-primary"
        >WhatsApp</a>.
      </p>
    </Secao>
  </div>
</template>
