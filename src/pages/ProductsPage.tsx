import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductFilters, SortOption } from '../types';
import LoadingSpinner from '../components/UI/LoadingSpinner';

/**
 * Products Page - Product listing with filters and search
 * Now connected to real GraphQL API
 */
function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [localFilters, setLocalFilters] = useState<ProductFilters>({});
  const [localSort, setLocalSort] = useState<SortOption>({ field: 'name', direction: 'asc' });

  const {
    products,
    loading,
    error,
    hasMore,
    fetchProducts,
    loadMore,
    searchProducts,
    setFilters,
    setSort,
    clearFilters,
    filters,
    sort,
  } = useProducts({
    autoFetch: true,
    initialFilters: localFilters,
    initialSort: localSort,
    limit: 12, // Show 12 products per page
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      await searchProducts(searchTerm.trim());
    } else {
      await fetchProducts();
    }
  };

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    const updatedFilters = { ...localFilters, ...newFilters };
    setLocalFilters(updatedFilters);
    setFilters(updatedFilters);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, direction] = e.target.value.split('-') as [keyof typeof sort.field, 'asc' | 'desc'];
    const newSort: SortOption = { field: field as any, direction };
    setLocalSort(newSort);
    setSort(newSort);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setLocalFilters({});
    clearFilters();
  };

  const handleLoadMore = async () => {
    if (hasMore && !loading) {
      await loadMore();
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner size="lg" text="Cargando productos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 btn btn-primary"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Catálogo de Productos</h1>
        <p className="text-gray-600">
          Encuentra el equipo de protección personal que necesitas para tu empresa
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="md:col-span-2">
            <div className="flex">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition-colors"
              >
                Buscar
              </button>
            </div>
          </form>

          {/* Category Filter */}
          <select
            value={filters.category || ''}
            onChange={(e) => handleFilterChange({ category: e.target.value || undefined })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todas las categorías</option>
            <option value="Protección Cabeza">Protección Cabeza</option>
            <option value="Protección Manos">Protección Manos</option>
            <option value="Alta Visibilidad">Alta Visibilidad</option>
            <option value="Calzado Seguridad">Calzado Seguridad</option>
          </select>

          {/* Sort */}
          <select
            value={`${sort.field}-${sort.direction}`}
            onChange={handleSortChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="name-asc">Nombre A-Z</option>
            <option value="name-desc">Nombre Z-A</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="createdAt-desc">Más Recientes</option>
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="mt-4 flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Rango de precio:</label>
          <input
            type="number"
            placeholder="Min €"
            value={localFilters.minPrice || ''}
            onChange={(e) => handleFilterChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-24 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            placeholder="Max €"
            value={localFilters.maxPrice || ''}
            onChange={(e) => handleFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-24 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={localFilters.inStock || false}
              onChange={(e) => handleFilterChange({ inStock: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Solo en stock</span>
          </label>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm text-red-600">{error}</p>
              <button 
                onClick={() => fetchProducts()} 
                className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            {/* Product Image */}
            <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="mb-2">
                <span className="text-xs text-gray-500 font-medium">{product.sku}</span>
                {product.category && (
                  <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {product.category}
                  </span>
                )}
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.name}
              </h3>
              
              {product.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}

              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-bold text-primary-600">
                  €{product.price.toFixed(2)}
                </span>
                <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
                </span>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => window.location.href = `/productos/${product.id}`}
                  className="flex-1 btn btn-outline text-sm"
                >
                  Ver Detalles
                </button>
                <button
                  disabled={product.stock === 0}
                  className="flex-1 btn btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Añadir al Carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
          <p className="text-gray-600 mb-4">Intenta ajustar los filtros o términos de búsqueda</p>
          <button
            onClick={handleClearFilters}
            className="btn btn-primary"
          >
            Limpiar Filtros
          </button>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && products.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="btn btn-outline disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center">
                <LoadingSpinner size="sm" />
                <span className="ml-2">Cargando...</span>
              </div>
            ) : (
              'Cargar Más Productos'
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;