export interface ComandaParseada {
  nome: string | null
  numero: number | null
}

// Rótulos que aparecem na comanda depois da linha "Cliente:" — usados para cortar
// o nome caso o OCR junte tudo numa linha só.
const PROXIMOS_ROTULOS = /\b(hor[aá]rio|atendente|pedido|canal|itens|qtd|drinks)\b/i

export function parseComanda (texto: string): ComandaParseada {
  // Pega o que vem depois de "Cliente:" — tolerante a erros de OCR na palavra
  // (Cl1ente, Ciiente, Clente) e à pontuação (:, ., ausência).
  const m = texto.match(/c[li1]{1,2}ente\s*[:;.\-]?\s*(.+)/i)
  if (!m) return { nome: null, numero: null }

  let segmento = m[1]

  // Se o OCR juntou a linha seguinte, corta no próximo rótulo conhecido.
  const corte = segmento.search(PROXIMOS_ROTULOS)
  if (corte > 0) segmento = segmento.slice(0, corte)
  segmento = segmento.trim()

  // Número da senha = primeiro grupo isolado de 1-3 dígitos (antes ou depois do nome,
  // ou colado nele). Ignora sequências maiores (ex.: nº do pedido).
  const numMatch = segmento.match(/(?<!\d)(\d{1,3})(?!\d)/)
  const numero = numMatch ? parseInt(numMatch[1], 10) : null

  // Nome = segmento sem o número, limpo de pontuação/espaços nas pontas.
  let nome = segmento
  if (numMatch?.index != null) {
    nome = segmento.slice(0, numMatch.index) + segmento.slice(numMatch.index + numMatch[1].length)
  }
  nome = nome.replace(/\s+/g, ' ').replace(/^[\s.,;:-]+|[\s.,;:-]+$/g, '').trim()

  return { nome: nome || null, numero }
}
