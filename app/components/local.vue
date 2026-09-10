<script setup lang="ts">
const { descricoes, sincronizadoComGoogle, diaHoje } = useHorario()
const { trackEvent } = useAnalytics()

const DIAS_ORDEM = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo']

/** Google devolve começando em segunda-feira; normalizo para (índice 0 = domingo). */
const linhas = computed(() => descricoes.value.map((d) => {
  const [dia, ...resto] = d.split(':')
  const horario = resto.join(':').trim()
  const nome = (dia ?? '').replace('-feira', '').trim().toLowerCase()
  const indice = (DIAS_ORDEM.findIndex(x => nome.startsWith(x)) + 1) % 7
  return { nome, horario, fechado: /fechado/i.test(horario), hoje: indice === diaHoje.value }
}))
</script>

<template>
  <Secao
    id="local"
    destaque="Onde"
    titulo="estamos"
    descricao="Zona Sul de São José dos Campos, pertinho do Shopping Vale Sul, com estacionamento fácil."
  >
    <div class="grid gap-6 lg:grid-cols-5">
      <div class="flex flex-col gap-6 lg:col-span-2">
        <UPageCard
          as="address"
          icon="i-lucide-map-pin"
          :title="site.address.streetAddress"
          variant="subtle"
          :ui="{ root: 'rounded-xl ring-white/10 not-italic', wrapper: 'items-stretch', leadingIcon: 'size-6', title: 'text-lg', footer: 'pt-4' }"
        >
          <template #description>
            {{ site.address.neighborhood }} · {{ site.address.addressLocality }} – {{ site.address.addressRegion }}<br/>
            CEP {{ site.address.postalCode }}
          </template>
          <template #footer>
            <div class="flex flex-wrap gap-2">
              <UButton
                :to="links.googleMaps"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                icon="i-lucide-navigation"
                @click="trackEvent('directions_click')"
              >
                Como chegar
              </UButton>
              <UButton
                :to="links.whatsapp(whatsappMessages.contato)"
                target="_blank"
                rel="noopener noreferrer"
                color="neutral"
                variant="outline"
                icon="i-simple-icons-whatsapp"
              >
                WhatsApp
              </UButton>
            </div>
          </template>
        </UPageCard>

        <UPageCard
          icon="i-lucide-clock"
          title="Horário de funcionamento"
          variant="subtle"
          :ui="{ root: 'rounded-xl ring-white/10', wrapper: 'w-full items-stretch', leadingIcon: 'size-6', body: 'w-full', footer: 'pt-3 w-full' }"
        >
          <template #description>
            <!-- Só no cliente: o destaque de "hoje" e a ordem vinda do Google mudam após a hidratação -->
            <ClientOnly>
              <dl class="mt-2 divide-y divide-default text-sm">
                <div
                  v-for="linha in linhas"
                  :key="linha.nome"
                  class="flex items-center justify-between gap-4 py-2"
                  :class="linha.hoje ? 'text-highlighted font-semibold' : 'text-muted'"
                >
                  <dt class="flex items-center gap-2 capitalize">
                    {{ linha.nome }}
                    <UBadge
                      v-if="linha.hoje"
                      color="primary"
                      variant="subtle"
                      size="xs"
                    >
                      hoje
                    </UBadge>
                  </dt>
                  <dd :class="linha.fechado ? 'text-error' : ''">
                    {{ linha.horario }}
                  </dd>
                </div>
              </dl>
              <template #fallback>
                <dl class="mt-2 divide-y divide-default text-sm text-muted">
                  <div
                    v-for="linha in linhas"
                    :key="linha.nome"
                    class="flex items-center justify-between gap-4 py-2"
                  >
                    <dt class="capitalize">
                      {{ linha.nome }}
                    </dt>
                    <dd :class="linha.fechado ? 'text-error' : ''">
                      {{ linha.horario }}
                    </dd>
                  </div>
                </dl>
              </template>
            </ClientOnly>
          </template>
          <template #footer>
            <p class="text-xs text-muted">
              <ClientOnly>{{ sincronizadoComGoogle ? 'Sincronizado com o Google.' : 'Horário padrão da casa.' }}</ClientOnly>
            </p>
          </template>
        </UPageCard>
      </div>

      <div class="lg:col-span-3">
        <EmbedLazy
          :src="site.embeds.mapa"
          titulo="Mapa com a localização do Expediente Bar"
          classe="h-[360px] lg:h-full lg:min-h-[420px]"
          :link-externo="links.googleMaps"
          rotulo-link="Abrir no Google Maps"
        />
      </div>
    </div>
  </Secao>
</template>
