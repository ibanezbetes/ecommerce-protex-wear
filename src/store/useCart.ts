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
  
  // Custom discount properties
  discountCode: string | null;
  discountAmount: number | null;
  applyDiscountCode: (code: string) => Promise<void>;
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

const SUPPORTED_DISCOUNTS: Record<string, { type: 'percentage' | 'fixed'; value: number }> = {
  VERANO20: { type: 'percentage', value: 20 },
  PROTEX10: { type: 'fixed', value: 10 },
  PROTEX20: { type: 'percentage', value: 20 },
};

const computeTotals = (items: CartItem[], discountCode: string | null) => {
  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  
  let discountAmount = 0;
  if (discountCode) {
    const promo = SUPPORTED_DISCOUNTS[discountCode];
    if (promo) {
      if (promo.type === 'percentage') {
        discountAmount = parseFloat((cartTotal * (promo.value / 100)).toFixed(2));
      } else {
        discountAmount = Math.min(promo.value, cartTotal);
      }
    }
  }

  return { 
    cartTotal, 
    subtotal: cartTotal, 
    itemCount,
    discountAmount: discountCode ? discountAmount : null
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
      discountAmount: null,

      applyDiscountCode: async (code: string) => {
        const cleanCode = code.trim().toUpperCase();
        const promo = SUPPORTED_DISCOUNTS[cleanCode];
        if (promo) {
          const { items } = get();
          const totals = computeTotals(items, cleanCode);
          set({ 
            discountCode: cleanCode, 
            discountAmount: totals.discountAmount 
          });
        } else {
          throw new Error('Código de descuento no válido');
        }
      },
      
      removeDiscountCode: () => {
        set({ discountCode: null, discountAmount: null });
      },

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
        return { items: newItems, isCartOpen: true, ...computeTotals(newItems, state.discountCode) };
      }),

      removeItem: (variantId) => set((state) => {
        const newItems = state.items.filter(i => i.variantId !== variantId);
        return { items: newItems, ...computeTotals(newItems, state.discountCode) };
      }),

      updateQuantity: (variantId, quantity) => set((state) => {
        const newItems = state.items.map(i =>
          i.variantId === variantId ? { ...i, quantity } : i
        );
        return { items: newItems, ...computeTotals(newItems, state.discountCode) };
      }),

      clearCart: () => set({ items: [], isCartOpen: false, cartTotal: 0, subtotal: 0, itemCount: 0, discountCode: null, discountAmount: null }),

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
    }),
    {
      name: 'protex-cart-storage',
      // persist cart items, discounts and totals
      partialize: (state) => ({
        items: state.items,
        discountCode: state.discountCode,
        cartTotal: state.cartTotal,
        subtotal: state.subtotal,
        itemCount: state.itemCount,
        discountAmount: state.discountAmount,
      }),
      // Automatically recalculate on rehydration to prevent any stale 0.00€ totals
      onRehydrateStorage: () => (state, error) => {
        if (state && !error) {
          const totals = computeTotals(state.items, state.discountCode);
          state.cartTotal = totals.cartTotal;
          state.subtotal = totals.subtotal;
          state.itemCount = totals.itemCount;
          state.discountAmount = totals.discountAmount;
        }
      }
    }
  )
);

