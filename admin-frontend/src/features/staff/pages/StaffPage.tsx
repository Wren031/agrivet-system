import { useState, useMemo } from 'react'
import { Users, Search, Plus, Phone, Mail, Trash2 } from 'lucide-react'
import { useStaff } from '../hooks/useStaff'
import { useApp } from '../../../context/AppContext'
import { SkeletonCards } from '../../../components/Skeleton'
import Drawer from '../../../components/Drawer'
import Modal from '../../../components/Modal'
import StaffCard from '../components/StaffCard'
import type { Staff } from '../services/types'

export default function StaffPage() {
  const { staff, loading, add, update, remove } = useStaff()
  const { addNotification } = useApp()
  const [search, setSearch] = useState('')
  const [showDrawer, setShowDrawer] = useState(false)
  const [editing, setEditing] = useState<Staff | null>(null)
  const [form, setForm] = useState<Partial<Staff>>({})
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() =>
    staff.filter(s =>
      (s.fullName?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (s.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (s.contactNo?.toLowerCase() || '').includes(search.toLowerCase())
    ),
    [staff, search]
  )

  function openAdd() {
    setEditing(null)
    setForm({ fullName: '', email: '', contactNo: '', password: '' })
    setConfirmPassword('')
    setShowDrawer(true)
  }

  function openEdit(member: Staff) {
    setEditing(member)
    setForm({ ...member })
    setConfirmPassword(member.password || '')
    setShowDrawer(true)
  }

  async function handleSave() {
    if (!form.fullName?.trim() || !form.email?.trim() || !form.contactNo?.trim() || !form.password?.trim()) return
    if (form.password !== confirmPassword) {
      addNotification({ message: 'Passwords do not match', type: 'error' })
      return
    }
    setSaving(true)
    try {
      if (editing) {
        await update(editing.id, form)
        addNotification({ message: 'Staff updated', type: 'success' })
      } else {
        await add(form as Omit<Staff, 'id'>)
        addNotification({ message: 'Staff added', type: 'success' })
      }
      setShowDrawer(false)
    } catch {
      addNotification({ message: 'Failed to save staff', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      await remove(deleteId)
      addNotification({ message: 'Staff deleted', type: 'success' })
      setDeleteId(null)
    } catch {
      addNotification({ message: 'Failed to delete staff', type: 'error' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Staff</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your team members and their access</p>
        </div>
        <button onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
          <Plus size={16} /> Add Staff
        </button>
      </div>

      {/* Stats Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
          <Users size={22} />
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Staff</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">{staff.length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input type="text" placeholder="Search staff..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonCards count={4} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <Users size={32} className="text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">No staff found</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            {search ? 'Try a different search term' : 'Click "Add Staff" to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map(member => (
            <StaffCard
              key={member.id}
              member={member}
              onEdit={openEdit}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Drawer */}
      <Drawer open={showDrawer} onClose={() => setShowDrawer(false)} title={editing ? 'Edit Staff' : 'Add Staff'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <input value={form.fullName || ''} onChange={e => setForm({ ...form, fullName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Number</label>
            <input value={form.contactNo || ''} onChange={e => setForm({ ...form, contactNo: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input type="password" value={form.password || ''} onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving || !form.fullName?.trim() || !form.email?.trim() || !form.contactNo?.trim() || !form.password?.trim()}
              className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50">
              {saving ? 'Saving...' : editing ? 'Update Staff' : 'Add Staff'}
            </button>
            <button onClick={() => setShowDrawer(false)}
              className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium">Cancel</button>
          </div>
        </div>
      </Drawer>

      {/* Delete Modal */}
      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete Staff" size="sm">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} className="text-red-500" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
            Are you sure you want to delete this staff member? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={handleDelete}
              className="flex-1 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 text-sm font-medium">Delete</button>
            <button onClick={() => setDeleteId(null)}
              className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
