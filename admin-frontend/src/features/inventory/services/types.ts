export interface Item {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  image: string
  createdAt: string
}

export interface Product extends Item {
  currency?: string
}
