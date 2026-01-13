import { useState, useEffect, useCallback } from 'react';
import { productOperations, type Product, handleGraphQLError } from '../services/graphql';
import { ProductFilters, SortOption } from '../types';

/**
 * Custom hook for product management
 * Provides CRUD operations and state management for products
 */

interface UseProductsOptions {
  autoFetch?: boolean;
  initialFilters?: ProductFilters;
  initialSort?: SortOption;
  limit?: number;
}

interface UseProductsReturn {
  // State
  products: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  nextToken: string | null;

  // Actions
  fetchProducts: () => Promise<void>;
  loadMore: () => Promise<void>;
  searchProducts: (searchTerm: string) => Promise<void>;
  createProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product | null>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  refreshProducts: () => Promise<void>;

  // Filters and sorting
  setFilters: (filters: ProductFilters) => void;
  setSort: (sort: SortOption) => void;
  clearFilters: () => void;

  // Current state
  filters: ProductFilters;
  sort: SortOption;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const {
    autoFetch = true,
    initialFilters = {},
    initialSort = { field: 'name', direction: 'asc' },
    limit = 20,
  } = options;

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [sort, setSort] = useState<SortOption>(initialSort);

  // Build GraphQL filter from ProductFilters
  const buildGraphQLFilter = useCallback((productFilters: ProductFilters) => {
    const filter: any = {};

    if (productFilters.category) {
      filter.category = { eq: productFilters.category };
    }

    if (productFilters.minPrice !== undefined || productFilters.maxPrice !== undefined) {
      filter.price = {};
      if (productFilters.minPrice !== undefined) {
        filter.price.gte = productFilters.minPrice;
      }
      if (productFilters.maxPrice !== undefined) {
        filter.price.lte = productFilters.maxPrice;
      }
    }

    if (productFilters.inStock) {
      filter.stock = { gt: 0 };
    }

    if (productFilters.tags && productFilters.tags.length > 0) {
      filter.or = productFilters.tags.map(tag => ({ tags: { contains: tag } }));
    }

    // Always filter for active products unless explicitly requested
    filter.isActive = { eq: true };

    return Object.keys(filter).length > 0 ? filter : undefined;
  }, []);

  // Sort products locally (GraphQL doesn't support complex sorting)
  const sortProducts = useCallback((productList: Product[], sortOption: SortOption): Product[] => {
    return [...productList].sort((a, b) => {
      let aValue: any = a[sortOption.field];
      let bValue: any = b[sortOption.field];

      // Handle different data types
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue?.toLowerCase() || '';
      }

      if (aValue < bValue) {
        return sortOption.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOption.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async (reset = true) => {
    try {
      setLoading(true);
      setError(null);

      const filter = buildGraphQLFilter(filters);
      const token = reset ? null : nextToken;

      const response = await productOperations.listProducts(filter, limit, token || undefined);

      if (response.data) {
        const newProducts = response.data as Product[];
        const sortedProducts = sortProducts(newProducts, sort);

        if (reset) {
          setProducts(sortedProducts);
        } else {
          setProducts(prev => sortProducts([...prev, ...newProducts], sort));
        }

        setNextToken(response.nextToken || null);
        setHasMore(!!response.nextToken);
      }
    } catch (err) {
      const errorMessage = handleGraphQLError(err);
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, sort, limit, nextToken, buildGraphQLFilter, sortProducts]);

  // Load more products (pagination)
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await fetchProducts(false);
  }, [hasMore, loading, fetchProducts]);

  // Search products
  const searchProducts = useCallback(async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!searchTerm.trim()) {
        await fetchProducts(true);
        return;
      }

      // Perform client-side filtering for case-insensitive search
      // Fetch a larger batch to filter from (since backend 'contains' is case-sensitive)
      const response = await productOperations.listProducts(undefined, 500);

      if (response.data) {
        const allProducts = response.data as Product[];
        const lowerTerm = searchTerm.toLowerCase();

        const searchResults = allProducts.filter(product => {
          const nameMatch = product.name && product.name.toLowerCase().includes(lowerTerm);
          const descMatch = product.description && product.description.toLowerCase().includes(lowerTerm);
          const catMatch = product.category && typeof product.category === 'string' && product.category.toLowerCase().includes(lowerTerm);
          const tagsMatch = product.tags && product.tags.some(tag => tag && tag.toLowerCase().includes(lowerTerm));
          const skuMatch = product.sku && product.sku.toLowerCase().includes(lowerTerm);

          return nameMatch || descMatch || catMatch || tagsMatch || skuMatch;
        });

        const sortedResults = sortProducts(searchResults, sort);
        setProducts(sortedResults);
        setNextToken(null);
        setHasMore(false);
      }
    } catch (err) {
      const errorMessage = handleGraphQLError(err);
      setError(errorMessage);
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  }, [sort, sortProducts, fetchProducts]);

