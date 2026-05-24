import { create } from 'zustand';

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  get cartTotal(): number;
}

export const useCart = create<CartState>((set, get) => ({
  items: [
    // Datos mockeados iniciales para poder testear el checkout directamente
    { productId: '01001', variantId: '01001080040', name: 'Camiseta ANBOR', price: 9.99, quantity: 2 },
    { productId: 'MODELO-X', variantId: 'REF-Y', name: 'Pantalón Forli', price: 25.50, quantity: 1 }
  ],
  
  addItem: (newItem) => set((state) => {
    const existing = state.items.find(i => i.variantId === newItem.variantId);
    if (existing) {
      return {
        items: state.items.map(i => 
          i.variantId === newItem.variantId ? { ...i, quantity: i.quantity + newItem.quantity } : i
        )
      };
    }
    return { items: [...state.items, newItem] };
  }),

  removeItem: (variantId) => set((state) => ({
    items: state.items.filter(i => i.variantId !== variantId)
  })),

  clearCart: () => set({ items: [] }),

  get cartTotal() {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}));
