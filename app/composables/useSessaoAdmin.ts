// Sessão da área interna (/admin e subrotas): encerra o login
// no Supabase e devolve para a tela de login.
export function useSessaoAdmin () {
  const supabase = useSupabaseClient()
  const toast = useToast()

  async function sair () {
    await supabase.auth.signOut()
    toast.add({ title: 'Logout realizado', color: 'info' })
    await navigateTo('/login')
  }

  return { sair }
}
