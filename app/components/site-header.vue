<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const { trackEvent } = useAnalytics()

/** Anexa rastreio de clique a itens de navegação (Nuxt UI chama onSelect ao clicar). */
function rastrear (itens: NavigationMenuItem[], local: string): NavigationMenuItem[] {
  return itens.map(item => ({
    ...item,
    onSelect: () => trackEvent('nav_click', { label: item.label, to: item.to, local })
  }))
}

const rolou = ref(false)
const naHome = computed(() => route.path === '/')
/** Na home o header só aparece depois de rolar o hero; nas outras páginas fica sempre visível. */
const visivel = computed(() => !naHome.value || rolou.value)

function aoRolar () {
  rolou.value = window.scrollY > 160
}
onMounted(() => {
  aoRolar()
  window.addEventListener('scroll', aoRolar, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', aoRolar))

const principais: NavigationMenuItem[] = rastrear([
  { label: 'Agenda', to: '/#agenda', icon: 'i-lucide-calendar-days' },
  { label: 'Eventos', to: '/eventos', icon: 'i-lucide-ticket' },
  { label: 'Cardápio', to: '/cardapio', icon: 'i-lucide-utensils' },
  { label: 'Galeria', to: '/#galeria', icon: 'i-lucide-images' }
], 'header')

const menuMovel: NavigationMenuItem[][] = [
  [
    ...principais,
    { label: 'Avaliações', to: '/#avaliacoes', icon: 'i-lucide-star' },
    { label: 'Perguntas frequentes', to: '/#faq', icon: 'i-lucide-circle-help' },
    { label: 'Como chegar', to: '/#local', icon: 'i-lucide-map-pin' }
  ],
  [
    { label: 'WhatsApp', to: links.whatsapp(whatsappMessages.contato), icon: 'i-simple-icons-whatsapp', target: '_blank' },
    { label: 'Instagram', to: links.instagram, icon: 'i-simple-icons-instagram', target: '_blank' },
    { label: 'iFood', to: links.ifood, icon: 'i-simple-icons-ifood', target: '_blank' }
  ]
]
</script>

<template>
  <UHeader
    mode="drawer"
    to="/"
    :menu="{ direction: 'right', title: 'Menu', description: 'Navegue pelo site do Expediente Bar' }"
    :toggle="{ color: 'neutral', variant: 'ghost', 'aria-label': 'Abrir menu' }"
    :aria-hidden="!visivel"
    :ui="{
      root: `fixed inset-x-0 top-0 z-50 bg-black/80 border-white/10 backdrop-blur-md transition-transform duration-300 will-change-transform ${visivel ? 'translate-y-0' : '-translate-y-full'}`,
      container: 'max-w-6xl',
      left: 'flex-1 min-w-0',
      center: 'flex-none',
      right: 'flex-1 justify-end',
      title: 'flex items-center gap-2',
      body: 'flex flex-col gap-6'
    }"
    @update:open="(aberto: boolean) => aberto && trackEvent('menu_abrir')"
  >
    <template #top>
      <UButton
        to="#conteudo"
        variant="solid"
        color="primary"
        size="sm"
        class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60]"
      >
        Ir para o conteúdo
      </UButton>
    </template>

    <template #left>
      <ULink
        to="/"
        class="flex items-center gap-2 shrink-0"
        aria-label="Expediente Bar – página inicial"
      >
        <img
          src="/logo.svg"
          alt="Expediente Bar"
          width="476"
          height="151"
          class="h-7 w-[88px]"
        />
      </ULink>
    </template>

    <UNavigationMenu
      :items="principais"
      variant="link"
      color="neutral"
      :ui="{ link: 'font-medium text-white/85 hover:text-white', linkLeadingIcon: 'hidden' }"
    />

    <template #right>
      <UButton
        :to="links.whatsapp(whatsappMessages.reserva)"
        target="_blank"
        rel="noopener noreferrer"
        icon="i-simple-icons-whatsapp"
        color="primary"
        label="Reservar"
        class="font-semibold"
        @click="trackEvent('reserve_click', { source: 'header' })"
      />
    </template>

    <template #body>
      <UNavigationMenu
        :items="menuMovel"
        aria-label="Menu móvel"
        orientation="vertical"
        variant="link"
        color="neutral"
        :ui="{ link: 'py-2.5 text-base' }"
      />
    </template>
  </UHeader>
</template>
