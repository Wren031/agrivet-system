import { Phone, Mail, Edit2, Trash2 } from 'lucide-react'
import type { AdminStaff } from '../services/types'

interface StaffCardProps {
  member: AdminStaff
  onEdit: (member: AdminStaff) => void
  onDelete: (id: string) => void
}

export default function StaffCard({ member, onEdit, onDelete }: StaffCardProps) {
  return (
    <div className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
          {member.fullName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-800 dark:text-slate-200 text-sm truncate">{member.fullName}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{member.email}</p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(member)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title="Edit"><Edit2 size={14} /></button>
          <button onClick={() => onDelete(member.id)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Delete"><Trash2 size={14} /></button>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <Mail size={14} />
          <span className="truncate">{member.email}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <Phone size={14} />
          <span className="font-medium text-slate-700 dark:text-slate-200">{member.contactNumber}</span>
        </div>
      </div>
    </div>
  )
}
