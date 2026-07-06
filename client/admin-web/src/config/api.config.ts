export const API_BASE_URL = "http://localhost:3000/api";

export function getImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  const backendOrigin = new URL(API_BASE_URL).origin
  if (url.startsWith('http://localhost:3000')) {
    return url.replace('http://localhost:3000', backendOrigin)
  }
  return url
}