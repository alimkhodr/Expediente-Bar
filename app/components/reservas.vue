<script setup lang="ts">
const { trackEvent } = useAnalytics()

const acoes = [
  {
    label: 'Reservar pelo WhatsApp',
    to: links.whatsapp(whatsappMessages.reserva),
    target: '_blank',
    rel: 'noopener noreferrer',
    color: 'primary' as const,
    size: 'xl' as const,
    icon: 'i-simple-icons-whatsapp',
    onClick: () => trackEvent('reserve_click', { source: 'reservas' })
  },
  {
    label: 'Reserva de aniversário',
    to: links.whatsapp(whatsappMessages.aniversario),
    target: '_blank',
    rel: 'noopener noreferrer',
    color: 'neutral' as const,
    variant: 'outline' as const,
    size: 'xl' as const,
    icon: 'i-lucide-party-popper',
    onClick: () => trackEvent('reserve_click', { source: 'reservas_aniversario' })
  }
]
</script>

<template>
  <section
    id="reservas"
    aria-labelledby="reservas-titulo"
    class="bg-elevated/40"
  >
    <UPageSection
      as="div"
      orientation="horizontal"
      :description="`Use o mapa da casa como referência e fale com a gente no WhatsApp ${site.telephone}. Aniversariantes têm condições especiais e recomendamos reservar com antecedência para sextas e sábados.`"
      :links="acoes"
      :ui="{
        container: 'py-16 sm:py-16 lg:py-16 gap-10 lg:grid-cols-5',
        wrapper: 'lg:col-span-2',
        title: 'text-3xl sm:text-4xl lg:text-5xl',
        links: 'mt-2 flex-col sm:flex-row lg:flex-col lg:items-start'
      }"
    >
      <template #title>
        <span id="reservas-titulo">
          <span class="text-primary italic">Reserve</span> sua mesa
        </span>
      </template>

      <figure class="lg:col-span-3">
        <img
          src="/images/mapa.svg"
          alt="Mapa da casa do Expediente Bar com a disposição das mesas, palco e bar"
          width="1200"
          height="800"
          loading="lazy"
          decoding="async"
        />
        <figcaption class="mt-2 text-center text-xs text-muted">
          Mapa ilustrativo da casa
        </figcaption>
      </figure>
    </UPageSection>
  </section>
</template>
