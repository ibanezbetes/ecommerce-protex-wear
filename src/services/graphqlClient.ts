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
    const isUnauthorized = json.errors.some(err => 
      err.message?.toLowerCase().includes('not authorized') || 
      err.message?.toLowerCase().includes('unauthorized') || 
      err.message?.toLowerCase().includes('expired')
    );

    if (isUnauthorized && !isGuest) {
      console.warn('[graphqlFetch] Token de Cognito expirado o no autorizado. Cerrando sesión y reintentando como invitado...');
      
      // Limpiar la sesión expirada del store useAuth
      useAuth.getState().logout();
      
      // Reintentar la consulta de forma recursiva como invitado (usará la API Key en lugar del token expirado)
      return graphqlFetch(query, variables);
    }

    if (isUnauthorized) {
      console.warn('[graphqlFetch] Petición no autorizada / API Key expirada:', json.errors);
    } else {
      console.error('[graphqlFetch] Errores GraphQL:', json.errors);
    }
    throw new Error(json.errors[0]?.message || 'Error en la petición GraphQL');
  }

  return json.data;
}

// ===========================================================================
// Queries
// ===========================================================================

/** Listado de productos con paginación y filtro por marca */
const LIST_PRODUCTS_QUERY = `
  query ListProducts($brand: String, $category: String, $limit: Int, $nextToken: String) {
    listProducts(brand: $brand, category: $category, limit: $limit, nextToken: $nextToken) {
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
   * @param category  - Filtrar por categoría. Omitir para todas.
   * @param limit     - Número máximo de productos por página (default: API decide).
   * @param nextToken - Token de paginación para obtener la siguiente página.
   * @returns         - Objeto con `items` (array de productos) y `nextToken`.
   */
  async listProducts(
    brand?: string,
    category?: string,
    limit?: number,
    nextToken?: string
  ) {
    const variables: Record<string, unknown> = {};
    if (brand !== undefined) variables.brand = brand;
    if (category !== undefined) variables.category = category;
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

// ===========================================================================
// Operaciones de Usuario y Pedidos
// ===========================================================================

const GET_USER_PROFILE_QUERY = `
  query GetUserProfile {
    getUserProfile {
      id
      email
      name
      role
      shippingAddress {
        street
        city
        postalCode
        country
      }
      billingAddress {
        street
        city
        postalCode
        country
      }
      specialPrices {
        productId
        specialPrice
      }
    }
  }
`;

const UPDATE_USER_PROFILE_MUTATION = `
  mutation UpdateUserProfile($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input) {
      id
      name
      shippingAddress {
        street
        city
        postalCode
        country
      }
      billingAddress {
        street
        city
        postalCode
        country
      }
    }
  }
`;

const LIST_USER_ORDERS_QUERY = `
  query ListUserOrders {
    listUserOrders {
      id
      orderDate
      status
      totalAmount
      items {
        productId
        name
        quantity
        priceAtPurchase
      }
    }
  }
`;

export const userOperations = {
  async getUserProfile() {
    const data = await graphqlFetch<{ getUserProfile: Record<string, unknown> }>(GET_USER_PROFILE_QUERY);
    return data.getUserProfile;
  },

  async updateUserProfile(input: Record<string, unknown>) {
    const data = await graphqlFetch<{ updateUserProfile: Record<string, unknown> }>(UPDATE_USER_PROFILE_MUTATION, { input });
    return data.updateUserProfile;
  },

  async listUserOrders() {
    const data = await graphqlFetch<{ listUserOrders: Array<Record<string, unknown>> }>(LIST_USER_ORDERS_QUERY);
    return data.listUserOrders;
  }
};

// ===========================================================================
// Operaciones de Administrador
// ===========================================================================

const LIST_ALL_ORDERS_QUERY = `
  query ListAllOrders($status: String, $email: String, $startDate: String, $endDate: String, $limit: Int, $nextToken: String) {
    listAllOrders(status: $status, email: $email, startDate: $startDate, endDate: $endDate, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        customerEmail
        orderDate
        status
        totalAmount
        items {
          productId
          name
          quantity
          priceAtPurchase
        }
      }
      nextToken
    }
  }
`;

const LIST_USERS_QUERY = `
  query ListUsers($limit: Int, $nextToken: String) {
    listUsers(limit: $limit, nextToken: $nextToken) {
      items {
        id
        email
        name
        role
      }
      nextToken
    }
  }
`;

const SET_SPECIAL_PRICE_MUTATION = `
  mutation SetSpecialPrice($userId: ID!, $productId: ID!, $specialPrice: Float!) {
    setSpecialPrice(userId: $userId, productId: $productId, specialPrice: $specialPrice) {
      userId
      productId
      specialPrice
    }
  }
`;

export const adminOperations = {
  async listAllOrders(filters: any = {}) {
    const data = await graphqlFetch<{ listAllOrders: { items: any[], nextToken?: string } }>(LIST_ALL_ORDERS_QUERY, filters);
    return data.listAllOrders;
  },

  async listUsers(limit?: number, nextToken?: string) {
    const data = await graphqlFetch<{ listUsers: { items: any[], nextToken?: string } }>(LIST_USERS_QUERY, { limit, nextToken });
    return data.listUsers;
  },

  async setSpecialPrice(userId: string, productId: string, specialPrice: number) {
    const data = await graphqlFetch<{ setSpecialPrice: Record<string, unknown> }>(SET_SPECIAL_PRICE_MUTATION, {
      userId,
      productId,
      specialPrice
    });
    return data.setSpecialPrice;
  }
};
