import { describe, it, expect } from 'vitest'
import { canAccess, isWaiter } from './staff-role'

describe('isWaiter', () => {
  it('reconhece o papel garcom só no app_metadata', () => {
    expect(isWaiter({ app_metadata: { role: 'garcom' } })).toBe(true)
    expect(isWaiter({ app_metadata: {} })).toBe(false)
    expect(isWaiter(null)).toBe(false)
  })
})

describe('canAccess', () => {
  it('libera só /admin/senhas para o garçom', () => {
    expect(canAccess('/admin/senhas', true)).toBe(true)
    expect(canAccess('/admin/senhas/', true)).toBe(true)
    expect(canAccess('/admin', true)).toBe(false)
    expect(canAccess('/admin/reviews', true)).toBe(false)
    expect(canAccess('/admin/cms', false)).toBe(true)
  })
})
