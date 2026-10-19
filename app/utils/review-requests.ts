export type ReviewSource = 'nfc' | 'qr' | 'site'

export interface ReviewRequest {
  id: number
  customer_name: string | null
  waiter_name: string | null
  source: ReviewSource
  confirmed_at: string | null
  created_at: string
}

export interface WaiterRanking {
  key: string
  name: string
  total: number
  confirmed: number
  nfc: number
  qr: number
  lastAt: string
}

const VALID_SOURCES: ReviewSource[] = ['nfc', 'qr', 'site']

/** Origem a partir do utm_medium da placa (nfc/qr); qualquer outra coisa conta como "site". */
export function sourceFromMedium (medium: unknown): ReviewSource {
  const value = String(Array.isArray(medium) ? medium[0] : medium ?? '').toLowerCase()
  return (VALID_SOURCES as string[]).includes(value) ? value as ReviewSource : 'site'
}

export const CUSTOMER_NAME_MAX = 80
export const WAITER_NAME_MAX = 60

/** Limpa o nome digitado: tira espaços extras e corta no limite da coluna. */
export function cleanName (raw: string, max: number): string | null {
  const name = raw.replace(/\s+/g, ' ').trim().slice(0, max).trim()
  return name || null
}

/** Chave para agrupar o mesmo garçom digitado de jeitos diferentes ("João", "joao ", "JOAO"). */
export function waiterKey (name: string | null): string {
  if (!name) return ''
  return name.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim()
}

function titleCase (name: string): string {
  return name.toLowerCase().replace(/(^|\s)\p{L}/gu, s => s.toUpperCase())
}

/** Ranking por garçom (mais avaliações confirmadas, depois mais envios). Envios sem nome ficam fora do ranking. */
export function rankWaiters (rows: ReviewRequest[]): WaiterRanking[] {
  const groups = new Map<string, { spellings: Map<string, number>, total: number, confirmed: number, nfc: number, qr: number, lastAt: string }>()
  for (const row of rows) {
    const key = waiterKey(row.waiter_name)
    if (!key) continue
    const group = groups.get(key) ?? { spellings: new Map(), total: 0, confirmed: 0, nfc: 0, qr: 0, lastAt: row.created_at }
    const spelling = titleCase(row.waiter_name!.trim())
    group.spellings.set(spelling, (group.spellings.get(spelling) ?? 0) + 1)
    group.total++
    if (row.confirmed_at) group.confirmed++
    if (row.source === 'nfc') group.nfc++
    if (row.source === 'qr') group.qr++
    if (row.created_at > group.lastAt) group.lastAt = row.created_at
    groups.set(key, group)
  }
  return [...groups.entries()]
    .map(([key, g]) => ({
      key,
      // Exibe a grafia mais usada
      name: [...g.spellings.entries()].sort((a, b) => b[1] - a[1])[0]![0],
      total: g.total,
      confirmed: g.confirmed,
      nfc: g.nfc,
      qr: g.qr,
      lastAt: g.lastAt
    }))
    .sort((a, b) => b.confirmed - a.confirmed || b.total - a.total || a.name.localeCompare(b.name, 'pt-BR'))
}
