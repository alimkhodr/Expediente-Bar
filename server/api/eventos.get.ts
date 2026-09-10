import type { Evento, EventosResponse } from '~/types/eventos'

interface SymplaEvento {
  id: string
  name: string
  start_date: string
  end_date: string
  image?: string
  url: string
  detail?: string
  published?: number
  cancelled?: number
  address?: { name?: string; address?: string; city?: string; state?: string }
}

interface SymplaResposta {
  data?: SymplaEvento[]
  pagination?: { next_cursor?: string | null }
}

/**
 * Próximos eventos publicados no Sympla.
 * Cache de 1h com stale-while-revalidate: o site nunca espera o Sympla
 * e os eventos novos aparecem sozinhos.
 */
export default cachedEventHandler(async (event): Promise<EventosResponse> => {
  const { symplaToken } = useRuntimeConfig(event)
  if (!symplaToken) {
    return { eventos: [], fonte: 'desabilitado', atualizadoEm: new Date().toISOString() }
  }

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const from = hoje.toISOString().slice(0, 19)

  try {
    const resposta = await $fetch<SymplaResposta>('https://api.sympla.com.br/public/v1.6.0/events', {
      headers: { s_token: symplaToken },
      query: {
        published: 'true',
        from,
        timezone: 'America/Sao_Paulo',
        field_sort: 'start_date',
        sort: 'asc',
        page_size: 30,
        fields: 'id,name,start_date,end_date,image,url,detail,cancelled,address'
      },
      timeout: 8000
    })

    const eventos: Evento[] = (resposta.data ?? [])
      .filter(e => !e.cancelled)
      .map(e => ({
        id: e.id,
        nome: e.name,
        inicio: e.start_date,
        fim: e.end_date,
        imagem: e.image || null,
        url: e.url,
        descricao: limparHtml(e.detail),
        local: e.address?.name || null
      }))

    return { eventos, fonte: 'sympla', atualizadoEm: new Date().toISOString() }
  } catch (erro) {
    console.error('[sympla] falha ao buscar eventos:', (erro as Error).message)
    return { eventos: [], fonte: 'erro', atualizadoEm: new Date().toISOString() }
  }
}, {
  maxAge: import.meta.dev ? 1 : 60 * 60,
  swr: true,
  name: 'sympla-eventos',
  getKey: () => 'v1'
})

function limparHtml (html?: string): string {
  if (!html) return ''
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300)
}
