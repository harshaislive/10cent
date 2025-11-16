// Get the next Saturday date from today
export function getNextSaturday(): string {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0 = Sunday, 6 = Saturday
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7 // If today is Saturday, get next Saturday
  
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