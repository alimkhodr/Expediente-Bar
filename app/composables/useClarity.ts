import clarity from '@microsoft/clarity'

export function useClarity () {
  const trackEvent = (name: string) => {
    if (import.meta.client) {
      clarity.event(name)
    }
  }

  return { trackEvent }
}
