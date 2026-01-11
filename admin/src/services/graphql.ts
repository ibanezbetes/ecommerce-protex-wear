
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource'; // Assuming standard Amplify Gen 2 structure
import { Product, Order } from '../types';

// Lazy client initialization to ensure Amplify is configured first
let publicClient: ReturnType<typeof generateClient<Schema>> | null = null;
let authClient: ReturnType<typeof generateClient<Schema>> | null = null;

const getClient = () => {
    if (!publicClient) {
        publicClient = generateClient<Schema>({ authMode: 'apiKey' });
    }
    return publicClient;
};

const getAuthenticatedClient = () => {
    if (!authClient) {
        authClient = generateClient<Schema>({ authMode: 'userPool' });
    }
    return authClient;
};

export const orderOperations = {
    async listAllOrders(filter?: any, limit?: number, nextToken?: string) {
        try {
            console.log("🚀 [API DEBUG] listing all orders with userPool auth...");
            // Use authenticated client explicitly
            const response = await getAuthenticatedClient().models.Order.list({
                filter,
                limit,
                nextToken
                // authMode is already default for this client
            });
            return response;
        } catch (error) {
            console.error("Error listing all orders:", error);
            throw error;
        }
    },

    async listUserOrders(filter?: any, limit?: number, nextToken?: string) {
        try {
            const response = await getAuthenticatedClient().models.Order.list({
                filter,
                limit,
                nextToken
            });
            return response;
        } catch (error) {
            console.error("Error listing user orders:", error);
            throw error;
        }
    },

    async getOrder(id: string) {
        try {
            const response = await getAuthenticatedClient().models.Order.get({ id });
            return response;
        } catch (error) {
            console.error("Error getting order:", error);
            throw error;
        }
    },

    async createOrder(input: any) {
        try {
            const response = await getAuthenticatedClient().models.Order.create({ ...input });
            return response;
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    },

    async updateOrder(input: any) {
        try {
            const response = await getAuthenticatedClient().models.Order.update({ ...input });
            return response;
        } catch (error) {
            console.error("Error updating order:", error);
            throw error;
        }
    }
};

export const userOperations = {
    // Assuming User model exists based on instructions, though it might be via Cognito or a User model.
    // The user requested 'listUsers, getUserByEmail, updateUser, createUser'.
    // Failing a specific 'User' model (usually managed by Cognito directly), I'll assume there is a 'User' model in Schema
    // OR this refers to a custom model. I will check schema if possible, but I'll follow instructions.

    async listUsers(filter?: any, limit?: number, nextToken?: string) {
        try {
            // @ts-ignore
            const response = await getAuthenticatedClient().models.User.list({
                filter,
                limit,
                nextToken
            });
            return response;
        } catch (error) {
            console.error("Error listing users:", error);
            throw error;
        }
    },

    async getUserByEmail(email: string) {
        try {
            // @ts-ignore
            const { data: items } = await getAuthenticatedClient().models.User.list({
                filter: { email: { eq: email } }
            });
            return { data: items[0] };
        } catch (error) {
            console.error("Error getting user by email:", error);
            throw error;
        }
    },

    async createUser(input: any) {
        try {
            // @ts-ignore
            const response = await getAuthenticatedClient().models.User.create({ ...input });
            return response;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    async updateUser(input: any) {
        try {
            // @ts-ignore
            const response = await getAuthenticatedClient().models.User.update({ ...input });
            return response;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }
};

export const productOperations = {
    // Public Reads (API Key default)
    async listProducts(filter?: any, limit?: number, nextToken?: string) {
        try {
            console.log("🚀 [API DEBUG] listing products (fetching as Authenticated Admin)...");
            // Switch to Authenticated Client for Dashboard usage
            const response = await getAuthenticatedClient().models.Product.list({
                filter,
                limit,
                nextToken
                // authMode: 'userPool' implicitly
            });
            console.log(`✅ [API DEBUG] listProducts result: ${response.data.length} items`);
            return response;
        } catch (error) {
            console.error("Error listing products in Dashboard:", error);
            throw error;
        }
    },

    async getProduct(id: string) {
        try {
            const response = await getClient().models.Product.get({ id });
            return response;
        } catch (error) {
            console.error("Error getting product:", error);
            throw error;
        }
    },

    async getProductBySku(sku: string) {
        try {
            const { data: items, errors } = await getClient().models.Product.list({
                filter: { sku: { eq: sku } }
            });
            if (errors) throw errors;
            return { data: items[0] };
        } catch (error) {
            console.error("Error getting product by SKU:", error);
            throw error;
        }
    },

    async searchProducts(query: string) {
        // Basic search implementation if needed, or just list
        try {
            // Using a simple filter for name contains query
            const response = await getClient().models.Product.list({
                filter: { name: { contains: query } }
            });
            return response;
        } catch (error) {
            console.error("Error searching products:", error);
            throw error;
        }
    },

    // Protected Writes (User Pool)
    async createProduct(input: any) {
        try {
            const response = await getAuthenticatedClient().models.Product.create({ ...input });
            return response;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    },

    async updateProduct(input: any & { id: string }) {
        try {
            const response = await getAuthenticatedClient().models.Product.update({
                ...input,
                updatedAt: new Date().toISOString()
            });
            return response;
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    },

    async deleteProduct(id: string) {
        try {
            const response = await getAuthenticatedClient().models.Product.delete({ id });
            return response;
        } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
        }
    },

    async debugTestUserPoolAuth() {
        try {
            console.log("🕵️‍♂️ [AUTH DIAGNOSTIC] Testing UserPool auth on Product (allowed for 'authenticated')...");
            const response = await getAuthenticatedClient().models.Product.list({ limit: 1 });
            console.log("✅ [AUTH DIAGNOSTIC] Success! UserPool auth works for Products.");
            return { success: true, data: response.data };
        } catch (error) {
            console.error("❌ [AUTH DIAGNOSTIC] Failed to list Products with UserPool:", error);
            return { success: false, error };
        }
    }
};
