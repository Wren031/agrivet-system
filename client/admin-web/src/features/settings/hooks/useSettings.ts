import { useState, useEffect, useCallback } from 'react'
import { fetchSettings, saveSettings, type AppSettings } from '../services/settingsService'

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await fetchSettings()
    setSettings(data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const save = useCallback(async (s: AppSettings) => {
    const saved = await saveSettings(s)
    setSettings(saved)
    return saved
  }, [])

  return { settings, loading, save, reload: load }
}
