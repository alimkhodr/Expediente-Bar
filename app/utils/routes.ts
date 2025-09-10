import type { NavigationMenuItem } from '@nuxt/ui'

export const routes = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'Agenda',
      to: '#agenda'
    },
    {
      label: 'Mapa',
      to: '#mapa'
    },
    {
      label: 'Avaliações',
      to: '#avaliacoes'
    },
    {
      label: 'FAQ',
      to: '#faq'
    },
    {
      label: 'Local',
      to: '#local'
    },
    {
      label: 'Cardápio',
      to: '/cardapio',
      target: '_blank'
    },
    {
      label: 'WhatsApp',
      icon: 'i-simple-icons-whatsapp',
      to: 'https://wa.me/5511999999999',
      class: 'text-green-500',
      target: '_blank'
    }
  ]
])
