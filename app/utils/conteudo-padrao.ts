import type { Conteudo } from '~/types/conteudo'

/**
 * Conteúdo padrão do site. O CMS (/admin/cms) sobrescreve cada chave;
 * quando a tabela `conteudo` está vazia ou fora do ar, o site usa isto.
 */
export const conteudoPadrao: Conteudo = {
  links: [
    { id: 'reservas', titulo: 'Reservar mesa', descricao: 'Garanta seu lugar pelo WhatsApp', icone: 'i-simple-icons-whatsapp', url: 'https://wa.me/5512988865185?text=Ol%C3%A1!%20Gostaria%20de%20fazer%20uma%20reserva.', ativo: true },
    { id: 'cardapio', titulo: 'Ver cardápio', descricao: 'Porções, lanches e drinks', icone: 'i-lucide-utensils', url: '/cardapio', imagem: '/images/galeria/foto-40.webp', ativo: true },
    { id: 'eventos', titulo: 'Eventos e ingressos', descricao: 'Próximas festas pelo Sympla', icone: 'i-lucide-ticket', url: '/eventos', ativo: true },
    { id: 'agenda', titulo: 'Agenda da semana', descricao: 'Pagode, sertanejo e promoções', icone: 'i-lucide-calendar-days', url: '#agenda', ativo: true },
    { id: 'instagram', titulo: 'Instagram', descricao: '@expedientebar_', icone: 'i-simple-icons-instagram', url: 'https://www.instagram.com/expedientebar_', ativo: true },
    { id: 'ifood', titulo: 'Pedir no iFood', descricao: 'Delivery', icone: 'i-simple-icons-ifood', url: 'https://www.ifood.com.br/delivery/sao-jose-dos-campos-sp/expediente-bar-jardim-satelite/0780226c-3ae2-4204-b6f0-ed90ada79fc2', ativo: true },
    { id: 'localizacao', titulo: 'Como chegar', descricao: 'Floradas de São José', icone: 'i-lucide-map-pin', url: 'https://www.google.com/maps/search/?api=1&query=Expediente%20Bar&query_place_id=ChIJVx-dQk9LzJQR80Am0iwvW10', ativo: true }
  ],
  destaques: [
    {
      id: 'aniversario',
      titulo: 'Comemore seu aniversário',
      texto: 'Reserve sua mesa e aproveite condições especiais para aniversariantes do mês.',
      imagem: '/images/galeria/foto-01.webp',
      botao: 'Reservar',
      url: 'https://wa.me/5512988865185?text=Ol%C3%A1!%20Gostaria%20de%20reservar%20para%20comemorar%20meu%20anivers%C3%A1rio!',
      icone: 'i-lucide-party-popper',
      ativo: true
    },
    {
      id: 'pagode',
      titulo: 'O melhor do pagode',
      texto: 'A energia do pagode que você ama é aqui. Confira a agenda e venha curtir com a gente.',
      imagem: '/images/galeria/foto-14.webp',
      botao: 'Ver agenda',
      url: '#agenda',
      icone: 'i-lucide-music',
      ativo: true
    },
    {
      id: 'ifood',
      titulo: 'Delivery no iFood',
      texto: 'Porções, lanches e bebidas no conforto da sua casa.',
      imagem: '/images/galeria/foto-40.webp',
      botao: 'Pedir no iFood',
      url: 'https://www.ifood.com.br/delivery/sao-jose-dos-campos-sp/expediente-bar-jardim-satelite/0780226c-3ae2-4204-b6f0-ed90ada79fc2',
      icone: 'i-simple-icons-ifood',
      ativo: true
    }
  ],
  agenda: {
    itens: [
      { id: 'ter-qua', dia: 'Terça e quarta', descricao: 'Promoção de cerveja', icone: 'i-lucide-beer' },
      { id: 'sex', dia: 'Sexta-feira', descricao: 'Sextanejo ou pagode, com promoção. #SEXTOU', icone: 'i-lucide-guitar' },
      { id: 'sab', dia: 'Sábado', descricao: 'O melhor pagode da cidade', icone: 'i-lucide-mic-vocal' }
    ],
    canvaEmbed: 'https://www.canva.com/design/DAHMT7rO9mg/OLZk7gBOLn_u0cBiv5yrhA/view?embed',
    linkPublico: 'https://www.instagram.com/expedientebar_'
  },
  faq: [
    {
      id: 'reservas',
      question: 'Vocês aceitam reservas?',
      answer: 'Sim, aceitamos reservas! Você pode fazer sua reserva pelo WhatsApp (12) 98886-5185 ou através das nossas redes sociais. Recomendamos reservar com antecedência, especialmente para fins de semana.'
    },
    {
      id: 'aniversario',
      question: 'Aniversariante tem alguma condição especial?',
      answer: 'Sim! Temos condições especiais para aniversariantes do mês. Consulte nossa equipe no momento da reserva para mais informações.'
    },
    {
      id: 'pagamento',
      question: 'Quais formas de pagamento vocês aceitam?',
      answer: 'Aceitamos cartões de crédito e débito, além de vales refeição como VR Refeição, Pluxee, Alelo e Ticket.'
    },
    {
      id: 'estacionamento',
      question: 'Vocês têm estacionamento?',
      answer: 'Temos bastante espaço em volta do bar para estacionar com tranquilidade. Assim, você não precisa se preocupar e pode aproveitar ao máximo a sua experiência com a gente.'
    },
    {
      id: 'musica',
      question: 'Vocês têm música ao vivo?',
      answer: 'Sim! Temos apresentações de música ao vivo nas sextas-feiras (Pagode ou Sertanejo) e aos sábados (Pagode). Confira nossa agenda completa no site ou em nosso Instagram.'
    },
    {
      id: 'local',
      question: 'Onde vocês estão localizados?',
      answer: 'Estamos localizados na Rua Paulo da Silva Santos, nº 32 - Floradas de São José, Zona Sul de São José dos Campos, próximo ao Shopping Vale Sul.'
    }
  ]
}
