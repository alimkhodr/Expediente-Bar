export function useAnalytics () {
  const { $analytics } = useNuxtApp()

  const trackEvent = (name: string, properties?: Record<string, unknown>) => {
    if (import.meta.client) $analytics?.capturar(name, properties)
  }

  return { trackEvent }
}
