"use client";

import { useEffect, useState } from "react";
import { adminOperations, productOperations } from "@/services/graphqlClient";
import { Loader2, Users, Search, Save, X, UserPlus, Shield, CheckCircle2, Lock, Mail, User as UserIcon, FileText } from "lucide-react";

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Formulario precio especial
  const [productId, setProductId] = useState("");
  const [specialPrice, setSpecialPrice] = useState("");
  const [savingPrice, setSavingPrice] = useState(false);
  
  const [products, setProducts] = useState<any[]>([]);

  // Formulario Crear Usuario VIP / Pre-verificado (Siempre USER)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserCif, setNewUserCif] = useState("");
  const [newUserCanPayLater, setNewUserCanPayLater] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccessMessage, setCreateSuccessMessage] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let allUsers: any[] = [];
      let nextToken: string | undefined = undefined;
      let hasMore = true;

      while (hasMore) {
        const data = await adminOperations.listUsers(50, nextToken);
        if (data?.items) {
          allUsers = [...allUsers, ...data.items];
        }
        if (data?.nextToken) {
          nextToken = data.nextToken;
        } else {
          hasMore = false;
        }
      }
      setUsers(allUsers);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      let allProducts: any[] = [];
      let nextToken: string | undefined = undefined;
      let hasMore = true;
      while (hasMore) {
        const pData = await productOperations.listProducts(undefined, undefined, 100, nextToken);
        if (pData?.items) {
          allProducts = [...allProducts, ...pData.items];
        }
        if (pData?.nextToken) {
          nextToken = pData.nextToken;
        } else {
          hasMore = false;
        }
      }
      setProducts(allProducts);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);

  const handleOpenSpecialPrice = (user: any) => {
    setSelectedUser(user);
    setProductId("");
    setSpecialPrice("");
    setIsModalOpen(true);
  };

  const handleSaveSpecialPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !specialPrice) return;

    try {
      setSavingPrice(true);
      await adminOperations.setSpecialPrice(selectedUser.id, productId, parseFloat(specialPrice));
      alert("Precio especial asignado correctamente");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error asignando precio:", error);
      alert("Hubo un error al asignar el precio especial.");
    } finally {
      setSavingPrice(false);
    }
  };

  const handleToggleCanPayLater = async (user: any) => {
    try {
      const newValue = !user.can_pay_later;
      // Optimistic update
      setUsers(users.map(u => u.id === user.id ? { ...u, can_pay_later: newValue } : u));
      await adminOperations.setCanPayLater(user.id, newValue);
    } catch (error) {
      console.error("Error toggling can_pay_later:", error);
      alert("Error al actualizar la opción de pago aplazado.");
      // Revert on error
      setUsers(users.map(u => u.id === user.id ? { ...u, can_pay_later: user.can_pay_later } : u));
    }
  };

  const handleOpenCreateUserModal = () => {
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPassword("");
    setNewUserCif("");
    setNewUserCanPayLater(false);
    setCreateError("");
    setCreateSuccessMessage("");
    setIsCreateModalOpen(true);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreateSuccessMessage("");

    if (!newUserEmail || !newUserPassword) {
      setCreateError("Email y contraseña son campos obligatorios.");
      return;
    }

    if (newUserPassword.length < 8) {
      setCreateError("La contraseña debe tener mínimo 8 caracteres.");
      return;
    }

    try {
      setCreatingUser(true);
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          cif: newUserCif,
          role: 'USER',
          can_pay_later: newUserCanPayLater,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "No se pudo crear el usuario.");
      }

      setCreateSuccessMessage(`¡Usuario ${newUserEmail} creado y verificado automáticamente! Ya puede acceder directamente con su contraseña.`);
      
      // Añadir inmediatamente a la lista local
      if (data.user) {
        setUsers(prev => [data.user, ...prev]);
      } else {
        fetchUsers();
      }

      setTimeout(() => {
        setIsCreateModalOpen(false);
        setCreateSuccessMessage("");
      }, 2500);

    } catch (err: any) {
      console.error("Error creando usuario:", err);
      setCreateError(err.message || "Error al crear el usuario.");
    } finally {
      setCreatingUser(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchTerm) return true;
    return (
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.cif && u.cif.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.id && u.id.includes(searchTerm))
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-600" />
            Gestión de Usuarios
          </h1>
          <p className="text-gray-500 mt-1">Administra clientes, crea cuentas verificadas y asigna precios especiales</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchUsers} 
            className="bg-white text-gray-700 border border-gray-200 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all"
          >
            Actualizar
          </button>
          <button 
            onClick={handleOpenCreateUserModal}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            Crear Usuario Verificado
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email, CIF o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            <p className="mt-4 text-indigo-600 font-medium">Cargando usuarios...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            No se encontraron usuarios.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">ID / Nombre</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">CIF / NIF</th>
                  <th className="px-6 py-4">Rol</th>
                  <th className="px-6 py-4 text-center">Pago Personalizado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{u.name || "Sin nombre"}</p>
                      <p className="text-xs text-gray-500 font-mono">#{u.id.substring(0, 8)}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{u.email}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">{u.cif || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${u.role === "ADMIN" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}`}>
                        {u.role === "ADMIN" && <Shield className="w-3 h-3" />}
                        {u.role || "USER"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleCanPayLater(u)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          u.can_pay_later
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                        }`}
                        title={u.can_pay_later ? 'Desactivar Pago Personalizado' : 'Activar Pago Personalizado'}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${u.can_pay_later ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                        {u.can_pay_later ? 'Habilitado' : 'Deshabilitado'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleOpenSpecialPrice(u)}
                        className="inline-flex items-center px-3.5 py-1.5 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        Asignar Precio
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Crear Usuario Verificado (Rol USER automático) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">Crear Usuario Verificado</h3>
                  <p className="text-xs text-gray-500">Acceso inmediato sin requerir confirmación de email</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createSuccessMessage ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">Usuario Listo para Usar</h4>
                <p className="text-sm text-gray-600 max-w-sm mx-auto">{createSuccessMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleCreateUser} className="space-y-4">
                {createError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
                    {createError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                    Nombre Completo o Empresa
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Ej: Construcciones García S.L. / Juan Pérez"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      Email (Login)
                    </label>
                    <input
                      type="email"
                      required
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      placeholder="cliente@empresa.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-gray-400" />
                      CIF / NIF (Opcional)
                    </label>
                    <input
                      type="text"
                      value={newUserCif}
                      onChange={(e) => setNewUserCif(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      placeholder="B12345678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                    Contraseña Inicial (Definitiva)
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium font-mono text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Mínimo 8 caracteres (ej: Protex2026!)"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Esta contraseña quedará activa de inmediato sin forzar cambio de contraseña ni enviar email.
                  </p>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none bg-gray-50 p-3 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={newUserCanPayLater}
                      onChange={(e) => setNewUserCanPayLater(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded-sm border-gray-300 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">Habilitar Pago Aplazado / Personalizado</span>
                      <span className="text-[11px] text-gray-500 block">Permite a este cliente formalizar pedidos sin pagar en el acto con tarjeta</span>
                    </div>
                  </label>
                </div>

                <div className="pt-5 flex justify-end gap-3 border-t border-gray-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2.5 text-gray-700 font-semibold text-sm hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={creatingUser}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm flex items-center gap-2 disabled:opacity-70 transition-all"
                  >
                    {creatingUser ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                    Crear y Activar Cuenta
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Asignar Precio Especial */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Precio Especial</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              Asignando precio VIP para: <strong className="text-gray-900">{selectedUser.name || selectedUser.email}</strong>
            </p>

            <form onSubmit={handleSaveSpecialPrice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Producto</label>
                <input
                  type="text"
                  required
                  list="products-list"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Buscar o seleccionar producto..."
                />
                <datalist id="products-list">
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.variants?.[0]?.sku || '-'})
                    </option>
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo Precio (€)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={specialPrice}
                  onChange={(e) => setSpecialPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Ej: 10.50"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingPrice}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center gap-2 disabled:opacity-70"
                >
                  {savingPrice ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
