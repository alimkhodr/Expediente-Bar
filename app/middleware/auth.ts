export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  await aguardarSessao()
  const user = useSupabaseUser()

  if (!user.value) {
    return navigateTo('/login?redirect=' + encodeURIComponent(to.fullPath))
  }

  // Login de garçom: só a tela de chamar senha (o banco também bloqueia o resto via RLS)
  if (!canAccess(to.path, isWaiter(user.value))) {
    return navigateTo(WAITER_HOME)
  }
})
