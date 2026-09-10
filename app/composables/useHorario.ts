import type { HorarioResponse, PeriodoHorario } from '~/types/horario'

const DIAS_PT = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
const DIAS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MIN_DIA = 24 * 60
const MIN_SEMANA = 7 * MIN_DIA

function periodosFallback (): PeriodoHorario[] {
  return site.openingHours.flatMap(h =>
    h.days.map((dia) => {
      const day = DIAS_EN.indexOf(dia)
      const [oh, om] = h.opens.split(':').map(Number)
      const [ch, cm] = h.closes.split(':').map(Number)
      const fechaNoDiaSeguinte = ch * 60 + cm <= oh * 60 + om
      return {
        open: { day, hour: oh, minute: om },
        close: { day: fechaNoDiaSeguinte ? (day + 1) % 7 : day, hour: ch, minute: cm }
      }
    })
  )
}

function descricoesFallback (): string[] {
  return DIAS_EN.map((dia, i) => {
    const h = site.openingHours.find(x => (x.days as readonly string[]).includes(dia))
    const nome = DIAS_PT[i]!.replace(/^./, c => c.toUpperCase())
    return `${nome}: ${h ? `${h.opens} – ${h.closes}` : 'Fechado'}`
  })
}

/** Minutos desde domingo 00:00 no fuso de São Paulo. */
function agoraEmMinutos (agora: Date): number {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }).formatToParts(agora)
  const pegar = (t: string) => partes.find(p => p.type === t)?.value ?? '0'
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(pegar('weekday'))
  const hora = Number(pegar('hour')) % 24
  return dia * MIN_DIA + hora * 60 + Number(pegar('minute'))
}

function janela (p: PeriodoHorario): [number, number] {
  const abre = p.open.day * MIN_DIA + p.open.hour * 60 + p.open.minute
  let fecha = p.close
    ? p.close.day * MIN_DIA + p.close.hour * 60 + p.close.minute
    : abre + MIN_DIA
  if (fecha <= abre) fecha += MIN_SEMANA
  return [abre, fecha]
}

export function calcularStatus (periodos: PeriodoHorario[], agora = new Date()) {
  const n = agoraEmMinutos(agora)
  let aberto = false
  let fechaEm: number | null = null
  let proximaAbertura: number | null = null

  for (const p of periodos) {
    const [abre, fecha] = janela(p)
    for (const deslocamento of [0, MIN_SEMANA]) {
      const t = n + deslocamento
      if (t >= abre && t < fecha) {
        aberto = true
        fechaEm = fecha - deslocamento
      }
    }
    const candidatos = [abre, abre + MIN_SEMANA].filter(a => a > n)
    for (const a of candidatos) {
      if (proximaAbertura === null || a < proximaAbertura) proximaAbertura = a
    }
  }

  const formatar = (min: number) => {
    const m = ((min % MIN_SEMANA) + MIN_SEMANA) % MIN_SEMANA
    const dia = Math.floor(m / MIN_DIA)
    const hh = String(Math.floor((m % MIN_DIA) / 60)).padStart(2, '0')
    const mm = String(m % 60).padStart(2, '0')
    const hoje = Math.floor(n / MIN_DIA)
    let prefixo = DIAS_PT[dia]!
    if (dia === hoje) prefixo = 'hoje'
    else if (dia === (hoje + 1) % 7) prefixo = 'amanhã'
    return { dia: prefixo, hora: `${hh}:${mm}` }
  }

  return {
    aberto,
    fechaEm: fechaEm !== null ? formatar(fechaEm) : null,
    proximaAbertura: proximaAbertura !== null ? formatar(proximaAbertura) : null
  }
}

/**
 * Horário de funcionamento: começa com o horário padrão (SSR) e troca pelo
 * do Google quando a API responde. "Aberto agora" é recalculado a cada minuto
 * no navegador, no fuso de São Paulo.
 */
export function useHorario () {
  const { data, status } = useLazyFetch<HorarioResponse>('/api/places/opening-hours', {
    key: 'horario',
    server: false,
    default: () => ({ regularOpeningHours: null, fonte: 'fallback' as const })
  })

  const agora = ref(new Date())
  let timer: ReturnType<typeof setInterval> | undefined
  onMounted(() => {
    agora.value = new Date()
    timer = setInterval(() => { agora.value = new Date() }, 60_000)
  })
  onUnmounted(() => clearInterval(timer))

  const periodos = computed(() => data.value?.regularOpeningHours?.periods ?? periodosFallback())
  const descricoes = computed(() =>
    data.value?.regularOpeningHours?.weekdayDescriptions ?? descricoesFallback()
  )
  const statusAtual = computed(() => calcularStatus(periodos.value, agora.value))
  const sincronizadoComGoogle = computed(() => data.value?.fonte === 'google')

  /** Índice (0 = domingo) do dia atual em São Paulo, para destacar na lista. */
  const diaHoje = computed(() => Math.floor(agoraEmMinutos(agora.value) / MIN_DIA))

  return { descricoes, statusAtual, sincronizadoComGoogle, diaHoje, carregando: computed(() => status.value === 'pending') }
}
