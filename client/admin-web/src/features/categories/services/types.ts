export interface Category {
  id: string
  name: string
  subcategories?: SubCategory[]
}

export interface SubCategory {
  id: string
  name: string
  categoryId: string
}
