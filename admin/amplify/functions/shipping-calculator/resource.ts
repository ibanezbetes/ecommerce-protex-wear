import { defineFunction } from '@aws-amplify/backend';

/**
 * Shipping Calculator Lambda Function
 * Calculates shipping costs based on location, weight, and shipping method
 */
export const shippingCalculator = defineFunction({
  entry: './handler.ts',
  environment: {
    // Shipping API keys and configuration
    SHIPPING_API_KEY: process.env.SHIPPING_API_KEY || '',
    DEFAULT_SHIPPING_RATE: process.env.DEFAULT_SHIPPING_RATE || '9.99',
    FREE_SHIPPING_THRESHOLD: process.env.FREE_SHIPPING_THRESHOLD || '100.00',
  },
  timeoutSeconds: 15,
});