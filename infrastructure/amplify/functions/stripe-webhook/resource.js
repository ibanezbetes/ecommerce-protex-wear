"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhook = void 0;
const backend_1 = require("@aws-amplify/backend");
/**
 * Stripe Webhook Lambda Function
 * Processes payment webhooks from Stripe and updates order status
 */
exports.stripeWebhook = (0, backend_1.defineFunction)({
    entry: './handler.ts',
    environment: {
        // Stripe webhook secret will be set via environment variables
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
        // GraphQL API endpoint for updating orders
        GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT || '',
    },
    timeoutSeconds: 30,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxrREFBc0Q7QUFFdEQ7OztHQUdHO0FBQ1UsUUFBQSxhQUFhLEdBQUcsSUFBQSx3QkFBYyxFQUFDO0lBQzFDLEtBQUssRUFBRSxjQUFjO0lBQ3JCLFdBQVcsRUFBRTtRQUNYLDhEQUE4RDtRQUM5RCxxQkFBcUIsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixJQUFJLEVBQUU7UUFDOUQsMkNBQTJDO1FBQzNDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLElBQUksRUFBRTtLQUNyRDtJQUNELGNBQWMsRUFBRSxFQUFFO0NBQ25CLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRlZmluZUZ1bmN0aW9uIH0gZnJvbSAnQGF3cy1hbXBsaWZ5L2JhY2tlbmQnO1xyXG5cclxuLyoqXHJcbiAqIFN0cmlwZSBXZWJob29rIExhbWJkYSBGdW5jdGlvblxyXG4gKiBQcm9jZXNzZXMgcGF5bWVudCB3ZWJob29rcyBmcm9tIFN0cmlwZSBhbmQgdXBkYXRlcyBvcmRlciBzdGF0dXNcclxuICovXHJcbmV4cG9ydCBjb25zdCBzdHJpcGVXZWJob29rID0gZGVmaW5lRnVuY3Rpb24oe1xyXG4gIGVudHJ5OiAnLi9oYW5kbGVyLnRzJyxcclxuICBlbnZpcm9ubWVudDoge1xyXG4gICAgLy8gU3RyaXBlIHdlYmhvb2sgc2VjcmV0IHdpbGwgYmUgc2V0IHZpYSBlbnZpcm9ubWVudCB2YXJpYWJsZXNcclxuICAgIFNUUklQRV9XRUJIT09LX1NFQ1JFVDogcHJvY2Vzcy5lbnYuU1RSSVBFX1dFQkhPT0tfU0VDUkVUIHx8ICcnLFxyXG4gICAgLy8gR3JhcGhRTCBBUEkgZW5kcG9pbnQgZm9yIHVwZGF0aW5nIG9yZGVyc1xyXG4gICAgR1JBUEhRTF9FTkRQT0lOVDogcHJvY2Vzcy5lbnYuR1JBUEhRTF9FTkRQT0lOVCB8fCAnJyxcclxuICB9LFxyXG4gIHRpbWVvdXRTZWNvbmRzOiAzMCxcclxufSk7Il19