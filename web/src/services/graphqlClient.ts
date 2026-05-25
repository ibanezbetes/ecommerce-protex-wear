import { useAuth } from '@/store/useAuth';

/**
 * Cliente Ligero de GraphQL (AppSync)
 * Utiliza fetch nativo y Autorización Híbrida (JWT vs API Key).
 */
export const graphqlFetch = async (query: string, variables: Record<string, any> = {}) => {
  const APPSYNC_URL = process.env.NEXT_PUBLIC_APPSYNC_URL;
  const APPSYNC_API_KEY = process.env.NEXT_PUBLIC_APPSYNC_API_KEY;

  if (!APPSYNC_URL) {
    throw new Error('Missing NEXT_PUBLIC_APPSYNC_URL environment variable');
  }

  // Extraemos el JWT del estado global de Zustand
  const { user, isGuest } = useAuth.getState();
  const token = user?.token;

  // Lógica de Autorización Híbrida
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (!isGuest && token) {
    // Usuario autenticado (usando el Cognito JWT)
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    // Usuario invitado (usando la API Key pública)
    if (!APPSYNC_API_KEY) {
      console.warn('⚠️ Requesting as guest but missing NEXT_PUBLIC_APPSYNC_API_KEY.');
    } else {
      headers['x-api-key'] = APPSYNC_API_KEY;
    }
  }

  try {
    const response = await fetch(APPSYNC_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const json = await response.json();

    if (json.errors) {
      console.error('GraphQL Errors:', json.errors);
      throw new Error(json.errors[0]?.message || 'GraphQL Request Error');
    }

    return json.data;
  } catch (error) {
    console.error('GraphQL Fetch Error:', error);
    throw error;
  }
};

// --- QUERIES CUSTOM ---

const LIST_PRODUCTS_QUERY = `
  query ListProducts($brand: String, $limit: Int, $nextToken: String) {
    listProducts(brand: $brand, limit: $limit, nextToken: $nextToken) {
      items {
        id
        sku
        name
        description
        price
        stock
        imageUrl
        category
        isActive
      }
      nextToken
    }
  }
`;

// --- OPERACIONES ---

export const productOperations = {
  /**
   * Listar productos con filtros personalizados
   */
  async listProducts(brand?: string, limit?: number, nextToken?: string) {
    const variables: Record<string, any> = {};
    if (brand !== undefined) variables.brand = brand;
    if (limit !== undefined) variables.limit = limit;
    if (nextToken !== undefined) variables.nextToken = nextToken;

    const data = await graphqlFetch(LIST_PRODUCTS_QUERY, variables);
    return data.listProducts;
  }
};
