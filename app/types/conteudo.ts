/** Ícones permitidos no CMS (só estes entram no bundle). */
export const ICONES_CMS = [
  'i-lucide-calendar-days',
  'i-lucide-ticket',
  'i-lucide-utensils',
  'i-lucide-calendar-check',
  'i-lucide-map-pin',
  'i-lucide-star',
  'i-lucide-party-popper',
  'i-lucide-beer',
  'i-lucide-music',
  'i-lucide-mic-vocal',
  'i-lucide-guitar',
  'i-lucide-sparkles',
  'i-lucide-images',
  'i-lucide-phone',
  'i-lucide-truck',
  'i-lucide-gift',
  'i-lucide-clock',
  'i-simple-icons-whatsapp',
  'i-simple-icons-instagram',
  'i-simple-icons-facebook',
  'i-simple-icons-ifood',
  'i-simple-icons-tiktok',
  'i-simple-icons-spotify'
] as const

export type IconeCms = typeof ICONES_CMS[number]

export interface LinkHero {
  id: string
  titulo: string
  descricao: string
  icone: IconeCms
  /** URL absoluta, caminho interno ("/cardapio") ou âncora ("#agenda") */
  url: string
  ativo: boolean
}

export interface Destaque {
  id: string
  titulo: string
  texto: string
  imagem: string
  botao: string
  url: string
  icone?: IconeCms
  ativo: boolean
}

export interface ItemAgenda {
  id: string
  dia: string
  descricao: string
  icone: IconeCms
}

export interface Agenda {
  itens: ItemAgenda[]
  /** URL de embed do Canva (…/view?embed) */
  canvaEmbed: string
  /** Link público da agenda (Canva/Instagram) */
  linkPublico: string
}

export interface PerguntaFaq {
  id: string
  question: string
  answer: string
}

export interface Conteudo {
  links: LinkHero[]
  destaques: Destaque[]
  agenda: Agenda
  faq: PerguntaFaq[]
}

export type ChaveConteudo = keyof Conteudo

export interface ConteudoResponse {
  conteudo: Conteudo
  /** Quais chaves vieram do CMS (as demais usam o padrão do código) */
  origem: Record<ChaveConteudo, 'cms' | 'padrao'>
  atualizadoEm: string
}
