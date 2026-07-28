export const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || '/api';

export function getImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  if (url.startsWith('http://localhost:3000/api')) {
    const origin = API_BASE_URL.startsWith('http')
      ? new URL(API_BASE_URL).origin
      : ''
    return url.replace('http://localhost:3000/api', origin)
  }
  return url
}