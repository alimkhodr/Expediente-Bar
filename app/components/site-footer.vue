<script setup lang="ts">
import type { FooterColumn } from '@nuxt/ui'
const { trackEvent } = useAnalytics()

/** Um único listener para todos os links do rodapé. */
function aoClicar (e: MouseEvent) {
  const a = (e.target as HTMLElement).closest('a')
  if (a) trackEvent('footer_link_click', { label: a.textContent?.trim().slice(0, 60), href: a.getAttribute('href') })
}

const ano = new Date().getFullYear()

const colunas: FooterColumn[] = [
  {
    label: 'Navegação',
    children: [
      { label: 'Agenda', to: '/#agenda' },
      { label: 'Eventos', to: '/eventos' },
      { label: 'Cardápio', to: '/cardapio' },
      { label: 'Galeria', to: '/#galeria' },
      { label: 'Avaliações', to: '/#avaliacoes' },
      { label: 'Perguntas frequentes', to: '/#faq' }
    ]
  },
  {
    label: 'Contato',
    children: [
      { label: 'WhatsApp', to: links.whatsapp(whatsappMessages.contato), icon: 'i-simple-icons-whatsapp', target: '_blank' },
      { label: 'Instagram', to: links.instagram, icon: 'i-simple-icons-instagram', target: '_blank' },
      { label: 'Facebook', to: links.facebook, icon: 'i-simple-icons-facebook', target: '_blank' },
      { label: 'Pedir no iFood', to: links.ifood, icon: 'i-simple-icons-ifood', target: '_blank' },
      { label: site.telephone, to: `tel:${site.telephone.replace(/\D/g, '')}`, icon: 'i-lucide-phone' }
    ]
  }
]

const redes = [
  { label: 'Instagram', to: links.instagram, icon: 'i-simple-icons-instagram' },
  { label: 'Facebook', to: links.facebook, icon: 'i-simple-icons-facebook' },
  { label: 'WhatsApp', to: links.whatsapp(whatsappMessages.contato), icon: 'i-simple-icons-whatsapp' }
]
</script>

<template>
  <UFooter
    :ui="{ root: 'border-t border-white/10', top: 'border-b border-white/10', container: 'max-w-6xl', left: 'text-xs text-muted' }"
    @click="aoClicar"
  >
    <template #top>
      <h2 class="sr-only">
        Informações e links do Expediente Bar
      </h2>
      <UContainer class="max-w-6xl">
        <UFooterColumns :columns="colunas">
          <template #left>
            <div class="flex flex-col gap-4">
              <img
                src="/logo.svg"
                alt="Expediente Bar"
                width="476"
                height="151"
                loading="lazy"
                class="h-10 w-[126px] self-start"
              />
              <p class="text-sm text-muted max-w-sm">
                {{ site.description }}
              </p>
              <address class="not-italic text-sm text-muted">
                {{ site.address.streetAddress }} · {{ site.address.neighborhood }}<br/>
                {{ site.address.addressLocality }} – {{ site.address.addressRegion }}, {{ site.address.postalCode }}
              </address>
            </div>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <p>© {{ ano }} {{ site.name }}. Todos os direitos reservados.</p>
    </template>

    <template #default>
      <p class="text-xs text-muted">
        Site por
        <ULink
          to="https://www.instagram.com/alikhodr10"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-primary"
        >@alikhodr10</ULink>
      </p>
    </template>

    <template #right>
      <UButton
        v-for="rede in redes"
        :key="rede.to"
        :to="rede.to"
        target="_blank"
        rel="noopener noreferrer"
        :icon="rede.icon"
        color="neutral"
        variant="ghost"
        :aria-label="rede.label"
      />
    </template>
  </UFooter>
</template>
