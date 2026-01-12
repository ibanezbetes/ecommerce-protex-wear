import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Address, Order } from '../types';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

import { OrderStatusTimeline } from '../components/Orders/OrderStatusTimeline';
import { generateInvoice } from '../utils/InvoiceGenerator';

const client = generateClient<Schema>();

/**
 * Profile Page - User profile management and order history
 */
function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'preferences'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Fetch Orders
  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      setLoadingOrders(true);
      try {
        // If owner auth is set up correctly, list() will return user's orders
        const { data: items, errors } = await client.models.Order.list({
          authMode: 'userPool'
        });

        if (errors) console.error(errors);

        // Sort by date desc
        const sorted = (items || []).sort((a, b) =>
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        );
        setOrders(sorted);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    }

    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [user, activeTab]);

  const [profileData, setProfileData] = useState<Partial<User>>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    company: user?.company || '',
    phone: user?.phone || '',
  });

  // Mock Addresses for now (can be Phase 4.1)
  const mockAddresses: Address[] = [
    {
      id: '1',
      firstName: user?.firstName || 'Usuario',
      lastName: user?.lastName || '',
      addressLine1: 'Dirección predeterminada',
      city: 'Madrid',
      postalCode: '28001',
      country: 'ES',
      phone: user?.phone,
      isDefault: true,
    }
  ];

  const handleProfileChange = (field: keyof User, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement profile update with Cognito attrs
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      await refreshUser();
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: string | null | undefined) => {
    switch (status) {
      case 'DELIVERED': return 'text-green-600 bg-green-50';
      case 'SHIPPED': return 'text-blue-600 bg-blue-50';
      case 'PROCESSING': return 'text-yellow-600 bg-yellow-50';
      case 'PENDING': return 'text-gray-600 bg-gray-50';
      case 'PAID': return 'text-green-600 bg-green-50'; // Paid is good
      case 'CANCELLED': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string | null | undefined) => {
    switch (status) {
      case 'DELIVERED': return 'Entregado';
      case 'SHIPPED': return 'Enviado';
      case 'PROCESSING': return 'Procesando';
      case 'PENDING': return 'Pendiente de Pago';
      case 'PAID': return 'Pagado / Confirmado';
      case 'CANCELLED': return 'Cancelado';
      default: return status || 'Desconocido';
    }
  };

  const parseItems = (itemsJson: any) => {
    try {
      if (typeof itemsJson === 'string') return JSON.parse(itemsJson);
      return itemsJson || [];
    } catch { return []; }
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: '👤' },
    { id: 'addresses', label: 'Direcciones', icon: '📍' },
    { id: 'orders', label: 'Pedidos', icon: '📦' },
    { id: 'preferences', label: 'Preferencias', icon: '⚙️' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4 mt-4 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-blue-600">
                {user?.firstName?.[0] || 'U'}
              </div>
              <h3 className="font-semibold">{user?.firstName} {user?.lastName}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border min-h-[400px]">

              {/* Profile */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6">Información Personal</h2>
                  {/* ... (Existing Profile Edit Logic) ... */}
                  <div className="p-4 bg-gray-50 rounded text-gray-500 text-center">
                    Funcionalidad de edición de perfil en desarrollo.
                  </div>
                </div>
              )}

              {/* Addresses */}
              {activeTab === 'addresses' && (
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6">Direcciones</h2>
                  <div className="space-y-4">
                    {mockAddresses.map((address) => (
                      <div key={address.id} className="border p-4 rounded-lg">
                        <p className="font-bold">{address.firstName} {address.lastName} {address.isDefault && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded ml-2">Default</span>}</p>
                        <p className="text-gray-600">{address.addressLine1}</p>
                        <p className="text-gray-600">{address.city}, {address.postalCode}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ORDERS (REAL DATA) */}
              {activeTab === 'orders' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Historial de Pedidos</h2>

                  {loadingOrders ? (
                    <div className="flex justify-center py-12"><LoadingSpinner /></div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const parsedItems = parseItems(order.items);

                        return (
                          <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">

                            {/* ... inside component ... */}

                            <div className="mb-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="font-medium text-gray-900">Pedido #{order.id.split('-')[0]}...</h3>
                                  <p className="text-sm text-gray-600">
                                    {new Date(order.createdAt).toLocaleDateString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                                <span className="font-bold text-lg">€{order.totalAmount?.toFixed(2)}</span>
                              </div>

                              {/* Visual Timeline */}
                              <OrderStatusTimeline
                                status={order.paymentStatus === 'PAID' && order.status === 'PENDING' ? 'CONFIRMED' : (order.status || 'PENDING')}
                                dates={{
                                  createdAt: order.createdAt,
                                }}
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm bg-gray-50 p-3 rounded">
                              <div>
                                <p className="text-gray-500">Total:</p>
                                <p className="font-semibold text-lg">€{order.totalAmount?.toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Productos:</p>
                                <p>{parsedItems.length} artículo(s)</p>
                              </div>
                              <div className="text-right">
                                <button
                                  onClick={() => generateInvoice(order)}
                                  className="text-blue-600 hover:underline flex items-center gap-1 ml-auto"
                                >
                                  📄 Descargar Factura
                                </button>
                              </div>
                            </div>

                            <div className="mt-3">
                              {parsedItems.map((item: any, idx: number) => (
                                <div key={idx} className="text-xs text-gray-500 flex justify-between">
                                  <span>{item.quantity}x {item.name || item.product?.name}</span>
                                </div>
                              ))}
                            </div>

                            {/* Tracking Info Section */}
                            {(order.trackingNumber || order.trackingUrl) && (
                              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-blue-50/50 p-3 rounded-md">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl">🚚</span>
                                  <div>
                                    <p className="text-sm font-bold text-gray-800">{order.carrier || 'Transportista'}</p>
                                    <p className="text-xs text-gray-500 font-mono tracking-wide">{order.trackingNumber}</p>
                                  </div>
                                </div>

                                {order.trackingUrl && (
                                  <a
                                    href={order.trackingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm bg-white border border-gray-200 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors font-medium flex items-center shadow-sm"
                                  >
                                    Rastrear Pedido
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {orders.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <p>No has realizado ningún pedido todavía.</p>
                          <div className="flex flex-col gap-3 justify-center mt-4">
                            <button onClick={() => window.location.href = '/productos'} className="text-blue-600 underline">Ir a la tienda</button>
                            <button
                              onClick={() => setOrders([{
                                id: 'DEMO-123456',
                                createdAt: new Date().toISOString(),
                                totalAmount: 145.50,
                                subtotal: 120.00,
                                shippingCost: 5.99,
                                taxAmount: 19.51,
                                status: 'SHIPPED',
                                paymentStatus: 'PAID',
                                items: JSON.stringify([
                                  { name: 'Casco de Seguridad', quantity: 2, price: 45.00 },
                                  { name: 'Chaleco Reflectante', quantity: 1, price: 30.00 }
                                ]),
                                shippingAddress: JSON.stringify({
                                  firstName: 'Usuario',
                                  lastName: 'Demo',
                                  addressLine1: 'Calle de Prueba 123',
                                  city: 'Madrid',
                                  postalCode: '28001',
                                  country: 'ES'
                                }),
                                carrier: 'SEUR',
                                trackingNumber: 'SU123456789ES',
                                trackingUrl: 'https://www.seur.com'
                              }])}
                              className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition"
                            >
                              👁️ Ver Pedido de Ejemplo (Demo)
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Preferences */}
              {activeTab === 'preferences' && (
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6">Preferencias</h2>
                  <p className="text-gray-500">Configuración de notificaciones próximamente.</p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;