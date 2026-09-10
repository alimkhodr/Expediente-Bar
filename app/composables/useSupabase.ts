import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'

/**
 * Cliente Supabase criado sob demanda. Só as páginas internas (/admin, /tv, /login)
 * importam este arquivo, então o SDK fica fora do bundle das páginas públicas.
 */
let cliente: SupabaseClient | null = null
const usuario = ref<User | null>(null)
let sessaoPronta: Promise<void> | null = null

export function useSupabaseClient (): SupabaseClient {
  if (cliente) return cliente
  const { public: { supabaseUrl, supabaseKey } } = useRuntimeConfig()
  cliente = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseKey || 'placeholder-anon-key',
    { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } }
  )
  return cliente
}

/** Usuário autenticado (reativo). Inicializa a sessão na primeira chamada, só no navegador. */
export function useSupabaseUser () {
  if (import.meta.client && !sessaoPronta) {
    const c = useSupabaseClient()
    sessaoPronta = c.auth.getSession().then(({ data }) => {
      usuario.value = data.session?.user ?? null
    }).catch(() => { usuario.value = null })
    c.auth.onAuthStateChange((_evento, sessao) => {
      usuario.value = sessao?.user ?? null
    })
  }
  return usuario
}

/** Aguarda a leitura inicial da sessão (para middlewares). */
export async function aguardarSessao () {
  useSupabaseUser()
  await sessaoPronta
}
