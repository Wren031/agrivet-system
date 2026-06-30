import { useState, useCallback } from 'react';
import { Product } from '../../../types';
import { bookingFeatureService } from '../services/bookingFeature.service';

export function useCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allProducts = await bookingFeatureService.getProducts();
      setProducts(allProducts);
      setFilteredProducts(allProducts);
      const cats = [...new Set(allProducts.map(p => p.category))];
      setCategories(cats);
    } catch (e: any) {
      setError(e.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filterByCategory = useCallback(async (category: string) => {
    setSelectedCategory(category);
    if (category === 'All' || category === 'All Categories') {
      setFilteredProducts(products);
      return;
    }
    const result = products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
    setFilteredProducts(result);
  }, [products]);

  const search = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredProducts(products);
      return;
    }
    const q = query.toLowerCase();
    const result = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
    setFilteredProducts(result);
  }, [products]);

  return {
    products, filteredProducts, categories, selectedCategory, searchQuery,
    isLoading, error, loadProducts, filterByCategory, search,
  };
}
