export function duration(start?: Date | string | null, end?: Date | string | null): string {
  if (!start || !end) return '-'

  const startDate = new Date(start)
  const endDate = new Date(end)

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return '-'
  if (endDate < startDate) return '-'

  let diffMs = endDate.getTime() - startDate.getTime()

  const minute = 1000 * 60
  const hour = minute * 60
  const day = hour * 24

  const days = Math.floor(diffMs / day)
  diffMs %= day

  const hours = Math.floor(diffMs / hour)
  diffMs %= hour

  const minutes = Math.floor(diffMs / minute)

  return `${days} hari ${hours} jam ${minutes} menit`
}