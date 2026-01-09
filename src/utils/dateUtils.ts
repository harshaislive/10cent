// Get the next Saturday date from today
export function getNextSaturday(): string {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0 = Sunday, 6 = Saturday

  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000 // IST offset in milliseconds
  const istTime = new Date(today.getTime() + istOffset)
  const istHour = istTime.getUTCHours()
  const istDayOfWeek = istTime.getUTCDay() // 0 = Sunday, 6 = Saturday in IST

  // Check if it's Friday after 12pm IST (5 = Friday)
  const isFridayAfter12pm = istDayOfWeek === 5 && istHour >= 12

  let daysUntilSaturday: number

  if (isFridayAfter12pm) {
    // After Friday 12pm IST, skip to the Saturday after next
    daysUntilSaturday = (6 - istDayOfWeek + 7) % 7 + 7
  } else {
    // Before Friday 12pm IST or any other day, get the next Saturday
    daysUntilSaturday = (6 - istDayOfWeek + 7) % 7 || 7 // If today is Saturday, get next Saturday
  }

  const nextSaturday = new Date(today)
  nextSaturday.setDate(today.getDate() + daysUntilSaturday)

  // Format: "15 Nov 2025"
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }
  return nextSaturday.toLocaleDateString('en-US', options)
}

// Get the next Saturday date with time
export function getNextSaturdayWithTime(): string {
  const date = getNextSaturday()
  return `Saturday, 6:00 PM IST, ${date}`
}