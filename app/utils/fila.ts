export function formatarSenha (numero: number | null | undefined): string {
  return String(numero ?? 0).padStart(3, '0')
}
