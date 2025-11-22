import { links } from '~/utils/links'
import type { Aviso } from '~/types/aviso'

export const avisos: Aviso[] = [
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
