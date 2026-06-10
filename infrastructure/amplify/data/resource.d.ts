import { type ClientSchema } from '@aws-amplify/backend';
/**
 * Protex Wear - Data Models and GraphQL Schema
 * E-commerce platform for work clothing and PPE distribution
 *
 * Models:
 * - Product: Catalog items (SKU, name, price, stock, images)
 * - Order: Customer orders with products and status tracking
 * - User: Extended user profiles with company information
 */
declare const schema: any;
export type Schema = ClientSchema<typeof schema>;
export declare const data: any;
export {};
