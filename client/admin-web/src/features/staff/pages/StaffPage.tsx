import { useState, useMemo } from 'react'
import { Users, Search, Plus, Phone, Mail, Trash2, Edit2, User, Lock, ShieldCheck, ChevronLeft, ChevronRight, X, CheckSquare, Square } from 'lucide-react'
import { useStaff } from '../hooks/useStaff'
import { useApp } from '../../../context/AppContext'
import { SkeletonTable } from '../../../components/Skeleton'
import Drawer from '../../../components/Drawer'
import Modal from '../../../components/Modal'
import type { AdminStaff, CreateAdminStaffData, UpdateAdminStaffData } from '../services/types'

const PAGE_SIZE = 8

export default function StaffPage() {
  const { staff, loading, add, update, remove } = useStaff()
  const { addNotification } = useApp()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showDrawer, setShowDrawer] = useState(false)
  const [editing, setEditing] = useState<AdminStaff | null>(null)
  const [form, setForm] = useState<Partial<AdminStaff & { password: string }>>({ password: '' })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() =>
    staff.filter(s =>
      (s.fullName?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (s.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (s.contactNumber?.toLowerCase() || '').includes(search.toLowerCase())
    ),
    [staff, search]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const allSelected = paginated.length > 0 && paginated.every(s => selectedIds.has(s.id))

  function toggleAll() {
    if (allSelected) setSelectedIds(new Set())
    else setSelectedIds(new Set(paginated.map(s => s.id)))
  }

  function toggleOne(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function openAdd() {
    setEditing(null)
    setForm({ fullName: '', email: '', contactNumber: '', password: '' })
    setConfirmPassword('')
    setShowDrawer(true)
  }

  function openEdit(member: AdminStaff) {
    setEditing(member)
    setForm({ ...member, password: '' })
    setConfirmPassword('')
    setShowDrawer(true)
  }

  async function handleSave() {
    if (!form.fullName?.trim() || !form.email?.trim() || !form.contactNumber?.trim()) return
    if (!editing && !form.password?.trim()) return
    if (form.password && form.password !== confirmPassword) {
      addNotification({ message: 'Passwords do not match', type: 'error' })
      return
    }
    setSaving(true)
    try {
      if (editing) {
        await update(editing.id, form)
        addNotification({ message: 'Staff updated successfully', type: 'success' })
      } else {
        await add(form as CreateAdminStaffData)
        addNotification({ message: 'Staff added successfully', type: 'success' })
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
      addNotification({ message: 'Staff deleted successfully', type: 'success' })
      setDeleteId(null)
    } catch {
      addNotification({ message: 'Failed to delete staff', type: 'error' })
    }
  }

  function handleSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white tracking-tight">Staff</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Manage your team members and their access to the system</p>
        </div>
        <button onClick={openAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-800 dark:hover:bg-surface-200 transition-all duration-200 text-sm font-semibold active:scale-[0.97]">
          <Plus size={16} /> Add Staff
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500 dark:text-surface-400" />
        <input
          type="text"
          placeholder="Search by name, email or contact..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
          className="w-full pl-10 pr-9 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 placeholder:text-surface-400 dark:placeholder:text-surface-500"
        />
        {search && (
          <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonTable rows={4} />
      ) : paginated.length === 0 ? (
        <div className="text-center py-16 px-6">
          <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center mx-auto mb-4">
            <Users size={28} className="text-surface-500 dark:text-surface-400" />
          </div>
          <p className="text-surface-500 dark:text-surface-400 font-semibold">
            {search ? 'No matching staff found' : 'No staff members yet'}
          </p>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1.5">
            {search ? 'Try a different search term or clear the filter' : 'Get started by adding your first team member'}
          </p>
          {!search && (
            <button onClick={openAdd} className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-800 dark:hover:bg-surface-200 transition-all duration-200 text-sm font-medium active:scale-[0.97]">
              <Plus size={16} /> Add Staff
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-50 dark:bg-surface-800/50 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-10">
                    <button onClick={toggleAll} className="flex items-center justify-center">
                      {allSelected ? <CheckSquare size={15} className="text-surface-500" /> : <Square size={15} className="text-surface-400" />}
                    </button>
                  </th>
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(member => {
                  const checked = selectedIds.has(member.id)
                  return (
                    <tr key={member.id} className={`border-b border-surface-100 dark:border-surface-800 transition-colors ${checked ? 'bg-surface-100/50 dark:bg-surface-800/50' : ''}`}>
                      <td className="py-3 px-4">
                        <button onClick={() => toggleOne(member.id)} className="flex items-center justify-center">
                          {checked ? <CheckSquare size={15} className="text-surface-700 dark:text-surface-300" /> : <Square size={15} className="text-surface-400" />}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-surface-500 dark:text-surface-400">#{member.id.slice(0, 6)}</td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-surface-800 dark:text-surface-200">{member.fullName}</span>
                      </td>
                      <td className="py-3 px-4 text-surface-600 dark:text-surface-300 truncate max-w-[200px]">{member.email}</td>
                      <td className="py-3 px-4 text-surface-600 dark:text-surface-300">{member.contactNumber}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => openEdit(member)}
                            className="p-1.5 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors" title="Edit staff">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => setDeleteId(member.id)}
                            className="p-1.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors" title="Delete staff">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-surface-500 dark:text-surface-400">
                Showing <span className="font-medium text-surface-600 dark:text-surface-300">{(page - 1) * PAGE_SIZE + 1}</span> to{' '}
                <span className="font-medium text-surface-600 dark:text-surface-300">{Math.min(page * PAGE_SIZE, filtered.length)}</span> of{' '}
                <span className="font-medium text-surface-600 dark:text-surface-300">{filtered.length}</span> staff
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3.5 py-2 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700/60 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium">
                  <ChevronLeft size={14} /> Prev
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-3.5 py-2 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700/60 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium">
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add / Edit Drawer */}
      <Drawer open={showDrawer} onClose={() => setShowDrawer(false)} title={editing ? 'Edit Staff' : 'Add Staff'} className="max-w-[350px]">
        <div className="space-y-7">
          {/* Form Header */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
              {editing ? (
                <Edit2 size={20} className="text-surface-600 dark:text-surface-300" />
              ) : (
                <User size={20} className="text-surface-600 dark:text-surface-300" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-surface-800 dark:text-surface-200">{editing ? 'Update Staff' : 'New Staff Member'}</p>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                {editing ? 'Modify the details for this team member' : 'Fill in the details to create a new account'}
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-surface-100 dark:border-surface-800">
              <div className="w-7 h-7 rounded-lg bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
                <User size={14} className="text-surface-500 dark:text-surface-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">Personal Information</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">Basic details about the staff member</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 dark:text-surface-400" />
                  <input value={form.fullName || ''} onChange={e => setForm({ ...form, fullName: e.target.value })}
                    placeholder="e.g. Juan Dela Cruz"
                    className="w-full pl-9 pr-3 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800/50 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 placeholder:text-surface-400 dark:placeholder:text-surface-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 dark:text-surface-400" />
                  <input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. juan@example.com"
                    className="w-full pl-9 pr-3 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800/50 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 placeholder:text-surface-400 dark:placeholder:text-surface-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1.5">Contact Number</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 dark:text-surface-400" />
                  <input value={form.contactNumber || ''} onChange={e => setForm({ ...form, contactNumber: e.target.value })}
                    placeholder="e.g. 0917 123 4567"
                    className="w-full pl-9 pr-3 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800/50 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 placeholder:text-surface-400 dark:placeholder:text-surface-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div>
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-surface-100 dark:border-surface-800">
              <div className="w-7 h-7 rounded-lg bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
                <ShieldCheck size={14} className="text-surface-500 dark:text-surface-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">Security</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">Set the account password</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1.5">
                  Password {editing && <span className="font-normal normal-case text-surface-400">(leave blank to keep current)</span>}
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 dark:text-surface-400" />
                  <input type="password" value={form.password || ''} onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder={editing ? 'Enter new password...' : 'Enter password...'}
                    className="w-full pl-9 pr-3 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800/50 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 placeholder:text-surface-400 dark:placeholder:text-surface-500" />
                </div>
              </div>
              {form.password && (
                <div>
                  <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 dark:text-surface-400" />
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password..."
                      className="w-full pl-9 pr-3 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800/50 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 placeholder:text-surface-400 dark:placeholder:text-surface-500" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-3 border-t border-surface-100 dark:border-surface-800 sticky bottom-0 bg-white dark:bg-surface-900 pb-1">
            <button onClick={handleSave}
              disabled={saving || !form.fullName?.trim() || !form.email?.trim() || !form.contactNumber?.trim() || (!editing && !form.password?.trim())}
              className="flex-1 py-2.5 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-800 dark:hover:bg-surface-200 transition-all duration-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]">
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  Saving...
                </span>
              ) : editing ? 'Update Staff' : 'Add Staff'}
            </button>
            <button onClick={() => setShowDrawer(false)}
              className="px-6 py-2.5 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800/60 transition-all duration-200 text-sm font-medium active:scale-[0.98]">Cancel</button>
          </div>
        </div>
      </Drawer>

      {/* Delete Modal */}
      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete Staff" size="sm">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} className="text-surface-500" />
          </div>
          <h3 className="text-base font-semibold text-surface-800 dark:text-surface-100 mb-2">Confirm Deletion</h3>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-6 leading-relaxed">
            Are you sure you want to delete this staff member? This action cannot be undone and the account will be permanently removed.
          </p>
          <div className="flex gap-3">
            <button onClick={handleDelete}
              className="flex-1 py-2.5 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-800 dark:hover:bg-surface-200 transition-all duration-200 text-sm font-medium active:scale-[0.98]">Delete</button>
            <button onClick={() => setDeleteId(null)}
              className="flex-1 py-2.5 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800/60 transition-all duration-200 text-sm font-medium active:scale-[0.98]">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
