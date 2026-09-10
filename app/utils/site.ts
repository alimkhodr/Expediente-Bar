/**
 * Fonte única de verdade sobre o negócio.
 * Usada por SEO (JSON-LD), header, hero, rodapé e páginas.
 */
export const site = {
  name: 'Expediente Bar',
  legalName: 'Expediente Bar',
  slogan: 'O melhor expediente é aqui!',
  description:
    'Bar em São José dos Campos com pagode ao vivo, sertanejo, cerveja gelada, porções e drinks. Reserve sua mesa, veja a agenda da semana, o cardápio e os próximos eventos.',
  url: 'https://expedientebar.com.br',
  locale: 'pt-BR',
  telephone: '+55 12 98886-5185',
  whatsappNumber: '5512988865185',
  email: '',
  priceRange: '$$',
  address: {
    streetAddress: 'Rua Paulo da Silva Santos, 32',
    addressLocality: 'São José dos Campos',
    addressRegion: 'SP',
    postalCode: '12230-091',
    addressCountry: 'BR',
    neighborhood: 'Floradas de São José'
  },
  geo: {
    latitude: -23.218927,
    longitude: -45.887348
  },
  googlePlaceId: 'ChIJVx-dQk9LzJQR80Am0iwvW10',
  /** Horário padrão (fallback quando a API do Google não responde). */
  openingHours: [
    { days: ['Tuesday', 'Wednesday', 'Thursday'], opens: '17:00', closes: '00:00' },
    { days: ['Friday'], opens: '17:00', closes: '01:00' },
    { days: ['Saturday'], opens: '16:00', closes: '01:00' }
  ],
  social: {
    instagram: 'https://www.instagram.com/expedientebar_',
    facebook: 'https://www.facebook.com/Expedientebarsjc',
    ifood: 'https://www.ifood.com.br/delivery/sao-jose-dos-campos-sp/expediente-bar-jardim-satelite/0780226c-3ae2-4204-b6f0-ed90ada79fc2',
    googleMaps: 'https://www.google.com/maps/search/?api=1&query=Expediente%20Bar&query_place_id=ChIJVx-dQk9LzJQR80Am0iwvW10',
    sympla: 'https://www.sympla.com.br/produtor/expedientebar'
  },
  embeds: {
    agendaCanva: 'https://www.canva.com/design/DAHMT7rO9mg/OLZk7gBOLn_u0cBiv5yrhA/view?embed',
    mapa: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7333.327207348863!2d-45.887348!3d-23.218927!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cc4a8c55544269%3A0xa891d1d896845d41!2sR.%20Paulo%20da%20Silva%20Santos%2C%2032%20-%20Floradas%20de%20S%C3%A3o%20Jos%C3%A9%2C%20S%C3%A3o%20Jos%C3%A9%20dos%20Campos%20-%20SP%2C%2012230-091!5e0!3m2!1spt-BR!2sbr!4v1739294099875!5m2!1spt-BR!2sbr'
  },
  images: {
    logo: '/logo.svg',
    og: '/og-image.jpg'
  }
} as const

export type Site = typeof site
