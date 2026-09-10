import type { Evento } from '~/types/eventos'

type Nodo = Record<string, unknown>

function base () {
  const { public: { siteUrl } } = useRuntimeConfig()
  return { siteUrl }
}

/** Injeta um bloco JSON-LD (@graph) no <head>. */
export function useSchemaOrg (nodos: Nodo[]) {
  useHead({
    script: [{
      type: 'application/ld+json',
      innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@graph': nodos })
    }]
  })
}

const DIAS_SCHEMA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/** BarOrPub + Restaurant: nome, endereço, telefone, horários, redes, cardápio. */
export function schemaNegocio (): Nodo {
  const { siteUrl } = base()
  return {
    '@type': ['BarOrPub', 'Restaurant'],
    '@id': `${siteUrl}/#negocio`,
    name: site.name,
    alternateName: 'Expediente Bar SJC',
    description: site.description,
    url: siteUrl,
    telephone: site.telephone,
    priceRange: site.priceRange,
    image: [`${siteUrl}${site.images.og}`],
    logo: `${siteUrl}${site.images.logo}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.streetAddress,
      addressLocality: site.address.addressLocality,
      addressRegion: site.address.addressRegion,
      postalCode: site.address.postalCode,
      addressCountry: site.address.addressCountry
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.latitude,
      longitude: site.geo.longitude
    },
    hasMap: site.social.googleMaps,
    openingHoursSpecification: site.openingHours.map(h => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes
    })),
    sameAs: [site.social.instagram, site.social.facebook, site.social.ifood, site.social.sympla],
    hasMenu: `${siteUrl}/cardapio`,
    servesCuisine: ['Petiscos', 'Porções', 'Drinks', 'Cerveja'],
    acceptsReservations: 'True',
    currenciesAccepted: 'BRL',
    paymentAccepted: 'Cartão de crédito, cartão de débito, Pix, VR, Pluxee, Alelo, Ticket',
    publicAccess: true,
    isAccessibleForFree: true,
    keywords: 'bar, pagode, sertanejo, música ao vivo, São José dos Campos, happy hour, porções, drinks'
  }
}

export function schemaWebSite (): Nodo {
  const { siteUrl } = base()
  return {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: site.name,
    inLanguage: 'pt-BR',
    publisher: { '@id': `${siteUrl}/#negocio` }
  }
}

export function schemaPagina (caminho: string, nome: string, descricao: string): Nodo {
  const { siteUrl } = base()
  return {
    '@type': 'WebPage',
    '@id': `${siteUrl}${caminho}#webpage`,
    url: `${siteUrl}${caminho}`,
    name: nome,
    description: descricao,
    inLanguage: 'pt-BR',
    isPartOf: { '@id': `${siteUrl}/#website` },
    about: { '@id': `${siteUrl}/#negocio` }
  }
}

export function schemaBreadcrumb (itens: { nome: string; caminho: string }[]): Nodo {
  const { siteUrl } = base()
  return {
    '@type': 'BreadcrumbList',
    itemListElement: itens.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.nome,
      item: `${siteUrl}${item.caminho}`
    }))
  }
}

export function schemaFaq (perguntas: { question: string; answer: string }[]): Nodo {
  return {
    '@type': 'FAQPage',
    mainEntity: perguntas.map(p => ({
      '@type': 'Question',
      name: p.question,
      acceptedAnswer: { '@type': 'Answer', text: p.answer }
    }))
  }
}

/** Datas do Sympla vêm em horário local de São Paulo sem offset. */
export function comOffsetSaoPaulo (iso: string): string {
  return /[Zz]|[+-]\d{2}:\d{2}$/.test(iso) ? iso : `${iso}-03:00`
}

export function schemaEvento (evento: Evento): Nodo {
  const { siteUrl } = base()
  return {
    '@type': 'Event',
    '@id': `${siteUrl}/eventos#${evento.id}`,
    name: evento.nome,
    description: evento.descricao || `${evento.nome} no ${site.name}`,
    startDate: comOffsetSaoPaulo(evento.inicio),
    endDate: comOffsetSaoPaulo(evento.fim),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: evento.imagem ? [evento.imagem] : [`${siteUrl}${site.images.og}`],
    url: evento.url,
    location: {
      '@type': 'Place',
      name: evento.local || site.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: site.address.streetAddress,
        addressLocality: site.address.addressLocality,
        addressRegion: site.address.addressRegion,
        postalCode: site.address.postalCode,
        addressCountry: site.address.addressCountry
      }
    },
    organizer: { '@type': 'Organization', name: site.name, url: siteUrl },
    offers: {
      '@type': 'Offer',
      url: evento.url,
      availability: 'https://schema.org/InStock',
      priceCurrency: 'BRL',
      validFrom: new Date().toISOString().slice(0, 10)
    }
  }
}

export { DIAS_SCHEMA }
