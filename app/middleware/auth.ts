export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) {
    return
  }

  const user = useSupabaseUser()

  if (!user.value) {
    return navigateTo('/login?redirect=' + encodeURIComponent(to.fullPath))
  }
})
