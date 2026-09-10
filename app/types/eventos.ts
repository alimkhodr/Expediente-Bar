export interface Evento {
  id: string
  nome: string
  /** ISO local (America/Sao_Paulo), ex.: 2026-09-12T21:00:00 */
  inicio: string
  fim: string
  imagem: string | null
  url: string
  descricao: string
  local: string | null
}

export interface EventosResponse {
  eventos: Evento[]
  fonte: 'sympla' | 'desabilitado' | 'erro'
  atualizadoEm: string
}
