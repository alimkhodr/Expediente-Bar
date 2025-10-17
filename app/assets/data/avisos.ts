import { links } from '~/utils/links'
import type { Aviso } from '~/types/aviso'

export const avisos: Aviso[] = [
  {
    title: '4 anos Expediente',
    description: 'Garanta já seu ingresso! Dia 08/11',
    avatar: {
      src: '/images/avisos/4-anos.png',
      alt: 'Inauguração'
    },
    days: ['all'],
    status: true,
    actions: [
      {
        trailingIcon: 'material-symbols-arrow-right-alt',
        label: 'Ingressos',
        link: 'https://queroingresso.com/04anosexpedientebar'
      }
    ]
  },
  {
    title: 'Sexta | Caipirinha 50% OFF',
    description: 'Das 17h às 20h',
    avatar: {
      src: '/images/avisos/caipirinha.png',
      alt: 'Caipirinha'
    },
    days: ['friday'],
    status: true,
    actions: [
      {
        trailingIcon: 'material-symbols-arrow-right-alt',
        label: 'Reservar',
        link: links.whatsapp('Olá! Gostaria de reservar para essa sexta-feira!')
      }
    ]
  },
  {
    title: 'Terça e Quarta | Promoção de litrão',
    description: 'Litrão budweiser R$14,90',
    avatar: {
      src: '/images/avisos/litrao.png',
      alt: 'Litrão'
    },
    days: ['tuesday', 'wednesday'],
    status: true,
    actions: [
      {
        trailingIcon: 'material-symbols-arrow-right-alt',
        label: 'Reservar',
        link: links.whatsapp('Olá! Gostaria de reservar uma mesa!')
      }
    ]
  }
]
