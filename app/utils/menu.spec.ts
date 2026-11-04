import { describe, it, expect } from 'vitest'
import { formatMenuPrice, menuSchemaSections, menuSections } from './menu'

describe('menuSections', () => {
  it('tem preços válidos e nenhum item repetido por seção', () => {
    for (const section of menuSections) {
      const names = section.items.map(item => item.name)
      expect(new Set(names).size).toBe(names.length)
      for (const item of section.items) expect(item.price).toBeGreaterThan(0)
    }
  })

  it('confere amostras com o PDF de novembro/2026', () => {
    const price = (name: string) => menuSections.flatMap(s => s.items).find(i => i.name === name)?.price
    expect(price('Contra filé acebolado')).toBe(75)
    expect(price('Bolinho de feijoada')).toBe(45)
    expect(price("Gordon's Sunset")).toBe(42)
    expect(price('Ciroc Red Berry + 5 Red Bulls')).toBe(420)
    expect(menuSections.flatMap(s => s.items)).toHaveLength(93)
  })
})

describe('formatMenuPrice', () => {
  it('formata em reais sem centavos quando inteiro', () => {
    expect(formatMenuPrice(35).replace(/\s/g, ' ')).toBe('R$ 35')
  })
})

describe('menuSchemaSections', () => {
  it('gera MenuSection com MenuItem e Offer em BRL', () => {
    const [first] = menuSchemaSections()
    expect(first).toMatchObject({ '@type': 'MenuSection', name: 'Porções' })
    expect(first!.hasMenuItem[0]).toEqual({ '@type': 'MenuItem', name: 'Fritas simples', offers: { '@type': 'Offer', price: '35.00', priceCurrency: 'BRL' } })
  })
})
