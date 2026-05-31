import { create } from 'zustand';

/* ============================================================================
 * useCart — Store Global del Carrito de Compras (Zustand)
 * ============================================================================
 *
 * Gestiona los artículos del carrito, el estado del drawer (abierto/cerrado),
 * y proporciona totales calculados.
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
  /** Total del carrito (suma de precio × cantidad de cada artículo) */
  get cartTotal(): number;
  /** Subtotal antes de impuestos (actualmente igual a cartTotal) */
  get subtotal(): number;
  /** Número total de unidades en el carrito */
  get itemCount(): number;
}

/**
 * Hook de Zustand para gestionar el carrito de compras.
 *
 * @example
 * ```tsx
 * const { items, addItem, openCart, cartTotal } = useCart();
 *
 * // Añadir un producto:
 * addItem({ productId: '01001', variantId: '01001-M-RED', name: 'Camiseta M Roja', price: 9.99, quantity: 1 });
 * ```
 */
export const useCart = create<CartState>((set, get) => ({
  items: [],
  isCartOpen: false,

  addItem: (newItem) => set((state) => {
    const existing = state.items.find(i => i.variantId === newItem.variantId);
    if (existing) {
      // Si la variante ya está en el carrito, incrementar la cantidad
      return {
        items: state.items.map(i =>
          i.variantId === newItem.variantId
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        ),
        isCartOpen: true,
      };
    }
    // Si es una variante nueva, añadirla al final
    return { items: [...state.items, newItem], isCartOpen: true };
  }),

  removeItem: (variantId) => set((state) => ({
    items: state.items.filter(i => i.variantId !== variantId),
  })),

  updateQuantity: (variantId, quantity) => set((state) => ({
    items: state.items.map(i =>
      i.variantId === variantId ? { ...i, quantity } : i
    ),
  })),

  clearCart: () => set({ items: [], isCartOpen: false }),

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  get cartTotal() {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  get subtotal() {
    // Actualmente igual a cartTotal. Aquí se aplicarían descuentos en el futuro.
    return get().cartTotal;
  },

  get itemCount() {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
