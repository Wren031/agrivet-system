import { useState, type FormEvent } from 'react'
import type { Customer } from '../services/types'

interface CustomerFormProps {
  initialData: Customer | null
  onSave: (data: Omit<Customer, 'id'>) => void
  onCancel: () => void
}

export default function CustomerForm({ initialData, onSave, onCancel }: CustomerFormProps) {
  const [name, setName] = useState(initialData?.name ?? '')
  const [contactPerson, setContactPerson] = useState(initialData?.contactPerson ?? '')
  const [email, setEmail] = useState(initialData?.email ?? '')
  const [phone, setPhone] = useState(initialData?.phone ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Name is required'
    if (!contactPerson.trim()) errs.contactPerson = 'Contact person is required'
    if (!email.trim()) errs.email = 'Email is required'
    if (!phone.trim()) errs.phone = 'Phone is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    onSave({ name: name.trim(), contactPerson: contactPerson.trim(), email: email.trim(), phone: phone.trim(), totalOrders: initialData?.totalOrders ?? 0, status: initialData?.status ?? 'Active' })
  }

  const inputClass = (field: string) =>
    `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
      errors[field] ? 'border-red-400' : 'border-slate-200'
    }`

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass('name')} />{errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}</div>
      <div><label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label><input type="text" value={contactPerson} onChange={e => setContactPerson(e.target.value)} className={inputClass('contactPerson')} />{errors.contactPerson && <p className="text-xs text-red-500 mt-1">{errors.contactPerson}</p>}</div>
      <div><label className="block text-sm font-medium text-slate-700 mb-1">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass('email')} />{errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}</div>
      <div><label className="block text-sm font-medium text-slate-700 mb-1">Phone</label><input type="text" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass('phone')} />{errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}</div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
        <button type="submit" className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">{initialData ? 'Save Changes' : 'Add Customer'}</button>
      </div>
    </form>
  )
}
