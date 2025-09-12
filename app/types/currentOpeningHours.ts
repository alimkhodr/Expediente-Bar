export interface DateInfo {
  year: number
  month: number
  day: number
}

export interface TimeInfo {
  day: number
  hour: number
  minute: number
  date: DateInfo
  truncated?: boolean
}

export interface Period {
  open: TimeInfo
  close: TimeInfo
}

export interface CurrentOpeningHours {
  openNow: boolean
  periods: Period[]
  weekdayDescriptions: string[]
  nextOpenTime: string
  nextCloseTime: string
}

export interface CurrentOpeningHoursResponse {
  currentOpeningHours: CurrentOpeningHours
}
