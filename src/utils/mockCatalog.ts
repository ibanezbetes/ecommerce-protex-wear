/* ============================================================================
 * mockCatalog.ts — Catálogo de Respaldo Local (Datos Reales del Cliente)
 * ============================================================================
 *
 * Este archivo expone el catálogo completo de productos reales del cliente, 
 * importados directamente desde 'mockProducts.json'. 
 *
 * Sirve como fallback local resiliente cuando la API de AWS AppSync/Amplify
 * no está disponible o las credenciales públicas están expiradas.
 * ========================================================================= */

import mockProductsData from './mockProducts.json';

export interface MockVariant {
  id: string;
  sku?: string;
  size?: string;
  color?: string;
  basePrice: number;
  images?: string[];
}

export interface MockProduct {
  id: string;
  name: string;
  description?: string;
  brand: string;
  variants: MockVariant[];
}

// Exportar el catálogo completo de 282 productos reales
export const MOCK_PRODUCTS = mockProductsData as MockProduct[];
