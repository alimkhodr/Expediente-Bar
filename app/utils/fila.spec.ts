import { describe, it, expect } from 'vitest'
import { formatarSenha } from './fila'

describe('formatarSenha', () => {
  it('preenche com zeros à esquerda até 3 dígitos', () => {
    expect(formatarSenha(7)).toBe('007')
    expect(formatarSenha(42)).toBe('042')
    expect(formatarSenha(123)).toBe('123')
  })
  it('trata null/undefined como 000', () => {
    expect(formatarSenha(null)).toBe('000')
    expect(formatarSenha(undefined)).toBe('000')
  })
})
