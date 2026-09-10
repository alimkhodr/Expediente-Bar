import type { H3Event } from 'h3'

const PLACE_ID = 'ChIJVx-dQk9LzJQR80Am0iwvW10'

/** Consulta a Places API (New) do Google pedindo só os campos necessários. */
export async function buscarPlace<T> (event: H3Event, fields: string): Promise<T | null> {
  const { googlePlacesKey } = useRuntimeConfig(event)
  if (!googlePlacesKey) return null
  try {
    return await $fetch<T>(`https://places.googleapis.com/v1/places/${PLACE_ID}`, {
      query: { fields, languageCode: 'pt-BR' },
      headers: { 'X-Goog-Api-Key': googlePlacesKey },
      timeout: 8000
    })
  } catch (erro) {
    console.error('[places] falha ao consultar Google Places:', (erro as Error).message)
    return null
  }
}
