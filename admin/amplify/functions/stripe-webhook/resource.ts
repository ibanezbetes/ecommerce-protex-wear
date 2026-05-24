import { defineFunction } from '@aws-amplify/backend';

/**
 * Stripe Webhook Lambda Function
 * Processes payment webhooks from Stripe and updates order status
 */
export const stripeWebhook = defineFunction({
  entry: './handler.ts',
  environment: {
    // Stripe webhook secret will be set via environment variables
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
    // GraphQL API endpoint for updating orders
    GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT || '',
  },
  timeoutSeconds: 30,
});