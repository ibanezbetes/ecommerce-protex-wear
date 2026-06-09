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

  // ── Descuento (validado server-side) ──────────────────────────────────
  /** Código de descuento aplicado (e.g. "VERANO20"), null si no hay */
  discountCode: string | null;
  /** Tipo de descuento devuelto por el servidor ("percentage" | "fixed") */
  discountType: 'percentage' | 'fixed' | null;
  /** Valor del descuento devuelto por el servidor (e.g. 20 para 20%) */
  discountValue: number | null;
  /** Importe calculado del descuento en € */
  discountAmount: number | null;

  /** Valida un código de descuento contra el servidor */
  applyDiscountCode: (code: string) => Promise<void>;
  /** Elimina el descuento aplicado */
  removeDiscountCode: () => void;

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
}

/**
 * Recalcula los totales del carrito y el importe del descuento.
 *
 * El descuento se recalcula usando el tipo y valor devueltos por el servidor
 * (no un mapa local) para que la UI refleje el descuento correcto en tiempo
 * real cuando cambian los ítems.
 */
const computeTotals = (
  items: CartItem[],
  discountType: 'percentage' | 'fixed' | null,
  discountValue: number | null
) => {
  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  let discountAmount = 0;
  if (discountType && discountValue != null) {
    if (discountType === 'percentage') {
      discountAmount = parseFloat((cartTotal * (discountValue / 100)).toFixed(2));
    } else {
      discountAmount = Math.min(discountValue, cartTotal);
    }
  }

  return {
    cartTotal,
    subtotal: cartTotal,
    itemCount,
    discountAmount: discountType ? discountAmount : null,
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

      discountCode: null,
      discountType: null,
      discountValue: null,
      discountAmount: null,

      // ── Descuento: validación server-side ───────────────────────────────
      applyDiscountCode: async (code: string) => {
        const { items, subtotal } = get();

        const res = await fetch('/api/validate-discount', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: code.trim(), subtotal }),
        });

        const data = await res.json();

        if (data.valid) {
          const totals = computeTotals(items, data.discountType, data.discountValue);
          set({
            discountCode: code.trim().toUpperCase(),
            discountType: data.discountType,
            discountValue: data.discountValue,
            discountAmount: totals.discountAmount,
          });
        } else {
          throw new Error(data.error || 'Código de descuento no válido');
        }
      },

      removeDiscountCode: () => {
        const { items } = get();
        const totals = computeTotals(items, null, null);
        set({
          discountCode: null,
          discountType: null,
          discountValue: null,
          discountAmount: null,
          cartTotal: totals.cartTotal,
          subtotal: totals.subtotal,
          itemCount: totals.itemCount,
        });
      },

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
        return { items: newItems, isCartOpen: true, ...computeTotals(newItems, state.discountType, state.discountValue) };
      }),

      removeItem: (variantId) => set((state) => {
        const newItems = state.items.filter(i => i.variantId !== variantId);
        return { items: newItems, ...computeTotals(newItems, state.discountType, state.discountValue) };
      }),

      updateQuantity: (variantId, quantity) => set((state) => {
        const newItems = state.items.map(i =>
          i.variantId === variantId ? { ...i, quantity } : i
        );
        return { items: newItems, ...computeTotals(newItems, state.discountType, state.discountValue) };
      }),

      clearCart: () => set({
        items: [],
        isCartOpen: false,
        cartTotal: 0,
        subtotal: 0,
        itemCount: 0,
        discountCode: null,
        discountType: null,
        discountValue: null,
        discountAmount: null,
      }),

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
    }),
    {
      name: 'protex-cart-storage',
      // Persist cart items, discount metadata, and totals
      partialize: (state) => ({
        items: state.items,
        discountCode: state.discountCode,
        discountType: state.discountType,
        discountValue: state.discountValue,
        cartTotal: state.cartTotal,
        subtotal: state.subtotal,
        itemCount: state.itemCount,
        discountAmount: state.discountAmount,
      }),
      // Recalculate on rehydration to prevent stale totals
      onRehydrateStorage: () => (state, error) => {
        if (state && !error) {
          const totals = computeTotals(state.items, state.discountType, state.discountValue);
          state.cartTotal = totals.cartTotal;
          state.subtotal = totals.subtotal;
          state.itemCount = totals.itemCount;
          state.discountAmount = totals.discountAmount;
        }
      },
    }
  )
);
