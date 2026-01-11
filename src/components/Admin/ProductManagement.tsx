import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';
import ProductForm from './ProductForm';
import type { Product } from '../../services/graphql';
import '../../styles/AdminProducts.css';

/**
 * Product Management Component for Admin Dashboard
 * Provides CRUD operations for products with real GraphQL integration
 */
function ProductManagement() {
  const { user, isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
  } = useProducts({
    autoFetch: true,
    limit: 10,
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
        <div className="admin-products-header">
          <h2 className="admin-products-title">
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
      <div className="admin-products-header">
        <h2 className="admin-products-title">Gestión de Productos</h2>
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
      <div className="admin-products-search-card">
        <form onSubmit={handleSearch} style={{ display: 'contents' }}>
          <div className="admin-search-input-wrapper">
            <svg className="admin-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre, SKU o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
          </div>
          <button
            type="submit"
            className="btn-modern btn-modern-primary"
          >
            Buscar
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              refreshProducts();
            }}
            className="btn-modern btn-modern-outline"
          >
            Limpiar
          </button>
        </form>
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
      <div className="admin-table-container">
        {loading && products.length === 0 ? (
          <div className="p-8 text-center">
            <LoadingSpinner size="lg" text="Cargando productos..." />
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg style={{ width: '4rem', height: '4rem', margin: '0 auto' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
            <p className="text-gray-600 mb-4">Comienza creando tu primer producto</p>
            <button
              onClick={handleCreateProduct}
              className="btn-modern btn-modern-primary"
            >
              Crear Primer Producto
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>SKU</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="product-cell">
                          <div className="product-image-wrapper">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="product-image"
                              />
                            ) : (
                              <div className="product-image-placeholder">
                                <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="product-info-text">
                            <span className="product-name">{product.name}</span>
                            <span className="product-category">{product.category || 'Sin cat.'}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="sku-text">{product.sku}</span>
                      </td>
                      <td>
                        <span className="price-text">€{product.price.toFixed(2)}</span>
                      </td>
                      <td>
                        <span className={`stock-badge ${product.stock > 10 ? 'stock-high' : product.stock > 0 ? 'stock-low' : 'stock-out'
                          }`}>
                          <span className="stock-dot"></span>
                          {product.stock > 0 ? `${product.stock} un.` : 'Agotado'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${product.isActive ? 'status-active' : 'status-inactive'}`}>
                          {product.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="btn-icon"
                            title="Editar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style={{ display: 'block' }}>
                              <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product)}
                            className="btn-icon delete"
                            title="Eliminar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style={{ display: 'block' }}>
                              <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
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