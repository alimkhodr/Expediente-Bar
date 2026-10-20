import { describe, it, expect } from 'vitest'
import { cleanName, filterSuggestions, mergeSuggestions, rankWaiters, sourceFromMedium, waiterKey, type ReviewRequest } from './review-requests'

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

describe('filterSuggestions', () => {
  const list = [
    { name: 'Gabriel Paulista', uses: 7 },
    { name: 'João', uses: 5 },
    { name: 'Paulo', uses: 3 }
  ]

  it('sem texto mostra os mais citados', () => {
    expect(filterSuggestions(list, '').map(s => s.name)).toEqual(['Gabriel Paulista', 'João', 'Paulo'])
    expect(filterSuggestions(list, '', 2)).toHaveLength(2)
  })

  it('filtra pelo começo de qualquer palavra, sem acento', () => {
    expect(filterSuggestions(list, 'pau').map(s => s.name)).toEqual(['Gabriel Paulista', 'Paulo'])
    expect(filterSuggestions(list, 'joa').map(s => s.name)).toEqual(['João'])
  })

  it('some quando o nome já foi digitado inteiro', () => {
    expect(filterSuggestions(list, 'joão')).toEqual([])
  })
})
