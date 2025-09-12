const phoneNumber = '5512988865185'

export const links = {
  ifood: 'https://www.ifood.com.br/delivery/sao-jose-dos-campos-sp/expediente-bar-jardim-satelite/0780226c-3ae2-4204-b6f0-ed90ada79fc2',
  whatsapp: (message: string = 'Olá!') => {return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`},
  instagram: 'https://www.instagram.com/expedientebar_',
  facebook: 'https://www.facebook.com/Expedientebarsjc',
  review: 'https://search.google.com/local/writereview?placeid=ChIJVx-dQk9LzJQR80Am0iwvW10'
}
