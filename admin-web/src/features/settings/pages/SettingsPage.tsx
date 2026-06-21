import { useState, useEffect, type FormEvent } from 'react'
import { Save, User, Mail, Phone, Shield, Lock, Store, Palette, Eye, EyeOff } from 'lucide-react'
import { useApp } from '../../../context/AppContext'
import { fetchStaffById, updateStaff } from '../../staff/services/staffService'
import type { AppSettings } from '../services/settingsService'
import type { AdminStaff } from '../../staff/services/types'

const tabs = [
  { key: 'account', label: 'Account', icon: User },
  { key: 'security', label: 'Security', icon: Lock },
  { key: 'general', label: 'General', icon: Store },
  { key: 'appearance', label: 'Appearance', icon: Palette },
] as const

type TabKey = (typeof tabs)[number]['key']

export default function SettingsPage() {
  const { settings, updateSettings, addNotification, darkMode, setDarkMode, user } = useApp()
  const [activeTab, setActiveTab] = useState<TabKey>('account')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Configure your inventory system</p>
      </div>

      <div className="border-b border-slate-200 dark:border-slate-700 mb-8 overflow-x-auto">
        <nav className="flex gap-6 min-w-max sm:min-w-0">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {activeTab === 'account' && <AccountTab />}
      {activeTab === 'security' && <SecurityTab />}
      {activeTab === 'general' && <GeneralTab />}
      {activeTab === 'appearance' && <AppearanceTab />}
    </div>
  )
}

function AccountTab() {
  const { user, addNotification } = useApp()
  const [profile, setProfile] = useState<AdminStaff | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', contactNumber: '' })

  useEffect(() => {
    if (!user?.id) { setLoading(false); return }
    fetchStaffById(user.id)
      .then(data => {
        setProfile(data)
        setForm({ fullName: data.fullName, email: data.email, contactNumber: data.contactNumber })
      })
      .catch(() => addNotification({ message: 'Failed to load profile', type: 'error' }))
      .finally(() => setLoading(false))
  }, [user?.id])

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!user?.id) return
    setSaving(true)
    try {
      const updated = await updateStaff(user.id, form)
      setProfile(updated)
      setForm({ fullName: updated.fullName, email: updated.email, contactNumber: updated.contactNumber })
      addNotification({ message: 'Profile updated successfully', type: 'success' })
    } catch {
      addNotification({ message: 'Failed to update profile', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-5">
          <h2 className="text-base font-semibold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">Profile Information</h2>
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1,2,3].map(i => <div key={i} className="h-10 bg-slate-100 dark:bg-slate-700 rounded-lg" />)}
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                  className="w-full sm:max-w-md px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full sm:max-w-md px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Number</label>
                <input value={form.contactNumber} onChange={e => setForm(f => ({ ...f, contactNumber: e.target.value }))}
                  className="w-full sm:max-w-md px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div className="pt-2">
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50">
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-base font-semibold text-slate-800 dark:text-white mb-4">Account Info</h2>
          {loading || !profile ? (
            <div className="space-y-3 animate-pulse">
              {[1,2,3,4].map(i => <div key={i} className="h-8 bg-slate-100 dark:bg-slate-700 rounded-lg" />)}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <Shield size={16} className="text-slate-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">Role</p>
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Administrator</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <User size={16} className="text-slate-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">Name</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{profile.fullName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">Email</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <Phone size={16} className="text-slate-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">Contact</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{profile.contactNumber}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SecurityTab() {
  const { user, addNotification } = useApp()
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user?.id) return
    if (form.newPassword !== form.confirmPassword) {
      addNotification({ message: 'Passwords do not match', type: 'error' })
      return
    }
    if (form.newPassword.length < 6) {
      addNotification({ message: 'Password must be at least 6 characters', type: 'error' })
      return
    }
    setSaving(true)
    try {
      await updateStaff(user.id, { password: form.newPassword })
      addNotification({ message: 'Password updated successfully', type: 'success' })
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch {
      addNotification({ message: 'Failed to update password', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-5">
        <h2 className="text-base font-semibold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">Change Password</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Update your password to keep your account secure.</p>
        <div className="relative">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
          <div className="relative max-w-md">
            <input type={showPassword ? 'text' : 'password'} value={form.currentPassword} onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
              className="w-full px-3 py-2.5 pr-10 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div className="relative max-w-md">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
          <input type={showPassword ? 'text' : 'password'} value={form.newPassword} onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
            className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <div className="relative max-w-md">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
          <input type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
            className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <div className="pt-2">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50">
            <Lock size={16} /> {saving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  )
}

function GeneralTab() {
  const { settings, updateSettings, addNotification } = useApp()
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
    <form onSubmit={handleSave} className="max-w-2xl bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-5">
      <h2 className="text-base font-semibold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">General Settings</h2>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Store Name</label>
        <input value={form.storeName} onChange={e => setForm(f => ({ ...f, storeName: e.target.value }))}
          className="w-full sm:max-w-md px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Admin Email</label>
        <input type="email" value={form.adminEmail} onChange={e => setForm(f => ({ ...f, adminEmail: e.target.value }))}
          className="w-full sm:max-w-md px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
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
  )
}

function AppearanceTab() {
  const { darkMode, setDarkMode } = useApp()

  return (
    <div className="max-w-lg space-y-6">
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
          <div className="flex justify-between"><span className="text-slate-400 dark:text-slate-500">Products</span><span className="text-slate-700 dark:text-slate-300 font-medium">—</span></div>
        </div>
      </div>
    </div>
  )
}