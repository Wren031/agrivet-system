import { useState, useMemo } from 'react'
import { Users, Search, Plus, Phone, Mail, Trash2, Edit2, User, Lock, ShieldCheck, ChevronLeft, ChevronRight, X, BadgeCheck } from 'lucide-react'
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Admin Staff</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your team members and their access to the system</p>
        </div>
        <button onClick={openAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 text-sm font-semibold shadow-sm active:scale-[0.97]">
          <Plus size={16} /> Add Staff
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Search by name, email or contact..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
          className="w-full pl-10 pr-9 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
        />
        {search && (
          <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <SkeletonTable rows={4} />
        </div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Users size={28} className="text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-semibold">
            {search ? 'No matching staff found' : 'No staff members yet'}
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1.5">
            {search ? 'Try a different search term or clear the filter' : 'Get started by adding your first team member'}
          </p>
          {!search && (
            <button onClick={openAdd} className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 text-sm font-medium shadow-sm shadow-indigo-200 dark:shadow-indigo-900/20 active:scale-[0.97]">
              <Plus size={16} /> Add Staff
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="px-5 py-4">Staff Name</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Contact Number</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/80">
                  {paginated.map((member, idx) => (
                    <tr
                      key={member.id}
                      className="group hover:bg-slate-50/80 dark:hover:bg-slate-700/20 transition-all duration-150"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-xs shrink-0">
                            {member.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-100">{member.fullName}</span>
                            <div className="flex items-center gap-1 mt-0.5">
                              <BadgeCheck size={11} className="text-indigo-400" />
                              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Admin</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <div className="p-1 rounded-md bg-slate-50 dark:bg-slate-800/60 text-slate-400 shrink-0">
                            <Mail size={13} />
                          </div>
                          <span className="truncate max-w-[200px]">{member.email}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <div className="p-1 rounded-md bg-slate-50 dark:bg-slate-800/60 text-slate-400 shrink-0">
                            <Phone size={13} />
                          </div>
                          <span>{member.contactNumber}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => openEdit(member)}
                            className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all duration-150 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                            title="Edit staff">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => setDeleteId(member.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all duration-150 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                            title="Delete staff">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-slate-400 dark:text-slate-500">
                Showing <span className="font-medium text-slate-600 dark:text-slate-300">{(page - 1) * PAGE_SIZE + 1}</span> to{' '}
                <span className="font-medium text-slate-600 dark:text-slate-300">{Math.min(page * PAGE_SIZE, filtered.length)}</span> of{' '}
                <span className="font-medium text-slate-600 dark:text-slate-300">{filtered.length}</span> staff
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium">
                  <ChevronLeft size={14} /> Prev
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium">
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add / Edit Drawer */}
      <Drawer open={showDrawer} onClose={() => setShowDrawer(false)} title={editing ? 'Edit Staff' : 'Add Staff'} size="full" className="max-w-[420px]">
        <div className="space-y-7">
          {/* Form Header */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/20 dark:to-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/30">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-200/50 dark:shadow-indigo-900/30">
              {editing ? (
                <Edit2 size={20} className="text-white" />
              ) : (
                <User size={20} className="text-white" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-indigo-900 dark:text-indigo-200">{editing ? 'Update Staff' : 'New Staff Member'}</p>
              <p className="text-xs text-indigo-500 dark:text-indigo-400/80 mt-0.5">
                {editing ? 'Modify the details for this team member' : 'Fill in the details to create a new account'}
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                <User size={14} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Personal Information</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Basic details about the staff member</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input value={form.fullName || ''} onChange={e => setForm({ ...form, fullName: e.target.value })}
                    placeholder="e.g. Juan Dela Cruz"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. juan@example.com"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Contact Number</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input value={form.contactNumber || ''} onChange={e => setForm({ ...form, contactNumber: e.target.value })}
                    placeholder="e.g. 0917 123 4567"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all" />
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div>
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                <ShieldCheck size={14} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Security</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Set the account password</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Password {editing && <span className="font-normal normal-case text-slate-400">(leave blank to keep current)</span>}
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input type="password" value={form.password || ''} onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder={editing ? 'Enter new password...' : 'Enter password...'}
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all" />
                </div>
              </div>
              {form.password && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password..."
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 sticky bottom-0 bg-white dark:bg-slate-900 pb-1">
            <button onClick={handleSave}
              disabled={saving || !form.fullName?.trim() || !form.email?.trim() || !form.contactNumber?.trim() || (!editing && !form.password?.trim())}
              className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-200 dark:shadow-indigo-900/30 active:scale-[0.98]">
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  Saving...
                </span>
              ) : editing ? 'Update Staff' : 'Add Staff'}
            </button>
            <button onClick={() => setShowDrawer(false)}
              className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all duration-200 text-sm font-medium active:scale-[0.98]">Cancel</button>
          </div>
        </div>
      </Drawer>

      {/* Delete Modal */}
      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete Staff" size="sm">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-950/10 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Trash2 size={24} className="text-indigo-500" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-2">Confirm Deletion</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            Are you sure you want to delete this staff member? This action cannot be undone and the account will be permanently removed.
          </p>
          <div className="flex gap-3">
            <button onClick={handleDelete}
              className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 text-sm font-medium shadow-sm shadow-indigo-200 dark:shadow-indigo-900/30 active:scale-[0.98]">Delete</button>
            <button onClick={() => setDeleteId(null)}
              className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all duration-200 text-sm font-medium active:scale-[0.98]">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
