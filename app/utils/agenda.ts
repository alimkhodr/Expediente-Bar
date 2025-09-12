export function getAgendaDates (): string {
  const today = new Date()

  const dayOfWeek = today.getDay()

  let daysToTuesday: number
  if (dayOfWeek === 0) {
    daysToTuesday = 5
  } else if (dayOfWeek === 1) {
    daysToTuesday = 6
  } else if (dayOfWeek >= 2) {
    daysToTuesday = dayOfWeek - 2
  } else {
    daysToTuesday = 0
  }

  const tuesday = new Date(today)
  tuesday.setDate(today.getDate() - daysToTuesday)

  const saturday = new Date(tuesday)
  saturday.setDate(tuesday.getDate() + 4)

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return `${formatDate(tuesday)} até ${formatDate(saturday)}`
}
