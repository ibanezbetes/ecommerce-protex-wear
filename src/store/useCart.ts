import { create } from 'zustand';

/* ============================================================================
 * useCart — Store Global del Carrito de Compras (Zustand)
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

const computeTotals = (items: CartItem[]) => {
  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  return { cartTotal, subtotal: cartTotal, itemCount };
};

export const useCart = create<CartState>((set, get) => ({
  items: [],
  isCartOpen: false,
  cartTotal: 0,
  subtotal: 0,
  itemCount: 0,
  
  discountCode: null,
  discountAmount: null,

  applyDiscountCode: async (code: string) => {
    // Simulated discount logic for presentation
    if (code === 'PROTEX10') {
      set({ discountCode: code, discountAmount: 10 });
    } else {
      throw new Error('Código no válido');
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
    return { items: newItems, isCartOpen: true, ...computeTotals(newItems) };
  }),

  removeItem: (variantId) => set((state) => {
    const newItems = state.items.filter(i => i.variantId !== variantId);
    return { items: newItems, ...computeTotals(newItems) };
  }),

  updateQuantity: (variantId, quantity) => set((state) => {
    const newItems = state.items.map(i =>
      i.variantId === variantId ? { ...i, quantity } : i
    );
    return { items: newItems, ...computeTotals(newItems) };
  }),

  clearCart: () => set({ items: [], isCartOpen: false, cartTotal: 0, subtotal: 0, itemCount: 0, discountCode: null, discountAmount: null }),

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
}));
