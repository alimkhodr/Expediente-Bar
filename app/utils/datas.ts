const FUSO = 'America/Sao_Paulo'

/** Converte "2026-09-12T21:00:00" (local SP, sem offset) em Date. */
export function parseDataSympla (iso: string): Date {
  return new Date(/[Zz]|[+-]\d{2}:\d{2}$/.test(iso) ? iso : `${iso}-03:00`)
}

export function formatarDiaMes (iso: string) {
  const d = parseDataSympla(iso)
  return {
    dia: new Intl.DateTimeFormat('pt-BR', { day: '2-digit', timeZone: FUSO }).format(d),
    mes: new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: FUSO }).format(d).replace('.', ''),
    diaSemana: new Intl.DateTimeFormat('pt-BR', { weekday: 'long', timeZone: FUSO }).format(d),
    hora: new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: FUSO }).format(d)
  }
}

export function formatarDataCompleta (iso: string): string {
  const d = parseDataSympla(iso)
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: FUSO
  }).format(d)
}

/** Intervalo terça → sábado da semana corrente (a agenda do bar vai de terça a sábado). */
export function intervaloAgendaSemana (hoje = new Date()): string {
  const diaSemana = hoje.getDay()
  let ateTerca: number
  if (diaSemana === 0) ateTerca = 5
  else if (diaSemana === 1) ateTerca = 6
  else ateTerca = diaSemana - 2

  const terca = new Date(hoje)
  terca.setDate(hoje.getDate() - ateTerca)
  const sabado = new Date(terca)
  sabado.setDate(terca.getDate() + 4)

  const f = (d: Date) => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  return `${f(terca)} a ${f(sabado)}`
}

/** "Dom · 06 de setembro · 14h" (formato usado no card de evento do hero). */
export function formatarLinhaEvento (iso: string): string {
  const d = parseDataSympla(iso)
  const f = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('pt-BR', { ...opts, timeZone: FUSO }).format(d)
  const diaSemana = f({ weekday: 'short' }).replace('.', '').replace(/^./, c => c.toUpperCase())
  const [hora, minuto] = f({ hour: '2-digit', minute: '2-digit' }).split(':')
  return `${diaSemana} · ${f({ day: '2-digit' })} de ${f({ month: 'long' })} · ${hora}h${minuto === '00' ? '' : minuto}`
}
