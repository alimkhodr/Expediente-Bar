// Mapa da área interna: usado no menu lateral e nos cards da home do admin.

export interface AdminTool {
  label: string
  description: string
  icon: string
  to: string
}

export const adminTools: AdminTool[] = [
  { label: 'Início', description: 'Visão geral e atalhos.', icon: 'i-lucide-house', to: '/admin' },
  { label: 'Chamar senha', description: 'Chama a senha do pedido na TV do balcão. Dá para escanear a comanda.', icon: 'i-lucide-megaphone', to: '/admin/senhas' },
  { label: 'Placa de avaliação', description: 'Quem os clientes indicaram na placa NFC/QR e quais avaliações já apareceram no Google.', icon: 'i-lucide-star', to: '/admin/reviews' },
  { label: 'Conteúdo do site', description: 'Links do início, destaques, agenda da semana e perguntas frequentes.', icon: 'i-lucide-layout-template', to: '/admin/cms' }
]

export interface PublicScreen {
  label: string
  description: string
  icon: string
  to: string
}

/** Telas que o público vê (abrem em nova aba). */
export const publicScreens: PublicScreen[] = [
  { label: 'Site', description: 'Página inicial do bar.', icon: 'i-lucide-globe', to: '/' },
  { label: 'TV de senhas', description: 'Abrir na TV do balcão em tela cheia.', icon: 'i-lucide-tv', to: '/tv' },
  { label: 'Cardápio', description: 'Destino da placa de cardápio.', icon: 'i-lucide-book-open', to: '/cardapio/' },
  { label: 'Tela de avaliação', description: 'Destino da placa de avaliação.', icon: 'i-lucide-message-square-heart', to: '/avaliar/' }
]

export interface PlaqueLink {
  label: string
  medium: 'nfc' | 'qr'
  path: string
}

/** Links gravados nas placas: o mesmo em todas as placas de cada tipo. */
export const plaqueLinks: PlaqueLink[] = [
  { label: 'Avaliação · NFC', medium: 'nfc', path: '/avaliar/' },
  { label: 'Avaliação · QR code', medium: 'qr', path: '/avaliar/' },
  { label: 'Cardápio · NFC', medium: 'nfc', path: '/cardapio/' },
  { label: 'Cardápio · QR code', medium: 'qr', path: '/cardapio/' }
]

export function plaqueUrl (siteUrl: string, link: PlaqueLink): string {
  return `${siteUrl.replace(/\/$/, '')}${link.path}?utm_source=placa&utm_medium=${link.medium}`
}

/** Ferramentas externas usadas pela equipe. */
export const externalTools = [
  { label: 'Perfil no Google', description: 'Fotos, horários e respostas às avaliações.', icon: 'i-simple-icons-google', to: 'https://business.google.com/' },
  { label: 'PostHog', description: 'Visitas, cliques e origem (NFC, QR, Instagram).', icon: 'i-simple-icons-posthog', to: 'https://us.posthog.com/project/391883/dashboard/1494693' },
  { label: 'Supabase', description: 'Banco de dados e logins da equipe.', icon: 'i-simple-icons-supabase', to: 'https://supabase.com/dashboard/project/akrnjowlqqfiqvfgsojs' },
  { label: 'Netlify', description: 'Publicação do site e variáveis.', icon: 'i-simple-icons-netlify', to: 'https://app.netlify.com/projects/expedientebar' }
]
