import { describe, it, expect } from 'vitest'
import { parseComanda } from './comanda'

describe('parseComanda', () => {
  it('extrai nome e numero da linha Cliente', () => {
    const txt = 'Pedido: 773210 Canal: Balcao\nCliente: Jihad 455\nHorario: 21:04'
    expect(parseComanda(txt)).toEqual({ nome: 'Jihad', numero: 455 })
  })

  it('aceita nome composto antes do numero', () => {
    expect(parseComanda('Cliente: Jihad Khodr Ali 455')).toEqual({ nome: 'Jihad Khodr Ali', numero: 455 })
  })

  it('aceita numero antes do nome', () => {
    expect(parseComanda('Cliente: 455 Jihad')).toEqual({ nome: 'Jihad', numero: 455 })
  })

  it('aceita nome composto (Ana Maria 12)', () => {
    expect(parseComanda('Cliente: Ana Maria 12')).toEqual({ nome: 'Ana Maria', numero: 12 })
  })

  it('ignora o Pedido quando nao ha numero apos o nome', () => {
    expect(parseComanda('Pedido: 773210\nCliente: Jihad')).toEqual({ nome: 'Jihad', numero: null })
  })

  it('corta o restante quando o OCR junta a linha seguinte', () => {
    expect(parseComanda('Cliente: Jihad 455 Horario: 21:04 Atendente: Kelly')).toEqual({ nome: 'Jihad', numero: 455 })
  })

  it('tolera erro de OCR na palavra Cliente', () => {
    expect(parseComanda('Cl1ente Jihad 455')).toEqual({ nome: 'Jihad', numero: 455 })
  })

  it('separa numero colado no nome', () => {
    expect(parseComanda('Cliente: Jihad455')).toEqual({ nome: 'Jihad', numero: 455 })
  })

  it('sem linha Cliente, NAO chuta numero (volta vazio)', () => {
    expect(parseComanda('Senha 87 chamada')).toEqual({ nome: null, numero: null })
    expect(parseComanda('Pedido: 773210 Canal: Balcao')).toEqual({ nome: null, numero: null })
    expect(parseComanda('texto lixo sem dados')).toEqual({ nome: null, numero: null })
  })
})
