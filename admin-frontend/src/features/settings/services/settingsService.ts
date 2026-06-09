export interface AppSettings {
  storeName: string
  adminEmail: string
  currencySymbol: string
  lowStockThreshold: number
}

const STORAGE_KEY = 'appSettings'

const defaults: AppSettings = {
  storeName: 'Agrivet Supply',
  adminEmail: 'admin@agrivet.com',
  currencySymbol: '₱',
  lowStockThreshold: 10,
}

function delay(ms = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function fetchSettings(): Promise<AppSettings> {
  await delay()
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : defaults
}

export async function saveSettings(settings: AppSettings): Promise<AppSettings> {
  await delay()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  return settings
}
