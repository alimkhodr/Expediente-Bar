import posthog from 'posthog-js'

export default defineNuxtPlugin(() => {
  const { public: { posthogKey } } = useRuntimeConfig()

  if (import.meta.client && process.env.NODE_ENV === 'production' && posthogKey) {
    posthog.init(posthogKey, {
      api_host: 'https://us.i.posthog.com',
      capture_pageview: true,
      capture_pageleave: true
    })
  }

  return {
    provide: {
      posthog: import.meta.client ? posthog : null
    }
  }
})
