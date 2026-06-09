const STORAGE_KEY = 'inventory_categories'

function delay(ms = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function fetchCategories(): Promise<string[]> {
  await delay()
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) {
    const defaults = [
      'Feeds',
      'Veterinary Medicines',
      'Crop Protection',
      'Supplements',
      'Equipment',
      'Vaccines',
      'Animal Health Products',
      'Farming Tools',
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
    return defaults
  }
  return JSON.parse(data)
}

export async function addCategory(name: string): Promise<string[]> {
  await delay()
  const items = await fetchCategories()
  if (!items.includes(name)) {
    items.push(name)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }
  return items
}

export async function removeCategory(name: string): Promise<string[]> {
  await delay()
  const items = (await fetchCategories()).filter(c => c !== name)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  return items
}

export async function renameCategory(oldName: string, newName: string): Promise<string[]> {
  await delay()
  const items = await fetchCategories()
  const index = items.indexOf(oldName)
  if (index === -1) throw new Error('Category not found')
  if (items.includes(newName)) throw new Error('Category already exists')
  items[index] = newName
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  return items
}
