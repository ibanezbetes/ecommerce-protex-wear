import React, { useState, useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';
import ProductForm from './ProductForm';
import type { Product } from '../../services/graphql';
import '../../styles/AdminProducts.css';

/**
 * Product Management Component for Admin Dashboard
 * Provides CRUD operations for products with real GraphQL integration
 * Now with advanced filters and sorting
 */
function ProductManagement() {
  const { user, isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');

  const {
    products,
    loading,
    error,
    hasMore,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
    loadMore,
    setFilters,
    setSort,
  } = useProducts({
    autoFetch: true,
    limit: 1000,
  });

  // Check if user is admin
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Acceso Denegado</h3>
        <p className="text-red-600">Solo los administradores pueden gestionar productos.</p>
      </div>
    );
  }

  // Apply filters and sorting
  useEffect(() => {
    const filters: any = {};

    if (categoryFilter) {
      filters.category = categoryFilter;
    }

    if (stockFilter === 'in-stock') {
      filters.inStock = true;
    }

    setFilters(filters);

    // Apply sorting
    const [field, direction] = sortBy.split('-');
    setSort({ field: field as any, direction: direction as 'asc' | 'desc' });
  }, [categoryFilter, stockFilter, sortBy, setFilters, setSort]);

  // Filter products client-side for additional filters
  const filteredProducts = products.filter(product => {
    // Stock filter
    if (stockFilter === 'low-stock' && (product.stock > 10 || product.stock <= 0)) return false;
    if (stockFilter === 'out-of-stock' && product.stock > 0) return false;

    // Status filter
    if (statusFilter === 'active' && !product.isActive) return false;
    if (statusFilter === 'inactive' && product.isActive) return false;

    return true;
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      await searchProducts(searchTerm.trim());
    } else {
      await refreshProducts();
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)) {
      return;
    }

    const success = await deleteProduct(product.id);
    if (success) {
      alert('Producto eliminado exitosamente');
    } else {
      alert('Error al eliminar el producto');
    }
  };

  const handleFormSubmit = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingProduct) {
        // Update existing product
        const updated = await updateProduct(editingProduct.id, productData);
        if (updated) {
          alert('Producto actualizado exitosamente');
          setShowForm(false);
          setEditingProduct(null);
        }
      } else {
        // Create new product
        const created = await createProduct(productData);
        if (created) {
          alert('Producto creado exitosamente');
          setShowForm(false);
        }
      }
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Error al guardar el producto');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (showForm) {
    return (
      <div>
        <div className="apm-header">
          <h2 className="apm-title">
            {editingProduct ? 'Editar Producto' : 'Crear Producto'}
          </h2>
          <button
            onClick={handleFormCancel}
            className="btn-modern btn-modern-outline"
          >
            Cancelar
          </button>
        </div>

        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="apm-header">
        <h2 className="apm-title">Gestión de Productos</h2>
        <button
          onClick={handleCreateProduct}
          className="btn-modern btn-modern-primary"
        >
          <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nuevo Producto
        </button>
      </div>

      {/* Search and Filters */}
      <div className="apm-search-card">
        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div className="apm-search-input-wrapper" style={{ flex: '1 1 300px' }}>
              <svg className="apm-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nombre, SKU o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="apm-search-input"
              />
            </div>
            <button type="submit" className="btn-modern btn-modern-primary" style={{ whiteSpace: 'nowrap' }}>
              Buscar
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
                setStockFilter('all');
                setStatusFilter('all');
                refreshProducts();
              }}
              className="btn-modern btn-modern-outline"
              style={{ whiteSpace: 'nowrap' }}
            >
              Limpiar
            </button>
          </div>
        </form>

        {/* Compact Filters Row */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              minWidth: '140px',
              flex: '1 1 auto',
              maxWidth: '200px'
            }}
          >
            <option value="">Todas las categorías</option>
            <option value="Vestuario">Vestuario</option>
            <option value="Protección Cabeza">Protección Cabeza</option>
            <option value="Protección Manos">Protección Manos</option>
            <option value="Calzado Seguridad">Calzado Seguridad</option>
            <option value="Alta Visibilidad">Alta Visibilidad</option>
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              minWidth: '130px',
              flex: '1 1 auto',
              maxWidth: '180px'
            }}
          >
            <option value="all">Todo el stock</option>
            <option value="in-stock">En Stock</option>
            <option value="low-stock">Stock Bajo</option>
            <option value="out-of-stock">Agotado</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              minWidth: '120px',
              flex: '1 1 auto',
              maxWidth: '150px'
            }}
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              minWidth: '150px',
              flex: '1 1 auto',
              maxWidth: '200px'
            }}
          >
            <option value="name-asc">Nombre (A-Z)</option>
            <option value="name-desc">Nombre (Z-A)</option>
            <option value="price-asc">Precio ↑</option>
            <option value="price-desc">Precio ↓</option>
            <option value="stock-asc">Stock ↑</option>
            <option value="stock-desc">Stock ↓</option>
            <option value="createdAt-desc">Más Recientes</option>
            <option value="createdAt-asc">Más Antiguos</option>
          </select>

          {/* Results Count */}
          <div style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginLeft: 'auto',
            whiteSpace: 'nowrap',
            padding: '0.5rem 0'
          }}>
            {filteredProducts.length} de {products.length} productos
          </div>
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
                onClick={() => refreshProducts()}
                className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="apm-table-container">
        {loading && products.length === 0 ? (
          <div className="p-8 text-center">
            <LoadingSpinner size="lg" text="Cargando productos..." />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg style={{ width: '4rem', height: '4rem', margin: '0 auto' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
            <p className="text-gray-600 mb-4">
              {products.length > 0 ? 'No se encontraron productos con los filtros aplicados' : 'Comienza creando tu primer producto'}
            </p>
            {products.length === 0 && (
              <button
                onClick={handleCreateProduct}
                className="btn-modern btn-modern-primary"
              >
                Crear Primer Producto
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="apm-table">
                <thead className="apm-main-thead">
                  <tr>
                    <th className="apm-th">Producto</th>
                    <th className="apm-th">SKU</th>
                    <th className="apm-th">Precio</th>
                    <th className="apm-th">Stock</th>
                    <th className="apm-th">Estado</th>
                    <th className="apm-th">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="apm-tr">
                      <td className="apm-td">
                        <div className="apm-product-cell">
                          <div className="apm-img-wrapper">
                            {product.imageUrl && product.imageUrl.trim() !== '' ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name || 'Producto'}
                                className="apm-product-img"
                                loading="lazy"
                              />
                            ) : (
                              <div className="apm-img-placeholder">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="apm-info-text">
                            <span className="apm-product-name">{product.name}</span>
                            <span className="apm-product-category">{product.category || 'Sin cat.'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="apm-td">
                        <span className="apm-sku-badge">{product.sku}</span>
                      </td>
                      <td className="apm-td">
                        <span className="apm-price">€{product.price.toFixed(2)}</span>
                      </td>
                      <td className="apm-td">
                        <span className={`apm-stock-badge ${product.stock > 10 ? 'apm-stock-high' : product.stock > 0 ? 'apm-stock-low' : 'apm-stock-out'
                          }`}>
                          <span className="apm-stock-dot"></span>
                          {product.stock > 0 ? `${product.stock} un.` : 'Agotado'}
                        </span>
                      </td>
                      <td className="apm-td">
                        <span className={`apm-status-badge ${product.isActive ? 'apm-status-active' : 'apm-status-inactive'}`}>
                          {product.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="apm-td">
                        <div className="apm-actions">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="apm-btn-icon"
                            title="Editar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product)}
                            className="apm-btn-icon delete"
                            title="Eliminar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="px-6 py-4 border-t border-gray-200 text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="btn-modern btn-modern-outline"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Cargando...</span>
                    </div>
                  ) : (
                    'Cargar Más'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProductManagement;