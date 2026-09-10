import type { HorarioResponse } from '~/types/horario'

/**
 * Horário regular do Google. O "aberto agora" é calculado no navegador
 * a partir dos períodos, então este payload pode ficar em cache por 1 dia.
 */
export default cachedEventHandler(async (event): Promise<HorarioResponse> => {
  const dados = await buscarPlace<{
    regularOpeningHours?: HorarioResponse['regularOpeningHours']
  }>(event, 'regularOpeningHours')
  return { regularOpeningHours: dados?.regularOpeningHours ?? null, fonte: dados ? 'google' : 'fallback' }
}, {
  maxAge: import.meta.dev ? 1 : 60 * 60 * 24,
  swr: true,
  name: 'places-opening-hours',
  getKey: () => 'v2'
})
