import { useAuth } from '@/store/useAuth';

/* ============================================================================
 * graphqlClient.ts — Cliente Unificado de GraphQL para AWS AppSync
 * ============================================================================
 *
 * Punto de acceso único para todas las operaciones GraphQL del proyecto.
 * Soporta autorización híbrida:
 *   - Usuarios autenticados → JWT de Cognito (cabecera Authorization)
 *   - Usuarios invitados   → API Key pública  (cabecera x-api-key)
 *
 * Variables de entorno requeridas:
 *   NEXT_PUBLIC_APPSYNC_URL       — URL del endpoint de AppSync
 *   NEXT_PUBLIC_APPSYNC_API_KEY   — Clave pública para acceso de invitados
 * ========================================================================= */

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

/** Respuesta genérica de GraphQL */
interface GraphQLResponse<T = Record<string, unknown>> {
  data: T;
  errors?: Array<{ message: string; [key: string]: unknown }>;
}

// ---------------------------------------------------------------------------
// Cliente Base
// ---------------------------------------------------------------------------

/**
 * Ejecuta una petición GraphQL contra AWS AppSync.
 *
 * Determina automáticamente el método de autorización basándose en el
 * estado global de Zustand (`useAuth`): si el usuario está autenticado
 * envía su JWT; en caso contrario, envía la API Key pública.
 *
 * @param query     - La query o mutation de GraphQL en formato string.
 * @param variables - Variables opcionales para la operación.
 * @returns         - El campo `data` de la respuesta de GraphQL.
 * @throws          - Error si la petición falla o GraphQL devuelve errores.
 *
 * @example
 * ```ts
 * const data = await graphqlFetch<{ getProduct: Product }>(
 *   GET_PRODUCT_QUERY,
 *   { id: '123' }
 * );
 * ```
 */
export async function graphqlFetch<T = Record<string, unknown>>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const APPSYNC_URL = process.env.NEXT_PUBLIC_APPSYNC_URL;
  const APPSYNC_API_KEY = process.env.NEXT_PUBLIC_APPSYNC_API_KEY;

  if (!APPSYNC_URL) {
    throw new Error(
      '[graphqlFetch] Falta la variable de entorno NEXT_PUBLIC_APPSYNC_URL'
    );
  }

  // --- Autorización Híbrida ---
  const { user, isGuest } = useAuth.getState();
  const token = user?.token;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (!isGuest && token) {
    // Usuario autenticado: enviar JWT de Cognito
    headers['Authorization'] = token;
  } else {
    // Usuario invitado: enviar API Key
    if (!APPSYNC_API_KEY) {
      console.warn(
        '[graphqlFetch] Petición como invitado sin NEXT_PUBLIC_APPSYNC_API_KEY configurada.'
      );
    } else {
      headers['x-api-key'] = APPSYNC_API_KEY;
    }
  }

  // --- Ejecutar la petición ---
  const response = await fetch(APPSYNC_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  const json: GraphQLResponse<T> = await response.json();

  if (json.errors && json.errors.length > 0) {
    console.error('[graphqlFetch] Errores GraphQL:', json.errors);
    throw new Error(json.errors[0]?.message || 'Error en la petición GraphQL');
  }

  return json.data;
}

// ===========================================================================
// Queries
// ===========================================================================

/** Listado de productos con paginación y filtro por marca */
const LIST_PRODUCTS_QUERY = `
  query ListProducts($brand: String, $limit: Int, $nextToken: String) {
    listProducts(brand: $brand, limit: $limit, nextToken: $nextToken) {
      items {
        id
        sku
        name
        description
        brand
        price
        stock
        imageUrl
        category
        isActive
        variants {
          basePrice
          images
        }
      }
      nextToken
    }
  }
`;

// ===========================================================================
// Operaciones de Producto
// ===========================================================================

/**
 * Métodos de alto nivel para interactuar con productos en la API.
 * Encapsulan las queries GraphQL y proporcionan tipado básico.
 */
export const productOperations = {
  /**
   * Lista productos del catálogo con filtros opcionales y paginación.
   *
   * @param brand     - Filtrar por marca (e.g., "Anbor", "Forli"). Omitir para todas.
   * @param limit     - Número máximo de productos por página (default: API decide).
   * @param nextToken - Token de paginación para obtener la siguiente página.
   * @returns         - Objeto con `items` (array de productos) y `nextToken`.
   */
  async listProducts(
    brand?: string,
    limit?: number,
    nextToken?: string
  ) {
    const variables: Record<string, unknown> = {};
    if (brand !== undefined) variables.brand = brand;
    if (limit !== undefined) variables.limit = limit;
    if (nextToken !== undefined) variables.nextToken = nextToken;

    const data = await graphqlFetch<{
      listProducts: {
        items: Array<Record<string, unknown>>;
        nextToken: string | null;
      };
    }>(LIST_PRODUCTS_QUERY, variables);

    return data.listProducts;
  },
};
