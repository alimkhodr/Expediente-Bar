import { describe, it, expect } from 'vitest'
import { cleanWaiterName, rankWaiters, sourceFromMedium, waiterKey, type ReviewRequest } from './review-requests'

describe('sourceFromMedium', () => {
  it('aceita nfc e qr e cai em site no resto', () => {
    expect(sourceFromMedium('nfc')).toBe('nfc')
    expect(sourceFromMedium('QR')).toBe('qr')
    expect(sourceFromMedium(['nfc'])).toBe('nfc')
    expect(sourceFromMedium(undefined)).toBe('site')
    expect(sourceFromMedium('email')).toBe('site')
  })
})

describe('cleanWaiterName', () => {
  it('tira espaços e devolve null para vazio', () => {
    expect(cleanWaiterName('  João   Silva ')).toBe('João Silva')
    expect(cleanWaiterName('   ')).toBeNull()
    expect(cleanWaiterName('a'.repeat(80))).toHaveLength(60)
  })
})

describe('rankWaiters', () => {
  const row = (id: number, waiter_name: string | null, source: ReviewRequest['source'], created_at: string): ReviewRequest =>
    ({ id, waiter_name, source, created_at })

  it('agrupa variações do mesmo nome, conta origem e ordena por total', () => {
    const ranking = rankWaiters([
      row(1, 'João', 'nfc', '2026-10-18T22:00:00Z'),
      row(2, 'joao ', 'qr', '2026-10-18T23:00:00Z'),
      row(3, 'JOÃO', 'nfc', '2026-10-18T21:00:00Z'),
      row(4, 'Maria', 'qr', '2026-10-18T20:00:00Z'),
      row(5, null, 'nfc', '2026-10-18T20:30:00Z')
    ])
    expect(ranking).toHaveLength(2)
    expect(ranking[0]).toMatchObject({ key: waiterKey('joão'), name: 'João', total: 3, nfc: 2, qr: 1, lastAt: '2026-10-18T23:00:00Z' })
    expect(ranking[1]).toMatchObject({ name: 'Maria', total: 1 })
  })
})
