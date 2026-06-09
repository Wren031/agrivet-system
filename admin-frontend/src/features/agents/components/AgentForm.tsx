import { useState, type FormEvent } from 'react'
import type { Agent } from '../services/types'

interface AgentFormProps {
  initialData: Agent | null
  onSave: (data: Omit<Agent, 'id'>) => void
  onCancel: () => void
}

export default function AgentForm({ initialData, onSave, onCancel }: AgentFormProps) {
  const [name, setName] = useState(initialData?.name ?? '')
  const [email, setEmail] = useState(initialData?.email ?? '')
  const [phone, setPhone] = useState(initialData?.phone ?? '')
  const [region, setRegion] = useState(initialData?.region ?? '')
  const [status, setStatus] = useState<'Active' | 'Inactive'>(initialData?.status ?? 'Active')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Name is required'
    if (!email.trim()) errs.email = 'Email is required'
    if (!phone.trim()) errs.phone = 'Phone is required'
    if (!region.trim()) errs.region = 'Region is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    onSave({ name: name.trim(), email: email.trim(), phone: phone.trim(), region: region.trim(), status })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Agent Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.name ? 'border-red-400' : 'border-slate-200'}`} />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email ? 'border-red-400' : 'border-slate-200'}`} />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
        <input type="text" value={phone} onChange={e => setPhone(e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.phone ? 'border-red-400' : 'border-slate-200'}`} />
        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Region</label>
        <input type="text" value={region} onChange={e => setRegion(e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.region ? 'border-red-400' : 'border-slate-200'}`} />
        {errors.region && <p className="text-xs text-red-500 mt-1">{errors.region}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
        <select value={status} onChange={e => setStatus(e.target.value as 'Active' | 'Inactive')}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
        <button type="submit" className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
          {initialData ? 'Save Changes' : 'Add Agent'}
        </button>
      </div>
    </form>
  )
}
