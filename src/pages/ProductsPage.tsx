import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductFilters, SortOption } from '../types';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import S3Image from '../components/UI/S3Image';
import '../styles/ProductsPage.css';

/**
 * Products Page - Product listing with filters and search
 * Redesigned - Sidebar Layout (PcComponentes style)
 */
function ProductsPage() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [showFilters, setShowFilters] = useState(false);
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
    autoFetch: !initialSearch,
    initialFilters: localFilters,
    initialSort: localSort,
    limit: 12,
  });

  // Calculate active filters count for badge
  const activeFilterCount = [
    filters.category,
    localFilters.minPrice,
    localFilters.maxPrice,
    localFilters.inStock ? 'inStock' : undefined,
    sort.field !== 'name' || sort.direction !== 'asc' ? 'sort' : undefined
  ].filter(Boolean).length;

  // Helper to check active sort
  const isSortActive = (field: string, direction: string) =>
    sort.field === field && sort.direction === direction;

  useEffect(() => {
    if (initialSearch) {
      searchProducts(initialSearch);
    }
  }, [initialSearch]);

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
    // Legacy support if needed, but we use pills now
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
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size="lg" text="Cargando catálogo..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#991B1B', marginBottom: '1rem' }}>No se pudo cargar el catálogo</h2>
        <p style={{ color: '#7F1D1D', marginBottom: '1.5rem' }}>{error}</p>
        <button onClick={() => window.location.reload()} className="btn-load-more" style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA', color: '#991B1B' }}>
          Reintentar conexión
        </button>
      </div>
    );
  }

  return (
    <div className="products-container">
      {/* Header */}
      <div className="products-header">
        <h1 className="products-title">Catálogo Protex</h1>
        <p className="products-subtitle">
          Equipamiento de seguridad industrial de la más alta calidad para tu empresa
        </p>
      </div>

      {/* Main Layout: Sidebar + Content */}
      <div className="catalog-layout">

        {/* Mobile Filter Toggle Button */}
        <button
          className="mobile-filter-trigger"
          onClick={() => setShowFilters(!showFilters)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
          Filtros {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
        </button>

        {/* Left Sidebar (Filters) - With mobile toggle support */}
        <aside className="catalog-sidebar" style={showFilters ? { display: 'block', position: 'fixed', inset: 0, zIndex: 50, padding: '2rem' } : undefined}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="sidebar-title" style={{ margin: 0, border: 'none' }}>Filtros</h2>
            {showFilters && (
              <button onClick={() => setShowFilters(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            )}
          </div>

          {/* Global Search inside Sidebar */}
          <div className="filter-section">
            <div className="filter-section-header">Buscar</div>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-search-input"
              />
            </form>
          </div>

          {/* Price Filter */}
          <div className="filter-section">
            <div className="filter-section-header">Precio</div>
            <div className="price-range-row">
              <input
                type="number"
                placeholder="Min €"
                value={localFilters.minPrice || ''}
                onChange={(e) => handleFilterChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
                className="price-input-small"
              />
              <span style={{ color: '#9CA3AF' }}>-</span>
              <input
                type="number"
                placeholder="Max €"
                value={localFilters.maxPrice || ''}
                onChange={(e) => handleFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                className="price-input-small"
              />
            </div>
          </div>

          {/* Families / Categories */}
          <div className="filter-section">
            <div className="filter-section-header">Familias</div>

            <ul className="filter-list">
              {['Protección Cabeza', 'Protección Manos', 'Alta Visibilidad', 'Calzado Seguridad'].map(cat => (
                <li key={cat}>
                  <label className="filter-checkbox-item">
                    <input
                      type="checkbox"
                      checked={filters.category === cat}
                      onChange={(e) => handleFilterChange({ category: e.target.checked ? cat : undefined })}
                    />
                    {cat}
                  </label>
                </li>
              ))}
              <li>
                <label className="filter-checkbox-item">
                  <input
                    type="checkbox"
                    checked={filters.category === undefined}
                    onChange={(e) => e.target.checked && handleFilterChange({ category: undefined })}
                  />
                  Ver todas
                </label>
              </li>
            </ul>
          </div>

          {/* Availability */}
          <div className="filter-section">
            <div className="filter-section-header">Disponibilidad</div>
            <ul className="filter-list">
              <li>
                <label className="filter-checkbox-item">
                  <input
                    type="checkbox"
                    checked={localFilters.inStock || false}
                    onChange={(e) => handleFilterChange({ inStock: e.target.checked })}
                  />
                  En stock (Recíbelo mañana)
                </label>
              </li>
            </ul>
          </div>

          <button onClick={handleClearFilters} className="btn-load-more" style={{ width: '100%', fontSize: '0.875rem', padding: '0.5rem', marginTop: '1rem' }}>
            Borrar filtros
          </button>
        </aside>

        {/* Right Content */}
        <main className="catalog-main">

          {/* Top Sort Bar */}
          <div className="sort-bar">
            <span className="sort-label">Ordenar por:</span>
            <button
              className={`sort-pill ${isSortActive('name', 'asc') ? 'active' : ''}`}
              onClick={() => { setLocalSort({ field: 'name', direction: 'asc' }); setSort({ field: 'name', direction: 'asc' }); }}
            >
              Relevancia
            </button>
            <button
              className={`sort-pill ${isSortActive('price', 'asc') ? 'active' : ''}`}
              onClick={() => { setLocalSort({ field: 'price', direction: 'asc' }); setSort({ field: 'price', direction: 'asc' }); }}
            >
              Precio más bajo
            </button>
            <button
              className={`sort-pill ${isSortActive('price', 'desc') ? 'active' : ''}`}
              onClick={() => { setLocalSort({ field: 'price', direction: 'desc' }); setSort({ field: 'price', direction: 'desc' }); }}
            >
              Precio más alto
            </button>
            <button
              className={`sort-pill ${isSortActive('createdAt', 'desc') ? 'active' : ''}`}
              onClick={() => { setLocalSort({ field: 'createdAt', direction: 'desc' }); setSort({ field: 'createdAt', direction: 'desc' }); }}
            >
              Novedades
            </button>
            <div style={{ marginLeft: 'auto', fontSize: '0.875rem', color: '#6B7280' }}>
              {products.length} artículos
            </div>
          </div>

          {/* Product Grid */}
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card" onClick={() => window.location.href = `/productos/${product.id}`} style={{ cursor: 'pointer' }}>
                {/* Simulated Discount Badge randomly for demo purposes or if stock is low for urgency */}
                {product.stock > 0 && product.stock < 5 && (
                  <div className="discount-badge">¡Últimas uds!</div>
                )}

                <div className="product-image-container">
                  {product.imageUrl && product.imageUrl.trim() !== '' ? (
                    <S3Image
                      s3Key={product.imageUrl}
                      alt={product.name}
                      className="product-image"
                    />
                  ) : (
                    <div className="product-image-placeholder">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E5E7EB" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                    </div>
                  )}
                </div>

                <div className="product-info">
                  <h3 className="product-name" title={product.name}>{product.name}</h3>

                  <div className="product-price-section">
                    <span className="price-current">{product.price.toFixed(2)}€</span>
                    {/* <span className="price-original">{(product.price * 1.2).toFixed(2)}€</span> Demo strikethrough */}
                  </div>

                  <div className="stock-status">
                    {product.stock > 0 ? (
                      'Recíbelo mañana'
                    ) : (
                      'Agotado temporalmente'
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {products.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>No se encontraron resultados</h3>
              <p style={{ color: '#6B7280' }}>Prueba ajustando los filtros de la barra lateral.</p>
            </div>
          )}


          {/* Load More */}
          {hasMore && products.length > 0 && (
            <div className="loading-more">
              <button
                onClick={(e) => { e.stopPropagation(); handleLoadMore(); }}
                disabled={loading}
                className="btn-load-more"
              >
                {loading ? 'Cargando...' : 'Ver más productos'}
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
export default ProductsPage;