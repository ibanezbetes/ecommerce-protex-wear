import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Cart, CartItem, Product } from '../types';

/**
 * Shopping Cart Context for managing cart state
 * Persists cart data to localStorage
 */

interface CartContextType extends Cart {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

// Cart Reducer
function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.productId === product.id);

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? {
              ...item,
              quantity: item.quantity + quantity,
              totalPrice: (item.quantity + quantity) * item.unitPrice,
            }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          productId: product.id,
          product,
          quantity,
          unitPrice: product.price,
          totalPrice: product.price * quantity,
        };
        newItems = [...state.items, newItem];
      }

      return calculateCartTotals(newItems);
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.productId !== action.payload);
      return calculateCartTotals(newItems);
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        const newItems = state.items.filter(item => item.productId !== productId);
        return calculateCartTotals(newItems);
      }

      const newItems = state.items.map(item =>
        item.productId === productId
          ? {
            ...item,
            quantity,
            totalPrice: quantity * item.unitPrice,
          }
          : item
      );

      return calculateCartTotals(newItems);
    }

    case 'CLEAR_CART':
      return {
        items: [],
        subtotal: 0,
        itemCount: 0,
      };

    case 'LOAD_CART':
      return calculateCartTotals(action.payload);

    default:
      return state;
  }
}

// Helper function to calculate cart totals
function calculateCartTotals(items: CartItem[]): Cart {
  const subtotal = items.reduce((total, item) => total + item.totalPrice, 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return {
    items,
    subtotal: Math.round(subtotal * 100) / 100, // Round to 2 decimal places
    itemCount,
  };
}

// Initial State
const initialState: Cart = {
  items: [],
  subtotal: 0,
  itemCount: 0,
};

// Cart Provider Component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('protex-cart');
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('protex-cart', JSON.stringify(state.items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state.items]);

  const addItem = (product: Product, quantity: number = 1) => {
    if (quantity <= 0) return;

    // Check stock availability
    if (product.stock < quantity) {
      throw new Error(`Solo hay ${product.stock} unidades disponibles`);
    }

    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const item = state.items.find(item => item.productId === productId);

    if (item && quantity > 0) {
      // Check stock availability
      if (item.product.stock < quantity) {
        throw new Error(`Solo hay ${item.product.stock} unidades disponibles`);
      }
    }

    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const isInCart = (productId: string): boolean => {
    return state.items.some(item => item.productId === productId);
  };

  const getItemQuantity = (productId: string): number => {
    const item = state.items.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    isCartOpen,
    openCart,
    closeCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Helper hooks
export function useCartItemCount() {
  const { itemCount } = useCart();
  return itemCount;
}

export function useCartSubtotal() {
  const { subtotal } = useCart();
  return subtotal;
}

export function useCartItems() {
  const { items } = useCart();
  return items;
}