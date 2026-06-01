import { describe, it, expect } from 'vitest'
import { parseComanda } from './comanda'

describe('parseComanda', () => {
  it('extrai nome e numero da linha Cliente', () => {
    const txt = 'Pedido: 773210 Canal: Balcao\nCliente: Jihad 455\nHorario: 21:04'
    expect(parseComanda(txt)).toEqual({ nome: 'Jihad', numero: 455 })
  })

  it('aceita nome composto', () => {
    expect(parseComanda('Cliente: Ana Maria 12')).toEqual({ nome: 'Ana Maria', numero: 12 })
  })

  it('ignora o Pedido quando nao ha numero apos o nome', () => {
    expect(parseComanda('Pedido: 773210\nCliente: Jihad')).toEqual({ nome: 'Jihad', numero: null })
  })

  it('sem linha Cliente, usa numero isolado de ate 3 digitos', () => {
    expect(parseComanda('Senha 87 chamada')).toEqual({ nome: null, numero: 87 })
  })

  it('retorna nulos quando nao ha nada reconhecivel', () => {
    expect(parseComanda('texto lixo sem dados')).toEqual({ nome: null, numero: null })
  })

  it('nao confunde Pedido de 6 digitos com a senha', () => {
    expect(parseComanda('Pedido: 773210 Canal: Balcao')).toEqual({ nome: null, numero: null })
  })
})
