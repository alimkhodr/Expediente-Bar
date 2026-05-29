export function formatarSenha (numero: number | null | undefined): string {
  return String(numero ?? 0).padStart(3, '0')
}

export function faltam (atual: number, senhaUsuario: number): number {
  return senhaUsuario - atual
}

export function ehSuaVez (atual: number, senhaUsuario: number): boolean {
  return faltam(atual, senhaUsuario) <= 0
}

export interface ResultadoValidacao {
  ok: boolean
  mensagem?: string
}

const MAX_DISTANCIA = 50

export function validarSenha (atual: number, senhaUsuario: number): ResultadoValidacao {
  if (!Number.isInteger(senhaUsuario) || senhaUsuario < 1 || senhaUsuario > 999) {
    return { ok: false, mensagem: 'Digite uma senha entre 1 e 999.' }
  }
  if (senhaUsuario < atual) {
    return { ok: false, mensagem: 'Essa senha já foi chamada.' }
  }
  if (senhaUsuario > atual + MAX_DISTANCIA) {
    return { ok: false, mensagem: 'Essa senha está distante demais. Confira o número.' }
  }
  return { ok: true }
}
