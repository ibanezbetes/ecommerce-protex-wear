"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/store/useAuth";
import { userOperations } from "@/services/graphqlClient";
import { useRouter } from "next/navigation";
import { User, Package, MapPin, Loader2, Save, CreditCard } from "lucide-react";
import styles from "./page.module.css";

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
      <div className={styles.loadingShell}>
        <div className={styles.loadingCard}>
          <Loader2 className={styles.loadingIcon} />
          <p className={styles.loadingText}>Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={styles.heroCard}>
          <div className={styles.heroIconWrap}>
            <User className={styles.heroIcon} />
          </div>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Cuenta Protex Wear</span>
            <h1 className={styles.title}>Mi Perfil</h1>
            <p className={styles.subtitle}>
              Hola, {profile?.name || user?.email}. Gestiona tus datos, direcciones y pedidos desde un solo lugar.
            </p>
          </div>
          <div className={styles.heroMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Usuario</span>
              <strong className={styles.metaValue}>{profile?.name || user?.email}</strong>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Secciones</span>
              <strong className={styles.metaValue}>{activeTab === "data" ? "Datos" : "Pedidos"}</strong>
            </div>
          </div>
        </section>

        <div className={styles.tabBar}>
          <button
            className={`${styles.tabButton} ${activeTab === "data" ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab("data")}
          >
            Mis Datos
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "orders" ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Mis Pedidos
          </button>
        </div>

      {activeTab === "data" && (
        <form onSubmit={handleSaveProfile} className={styles.formLayout}>
          <section className={styles.panelCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Información Básica</h2>
              <p className={styles.cardHint}>Datos que usas para identificar tu cuenta.</p>
            </div>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.label}>Email (No modificable)</label>
                <input
                  type="text"
                  value={profile?.email || ""}
                  disabled
                  className={styles.inputDisabled}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Nombre Completo</label>
                <input
                  type="text"
                  value={profile?.name || ""}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className={styles.input}
                />
              </div>
            </div>
          </section>

          <section className={styles.panelCard}>
            <h2 className={styles.cardTitleWithIcon}>
              <MapPin className={styles.sectionIcon} />
              Dirección de Envío
            </h2>
            <div className={styles.formGrid}>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Calle y número</label>
                <input
                  type="text"
                  value={profile?.shippingAddress?.street || ""}
                  onChange={(e) => updateAddress("shipping", "street", e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Ciudad</label>
                <input
                  type="text"
                  value={profile?.shippingAddress?.city || ""}
                  onChange={(e) => updateAddress("shipping", "city", e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Código Postal</label>
                <input
                  type="text"
                  value={profile?.shippingAddress?.postalCode || ""}
                  onChange={(e) => updateAddress("shipping", "postalCode", e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>
          </section>

          <section className={styles.panelCard}>
            <h2 className={styles.cardTitleWithIcon}>
              <CreditCard className={styles.sectionIcon} />
              Datos de Facturación
            </h2>
            <div className={styles.formGrid}>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>Calle y número</label>
                <input
                  type="text"
                  value={profile?.billingAddress?.street || ""}
                  onChange={(e) => updateAddress("billing", "street", e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Ciudad</label>
                <input
                  type="text"
                  value={profile?.billingAddress?.city || ""}
                  onChange={(e) => updateAddress("billing", "city", e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Código Postal</label>
                <input
                  type="text"
                  value={profile?.billingAddress?.postalCode || ""}
                  onChange={(e) => updateAddress("billing", "postalCode", e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>
          </section>

          <button
            type="submit"
            disabled={saving}
            className={styles.saveButton}
          >
            {saving ? <Loader2 className={styles.buttonIconSpin} /> : <Save className={styles.buttonIcon} />}
            Guardar Cambios
          </button>
        </form>
      )}

      {activeTab === "orders" && (
        <div className={styles.panelCard}>
          {orders.length === 0 ? (
            <div className={styles.emptyState}>
              <Package className={styles.emptyIcon} />
              <h3 className={styles.emptyTitle}>No tienes pedidos</h3>
              <p className={styles.emptyText}>Todavía no has realizado ninguna compra con nosotros.</p>
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.th}>ID Pedido</th>
                  <th className={styles.th}>Fecha</th>
                  <th className={styles.th}>Total</th>
                  <th className={styles.th}>Estado</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order: any) => (
                  <tr key={order.id} className={styles.tr}>
                    <td className={styles.tdStrong}>
                      #{order.id.split("-").pop() || order.id}
                    </td>
                    <td className={styles.tdMuted}>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className={styles.tdStrong}>
                      {order.totalAmount.toFixed(2)} €
                    </td>
                    <td className={styles.td}>
                      <span className={styles.statusPill}>
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
