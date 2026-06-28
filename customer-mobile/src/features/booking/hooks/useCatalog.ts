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
      const [allProducts] = await Promise.all([
        bookingFeatureService.getProducts(),
      ]);
      setProducts(allProducts);
      setFilteredProducts(allProducts);
      setCategories(bookingFeatureService.getCategories());
    } catch (e: any) {
      setError(e.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filterByCategory = useCallback(async (category: string) => {
    setSelectedCategory(category);
    setIsLoading(true);
    try {
      if (category === 'All') {
        setFilteredProducts(products);
      } else {
        const result = await bookingFeatureService.getProductsByCategory(category);
        setFilteredProducts(result);
      }
    } catch {
      setFilteredProducts(products);
    } finally {
      setIsLoading(false);
    }
  }, [products]);

  const search = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredProducts(products);
      return;
    }
    setIsLoading(true);
    try {
      const result = await bookingFeatureService.searchProducts(query);
      setFilteredProducts(result);
    } catch {
      setFilteredProducts(products);
    } finally {
      setIsLoading(false);
    }
  }, [products]);

  return {
    products, filteredProducts, categories, selectedCategory, searchQuery,
    isLoading, error, loadProducts, filterByCategory, search,
  };
}
