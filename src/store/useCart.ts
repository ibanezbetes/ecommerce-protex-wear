import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/* ============================================================================
 * useCart — Store Global del Carrito de Compras (Zustand con Persistencia)
 * ============================================================================
 *
 * Gestiona los artículos del carrito, el estado del drawer (abierto/cerrado),
 * y proporciona totales calculados correctamente en cada mutación del estado.
 *
 * Cada artículo se identifica por `variantId` (no por `productId`),
 * porque un mismo producto puede tener varias tallas/colores.
 *
 * Descuentos:
 *   Los códigos se validan SERVER-SIDE via /api/validate-discount.
 *   El store almacena el tipo y valor devuelto por el servidor para poder
 *   recalcular el importe en tiempo real cuando cambian los ítems.
 *   La validación definitiva ocurre de nuevo al crear la sesión de Stripe.
 *
 * Integración:
 *   - CartDrawer.tsx    → UI del carrito lateral
 *   - Navbar.tsx        → Badge con el conteo de artículos
 *   - checkout/page.tsx → Resumen del pedido antes de pagar
 * ========================================================================= */

/** Artículo individual dentro del carrito */
export interface CartItem {
  /** ID del producto en la base de datos */
  productId: string;
  /** ID único de la variante (talla + color) */
  variantId: string;
  /** Nombre legible del producto (incluye talla/color) */
  name: string;
  /** Precio unitario en euros */
  price: number;
  /** Cantidad seleccionada */
  quantity: number;
  /** URL de la imagen del producto (opcional) */
  image?: string;
}

interface Discount {
  code: string;
  type: 'fixed' | 'percentage';
  value: number;
}

/** Estado y acciones del store del carrito */
interface CartState {
  /** Lista de artículos en el carrito */
  items: CartItem[];
  /** Controla si el drawer del carrito está visible */
  isCartOpen: boolean;
  /** Total del carrito (suma de precio × cantidad de cada artículo) */
  cartTotal: number;
  /** Subtotal antes de impuestos (actualmente igual a cartTotal) */
  subtotal: number;
  /** Número total de unidades en el carrito */
  itemCount: number;

  /** Descuento aplicado */
  discount: Discount | null;
  /** Monto de descuento total en euros */
  discountAmount: number;

  /** Añade un artículo. Si ya existe (mismo variantId), suma la cantidad. */
  addItem: (item: CartItem) => void;
  /** Elimina un artículo del carrito por su variantId */
  removeItem: (variantId: string) => void;
  /** Actualiza la cantidad de un artículo existente */
  updateQuantity: (variantId: string, quantity: number) => void;
  /** Vacía el carrito por completo */
  clearCart: () => void;
  /** Abre el drawer del carrito */
  openCart: () => void;
  /** Cierra el drawer del carrito */
  closeCart: () => void;
  /** Aplica un descuento */
  applyDiscount: (discount: Discount) => void;
  /** Elimina el descuento actual */
  removeDiscount: () => void;
}

const computeTotals = (
  items: CartItem[],
  discount: Discount | null
) => {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  
  let discountAmount = 0;
  if (discount) {
    if (discount.type === 'percentage') {
      discountAmount = subtotal * (discount.value / 100);
    } else {
      discountAmount = discount.value;
    }
  }
  
  const cartTotal = Math.max(0, subtotal - discountAmount);

  return {
    cartTotal,
    subtotal,
    itemCount,
    discountAmount
  };
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      cartTotal: 0,
      subtotal: 0,
      itemCount: 0,
      discount: null,
      discountAmount: 0,

      // ── Mutaciones del carrito ──────────────────────────────────────────
      addItem: (newItem) => set((state) => {
        let newItems;
        const existing = state.items.find(i => i.variantId === newItem.variantId);
        if (existing) {
          newItems = state.items.map(i =>
            i.variantId === newItem.variantId
              ? { ...i, quantity: i.quantity + newItem.quantity }
              : i
          );
        } else {
          newItems = [...state.items, newItem];
        }
        return { items: newItems, isCartOpen: true, ...computeTotals(newItems, state.discount) };
      }),

      removeItem: (variantId) => set((state) => {
        const newItems = state.items.filter(i => i.variantId !== variantId);
        return { items: newItems, ...computeTotals(newItems, state.discount) };
      }),

      updateQuantity: (variantId, quantity) => set((state) => {
        const safeQuantity = quantity < 1 ? 1 : quantity;
        const newItems = state.items.map(i =>
          i.variantId === variantId ? { ...i, quantity: safeQuantity } : i
        );
        return { items: newItems, ...computeTotals(newItems, state.discount) };
      }),

      clearCart: () => set({
        items: [],
        isCartOpen: false,
        cartTotal: 0,
        subtotal: 0,
        itemCount: 0,
        discount: null,
        discountAmount: 0,
      }),

      applyDiscount: (discount) => set((state) => ({
        discount,
        ...computeTotals(state.items, discount)
      })),

      removeDiscount: () => set((state) => ({
        discount: null,
        ...computeTotals(state.items, null)
      })),

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
    }),
    {
      name: 'protex-cart-storage',
      // Persist cart items, discount metadata, and totals
      partialize: (state) => ({
        items: state.items,
        cartTotal: state.cartTotal,
        subtotal: state.subtotal,
        itemCount: state.itemCount,
        discount: state.discount,
        discountAmount: state.discountAmount,
      }),
      // Recalculate on rehydration to prevent stale totals
      onRehydrateStorage: () => (state, error) => {
        if (state && !error) {
          const totals = computeTotals(state.items, state.discount);
          state.cartTotal = totals.cartTotal;
          state.subtotal = totals.subtotal;
          state.itemCount = totals.itemCount;
          state.discountAmount = totals.discountAmount;
        }
      },
    }
  )
);
