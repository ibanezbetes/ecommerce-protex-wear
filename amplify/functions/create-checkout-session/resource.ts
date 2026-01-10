import { defineFunction, secret } from '@aws-amplify/backend';

export const createCheckoutSession = defineFunction({
    name: 'create-checkout-session',
    entry: './handler.ts',
    environment: {
        STRIPE_SECRET_KEY: secret('STRIPE_SECRET_KEY'),
    },
    timeoutSeconds: 30, // Stripe calls can take a few seconds
});
