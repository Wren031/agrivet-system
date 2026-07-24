export default function noValue(value: unknown): string {
  if (value === null || value === undefined) return 'N/A'
  if (typeof value === 'string' && value.trim() === '') return 'N/A'
  if (typeof value === 'number' && isNaN(value)) return 'N/A'
  return String(value)
}
