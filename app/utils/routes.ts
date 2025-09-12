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
      to: '/cardapio'
    },
    {
      label: 'WhatsApp',
      icon: 'i-simple-icons-whatsapp',
      to: links.whatsapp('Olá'),
      class: 'text-green-500',
      target: '_blank'
    }
  ]
])
