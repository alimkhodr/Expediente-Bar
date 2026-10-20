import { describe, it, expect } from 'vitest'
import { cleanName, filterSuggestions, mergeSuggestions, similarityScore, rankWaiters, sourceFromMedium, waiterKey, type ReviewRequest } from './review-requests'

describe('sourceFromMedium', () => {
  it('aceita nfc e qr e cai em site no resto', () => {
    expect(sourceFromMedium('nfc')).toBe('nfc')
    expect(sourceFromMedium('QR')).toBe('qr')
    expect(sourceFromMedium(['nfc'])).toBe('nfc')
    expect(sourceFromMedium(undefined)).toBe('site')
    expect(sourceFromMedium('email')).toBe('site')
  })
})

describe('cleanName', () => {
  it('tira espaços, corta no limite e devolve null para vazio', () => {
    expect(cleanName('  João   Silva ', 60)).toBe('João Silva')
    expect(cleanName('   ', 60)).toBeNull()
    expect(cleanName('a'.repeat(100), 80)).toHaveLength(80)
  })
})

describe('rankWaiters', () => {
  const row = (id: number, waiter_name: string | null, source: ReviewRequest['source'], created_at: string, confirmed = false): ReviewRequest =>
    ({ id, customer_name: `Cliente ${id}`, waiter_name, source, confirmed_at: confirmed ? created_at : null, created_at })

  it('agrupa variações do mesmo nome, conta origem e ordena por total', () => {
    const ranking = rankWaiters([
      row(1, 'João', 'nfc', '2026-10-18T22:00:00Z'),
      row(2, 'joao ', 'qr', '2026-10-18T23:00:00Z'),
      row(3, 'JOÃO', 'nfc', '2026-10-18T21:00:00Z'),
      row(4, 'Maria', 'qr', '2026-10-18T20:00:00Z'),
      row(5, null, 'nfc', '2026-10-18T20:30:00Z')
    ])
    expect(ranking).toHaveLength(2)
    expect(ranking[0]).toMatchObject({ key: waiterKey('joão'), name: 'João', total: 3, confirmed: 0, nfc: 2, qr: 1, lastAt: '2026-10-18T23:00:00Z' })
    expect(ranking[1]).toMatchObject({ name: 'Maria', total: 1 })
  })

  it('coloca na frente quem tem mais avaliações confirmadas no Google', () => {
    const ranking = rankWaiters([
      row(1, 'João', 'nfc', '2026-10-18T22:00:00Z'),
      row(2, 'João', 'nfc', '2026-10-18T22:10:00Z'),
      row(3, 'Maria', 'qr', '2026-10-18T22:20:00Z', true)
    ])
    expect(ranking.map(r => [r.name, r.confirmed, r.total])).toEqual([['Maria', 1, 1], ['João', 0, 2]])
  })
})

describe('mergeSuggestions', () => {
  it('junta grafias do mesmo garçom e usa a mais citada', () => {
    const merged = mergeSuggestions([
      { name: 'gabriel paulista', uses: 2 },
      { name: 'Gabriel Paulista', uses: 5 },
      { name: 'João', uses: 3 },
      { name: 'joao', uses: 2 }
    ])
    expect(merged).toEqual([
      { name: 'Gabriel Paulista', uses: 7 },
      { name: 'João', uses: 5 }
    ])
  })
})

describe('similarityScore', () => {
  it('pontua começo do nome, começo de palavra, trecho e erro de digitação', () => {
    expect(similarityScore('Gabriel Paulista', 'gab')).toBe(4)
    expect(similarityScore('Gabriel Paulista', 'paul')).toBe(3)
    expect(similarityScore('Gabriel Paulista', 'ulis')).toBe(2)
    expect(similarityScore('Gabriel Paulista', 'gabirel')).toBe(1)
    expect(similarityScore('Gabriel Paulista', 'xyz')).toBe(0)
    expect(similarityScore('Jo', 'ja')).toBe(0)
  })
})

describe('filterSuggestions', () => {
  const list = [
    { name: 'Gabriel Paulista', uses: 7 },
    { name: 'João', uses: 5 },
    { name: 'Paulo', uses: 3 },
    { name: 'Giovana', uses: 2 },
    { name: 'Matheus', uses: 2 },
    { name: 'Bruno', uses: 1 }
  ]

  it('sem texto mostra só os 4 mais citados', () => {
    expect(filterSuggestions(list, '').map(s => s.name)).toEqual(['Gabriel Paulista', 'João', 'Paulo', 'Giovana'])
  })

  it('ordena pelo mais parecido e desempata pelos mais citados', () => {
    // "Paulo" começa com "pau" (4) e passa na frente de "Gabriel Paulista" (palavra, 3) mesmo citado menos
    expect(filterSuggestions(list, 'pau').map(s => s.name)).toEqual(['Paulo', 'Gabriel Paulista'])
    expect(filterSuggestions(list, 'joa').map(s => s.name)).toEqual(['João'])
  })

  it('acha mesmo com erro de digitação', () => {
    expect(filterSuggestions(list, 'gabirel').map(s => s.name)).toEqual(['Gabriel Paulista'])
    expect(filterSuggestions(list, 'mateus').map(s => s.name)).toEqual(['Matheus'])
  })

  it('some quando o nome já foi digitado inteiro', () => {
    expect(filterSuggestions(list, 'joão')).toEqual([])
  })
})
