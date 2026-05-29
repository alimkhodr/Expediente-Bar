import { describe, it, expect } from 'vitest'
import { formatarSenha, faltam, ehSuaVez, validarSenha } from './fila'

describe('formatarSenha', () => {
  it('preenche com zeros à esquerda até 3 dígitos', () => {
    expect(formatarSenha(2)).toBe('002')
    expect(formatarSenha(74)).toBe('074')
    expect(formatarSenha(100)).toBe('100')
  })
  it('trata null/undefined como 000', () => {
    expect(formatarSenha(null)).toBe('000')
    expect(formatarSenha(undefined)).toBe('000')
  })
})

describe('faltam', () => {
  it('retorna senhaUsuario - atual', () => {
    expect(faltam(101, 104)).toBe(3)
  })
  it('retorna 0 ou negativo quando já passou', () => {
    expect(faltam(104, 104)).toBe(0)
    expect(faltam(106, 104)).toBe(-2)
  })
})

describe('ehSuaVez', () => {
  it('é a vez quando faltam <= 0', () => {
    expect(ehSuaVez(104, 104)).toBe(true)
    expect(ehSuaVez(106, 104)).toBe(true)
    expect(ehSuaVez(101, 104)).toBe(false)
  })
})

describe('validarSenha', () => {
  it('aceita senha >= atual e <= atual + 50', () => {
    expect(validarSenha(101, 104)).toEqual({ ok: true })
    expect(validarSenha(101, 101)).toEqual({ ok: true })
    expect(validarSenha(101, 151)).toEqual({ ok: true })
  })
  it('rejeita senha menor que o atual', () => {
    const r = validarSenha(101, 100)
    expect(r.ok).toBe(false)
    expect(r.mensagem).toContain('já')
  })
  it('rejeita senha distante demais (> atual + 50)', () => {
    const r = validarSenha(101, 200)
    expect(r.ok).toBe(false)
    expect(r.mensagem).toContain('distante')
  })
  it('rejeita valores inválidos', () => {
    expect(validarSenha(101, 0).ok).toBe(false)
    expect(validarSenha(101, 1000).ok).toBe(false)
  })
})