  // Create product (Admin only)
  const createProduct = useCallback(async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product | null> => {
    try {
      setError(null);

      const response = await productOperations.createProduct(productData);

      if (response.data) {
        const newProduct = response.data as Product;
        setProducts(prev => sortProducts([newProduct, ...prev], sort));
        return newProduct;
      }

      return null;
    } catch (err) {
      const errorMessage = handleGraphQLError(err);
      setError(errorMessage);
      console.error('Error creating product:', err);
      return null;
    }
  }, [sort, sortProducts]);

  // Update product (Admin only)
  const updateProduct = useCallback(async (id: string, productData: Partial<Product>): Promise<Product | null> => {
    try {
      setError(null);

      const response = await productOperations.updateProduct({ id, ...productData } as any);

      if (response.data) {
        const updatedProduct = response.data as Product;
        setProducts(prev =>
          sortProducts(
            prev.map(p => p.id === id ? updatedProduct : p),
            sort
          )
        );
        return updatedProduct;
      }

      return null;
    } catch (err) {
      const errorMessage = handleGraphQLError(err);
      setError(errorMessage);
      console.error('Error updating product:', err);
      return null;
    }
  }, [sort, sortProducts]);

  // Delete product (Admin only)
  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);

      await productOperations.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      const errorMessage = handleGraphQLError(err);
      setError(errorMessage);
      console.error('Error deleting product:', err);
      return false;
    }
  }, []);

  // Refresh products
  const refreshProducts = useCallback(async () => {
    await fetchProducts(true);
  }, [fetchProducts]);

  // Update filters
  const updateFilters = useCallback((newFilters: ProductFilters) => {
    setFilters(newFilters);
    setNextToken(null);
    setHasMore(true);
  }, []);

  // Update sort
  const updateSort = useCallback((newSort: SortOption) => {
    setSort(newSort);
    // Re-sort existing products
    setProducts(prev => sortProducts(prev, newSort));
  }, [sortProducts]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
    setNextToken(null);
    setHasMore(true);
  }, []);

  // Auto-fetch on mount and when filters/sort change
  useEffect(() => {
    if (autoFetch) {
      fetchProducts(true);
    }
  }, [autoFetch, filters, sort]); // Note: fetchProducts is not in deps to avoid infinite loop

  return {
    // State
    products,
    loading,
    error,
    hasMore,
    nextToken,

    // Actions
    fetchProducts: () => fetchProducts(true),
    loadMore,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,

    // Filters and sorting
    setFilters: updateFilters,
    setSort: updateSort,
    clearFilters,

    // Current state
    filters,
    sort,
  };
}

/**
 * Hook for getting a single product by ID
 */
interface UseProductOptions {
  autoFetch?: boolean;
}

interface UseProductReturn {
  product: Product | null;
  loading: boolean;
  error: string | null;
  fetchProduct: (id: string) => Promise<void>;
  refreshProduct: () => Promise<void>;
}

export function useProduct(id?: string, options: UseProductOptions = {}): UseProductReturn {
  const { autoFetch = true } = options;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async (productId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await productOperations.getProduct(productId);

      if (response.data) {
        setProduct(response.data as Product);
      } else {
        setProduct(null);
        setError('Producto no encontrado');
      }
    } catch (err) {
      const errorMessage = handleGraphQLError(err);
      setError(errorMessage);
      setProduct(null);
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProduct = useCallback(async () => {
    if (id) {
      await fetchProduct(id);
    }
  }, [id, fetchProduct]);

  // Auto-fetch on mount if ID is provided
  useEffect(() => {
    if (autoFetch && id) {
      fetchProduct(id);
    }
  }, [autoFetch, id, fetchProduct]);

  return {
    product,
    loading,
    error,
    fetchProduct,
    refreshProduct,
  };
}