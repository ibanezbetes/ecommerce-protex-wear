import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/CartPage.css';

/**
 * Cart Page - Shopping cart with items management
 * TODO: Integrate with CartContext when implemented
 */
function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Mock cart data - TODO: Replace with CartContext
  const mockCartItems = [
    {
      id: '1',
      productId: '1',
      product: {
        id: '1',
        sku: 'EPP-001',
        name: 'Casco de Seguridad Industrial',
        price: 45.99,
        imageUrl: '/images/products/casco-seguridad.jpg',
        stock: 150,
      },
      quantity: 2,
      unitPrice: 45.99,
      totalPrice: 91.98,
    },
    {
      id: '2',
      productId: '2',
      product: {
        id: '2',
        sku: 'EPP-002',
        name: 'Guantes de Trabajo Anticorte',
        price: 12.50,
        imageUrl: '/images/products/guantes-anticorte.jpg',
        stock: 300,
      },
      quantity: 5,
      unitPrice: 12.50,
      totalPrice: 62.50,
    },
  ];

  const subtotal = mockCartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * 0.21; // 21% IVA
  const shipping = subtotal > 100 ? 0 : 9.99; // Free shipping over €100
  const total = subtotal + tax + shipping;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    // TODO: Implement quantity update
    console.log(`Update item ${itemId} to quantity ${newQuantity}`);
  };

  const handleRemoveItem = (itemId: string) => {
    // TODO: Implement item removal
    console.log(`Remove item ${itemId}`);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (mockCartItems.length === 0) {
    return (
      <div className="cart-page-container">
        <div className="cart-empty-state">
          <svg className="cart-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
          <h2 className="cart-empty-title">Tu carrito está vacío</h2>
          <p className="cart-empty-text">
            Explora nuestro catálogo y añade productos a tu carrito
          </p>
          <button
            onClick={() => navigate('/productos')}
            className="cart-continue-btn"
          >
            Ver Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <h1 className="cart-title">Carrito de Compras</h1>

      <div className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items-section">
          <div className="cart-items-card">
            <div className="cart-items-header">
              <h2 className="cart-items-count">
                Productos ({mockCartItems.length})
              </h2>
            </div>

            <div className="cart-item-list">
              {mockCartItems.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <div className="cart-item-content">
                    {/* Product Image */}
                    <div className="cart-item-image-wrapper">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="cart-item-image"
                        />
                      ) : (
                        <div className="cart-item-placeholder">
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="cart-item-details">
                      <div className="cart-item-header">
                        <div className="cart-item-info">
                          <h3 className="cart-item-name">
                            {item.product.name}
                          </h3>
                          <p className="cart-item-sku">SKU: {item.product.sku}</p>
                          <p className="cart-item-price-unit">
                            €{item.unitPrice.toFixed(2)} c/u
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="cart-item-remove-btn"
                          title="Eliminar producto"
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Quantity & Total */}
                      <div className="cart-item-footer">
                        <div className="cart-quantity-wrapper">
                          <span className="cart-quantity-label">Cant:</span>
                          <div className="cart-quantity-controls">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="cart-quantity-btn"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                              min="1"
                              max={item.product.stock}
                              className="cart-quantity-input"
                            />
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="cart-quantity-btn"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="cart-item-total">
                          €{item.totalPrice.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate('/productos')}
            className="cart-back-link"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Continuar Comprando
          </button>
        </div>

        {/* Order Summary */}
        <div className="cart-summary-section">
          <div className="cart-summary-card">
            <h2 className="cart-summary-title">Resumen del Pedido</h2>

            <div className="space-y-4">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span className="cart-summary-value">€{subtotal.toFixed(2)}</span>
              </div>

              <div className="cart-summary-row">
                <span>IVA (21%)</span>
                <span className="cart-summary-value">€{tax.toFixed(2)}</span>
              </div>

              <div className="cart-summary-row">
                <span>Envío</span>
                <span className="cart-summary-value">
                  {shipping === 0 ? (
                    <span className="cart-summary-free-shipping">Gratis</span>
                  ) : (
                    `€${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              {subtotal < 100 && (
                <div className="cart-shipping-notice">
                  <p className="font-medium mb-1">¡Envío gratis desde €100!</p>
                  <p>Te faltan €{(100 - subtotal).toFixed(2)} para envío gratuito.</p>
                </div>
              )}

              <div className="cart-summary-total">
                <span className="cart-total-label">Total</span>
                <span className="cart-total-value">€{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="cart-checkout-btn"
            >
              {isAuthenticated ? 'Tramitar Pedido' : 'Iniciar Sesión para Comprar'}
            </button>

            {/* Security Info */}
            <div className="cart-security-info">
              <div className="cart-secure-badge">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Pago 100% Seguro</span>
              </div>
              <p>Tus datos están protegidos con encriptación SSL de 256-bits.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;