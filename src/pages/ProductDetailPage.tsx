import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';

/**
 * Product Detail Page - Individual product view with full details
 * Now connected to real GraphQL API
 */
function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const { product, loading, error, refreshProduct } = useProduct(id, { autoFetch: true });
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      setAddingToCart(true);
      
      // Convert GraphQL Product to frontend Product type
      const frontendProduct = {
        id: product.id,
        sku: product.sku,
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl || undefined,
        imageUrls: product.imageUrls || undefined,
        category: product.category || undefined,
        tags: product.tags || undefined,
        specifications: product.specifications as Record<string, any> || undefined,
        dimensions: product.dimensions as any || undefined,
        weight: product.weight || undefined,
        isActive: product.isActive,
        createdAt: product.createdAt || new Date().toISOString(),
        updatedAt: product.updatedAt || new Date().toISOString(),
      };
      
      addItem(frontendProduct, quantity);
      
      // Show success message
      alert(`${quantity} unidad(es) de "${product.name}" añadidas al carrito`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Error al añadir al carrito. Por favor, inténtalo de nuevo.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner size="lg" text="Cargando producto..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error || 'Producto no encontrado'}</p>
          <div className="mt-4 space-x-2">
            <button 
              onClick={() => refreshProduct()} 
              className="btn btn-outline"
            >
              Reintentar
            </button>
            <button 
              onClick={() => navigate('/productos')} 
              className="btn btn-primary"
            >
              Volver al Catálogo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <button onClick={() => navigate('/')} className="hover:text-primary-600">
              Inicio
            </button>
          </li>
          <li>/</li>
          <li>
            <button onClick={() => navigate('/productos')} className="hover:text-primary-600">
              Productos
            </button>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            {product.imageUrls && product.imageUrls[selectedImage] ? (
              <img
                src={product.imageUrls[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.imageUrls && product.imageUrls.length > 1 && (
            <div className="flex space-x-2">
              {product.imageUrls.map((imageUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={imageUrl}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500 font-medium">{product.sku}</span>
              {product.category && (
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  {product.category}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-primary-600">
                €{product.price.toFixed(2)}
              </span>
              <span className={`text-lg font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
            <div className="text-gray-700 whitespace-pre-line">
              {product.description}
            </div>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Etiquetas</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <label className="text-sm font-medium text-gray-700">Cantidad:</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  min="1"
                  max={product.stock}
                  className="w-16 px-3 py-2 text-center border-0 focus:ring-0"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                className="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Añadiendo...</span>
                  </div>
                ) : (
                  'Añadir al Carrito'
                )}
              </button>
              <button className="btn btn-outline">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Favoritos
              </button>
            </div>
          </div>

          {/* Specifications */}
          {product.specifications && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Especificaciones Técnicas</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <dl className="grid grid-cols-1 gap-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                      <dt className="font-medium text-gray-700">{key}:</dt>
                      <dd className="text-gray-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}

          {/* Dimensions and Weight */}
          {(product.dimensions || product.weight) && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Dimensiones y Peso</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <dl className="grid grid-cols-1 gap-3">
                  {product.dimensions && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <dt className="font-medium text-gray-700">Dimensiones:</dt>
                      <dd className="text-gray-900">
                        {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} {product.dimensions.unit}
                      </dd>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex justify-between py-2">
                      <dt className="font-medium text-gray-700">Peso:</dt>
                      <dd className="text-gray-900">{product.weight} kg</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;