import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../amplify/data/resource';

/**
 * GraphQL Client Configuration
 * Provides typed GraphQL operations for Amplify Data
 */

// Lazy client generation - se genera cuando se necesita
let client: any = null;

function getClient() {
  if (!client) {
    try {
      client = generateClient<Schema>();
      console.log('✅ Cliente GraphQL generado exitosamente');
    } catch (error) {
      console.warn('⚠️ Error generando cliente GraphQL:', error);
      return null;
    }
  }
  return client;
}

// Export types for use in components
export type Product = Schema['Product']['type'];
export type Order = Schema['Order']['type'];
export type User = Schema['User']['type'];

// GraphQL operation types
export type CreateProductInput = Schema['Product']['createType'];
export type UpdateProductInput = Schema['Product']['updateType'];
export type ListProductsQuery = Schema['Product']['listType'];

export type CreateOrderInput = Schema['Order']['createType'];
export type UpdateOrderInput = Schema['Order']['updateType'];
export type ListOrdersQuery = Schema['Order']['listType'];

export type CreateUserInput = Schema['User']['createType'];
export type UpdateUserInput = Schema['User']['updateType'];
export type ListUsersQuery = Schema['User']['listType'];

/**
 * GraphQL Query and Mutation Helpers
 * Provides common operations with error handling
 */

