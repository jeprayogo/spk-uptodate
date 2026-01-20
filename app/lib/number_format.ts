export const formatNumber = (value: number | string) => {
  if (!value) return ''
  return new Intl.NumberFormat('id-ID').format(Number(value))
}