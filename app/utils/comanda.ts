export interface ComandaParseada {
  nome: string | null
  numero: number | null
}

export function parseComanda (texto: string): ComandaParseada {
  const linhaCliente = texto.match(/cliente:\s*(.+)/i)?.[1]?.trim()

  if (linhaCliente) {
    // último token só-dígitos (1-3) na linha = número da senha
    const m = linhaCliente.match(/^(.*?)\s*(\d{1,3})\s*$/)
    if (m) {
      const nome = m[1].trim()
      return { nome: nome || null, numero: parseInt(m[2], 10) }
    }
    return { nome: linhaCliente || null, numero: null }
  }

  // sem linha Cliente: procura número isolado de 1-3 dígitos
  const isolado = texto.match(/(?<!\d)(\d{1,3})(?!\d)/)
  return { nome: null, numero: isolado ? parseInt(isolado[1], 10) : null }
}
