// Declare the global clarity function
declare global {
  interface Window {
    clarity: (action: string, ...args: unknown[]) => void
  }
}

export function useClarity () {
  const trackEvent = (name: string) => {
    if (import.meta.client && typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', name)
    }
  }

  return { trackEvent }
}
