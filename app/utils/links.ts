export const links = {
  ifood: site.social.ifood,
  instagram: site.social.instagram,
  facebook: site.social.facebook,
  googleMaps: site.social.googleMaps,
  review: `https://search.google.com/local/writereview?placeid=${site.googlePlaceId}`,
  whatsapp: (message: string = 'Olá!') =>
    `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`
}

/** Mensagens prontas do WhatsApp usadas em vários CTAs. */
export const whatsappMessages = {
  reserva: 'Olá! Gostaria de fazer uma reserva.',
  aniversario: 'Olá! Gostaria de reservar para comemorar meu aniversário!',
  pagode: 'Olá! Gostaria de fazer uma reserva para curtir o pagode com vocês!',
  contato: 'Olá!'
}
