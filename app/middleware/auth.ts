export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  await aguardarSessao()
  const user = useSupabaseUser()

  if (!user.value) {
    return navigateTo('/login?redirect=' + encodeURIComponent(to.fullPath))
  }
})
