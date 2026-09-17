"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/store/useAuth";
import { useFavorites } from "@/store/useFavorites";
import { userOperations } from "@/services/graphqlClient";
import { useRouter } from "next/navigation";
import { User, Package, MapPin, Loader2, Save, CreditCard, ChevronDown, ChevronUp, Heart, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function ProfilePage() {
  const { user, isGuest } = useAuth();
  const { getFavorites, removeFavorite } = useFavorites();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"favorites" | "orders" | "data">("favorites");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const favorites = getFavorites(user?.email || user?.id);

  const toggleOrder = (orderId: string) => {
    setExpandedOrderId(prev => prev === orderId ? null : orderId);
  };

  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    if (isGuest || !user) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const userProfile = await userOperations.getUserProfile();
        setProfile(userProfile);
        
        const userOrders = await userOperations.listUserOrders();
        const sortedOrders = (userOrders || []).sort((a: any, b: any) => {
          return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
        });
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isGuest, router, hasHydrated]);

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
          
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-center">
            <div>
              <span className="block text-xs font-semibold text-gray-400 uppercase mb-1">Usuario</span>
              <strong className="text-sm font-bold text-gray-900">{profile?.name || user?.email}</strong>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-gray-100 w-fit mx-auto md:mx-0">
          <button
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "favorites" 
              ? "bg-gray-900 text-white shadow-md" 
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("favorites")}
          >
            <Heart className={`w-4 h-4 ${activeTab === "favorites" ? "text-red-400 fill-red-400" : "text-gray-400"}`} />
            <span>Mis Favoritos</span>
            {favorites.length > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === "favorites" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
              }`}>
                {favorites.length}
              </span>
            )}
          </button>
          <button
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "orders" 
              ? "bg-gray-900 text-white shadow-md" 
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            <Package className="w-4 h-4" />
            <span>Mis Pedidos</span>
            {orders.length > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === "orders" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
              }`}>
                {orders.length}
              </span>
            )}
          </button>
          <button
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "data" 
              ? "bg-gray-900 text-white shadow-md" 
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("data")}
          >
            <User className="w-4 h-4" />
            <span>Mis Datos</span>
          </button>
        </div>

        {/* Tab Content: Favorites */}
        {activeTab === "favorites" && (
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  Mis Artículos Favoritos
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Artículos y EPIs guardados en tu cuenta para comprar o consultar rápidamente.
                </p>
              </div>
              {favorites.length > 0 && (
                <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 self-start sm:self-auto">
                  {favorites.length} {favorites.length === 1 ? "artículo guardado" : "artículos guardados"}
                </span>
              )}
            </div>

            {favorites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-400 mb-6 shadow-inner">
                  <Heart size={36} className="fill-red-100 stroke-red-400" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">No tienes productos favoritos</h3>
                <p className="text-gray-500 max-w-md mb-6 leading-relaxed">
                  Aún no has guardado ningún artículo. Explora nuestro catálogo y pulsa el icono del corazón para guardar tus prendas y equipos favoritos aquí.
                </p>
                <Link
                  href="/productos"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-[0.98]"
                >
                  <ShoppingBag size={18} />
                  <span>Explorar Catálogo</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((fav) => (
                  <div
                    key={fav.id}
                    className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300 flex flex-col"
                  >
                    {/* Botón eliminar favorito flotante */}
                    <button
                      onClick={() => removeFavorite(fav.id, user?.email || user?.id)}
                      className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-500 backdrop-blur-sm border border-gray-200 flex items-center justify-center transition-colors shadow-sm"
                      title="Eliminar de favoritos"
                      aria-label="Eliminar de favoritos"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Contenedor de Imagen */}
                    <Link
                      href={`/productos/${fav.id}`}
                      className="relative aspect-square bg-slate-50 overflow-hidden flex items-center justify-center p-4 block"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={fav.image || "https://via.placeholder.com/600x800?text=Protex+Wear"}
                        alt={fav.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/600x800?text=Protex+Wear";
                        }}
                      />
                      {fav.brand && (
                        <div className="absolute top-3 left-3 bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {fav.brand}
                        </div>
                      )}
                    </Link>

                    {/* Información y Acciones */}
                    <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                      <div>
                        {fav.category && (
                          <span className="text-[11px] font-bold text-[#3b6d9c] uppercase tracking-wider block mb-1">
                            {fav.category}
                          </span>
                        )}
                        <Link
                          href={`/productos/${fav.id}`}
                          className="font-bold text-gray-900 hover:text-[#3b6d9c] transition-colors line-clamp-2 text-sm leading-snug"
                        >
                          {fav.name}
                        </Link>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-gray-400 block">Precio B2B</span>
                          <span className="text-lg font-black text-gray-900">{fav.price.toFixed(2)} €</span>
                        </div>
                        <Link
                          href={`/productos/${fav.id}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-[#3b6d9c] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                        >
                          <span>Ver producto</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 block">Teléfono</label>
                  <input
                    type="tel"
                    value={profile?.shippingAddress?.phone || ""}
                    onChange={(e) => updateAddress("shipping", "phone", e.target.value)}
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
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 block">Teléfono</label>
                  <input
                    type="tel"
                    value={profile?.billingAddress?.phone || ""}
                    onChange={(e) => updateAddress("billing", "phone", e.target.value)}
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
                      <React.Fragment key={order.id}>
                        <tr 
                          className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                          onClick={() => toggleOrder(order.id)}
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-gray-900 text-sm bg-gray-100 px-2.5 py-1 rounded-md">
                                #{order.id.split("-").pop() || order.id}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-500 font-medium">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 text-sm font-bold text-gray-900">
                            {order.totalAmount.toFixed(2)} €
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-between">
                              <span className="inline-flex items-center px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
                                {order.status}
                              </span>
                              {expandedOrderId === order.id ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </td>
                        </tr>
                        {expandedOrderId === order.id && (
                          <tr>
                            <td colSpan={4} className="p-0 border-b border-gray-100">
                              <div className="bg-gray-50 p-6 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-inner">
                                
                                {/* Detalles de Artículos */}
                                <div>
                                  <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-indigo-600" />
                                    Artículos del Pedido
                                  </h4>
                                  <ul className="space-y-3">
                                    {(order.items || []).map((item: any, idx: number) => (
                                      <li key={idx} className="flex justify-between items-center text-sm bg-white p-3 rounded-lg border border-gray-200">
                                        <div className="flex items-center gap-4">
                                          {item.image ? (
                                            <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden relative flex-shrink-0">
                                              <Image src={item.image} alt={item.name || "Producto"} fill className="object-cover" sizes="48px" />
                                            </div>
                                          ) : (
                                            <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center text-gray-400">
                                              <Package size={20} />
                                            </div>
                                          )}
                                          <div className="flex flex-col">
                                            <Link href={`/productos/${item.productId}`} className="font-semibold text-gray-900 hover:text-indigo-600 line-clamp-1 transition-colors">
                                              {item.name || `Producto ${item.productId}`}
                                            </Link>
                                            <span className="text-gray-500 text-xs mt-0.5">Cant: {item.quantity}</span>
                                          </div>
                                        </div>
                                        <div className="font-bold text-gray-900">
                                          {(item.priceAtPurchase * item.quantity).toFixed(2)} €
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Detalles de Direcciones */}
                                <div className="space-y-6">
                                  {order.shippingAddress && (
                                    <div>
                                      <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-indigo-600" />
                                        Dirección de Envío
                                      </h4>
                                      <div className="text-sm text-gray-600 bg-white p-4 rounded-lg border border-gray-200">
                                        <p>{order.shippingAddress.street}</p>
                                        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                        {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
                                      </div>
                                    </div>
                                  )}

                                  {order.billingAddress && (
                                    <div>
                                      <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-purple-600" />
                                        Dirección de Facturación
                                      </h4>
                                      <div className="text-sm text-gray-600 bg-white p-4 rounded-lg border border-gray-200">
                                        <p>{order.billingAddress.street}</p>
                                        <p>{order.billingAddress.city}, {order.billingAddress.postalCode}</p>
                                        {order.billingAddress.country && <p>{order.billingAddress.country}</p>}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
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
