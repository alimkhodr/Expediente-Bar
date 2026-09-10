/**
 * PostHog carregado de forma preguiçosa: o SDK (~250 KB) só é baixado quando a
 * página fica ociosa, fora do caminho crítico. Eventos disparados antes ficam na fila.
 */
import type { PostHog } from 'posthog-js'

type Evento = { nome: string, props?: Record<string, unknown> }

export default defineNuxtPlugin(() => {
  const { public: { posthogKey } } = useRuntimeConfig()
  const fila: Evento[] = []
  let instancia: PostHog | null = null
  let carregando = false

  const ativo = import.meta.client && import.meta.env.PROD && !!posthogKey

  async function carregar () {
    if (!ativo || instancia || carregando) return
    carregando = true
    const { default: posthog } = await import('posthog-js')
    posthog.init(posthogKey, {
      api_host: 'https://us.i.posthog.com',
      capture_pageview: 'history_change',
      capture_pageleave: true,
      persistence: 'localStorage+cookie',
      person_profiles: 'identified_only',
      // Captura automática de cliques/links/forms (fica no bundle principal)
      autocapture: true,
      // Evita baixar módulos extras (surveys, dead clicks, gravação de sessão) que não usamos
      disable_surveys: true,
      disable_session_recording: true,
      capture_dead_clicks: false
    })
    instancia = posthog
    for (const e of fila.splice(0)) instancia.capture(e.nome, e.props)
  }

  function capturar (nome: string, props?: Record<string, unknown>) {
    if (!ativo) return
    if (instancia) instancia.capture(nome, props)
    else {
      fila.push({ nome, props })
      carregar()
    }
  }

  if (ativo) {
    onNuxtReady(() => {
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void }).requestIdleCallback
      if (idle) idle(() => carregar(), { timeout: 4000 })
      else setTimeout(carregar, 2500)
    })
  }

  return { provide: { analytics: { capturar } } }
})
