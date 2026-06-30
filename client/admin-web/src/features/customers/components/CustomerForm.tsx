import { useState, type FormEvent } from 'react'
import type { Customer } from '../services/types'

interface CustomerFormProps {
  initialData: Customer | null
  onSave: (data: { fullName: string; phone: string; storeName?: string; address?: string }) => void
  onCancel: () => void
}

export default function CustomerForm({ initialData, onSave, onCancel }: CustomerFormProps) {
  const [fullName, setFullName] = useState(initialData?.fullName ?? '')
  const [phone, setPhone] = useState(initialData?.phone ?? '')
  const [storeName, setStoreName] = useState('')
  const [address, setAddress] = useState(initialData?.address ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!fullName.trim()) errs.fullName = 'Full name is required'
    if (!phone.trim()) errs.phone = 'Phone is required'
    if (!address.trim()) errs.address = 'Address is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    onSave({ fullName: fullName.trim(), phone: phone.trim(), storeName: storeName.trim() || undefined, address: address.trim() })
  }

  const inputClass = (field: string) =>
    `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 ${
      errors[field] ? 'border-red-400' : 'border-surface-200'
    }`

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="block text-sm font-medium text-surface-700 mb-1">Full Name</label><input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className={inputClass('fullName')} />{errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}</div>
      <div><label className="block text-sm font-medium text-surface-700 mb-1">Contact Number</label><input type="text" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass('phone')} />{errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}</div>
      <div><label className="block text-sm font-medium text-surface-700 mb-1">Store Name</label><input type="text" value={storeName} onChange={e => setStoreName(e.target.value)} className={inputClass('storeName')} /></div>
      <div><label className="block text-sm font-medium text-surface-700 mb-1">Address</label><input type="text" value={address} onChange={e => setAddress(e.target.value)} className={inputClass('address')} />{errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}</div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 text-sm font-medium text-surface-600 bg-surface-100 rounded-lg hover:bg-surface-200">Cancel</button>
        <button type="submit" className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-surface-600 rounded-lg hover:bg-surface-700">{initialData ? 'Save Changes' : 'Add Customer'}</button>
      </div>
    </form>
  )
}
