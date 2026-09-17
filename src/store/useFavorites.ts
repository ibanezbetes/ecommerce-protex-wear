import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/* ============================================================================
 * useFavorites — Store Global de Favoritos / Lista de Deseos (Zustand)
 * ============================================================================
 *
 * Gestiona los productos marcados como favoritos por los usuarios.
 * Los favoritos se guardan particionados por usuario (usando su email o id),
 * de modo que cada cuenta tenga su propia lista de favoritos independiente.
 * ========================================================================= */

export interface FavoriteProduct {
  id: string;
  name: string;
  brand: string;
  category?: string;
  price: number;
  image?: string;
  addedAt: string;
}

interface FavoritesState {
  /** Mapa de favoritos indexado por identificador de usuario (email o id) */
  favoritesByUser: Record<string, FavoriteProduct[]>;
  
  /** Añade o elimina un producto de favoritos. Devuelve true si quedó añadido, false si fue removido */
  toggleFavorite: (
    product: {
      id: string;
      name: string;
      brand?: string;
      category?: string;
      price?: number;
      image?: string;
    },
    userId?: string | null
  ) => boolean;

  /** Elimina un producto de favoritos */
  removeFavorite: (productId: string, userId?: string | null) => void;

  /** Comprueba si un producto está marcado como favorito */
  isFavorite: (productId: string, userId?: string | null) => boolean;

  /** Obtiene la lista de productos favoritos para un usuario */
  getFavorites: (userId?: string | null) => FavoriteProduct[];
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoritesByUser: {},

      toggleFavorite: (product, userId) => {
        const userKey = userId || 'default';
        const currentList = get().favoritesByUser[userKey] || [];
        const existsIndex = currentList.findIndex((item) => item.id === product.id);

        let isNowFavorite = false;
        let updatedList: FavoriteProduct[];

        if (existsIndex >= 0) {
          // Remover de favoritos
          updatedList = currentList.filter((item) => item.id !== product.id);
          isNowFavorite = false;
        } else {
          // Añadir a favoritos
          const newFavorite: FavoriteProduct = {
            id: product.id,
            name: product.name,
            brand: product.brand || 'Protex Wear',
            category: product.category,
            price: product.price || 0,
            image: product.image,
            addedAt: new Date().toISOString(),
          };
          updatedList = [newFavorite, ...currentList];
          isNowFavorite = true;
        }

        set((state) => ({
          favoritesByUser: {
            ...state.favoritesByUser,
            [userKey]: updatedList,
          },
        }));

        return isNowFavorite;
      },

      removeFavorite: (productId, userId) => {
        const userKey = userId || 'default';
        const currentList = get().favoritesByUser[userKey] || [];
        const updatedList = currentList.filter((item) => item.id !== productId);

        set((state) => ({
          favoritesByUser: {
            ...state.favoritesByUser,
            [userKey]: updatedList,
          },
        }));
      },

      isFavorite: (productId, userId) => {
        const userKey = userId || 'default';
        const currentList = get().favoritesByUser[userKey] || [];
        return currentList.some((item) => item.id === productId);
      },

      getFavorites: (userId) => {
        const userKey = userId || 'default';
        return get().favoritesByUser[userKey] || [];
      },
    }),
    {
      name: 'protex-favorites-storage',
    }
  )
);
