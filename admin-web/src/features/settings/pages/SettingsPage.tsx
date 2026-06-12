import { useState, type FormEvent } from 'react'
import { Save } from 'lucide-react'
import { useApp } from '../../../context/AppContext'
import type { AppSettings } from '../services/settingsService'

export default function SettingsPage() {
  const { settings, updateSettings, addNotification, darkMode, setDarkMode } = useApp()
  const [form, setForm] = useState<AppSettings>({ ...settings })
  const [saving, setSaving] = useState(false)

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await updateSettings(form)
      addNotification({ message: 'Settings saved successfully', type: 'success' })
    } catch {
      addNotification({ message: 'Failed to save settings', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Configure your inventory system</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">General Settings</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Store Name</label>
              <input value={form.storeName} onChange={e => setForm(f => ({ ...f, storeName: e.target.value }))}
                className="w-full max-w-md px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Admin Email</label>
              <input type="email" value={form.adminEmail} onChange={e => setForm(f => ({ ...f, adminEmail: e.target.value }))}
                className="w-full max-w-md px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Currency Symbol</label>
                <input value={form.currencySymbol} onChange={e => setForm(f => ({ ...f, currencySymbol: e.target.value }))} maxLength={5}
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Low Stock Threshold</label>
                <input type="number" min="1" value={form.lowStockThreshold} onChange={e => setForm(f => ({ ...f, lowStockThreshold: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div className="pt-2">
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50">
                <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-base font-semibold text-slate-800 dark:text-white mb-4">Appearance</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Dark Mode</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Toggle dark theme</p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  darkMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  darkMode ? 'translate-x-5' : ''
                }`} />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-base font-semibold text-slate-800 dark:text-white mb-3">System Info</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-400 dark:text-slate-500">Version</span><span className="text-slate-700 dark:text-slate-300 font-medium">1.0.0</span></div>
              <div className="flex justify-between"><span className="text-slate-400 dark:text-slate-500">Products</span><span className="text-slate-700 dark:text-slate-300 font-medium">{/* count from context */}—</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
