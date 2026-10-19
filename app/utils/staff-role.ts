// Papéis da área interna. O papel vem de app_metadata.role (definido no Supabase, o usuário não altera).

export const WAITER_ROLE = 'garcom'
/** Única tela liberada para o login de garçom. */
export const WAITER_HOME = '/admin/senhas'

export function isWaiter (user: { app_metadata?: Record<string, unknown> } | null | undefined): boolean {
  return user?.app_metadata?.role === WAITER_ROLE
}

/** Garçom só acessa a tela de chamar senha; a gerência acessa tudo. */
export function canAccess (path: string, waiter: boolean): boolean {
  if (!waiter) return true
  return path.replace(/\/$/, '') === WAITER_HOME
}
