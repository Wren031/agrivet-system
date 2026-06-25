import { useState, type FormEvent } from 'react'
import type { Agent, AgentStatus, CreateAgentData, UpdateAgentData } from '../services/types'

interface AgentFormProps {
  initialData: Agent | null
  onSave: (data: CreateAgentData | UpdateAgentData) => void
  onCancel: () => void
}

export default function AgentForm({ initialData, onSave, onCancel }: AgentFormProps) {
  const [fullName, setFullName] = useState(initialData?.fullName ?? '')
  const [email, setEmail] = useState(initialData?.email ?? '')
  const [contactNumber, setContactNumber] = useState(initialData?.contactNumber ?? '')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<AgentStatus>(initialData?.status ?? 'PENDING')
  const [idVerificationUrl, setIdVerificationUrl] = useState(initialData?.idVerificationUrl ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEdit = !!initialData

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!fullName.trim()) errs.fullName = 'Full name is required'
    if (!email.trim()) errs.email = 'Email is required'
    if (!contactNumber.trim()) errs.contactNumber = 'Contact number is required'
    if (!isEdit && !password.trim()) errs.password = 'Password is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    if (isEdit) {
      const data: UpdateAgentData = { fullName: fullName.trim(), contactNumber: contactNumber.trim(), email: email.trim(), status }
      if (idVerificationUrl.trim()) data.idVerificationUrl = idVerificationUrl.trim()
      if (password.trim()) data.password = password.trim()
      onSave(data)
    } else {
      onSave({
        fullName: fullName.trim(),
        contactNumber: contactNumber.trim(),
        email: email.trim(),
        password: password.trim(),
        status,
        idVerificationUrl: idVerificationUrl.trim() || undefined,
      } as CreateAgentData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
        <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.fullName ? 'border-red-400' : 'border-slate-200'}`} />
        {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email ? 'border-red-400' : 'border-slate-200'}`} />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
        <input type="text" value={contactNumber} onChange={e => setContactNumber(e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.contactNumber ? 'border-red-400' : 'border-slate-200'}`} />
        {errors.contactNumber && <p className="text-xs text-red-500 mt-1">{errors.contactNumber}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Password {isEdit && <span className="text-slate-400 font-normal">(leave blank to keep current)</span>}</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.password ? 'border-red-400' : 'border-slate-200'}`} />
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
        <select value={status} onChange={e => setStatus(e.target.value as AgentStatus)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">ID Verification URL</label>
        <input type="text" value={idVerificationUrl} onChange={e => setIdVerificationUrl(e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
        <button type="submit" className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
          {isEdit ? 'Save Changes' : 'Add Agent'}
        </button>
      </div>
    </form>
  )
}
