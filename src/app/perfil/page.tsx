"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/store/useAuth";
import { userOperations } from "@/services/graphqlClient";
import { useRouter } from "next/navigation";
import { User, Package, MapPin, Loader2, Save, CreditCard } from "lucide-react";

export default function ProfilePage() {
  const { user, isGuest } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"data" | "orders">("data");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (isGuest || !user) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const userProfile = await userOperations.getUserProfile();
        setProfile(userProfile);
        
        const userOrders = await userOperations.listUserOrders();
        setOrders(userOrders || []);
      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isGuest, router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const input = {
        name: profile.name,
        shippingAddress: profile.shippingAddress,
        billingAddress: profile.billingAddress
      };
      const updated = await userOperations.updateUserProfile(input);
      setProfile({ ...profile, ...updated });
      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error guardando perfil:", error);
      alert("Hubo un error al guardar tu perfil.");
    } finally {
      setSaving(false);
    }
  };

  const updateAddress = (type: "shipping" | "billing", field: string, value: string) => {
    setProfile((prev: any) => ({
      ...prev,
      [`${type}Address`]: {
        ...(prev[`${type}Address`] || {}),
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Hero Card */}
        <section className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0 text-white transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <User className="w-12 h-12 sm:w-14 sm:h-14" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <span className="text-xs font-bold tracking-wider text-indigo-600 uppercase mb-2 block">Cuenta Protex Wear</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Mi Perfil</h1>
            <p className="text-base sm:text-lg text-gray-500 max-w-2xl leading-relaxed">
              Hola, <span className="font-semibold text-gray-700">{profile?.name || user?.email}</span>. Gestiona tus datos, direcciones y pedidos desde un solo lugar.
            </p>
          </div>
          
          <div className="flex gap-4 md:flex-col sm:gap-6 bg-gray-50 p-5 rounded-2xl border border-gray-100">
            <div>
              <span className="block text-xs font-semibold text-gray-400 uppercase mb-1">Usuario</span>
              <strong className="text-sm font-bold text-gray-900">{profile?.name || user?.email}</strong>
            </div>
            <div>
              <span className="block text-xs font-semibold text-gray-400 uppercase mb-1">Secciones</span>
              <strong className="text-sm font-bold text-gray-900">{activeTab === "data" ? "Datos Personales" : "Historial Pedidos"}</strong>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-gray-100 w-fit mx-auto md:mx-0">
          <button
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "data" 
              ? "bg-gray-900 text-white shadow-md" 
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("data")}
          >
            Mis Datos
          </button>
          <button
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "orders" 
              ? "bg-gray-900 text-white shadow-md" 
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            Mis Pedidos
          </button>
        </div>

        {/* Tab Content: Data */}
        {activeTab === "data" && (
          <form onSubmit={handleSaveProfile} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Info Básica */}
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Información Básica</h2>
                <p className="text-sm text-gray-500 mt-1">Datos que usas para identificar tu cuenta.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 block">Email (No modificable)</label>
                  <input
                    type="text"
                    value={profile?.email || ""}
                    disabled
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 text-sm font-medium cursor-not-allowed focus:outline-none"
                  />
                </div>
                {profile?.cif && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 block">CIF / NIF (Empresa)</label>
                    <input
                      type="text"
                      value={profile?.cif}
                      disabled
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 text-sm font-medium cursor-not-allowed focus:outline-none uppercase"
                    />
                  </div>
                )}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700 block">Nombre / Razón Social</label>
                  <input
                    type="text"
                    value={profile?.name || ""}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Dirección Envío */}
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <MapPin size={20} />
                </div>
                Dirección de Envío
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700 block">Calle y número</label>
                  <input
                    type="text"
                    value={profile?.shippingAddress?.street || ""}
                    onChange={(e) => updateAddress("shipping", "street", e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 block">Ciudad</label>
                  <input
                    type="text"
                    value={profile?.shippingAddress?.city || ""}
                    onChange={(e) => updateAddress("shipping", "city", e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 block">Código Postal</label>
                  <input
                    type="text"
                    value={profile?.shippingAddress?.postalCode || ""}
                    onChange={(e) => updateAddress("shipping", "postalCode", e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Datos Facturación */}
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <CreditCard size={20} />
                </div>
                Datos de Facturación
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700 block">Calle y número</label>
                  <input
                    type="text"
                    value={profile?.billingAddress?.street || ""}
                    onChange={(e) => updateAddress("billing", "street", e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 block">Ciudad</label>
                  <input
                    type="text"
                    value={profile?.billingAddress?.city || ""}
                    onChange={(e) => updateAddress("billing", "city", e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 block">Código Postal</label>
                  <input
                    type="text"
                    value={profile?.billingAddress?.postalCode || ""}
                    onChange={(e) => updateAddress("billing", "postalCode", e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
                  />
                </div>
              </div>
            </section>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                <span>Guardar Cambios</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab Content: Orders */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                  <Package size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">No tienes pedidos</h3>
                <p className="text-gray-500 max-w-sm">Todavía no has realizado ninguna compra con nosotros. ¡Explora nuestro catálogo!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID Pedido</th>
                      <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order: any) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-mono font-bold text-gray-900 text-sm bg-gray-100 px-2.5 py-1 rounded-md">
                            #{order.id.split("-").pop() || order.id}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500 font-medium">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-sm font-bold text-gray-900">
                          {order.totalAmount.toFixed(2)} €
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
