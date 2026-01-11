import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { CheckoutButton } from '../CheckoutButton';

export function CartDrawer() {
    const { isCartOpen, closeCart, items, subtotal, removeItem, updateQuantity } = useCart();
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    // Handle Escape key to close
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeCart();
        };
        if (isCartOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isCartOpen, closeCart]);

    if (!isCartOpen) return null;

    const tax = subtotal * 0.21;
    const shipping = subtotal > 100 ? 0 : 9.99;
    const total = subtotal + tax + shipping;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={closeCart}
            />

            {/* Drawer Panel */}
            <div className="fixed inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md pointer-events-auto">
                    <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll animate-slide-in-right">

                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-6 sm:px-6 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Carrito de Compras</h2>
                            <button
                                type="button"
                                className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                                onClick={closeCart}
                            >
                                <span className="sr-only">Cerrar panel</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="text-gray-300 mb-4">
                                        <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <p className="text-lg font-medium text-gray-900">Tu carrito está vacío</p>
                                    <p className="mt-2 text-gray-500">¿No sabes qué comprar? ¡Tenemos miles de productos!</p>
                                    <button
                                        onClick={() => {
                                            closeCart();
                                            navigate('/productos');
                                        }}
                                        className="mt-6 text-blue-600 hover:text-blue-500 font-medium"
                                    >
                                        Continuar comprando &rarr;
                                    </button>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {items.map((item) => (
                                        <li key={item.productId} className="py-6 flex">
                                            <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                                <img
                                                    src={item.product.imageUrl || 'https://via.placeholder.com/150'}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-center object-cover"
                                                />
                                            </div>

                                            <div className="ml-4 flex-1 flex flex-col">
                                                <div>
                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                        <h3>
                                                            <a href={`/producto/${item.productId}`}>{item.product.name}</a>
                                                        </h3>
                                                        <p className="ml-4">€{item.totalPrice.toFixed(2)}</p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500">{item.product.sku}</p>
                                                </div>
                                                <div className="flex-1 flex items-end justify-between text-sm">
                                                    <div className="flex items-center border rounded-md">
                                                        <button
                                                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="px-2 text-gray-900">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                                            disabled={item.quantity >= item.product.stock}
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.productId)}
                                                        className="font-medium text-red-600 hover:text-red-500"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                                <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
                                    <p>Subtotal</p>
                                    <p>€{subtotal.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 mb-2">
                                    <p>Envío</p>
                                    <p>{shipping === 0 ? 'Gratis' : `€${shipping.toFixed(2)}`}</p>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-900 mt-4 mb-6">
                                    <p>Total</p>
                                    <p>€{total.toFixed(2)}</p>
                                </div>

                                <div className="mt-6">
                                    <button
                                        onClick={() => {
                                            closeCart();
                                            navigate('/checkout');
                                        }}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all transform hover:scale-[1.02]"
                                    >
                                        Tramitar Pedido
                                    </button>
                                </div>
                                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                                    <p>
                                        o{' '}
                                        <button
                                            type="button"
                                            className="text-blue-600 font-medium hover:text-blue-500"
                                            onClick={closeCart}
                                        >
                                            Continuar Comprando<span aria-hidden="true"> &rarr;</span>
                                        </button>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
