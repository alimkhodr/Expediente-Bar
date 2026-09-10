export interface PontoHorario {
  day: number
  hour: number
  minute: number
}

export interface PeriodoHorario {
  open: PontoHorario
  close?: PontoHorario
}

export interface HorarioRegular {
  periods: PeriodoHorario[]
  weekdayDescriptions: string[]
}

export interface HorarioResponse {
  regularOpeningHours: HorarioRegular | null
  fonte: 'google' | 'fallback'
}
