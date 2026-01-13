import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import IndustrialSpecifications from '../components/Product/IndustrialSpecifications';
import S3Image from '../components/UI/S3Image';
import { ShoppingCart, Heart, Box, ShieldCheck, Truck, CreditCard, FileText, Settings, Tag, ChevronDown } from 'lucide-react';
import '../styles/ProductDetail.css';

/**
 * Product Detail Page - Individual product view with full details
 */
function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const { product, loading, error, refreshProduct } = useProduct(id, { autoFetch: true });

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    description: true,
    specs: false,
    dimensions: false,
    tags: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // ... (handlers keep same logic, just ensuring they exist)
  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setAddingToCart(true);
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
      alert(`${quantity} unidad(es) de "${product.name}" añadidas al carrito`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Error al añadir al carrito');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const toggleWishlist = () => {
    setIsWishlist(!isWishlist);
  };

  if (loading) {
    return (
      <div className="pdp-container">
        <LoadingSpinner size="lg" text="Cargando producto..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pdp-container">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error || 'Producto no encontrado'}</p>
          <button onClick={() => navigate('/productos')} className="btn btn-primary mt-4">
            Volver al Catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pdp-container">
      {/* Breadcrumb */}
      <nav className="pdp-breadcrumb">
        <button onClick={() => navigate('/')}>Inicio</button>
        <span className="pdp-breadcrumb-separator">/</span>
        <button onClick={() => navigate('/productos')}>Productos</button>
        <span className="pdp-breadcrumb-separator">/</span>
        <span className="pdp-breadcrumb-current">{product.name}</span>
      </nav>

      <div className="pdp-main-grid">
        {/* Left Column: Gallery */}
        <div className="pdp-gallery">
          <div className="pdp-gallery-main">
            {product.imageUrls && product.imageUrls[selectedImage] ? (
              <S3Image
                s3Key={product.imageUrls[selectedImage]}
                alt={product.name}
              />
            ) : product.imageUrl ? (
              <S3Image
                s3Key={product.imageUrl}
                alt={product.name}
              />
            ) : (
              <div className="text-gray-400">
                <svg width="64" height="64" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.imageUrls && product.imageUrls.length > 1 && (
            <div className="pdp-gallery-thumbs">
              {product.imageUrls.map((imageUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`pdp-thumb-btn ${selectedImage === index ? 'active' : ''}`}
                >
                  <S3Image
                    s3Key={imageUrl}
                    alt={`${product.name} thumb ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Key Info & Actions */}
        <div className="pdp-info">

          <div className="pdp-header">
            <div className="pdp-meta-row">
              <span className="pdp-sku">REF: {product.sku}</span>
              {product.category && (
                <span className="pdp-category-badge">{product.category}</span>
              )}
            </div>

            <h1 className="pdp-title">{product.name}</h1>

            <div className="pdp-price-row">
              <span className="pdp-price">€{product.price.toFixed(2)}</span>
              {product.stock > 0 ? (
                <span className="pdp-stock-status in-stock">
                  <div className="pdp-stock-dot"></div> En Stock ({product.stock})
                </span>
              ) : (
                <span className="pdp-stock-status out-of-stock">
                  <div className="pdp-stock-dot"></div> Agotado
                </span>
              )}
            </div>
          </div>

          {/* Clean Action Card */}
          <div className="pdp-actions-card">
            <div className="pdp-action-row">
              <div className="pdp-qty-wrapper">
                <span className="pdp-qty-label">Cantidad</span>
                <div className="pdp-qty-controls">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="pdp-qty-btn"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    readOnly
                    className="pdp-qty-input"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="pdp-qty-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: '200px' }}>
                {/* Spacer or label could go here if needed, but flex handles it */}
                <span className="pdp-qty-label" style={{ visibility: 'hidden' }}>Acción</span>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || addingToCart}
                    className="pdp-add-btn"
                  >
                    {addingToCart ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span>Añadiendo...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={20} />
                        <span>Añadir al Carrito</span>
                      </>
                    )}
                  </button>
                  <button
                    className={`pdp-wishlist-btn ${isWishlist ? 'active' : ''}`}
                    title={isWishlist ? "Quitar de favoritos" : "Añadir a favoritos"}
                    onClick={toggleWishlist}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path
                        fill={isWishlist ? "#dc2626" : "none"}
                        stroke={isWishlist ? "none" : "#9ca3af"}
                        strokeWidth="2"
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pdp-trust-grid">
              <div className="pdp-trust-item">
                <Truck size={18} className="pdp-trust-icon" />
                <span>Envío Rápido 24/48h</span>
              </div>
              <div className="pdp-trust-item">
                <ShieldCheck size={18} className="pdp-trust-icon" />
                <span>Garantía de Calidad</span>
              </div>
              <div className="pdp-trust-item">
                <CreditCard size={18} className="pdp-trust-icon" />
                <span>Pago Seguro</span>
              </div>
            </div>
          </div>

          {/* Accordion Sections */}
          <div className="pdp-accordion">
            {/* Description */}
            <div className="pdp-accordion-item">
              <button
                className="pdp-accordion-header"
                onClick={() => toggleSection('description')}
                aria-expanded={expandedSections['description']}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FileText size={20} className="text-gray-400" />
                  <span>Descripción</span>
                </div>
                <ChevronDown
                  size={20}
                  className={`pdp-accordion-icon ${expandedSections['description'] ? 'open' : ''}`}
                />
              </button>
              {expandedSections['description'] && (
                <div className="pdp-accordion-content">
                  <p>{product.description}</p>
                </div>
              )}
            </div>

            {/* Specifications */}
            {product.specifications && (
              <div className="pdp-accordion-item">
                <button
                  className="pdp-accordion-header"
                  onClick={() => toggleSection('specs')}
                  aria-expanded={expandedSections['specs']}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Settings size={20} className="text-gray-400" />
                    <span>Especificaciones Técnicas</span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`pdp-accordion-icon ${expandedSections['specs'] ? 'open' : ''}`}
                  />
                </button>
                {expandedSections['specs'] && (
                  <div className="pdp-accordion-content">
                    <IndustrialSpecifications specifications={product.specifications} />
                  </div>
                )}
              </div>
            )}

            {/* Dimensions */}
            {(product.dimensions || product.weight) && (
              <div className="pdp-accordion-item">
                <button
                  className="pdp-accordion-header"
                  onClick={() => toggleSection('dimensions')}
                  aria-expanded={expandedSections['dimensions']}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Box size={20} className="text-gray-400" />
                    <span>Dimensiones y Peso</span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`pdp-accordion-icon ${expandedSections['dimensions'] ? 'open' : ''}`}
                  />
                </button>
                {expandedSections['dimensions'] && (
                  <div className="pdp-accordion-content">
                    <div className="pdp-specs-box">
                      <div className="pdp-dimensions-grid">
                        {product.dimensions && (
                          <>
                            <div className="pdp-dim-item">
                              <dt>Largo</dt>
                              <dd>{product.dimensions.length} {product.dimensions.unit}</dd>
                            </div>
                            <div className="pdp-dim-item">
                              <dt>Ancho</dt>
                              <dd>{product.dimensions.width} {product.dimensions.unit}</dd>
                            </div>
                            <div className="pdp-dim-item">
                              <dt>Alto</dt>
                              <dd>{product.dimensions.height} {product.dimensions.unit}</dd>
                            </div>
                          </>
                        )}
                        {product.weight && (
                          <div className="pdp-dim-item">
                            <dt>Peso</dt>
                            <dd>{product.weight} kg</dd>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="pdp-accordion-item">
                <button
                  className="pdp-accordion-header"
                  onClick={() => toggleSection('tags')}
                  aria-expanded={expandedSections['tags']}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Tag size={20} className="text-gray-400" />
                    <span>Etiquetas</span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`pdp-accordion-icon ${expandedSections['tags'] ? 'open' : ''}`}
                  />
                </button>
                {expandedSections['tags'] && (
                  <div className="pdp-accordion-content">
                    <div className="pdp-tags-container">
                      {product.tags.map(tag => (
                        <span key={tag} className="pdp-tag">#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;