// Product Operations
export const productOperations = {
  // List all products with optional filtering
  async listProducts(filter?: any, limit?: number, nextToken?: string) {
    try {
      const graphqlClient = getClient();
      
      // Verificar si el cliente está disponible
      if (!graphqlClient || !graphqlClient.models || !graphqlClient.models.Product) {
        throw new Error('GraphQL client not available - client.models.Product is undefined');
      }
      
      console.log('🔍 Usando cliente GraphQL real para listar productos');
      const response = await graphqlClient.models.Product.list({
        filter,
        limit,
        nextToken,
      });
      return response;
    } catch (error) {
      console.error('Error listing products:', error);
      throw error;
    }
  },

  // Get product by ID
  async getProduct(id: string) {
    try {
      const graphqlClient = getClient();
      if (!graphqlClient) throw new Error('GraphQL client not available');
      
      const response = await graphqlClient.models.Product.get({ id });
      return response;
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  },

  // Get product by SKU
  async getProductBySku(sku: string) {
    try {
      const graphqlClient = getClient();
      if (!graphqlClient) throw new Error('GraphQL client not available');
      
      const response = await graphqlClient.models.Product.productBySku({ sku });
      return response;
    } catch (error) {
      console.error('Error getting product by SKU:', error);
      throw error;
    }
  },

  // Get products by category
  async getProductsByCategory(category: string, limit?: number) {
    try {
      const graphqlClient = getClient();
      if (!graphqlClient) throw new Error('GraphQL client not available');
      
      const response = await graphqlClient.models.Product.productsByCategory({ 
        category,
        limit 
      });
      return response;
    } catch (error) {
      console.error('Error getting products by category:', error);
      throw error;
    }
  },

  // Create new product (Admin only)
  async createProduct(input: CreateProductInput) {
    try {
      const graphqlClient = getClient();
      if (!graphqlClient) throw new Error('GraphQL client not available');
      
      const response = await graphqlClient.models.Product.create({
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return response;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product (Admin only)
  async updateProduct(input: UpdateProductInput & { id: string }) {
    try {
      const graphqlClient = getClient();
      if (!graphqlClient) throw new Error('GraphQL client not available');
      
      const response = await graphqlClient.models.Product.update({
        ...input,
        updatedAt: new Date().toISOString(),
      });
      return response;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product (Admin only)
  async deleteProduct(id: string) {
    try {
      const graphqlClient = getClient();
      if (!graphqlClient) throw new Error('GraphQL client not available');
      
      const response = await graphqlClient.models.Product.delete({ id });
      return response;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Search products by name or description
  async searchProducts(searchTerm: string, limit?: number) {
    try {
      const graphqlClient = getClient();
      if (!graphqlClient) throw new Error('GraphQL client not available');
      
      const response = await graphqlClient.models.Product.list({
        filter: {
          or: [
            { name: { contains: searchTerm } },
            { description: { contains: searchTerm } },
            { tags: { contains: searchTerm } },
          ],
        },
        limit,
      });
      return response;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },
};

// Order Operations
export const orderOperations = {
  // List orders for current user
  async listUserOrders(userId: string, limit?: number, nextToken?: string) {
    try {
      const graphqlClient = getClient();
      if (!graphqlClient) throw new Error('GraphQL client not available');
      
      const response = await graphqlClient.models.Order.ordersByUser({
        userId,
        limit,
        nextToken,
      });
      return response;
    } catch (error) {
      console.error('Error listing user orders:', error);
      throw error;
    }
  },

  // List all orders (Admin only)
  async listAllOrders(filter?: any, limit?: number, nextToken?: string) {
    try {
      const graphqlClient = getClient();
      if (!graphqlClient) throw new Error('GraphQL client not available');
      
      const response = await graphqlClient.models.Order.list({
        filter,
        limit,
        nextToken,
      });
      return response;
    } catch (error) {
      console.error('Error listing all orders:', error);
      throw error;
    }
  },

  // Get order by ID
  async getOrder(id: string) {
    try {
      const graphqlClient = getClient();
      if (!graphqlClient) throw new Error('GraphQL client not available');
      
      const response = await graphqlClient.models.Order.get({ id });
      return response;
    } catch (error) {
      console.error('Error getting order:', error);
      throw error;
    }
  },

  // Create new order
  async createOrder(input: CreateOrderInput) {
    try {
      const graphqlClient = getClient();
      if (!graphqlClient) throw new Error('GraphQL client not available');
      
      const response = await graphqlClient.models.Order.create({
        ...input,
        orderDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return response;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Update order status (Admin only)
  async updateOrder(input: UpdateOrderInput & { id: string }) {
    try {
      const graphqlClient = getClient();
      if (!graphqlClient) throw new Error('GraphQL client not available');
      
      const response = await graphqlClient.models.Order.update({
        ...input,
        updatedAt: new Date().toISOString(),
      });
      return response;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },
};

// User Operations
export const userOperations = {
  // Get user by email
  async getUserByEmail(email: string) {
    try {
      const graphqlClient = getClient();
      if (!graphqlClient) throw new Error('GraphQL client not available');
      
      const response = await graphqlClient.models.User.userByEmail({ email });
      return response;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  },

  // Create user profile
  async createUser(input: CreateUserInput) {
    try {
      const graphqlClient = getClient();
      if (!graphqlClient) throw new Error('GraphQL client not available');
      
      const response = await graphqlClient.models.User.create({
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return response;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user profile
  async updateUser(input: UpdateUserInput & { id: string }) {
    try {
      const graphqlClient = getClient();
      if (!graphqlClient) throw new Error('GraphQL client not available');
      
      const response = await graphqlClient.models.User.update({
        ...input,
        updatedAt: new Date().toISOString(),
      });
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // List all users (Admin only)
  async listUsers(filter?: any, limit?: number, nextToken?: string) {
    try {
      const graphqlClient = getClient();
      if (!graphqlClient) throw new Error('GraphQL client not available');
      
      const response = await graphqlClient.models.User.list({
        filter,
        limit,
        nextToken,
      });
      return response;
    } catch (error) {
      console.error('Error listing users:', error);
      throw error;
    }
  },
};

/**
 * Error Handling Utilities
 */
export const handleGraphQLError = (error: any): string => {
  if (error?.errors && error.errors.length > 0) {
    return error.errors[0].message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'Ha ocurrido un error inesperado';
};

/**
 * GraphQL Subscription Helpers
 * For real-time updates
 */
export const subscriptions = {
  // Subscribe to product changes
  onProductChange() {
    const graphqlClient = getClient();
    if (!graphqlClient) throw new Error('GraphQL client not available');
    return graphqlClient.models.Product.observeQuery();
  },

  // Subscribe to order changes for a user
  onOrderChange(userId: string) {
    const graphqlClient = getClient();
    if (!graphqlClient) throw new Error('GraphQL client not available');
    return graphqlClient.models.Order.observeQuery({
      filter: { userId: { eq: userId } },
    });
  },

  // Subscribe to all order changes (Admin only)
  onAllOrdersChange() {
    const graphqlClient = getClient();
    if (!graphqlClient) throw new Error('GraphQL client not available');
    return graphqlClient.models.Order.observeQuery();
  },
};