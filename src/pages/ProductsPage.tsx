import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../contexts/CartContext';
import { ProductFilters, SortOption, Product } from '../types';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import PageTransition from '../components/UI/PageTransition';

// ── Demo products (shown when API has no products) ──────────────
const DEMO_PRODUCTS: Product[] = [
  {
    id: 'demo-001',
    sku: 'PW-CASCO-001',
    name: 'Casco de Seguridad Industrial V-Gard',
    description: 'Casco de protección industrial de alta resistencia con ventilación mejorada. Certificado EN 397. Ideal para construcción, industria y obras civiles.',
    price: 24.99,
    stock: 150,
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop',
    category: 'Protección Cabeza',
    tags: ['casco', 'EN397', 'construcción'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-002',
    sku: 'PW-GUANTES-002',
    name: 'Guantes de Trabajo Anticorte Nivel 5',
    description: 'Guantes de protección anticorte nivel 5 con recubrimiento de nitrilo. Máxima destreza y agarre. Certificado EN 388.',
    price: 12.50,
    stock: 300,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    category: 'Protección Manos',
    tags: ['guantes', 'anticorte', 'nitrilo', 'EN388'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-003',
    sku: 'PW-CHALECO-003',
    name: 'Chaleco Alta Visibilidad Clase 3',
    description: 'Chaleco reflectante de alta visibilidad clase 3 con bandas reflectantes 360°. Certificado EN ISO 20471. Color amarillo fluorescente.',
    price: 18.75,
    stock: 200,
    imageUrl: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&h=400&fit=crop',
    category: 'Alta Visibilidad',
    tags: ['chaleco', 'alta visibilidad', 'EN20471'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-004',
    sku: 'PW-BOTAS-004',
    name: 'Botas de Seguridad S3 Punta de Acero',
    description: 'Botas de seguridad S3 con puntera de acero, plantilla antiperforación y suela antideslizante. Resistentes al agua. Certificado EN ISO 20345.',
    price: 89.90,
    stock: 75,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    category: 'Calzado Seguridad',
    tags: ['botas', 'S3', 'punta acero', 'EN20345'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-005',
    sku: 'PW-GAFAS-005',
    name: 'Gafas de Protección Panorámicas',
    description: 'Gafas de seguridad panorámicas con lente antiarañazos y tratamiento antiempañante. Protección UV 400. Certificado EN 166.',
    price: 8.99,
    stock: 500,
    imageUrl: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop',
    category: 'Protección Ocular',
    tags: ['gafas', 'panorámicas', 'UV400', 'EN166'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-006',
    sku: 'PW-MASCARILLA-006',
    name: 'Mascarilla FFP2 NR Sin Válvula (Pack 20)',
    description: 'Mascarillas de protección respiratoria FFP2 NR. Eficacia de filtrado ≥ 94%. Sin válvula para protección bidireccional. Pack de 20 unidades.',
    price: 19.99,
    stock: 1000,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
    category: 'Protección Respiratoria',
    tags: ['mascarilla', 'FFP2', 'NR', 'pack20'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Products Page - Product listing with filters and search
 * Now connected to real GraphQL API
 */
function ProductsPage() {

  const { addItem, openCart } = useCart();
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

  // Use demo products if API returns nothing (dev/demo mode)
  const isDemoMode = !loading && products.length === 0;
  const displayProducts = isDemoMode ? DEMO_PRODUCTS : products;

  if (loading && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner size="lg" text="Cargando productos..." />
      </div>
    );
  }

  // On error, still show demo products
  const hasError = !!error && products.length === 0;

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Catálogo de Productos</h1>
          <p className="text-gray-600">
            Encuentra el equipo de protección personal que necesitas para tu empresa
          </p>
        </div>

        {/* Demo mode banner */}
        {(isDemoMode || hasError) && (
          <div style={{
            background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
            border: '1.5px solid #fde68a',
            borderRadius: 14,
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.875rem',
          }}>
            <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🧪</span>
            <div>
              <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: '#92400e' }}>
                Modo demo — Productos de muestra
              </p>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: '#78350f' }}>
                Estos son productos de ejemplo. Añádelos al carrito para probar el flujo completo de compra.
                {hasError && <span style={{ marginLeft: 4 }}>({error})</span>}
              </p>
            </div>
          </div>
        )}

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
          {displayProducts.map((product) => (
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
                    onClick={() => {
                      addItem(product);
                      openCart();
                    }}
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
        {
          displayProducts.length === 0 && !loading && (
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
          )
        }

        {/* Load More Button */}
        {
          hasMore && products.length > 0 && (
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
          )
        }
      </div>
    </PageTransition>
  );
}

export default ProductsPage;
