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
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <User className="w-8 h-8 text-indigo-600" />
          Mi Perfil
        </h1>
        <p className="text-gray-500 mt-2">
          Hola, {profile?.name || user?.email}. Gestiona tus datos y consulta tus compras.
        </p>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
        <button
          className={`pb-4 px-6 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "data"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("data")}
        >
          Mis Datos
        </button>
        <button
          className={`pb-4 px-6 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "orders"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("orders")}
        >
          Mis Pedidos
        </button>
      </div>

      {activeTab === "data" && (
        <form onSubmit={handleSaveProfile} className="space-y-8 max-w-3xl">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Información Básica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email (No modificable)</label>
                <input
                  type="text"
                  value={profile?.email || ""}
                  disabled
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={profile?.name || ""}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              Dirección de Envío
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Calle y número</label>
                <input
                  type="text"
                  value={profile?.shippingAddress?.street || ""}
                  onChange={(e) => updateAddress("shipping", "street", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ciudad</label>
                <input
                  type="text"
                  value={profile?.shippingAddress?.city || ""}
                  onChange={(e) => updateAddress("shipping", "city", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código Postal</label>
                <input
                  type="text"
                  value={profile?.shippingAddress?.postalCode || ""}
                  onChange={(e) => updateAddress("shipping", "postalCode", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-400" />
              Datos de Facturación
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Calle y número</label>
                <input
                  type="text"
                  value={profile?.billingAddress?.street || ""}
                  onChange={(e) => updateAddress("billing", "street", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ciudad</label>
                <input
                  type="text"
                  value={profile?.billingAddress?.city || ""}
                  onChange={(e) => updateAddress("billing", "city", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código Postal</label>
                <input
                  type="text"
                  value={profile?.billingAddress?.postalCode || ""}
                  onChange={(e) => updateAddress("billing", "postalCode", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Guardar Cambios
          </button>
        </form>
      )}

      {activeTab === "orders" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center">
              <Package className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No tienes pedidos</h3>
              <p className="text-gray-500 mt-2">Todavía no has realizado ninguna compra con nosotros.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300 uppercase">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID Pedido</th>
                  <th className="px-6 py-4 font-semibold">Fecha</th>
                  <th className="px-6 py-4 font-semibold">Total</th>
                  <th className="px-6 py-4 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      #{order.id.split("-").pop() || order.id}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {order.totalAmount.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
