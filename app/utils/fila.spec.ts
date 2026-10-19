import { describe, it, expect } from 'vitest'
import { estimateTextWidth, formatarSenha, nameForScreen } from './fila'

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

describe('nameForScreen', () => {
  it('mantém nomes curtos e limpa espaços', () => {
    expect(nameForScreen('  Jihad  ')).toBe('Jihad')
    expect(nameForScreen('Ana  Souza')).toBe('Ana Souza')
    expect(nameForScreen(null)).toBe('')
  })

  it('encurta nomes longos para primeiro + último nome', () => {
    expect(nameForScreen('Maria Eduarda Fernandes da Silva')).toBe('Maria Silva')
  })

  it('usa só o primeiro nome quando primeiro + último não cabem', () => {
    expect(nameForScreen('Gabriela Fernandes')).toBe('Gabriela')
  })

  it('corta um nome único muito longo com reticências', () => {
    const name = nameForScreen('Maximilianoalexandre')
    expect(name).toHaveLength(14)
    expect(name.endsWith('…')).toBe(true)
  })
})

describe('estimateTextWidth', () => {
  it('cresce com o número de caracteres e o tamanho da fonte', () => {
    expect(estimateTextWidth('Ana', 100)).toBe(186)
    expect(estimateTextWidth('Maria Silva', 100)).toBeGreaterThan(estimateTextWidth('Ana', 100))
  })
})
