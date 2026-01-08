import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Address, Order } from '../types';
import LoadingSpinner from '../components/UI/LoadingSpinner';

/**
 * Profile Page - User profile management and order history
 */
function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'preferences'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profileData, setProfileData] = useState<Partial<User>>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    company: user?.company || '',
    phone: user?.phone || '',
  });

  // Mock data
  const mockAddresses: Address[] = [
    {
      id: '1',
      firstName: 'Juan',
      lastName: 'Pérez',
      company: 'Construcciones ABC',
      addressLine1: 'Calle Mayor 123, 2º A',
      city: 'Madrid',
      postalCode: '28001',
      country: 'ES',
      phone: '+34 600 123 456',
      isDefault: true,
    },
  ];

  const mockOrders: Order[] = [
    {
      id: 'ORD-001',
      userId: user?.id || '',
      items: [
        {
          productId: '1',
          quantity: 2,
          unitPrice: 45.99,
          totalPrice: 91.98,
        },
      ],
      status: 'DELIVERED',
      subtotal: 91.98,
      shippingCost: 9.99,
      tax: 19.31,
      total: 121.28,
      shippingAddress: mockAddresses[0],
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:45:00Z',
    },
  ];

  const handleProfileChange = (field: keyof User, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement profile update API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Profile updated:', profileData);
      setIsEditing(false);
      await refreshUser();
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'text-green-600 bg-green-50';
      case 'SHIPPED': return 'text-blue-600 bg-blue-50';
      case 'PROCESSING': return 'text-yellow-600 bg-yellow-50';
      case 'PENDING': return 'text-gray-600 bg-gray-50';
      case 'CANCELLED': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'Entregado';
      case 'SHIPPED': return 'Enviado';
      case 'PROCESSING': return 'Procesando';
      case 'PENDING': return 'Pendiente';
      case 'CANCELLED': return 'Cancelado';
      default: return status;
    }
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
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* User Info Card */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mt-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary-600">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
                {user?.company && (
                  <p className="text-sm text-gray-500 mt-1">{user.company}</p>
                )}
                <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                  user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {user?.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="btn btn-outline"
                      >
                        Editar
                      </button>
                    ) : (
                      <div className="space-x-2">
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setProfileData({
                              firstName: user?.firstName || '',
                              lastName: user?.lastName || '',
                              email: user?.email || '',
                              company: user?.company || '',
                              phone: user?.phone || '',
                            });
                          }}
                          className="btn btn-outline"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          className="btn btn-primary"
                        >
                          {isSaving ? <LoadingSpinner size="sm" /> : 'Guardar'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.firstName || ''}
                          onChange={(e) => handleProfileChange('firstName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{user?.firstName || 'No especificado'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apellidos
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.lastName || ''}
                          onChange={(e) => handleProfileChange('lastName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{user?.lastName || 'No especificado'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correo Electrónico
                      </label>
                      <p className="text-gray-900">{user?.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Para cambiar el email, contacta con soporte
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileData.phone || ''}
                          onChange={(e) => handleProfileChange('phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{user?.phone || 'No especificado'}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Empresa
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.company || ''}
                          onChange={(e) => handleProfileChange('company', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{user?.company || 'No especificado'}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Direcciones</h2>
                    <button className="btn btn-primary">
                      Añadir Dirección
                    </button>
                  </div>

                  <div className="space-y-4">
                    {mockAddresses.map((address) => (
                      <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center mb-2">
                              <h3 className="font-medium text-gray-900">
                                {address.firstName} {address.lastName}
                              </h3>
                              {address.isDefault && (
                                <span className="ml-2 px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded">
                                  Por defecto
                                </span>
                              )}
                            </div>
                            {address.company && (
                              <p className="text-gray-600">{address.company}</p>
                            )}
                            <p className="text-gray-600">{address.addressLine1}</p>
                            <p className="text-gray-600">
                              {address.city}, {address.postalCode}
                            </p>
                            <p className="text-gray-600">{address.country}</p>
                            {address.phone && (
                              <p className="text-gray-600">{address.phone}</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-primary-600 hover:text-primary-700 text-sm">
                              Editar
                            </button>
                            <button className="text-red-600 hover:text-red-700 text-sm">
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Historial de Pedidos</h2>

                  <div className="space-y-4">
                    {mockOrders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium text-gray-900">Pedido #{order.id}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Total:</p>
                            <p className="font-semibold">€{order.total.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Productos:</p>
                            <p>{order.items.length} artículo(s)</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Envío:</p>
                            <p>€{order.shippingCost.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end space-x-2">
                          <button className="btn btn-outline btn-sm">
                            Ver Detalles
                          </button>
                          {order.status === 'DELIVERED' && (
                            <button className="btn btn-primary btn-sm">
                              Reordenar
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {mockOrders.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">No tienes pedidos aún</p>
                      <button
                        onClick={() => window.location.href = '/productos'}
                        className="btn btn-primary"
                      >
                        Explorar Productos
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferencias</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Notificaciones</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-3" />
                          <span>Notificaciones por email</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-3" />
                          <span>Actualizaciones de pedidos</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-3" />
                          <span>Ofertas y promociones</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Idioma y Región</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Idioma
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                            <option value="es">Español</option>
                            <option value="en">English</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Moneda
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                            <option value="EUR">EUR (€)</option>
                            <option value="USD">USD ($)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button className="btn btn-primary">
                        Guardar Preferencias
                      </button>
                    </div>
                  </div>
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