export function formatNomorPolisi(value: string) {
  if (!value) return ''

  const raw = value.replace(/\s+/g, '').toUpperCase() //hapus spasi dan ubah ke uppercase

  const match = raw.match(/^([A-Z]{1,2})(\d{1,4})([A-Z]{0,3})$/) //cocokan letter(s) + number(s) + letter(s)

  if (!match) return raw

  const [, prefix, number, suffix] = match

  return [prefix, number, suffix].filter(Boolean).join(' ')
}