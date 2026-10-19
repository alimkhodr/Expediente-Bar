export function formatarSenha (numero: number | null | undefined): string {
  return String(numero ?? 0).padStart(3, '0')
}

/** Limite de caracteres do nome na TV (acima disso o nome encurta para caber grande). */
export const SCREEN_NAME_MAX = 14

/**
 * Nome como aparece na TV: inteiro se couber; senão primeiro + último nome;
 * senão só o primeiro nome; e, se nem ele couber, cortado com reticências.
 */
export function nameForScreen (raw: string | null | undefined, max = SCREEN_NAME_MAX): string {
  const words = (raw ?? '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean)
  if (!words.length) return ''
  const full = words.join(' ')
  if (full.length <= max) return full
  if (words.length > 1) {
    const firstLast = `${words[0]} ${words[words.length - 1]}`
    if (firstLast.length <= max) return firstLast
  }
  const first = words[0]!
  return first.length <= max ? first : `${first.slice(0, max - 1)}…`
}

/**
 * Largura estimada do texto em unidades do viewBox.
 * 0.62em é a largura média conservadora de um caractere da Poppins bold.
 */
export function estimateTextWidth (text: string, fontSize: number, charWidthEm = 0.62): number {
  return Math.ceil(text.length * fontSize * charWidthEm)
}
