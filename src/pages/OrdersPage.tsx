import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Order, Address } from '../types';
import { Package, Search, Calendar, MapPin, CreditCard, ChevronRight, Clock, CheckCircle, Truck, XCircle, ShoppingBag } from 'lucide-react';
import '../styles/OrdersPage.css';

/**
 * Orders Page
 * Display user's order history with details and status
 */
function OrdersPage() {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Addresses
    const mockAddress: Address = {
        id: '1',
        firstName: user?.firstName || 'Usuario',
        lastName: user?.lastName || '',
        addressLine1: 'Calle Principal 123',
        city: 'Madrid',
        postalCode: '28001',
        country: 'España',
        phone: '+34 600 000 000',
        isDefault: true
    };

    // Mock Orders Data
    const mockOrders: Order[] = [
        {
            id: 'ORD-2024-001',
            userId: user?.id || '1',
            items: [
                { productId: '1', quantity: 2, unitPrice: 24.99, totalPrice: 49.98 },
                { productId: '2', quantity: 1, unitPrice: 15.50, totalPrice: 15.50 }
            ],
            total: 65.48,
            subtotal: 65.48,
            tax: 0,
            shippingCost: 0,
            status: 'DELIVERED',
            shippingAddress: mockAddress,
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-17T14:20:00Z'
        },
        {
            id: 'ORD-2024-045',
            userId: user?.id || '1',
            items: [
                { productId: '3', quantity: 1, unitPrice: 120.00, totalPrice: 120.00 }
            ],
            total: 120.00,
            subtotal: 120.00,
            tax: 0,
            shippingCost: 0,
            status: 'SHIPPED',
            shippingAddress: mockAddress,
            createdAt: '2024-02-01T09:15:00Z',
            updatedAt: '2024-02-02T11:00:00Z'
        },
        {
            id: 'ORD-2024-089',
            userId: user?.id || '1',
            items: [
                { productId: '5', quantity: 5, unitPrice: 9.99, totalPrice: 49.95 }
            ],
            total: 58.95, // + shipping
            subtotal: 49.95,
            tax: 0,
            shippingCost: 9.00,
            status: 'PROCESSING',
            shippingAddress: mockAddress,
            createdAt: '2024-02-10T16:45:00Z',
            updatedAt: '2024-02-10T16:45:00Z'
        }
    ];

    // Stats Calculation
    const totalOrders = mockOrders.length;
    const totalSpent = mockOrders.reduce((acc, order) => acc + order.total, 0);
    const pendingOrders = mockOrders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length;

    // Filter Orders
    const filteredOrders = mockOrders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'DELIVERED': return <CheckCircle className="w-4 h-4" />;
            case 'SHIPPED': return <Truck className="w-4 h-4" />;
            case 'PROCESSING': return <Clock className="w-4 h-4" />;
            case 'CANCELLED': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'Entregado';
            case 'SHIPPED': return 'Enviado';
            case 'PROCESSING': return 'En Proceso';
            case 'PENDING': return 'Pendiente';
            case 'CANCELLED': return 'Cancelado';
            default: return status;
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'delivered';
            case 'SHIPPED': return 'shipped';
            case 'PROCESSING': return 'processing';
            case 'PENDING': return 'pending';
            case 'CANCELLED': return 'cancelled';
            default: return 'pending';
        }
    };

    return (
        <div className="orders-page-container">
            <div className="orders-page-header">
                <h1 className="orders-page-title">Mis Pedidos</h1>
                <p className="orders-page-subtitle">Gestiona y realiza un seguimiento de tus compras recientes.</p>
            </div>

            {/* Stats Cards */}
            <div className="orders-stats-grid">
                <div className="stat-card">
                    <div className="stat-icon-wrapper stat-orders">
                        <ShoppingBag />
                    </div>
                    <div className="stat-info">
                        <h3>Total Pedidos</h3>
                        <p>{totalOrders}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper stat-spent">
                        <CreditCard />
                    </div>
                    <div className="stat-info">
                        <h3>Total Gastado</h3>
                        <p>€{totalSpent.toFixed(2)}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper stat-pending">
                        <Package />
                    </div>
                    <div className="stat-info">
                        <h3>En Camino</h3>
                        <p>{pendingOrders}</p>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="orders-filters">
                <div className="search-orders">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar por nº de pedido..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* Placeholder for future date filters or status dropdowns */}
            </div>

            {/* Orders List */}
            <div className="orders-list-container">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <div key={order.id} className="order-detail-card">
                            {/* Header */}
                            <div className="order-card-header">
                                <div className="header-column">
                                    <span className="header-label">Pedido Nº</span>
                                    <span className="header-value text-blue-600">{order.id}</span>
                                </div>
                                <div className="header-column">
                                    <span className="header-label">Fecha</span>
                                    <span className="header-value flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-gray-400" />
                                        {new Date(order.createdAt).toLocaleDateString('es-ES')}
                                    </span>
                                </div>
                                <div className="header-column">
                                    <span className="header-label">Total</span>
                                    <span className="header-value">€{order.total.toFixed(2)}</span>
                                </div>
                                <div className="header-column">
                                    <span className="header-label">Estado</span>
                                    <div>
                                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="order-card-body">
                                <div className="order-items-grid">
                                    <div className="items-list">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="order-item">
                                                <div className="item-image-box">
                                                    <ShoppingBag className="text-gray-400" />
                                                </div>
                                                <div className="item-info">
                                                    <h4>Producto ID: {item.productId}</h4> {/* In real app, name lookup needed */}
                                                    <p className="item-meta">
                                                        Cantidad: {item.quantity} × €{item.unitPrice.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="order-actions">
                                        <Link to={`/productos`} className="btn btn-outline w-full justify-center">
                                            Ver Producto
                                        </Link>
                                        {order.status === 'DELIVERED' && (
                                            <button className="btn btn-primary w-full justify-center">
                                                <Search className="w-4 h-4 mr-2" /> Comprar de nuevo
                                            </button>
                                        )}
                                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium text-center mt-2">
                                            Descargar Factura
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-orders">
                        <Package className="empty-icon w-20 h-20 mx-auto" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron pedidos</h3>
                        <p className="text-gray-500 mb-6">No tienes pedidos que coincidan con tu búsqueda.</p>
                        <Link to="/productos" className="btn btn-primary">
                            Ir a la Tienda
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrdersPage;
