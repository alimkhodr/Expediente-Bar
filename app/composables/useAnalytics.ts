export function useAnalytics () {
  const { $posthog } = useNuxtApp()

  const trackEvent = (name: string, properties?: Record<string, unknown>) => {
    if (import.meta.client && $posthog) {
      $posthog.capture(name, properties)
    }
  }

  return { trackEvent }
}
