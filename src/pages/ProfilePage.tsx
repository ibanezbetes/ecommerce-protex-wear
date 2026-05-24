import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User as UserType, Address, Order } from '../types';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { User, MapPin, Package, Settings, Edit2, Trash2, ChevronRight, LogOut, Phone, Mail, Building } from 'lucide-react';
import '../styles/ProfilePage.css';

/**
 * Profile Page - User profile management and order history
 */
function ProfilePage() {
  const { user, refreshUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders' | 'preferences'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profileData, setProfileData] = useState<Partial<UserType>>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    company: user?.company || '',
    phone: user?.phone || '',
  });

  // Mock data - In a real app, fetch this from API
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

  const handleProfileChange = (field: keyof UserType, value: string) => {
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
    { id: 'profile', label: 'Mi Perfil', icon: User },
    { id: 'addresses', label: 'Direcciones', icon: MapPin },
    { id: 'orders', label: 'Mis Pedidos', icon: Package },
    { id: 'preferences', label: 'Preferencias', icon: Settings },
  ];

  return (
    <div className="profile-container">
      <h1 className="profile-header-title">Mi Cuenta</h1>

      <div className="profile-content-grid">
        {/* Sidebar */}
        <div className="profile-sidebar">
          {/* User Info Card */}
          <div className="user-info-card">
            <div className="user-avatar-large">
              {user?.firstName?.[0] || user?.email?.[0] || 'U'}
            </div>
            <h3 className="user-name-display">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Usuario'}
            </h3>
            <p className="user-email-display">{user?.email}</p>
            <span className={`user-role-badge ${user?.role === 'ADMIN' ? 'role-admin' : 'role-client'}`}>
              {user?.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
            </span>
          </div>

          {/* Navigation */}
          <div className="profile-nav-card">
            <nav className="profile-nav-list">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`profile-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    <Icon className="profile-nav-icon" />
                    {tab.label}
                  </button>
                );
              })}
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={logout}
                className="profile-nav-item text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="profile-nav-icon" />
                Cerrar Sesión
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-main-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <>
              <div className="content-header">
                <h2 className="content-title">Información Personal</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-outline btn-sm"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setProfileData({ ...user });
                      }}
                      className="btn btn-outline btn-sm"
                      disabled={isSaving}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="btn btn-primary btn-sm"
                    >
                      {isSaving ? <LoadingSpinner size="sm" /> : 'Guardar Cambios'}
                    </button>
                  </div>
                )}
              </div>

              <div className="content-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Nombre</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.firstName || ''}
                        onChange={(e) => handleProfileChange('firstName', e.target.value)}
                        className="form-input"
                        placeholder="Tu nombre"
                      />
                    ) : (
                      <div className="info-value flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        {user?.firstName || 'No especificado'}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Apellidos</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.lastName || ''}
                        onChange={(e) => handleProfileChange('lastName', e.target.value)}
                        className="form-input"
                        placeholder="Tus apellidos"
                      />
                    ) : (
                      <div className="info-value">
                        {user?.lastName || 'No especificado'}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Correo Electrónico</label>
                    <div className="info-value flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {user?.email}
                    </div>
                    {isEditing && (
                      <p className="info-note">El email no se puede cambiar.</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Teléfono</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone || ''}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        className="form-input"
                        placeholder="+34 600..."
                      />
                    ) : (
                      <div className="info-value flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {user?.phone || 'No especificado'}
                      </div>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Empresa</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.company || ''}
                        onChange={(e) => handleProfileChange('company', e.target.value)}
                        className="form-input"
                        placeholder="Nombre de tu empresa"
                      />
                    ) : (
                      <div className="info-value flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        {user?.company || 'No especificado'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <>
              <div className="content-header">
                <h2 className="content-title">Mis Direcciones</h2>
                <button className="btn btn-primary btn-sm">
                  + Nueva Dirección
                </button>
              </div>

              <div className="content-body">
                <div className="grid grid-cols-1 gap-4">
                  {mockAddresses.map((address) => (
                    <div key={address.id} className="address-card">
                      <div className="address-header">
                        <div className="address-name">
                          {address.firstName} {address.lastName}
                          {address.isDefault && <span className="default-badge">Principal</span>}
                        </div>
                      </div>
                      <div className="address-details">
                        {address.company && <p className="font-medium text-gray-700">{address.company}</p>}
                        <p>{address.addressLine1}</p>
                        <p>{address.city}, {address.postalCode}</p>
                        <p>{address.country}</p>
                        {address.phone && <p className="flex items-center gap-2 mt-1 text-sm"><Phone className="w-3 h-3" /> {address.phone}</p>}
                      </div>
                      <div className="address-actions">
                        <button className="action-link edit flex items-center gap-1">
                          <Edit2 className="w-3 h-3" /> Editar
                        </button>
                        <button className="action-link delete flex items-center gap-1">
                          <Trash2 className="w-3 h-3" /> Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <>
              <div className="content-header">
                <h2 className="content-title">Historial de Pedidos</h2>
              </div>
              <div className="content-body">
                {mockOrders.length > 0 ? (
                  mockOrders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div>
                          <p className="order-id">Pedido #{order.id}</p>
                          <p className="order-date">
                            Realizado el {new Date(order.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                        <span className={`order-status ${getStatusClass(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>

                      <div className="order-summary">
                        <div className="summary-item">
                          <span className="label">Total</span>
                          <span className="value">€{order.total.toFixed(2)}</span>
                        </div>
                        <div className="summary-item">
                          <span className="label">Artículos</span>
                          <span className="value">{order.items.length}</span>
                        </div>
                        <div className="summary-item">
                          <span className="label">Envío a</span>
                          <span className="value truncate block max-w-[150px]">{order.shippingAddress.city}</span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 mt-3">
                        <button className="btn btn-outline btn-sm">
                          Ver Detalles
                        </button>
                        {order.status === 'DELIVERED' && (
                          <button className="btn btn-primary btn-sm">
                            <Package className="w-4 h-4 mr-1" /> Reordenar
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900">No tienes pedidos aún</p>
                    <p className="text-sm text-gray-500 mb-6">¿Por qué no echas un vistazo a nuestro catálogo?</p>
                    <button
                      onClick={() => window.location.href = '/productos'}
                      className="btn btn-primary"
                    >
                      Explorar Productos
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <>
              <div className="content-header">
                <h2 className="content-title">Preferencias de Cuenta</h2>
              </div>
              <div className="content-body">
                <div className="preference-section">
                  <h3 className="preference-title">Notificaciones</h3>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input type="checkbox" defaultChecked />
                      Recibir correos sobre el estado de mis pedidos
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" defaultChecked />
                      Suscribirse a la newsletter de ofertas y novedades
                    </label>
                  </div>
                </div>

                <div className="preference-section">
                  <h3 className="preference-title">Configuración Regional</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Idioma</label>
                      <select className="form-select">
                        <option value="es">Español (España)</option>
                        <option value="en">English (US)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Moneda</label>
                      <select className="form-select">
                        <option value="EUR">Euro (€)</option>
                        <option value="USD">US Dollar ($)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button className="btn btn-primary">
                    Guardar Preferencias
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;