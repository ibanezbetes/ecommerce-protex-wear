"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const stripe_1 = require("stripe");
/**
 * Stripe Webhook Handler
 * Processes payment events from Stripe and updates order status in DynamoDB
 *
 * Supported Events:
 * - payment_intent.succeeded: Mark order as PROCESSING
 * - payment_intent.payment_failed: Mark order as CANCELLED
 * - charge.dispute.created: Mark order as DISPUTED
 */
// Initialize Stripe with secret key from environment
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-12-15.clover',
});
// Webhook endpoint secret for signature verification
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
/**
 * Main Lambda handler for Stripe webhooks
 */
const handler = async (event) => {
    console.log('Stripe webhook received:', {
        headers: event.headers,
        body: event.body ? 'Present' : 'Missing',
    });
    try {
        // Verify webhook signature
        const signature = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
        if (!signature) {
            console.error('Missing Stripe signature header');
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing Stripe signature' }),
            };
        }
        if (!event.body) {
            console.error('Missing request body');
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing request body' }),
            };
        }
        // Construct and verify the webhook event
        let stripeEvent;
        try {
            stripeEvent = stripe.webhooks.constructEvent(event.body, signature, webhookSecret);
        }
        catch (err) {
            console.error('Webhook signature verification failed:', err);
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid signature' }),
            };
        }
        console.log('Verified Stripe event:', {
            id: stripeEvent.id,
            type: stripeEvent.type,
            created: stripeEvent.created,
        });
        // Process the webhook event
        const result = await processWebhookEvent(stripeEvent);
        return {
            statusCode: 200,
            body: JSON.stringify({
                received: true,
                eventId: stripeEvent.id,
                eventType: stripeEvent.type,
                result,
            }),
        };
    }
    catch (error) {
        console.error('Error processing webhook:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            }),
        };
    }
};
exports.handler = handler;
/**
 * Process different types of Stripe webhook events
 */
async function processWebhookEvent(event) {
    switch (event.type) {
        case 'payment_intent.succeeded':
            return await handlePaymentSucceeded(event.data.object);
        case 'payment_intent.payment_failed':
            return await handlePaymentFailed(event.data.object);
        case 'charge.dispute.created':
            return await handleChargeDispute(event.data.object);
        case 'invoice.payment_succeeded':
            return await handleInvoicePaymentSucceeded(event.data.object);
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
            return await handleSubscriptionEvent(event);
        default:
            console.log(`Unhandled event type: ${event.type}`);
            return { message: `Event type ${event.type} not handled` };
    }
}
/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(paymentIntent) {
    console.log('Processing payment success:', {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
    });
    // Extract order ID from payment intent metadata
    const orderId = paymentIntent.metadata?.orderId;
    if (!orderId) {
        console.warn('No orderId found in payment intent metadata');
        return { message: 'No orderId in metadata' };
    }
    // Update order status to PROCESSING
    const updateInput = {
        orderId,
        status: 'PROCESSING',
        paymentIntentId: paymentIntent.id,
        paymentStatus: 'succeeded',
        updatedAt: new Date().toISOString(),
    };
    return await updateOrderStatus(updateInput);
}
/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent) {
    console.log('Processing payment failure:', {
        id: paymentIntent.id,
        lastPaymentError: paymentIntent.last_payment_error,
    });
    const orderId = paymentIntent.metadata?.orderId;
    if (!orderId) {
        console.warn('No orderId found in payment intent metadata');
        return { message: 'No orderId in metadata' };
    }
    // Update order status to CANCELLED
    const updateInput = {
        orderId,
        status: 'CANCELLED',
        paymentIntentId: paymentIntent.id,
        paymentStatus: 'failed',
        updatedAt: new Date().toISOString(),
    };
    return await updateOrderStatus(updateInput);
}
/**
 * Handle charge dispute
 */
async function handleChargeDispute(dispute) {
    console.log('Processing charge dispute:', {
        id: dispute.id,
        amount: dispute.amount,
        reason: dispute.reason,
        status: dispute.status,
    });
    // Get the charge to find the payment intent
    const charge = await stripe.charges.retrieve(dispute.charge);
    const paymentIntentId = charge.payment_intent;
    if (!paymentIntentId) {
        console.warn('No payment intent found for disputed charge');
        return { message: 'No payment intent for dispute' };
    }
    // Get payment intent to find order ID
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const orderId = paymentIntent.metadata?.orderId;
    if (!orderId) {
        console.warn('No orderId found in payment intent metadata');
        return { message: 'No orderId in metadata' };
    }
    // Update order status to DISPUTED
    const updateInput = {
        orderId,
        status: 'DISPUTED',
        paymentIntentId,
        paymentStatus: 'disputed',
        updatedAt: new Date().toISOString(),
    };
    return await updateOrderStatus(updateInput);
}
/**
 * Handle invoice payment succeeded (for subscriptions)
 */
async function handleInvoicePaymentSucceeded(invoice) {
    console.log('Processing invoice payment success:', {
        id: invoice.id,
        amount: invoice.amount_paid,
        subscription: invoice.subscription || 'none',
    });
    // Handle subscription-related logic here
    return { message: 'Invoice payment processed' };
}
/**
 * Handle subscription events
 */
async function handleSubscriptionEvent(event) {
    console.log('Processing subscription event:', {
        type: event.type,
        id: event.id,
    });
    // Handle subscription-related logic here
    return { message: `Subscription event ${event.type} processed` };
}
/**
 * Update order status in DynamoDB via GraphQL API
 */
async function updateOrderStatus(input) {
    console.log('Updating order status:', input);
    try {
        // In a real implementation, this would make a GraphQL mutation
        // to update the order in DynamoDB. For now, we'll simulate it.
        const mutation = `
      mutation UpdateOrder($input: UpdateOrderInput!) {
        updateOrder(input: $input) {
          id
          status
          paymentIntentId
          paymentStatus
          updatedAt
        }
      }
    `;
        const variables = {
            input: {
                id: input.orderId,
                status: input.status,
                paymentIntentId: input.paymentIntentId,
                paymentStatus: input.paymentStatus,
                updatedAt: input.updatedAt,
            },
        };
        // TODO: Implement actual GraphQL API call using AWS AppSync client
        console.log('Would execute GraphQL mutation:', { mutation, variables });
        return {
            success: true,
            orderId: input.orderId,
            newStatus: input.status,
            message: 'Order status updated successfully',
        };
    }
    catch (error) {
        console.error('Error updating order status:', error);
        throw new Error(`Failed to update order status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
/**
 * Utility function to validate webhook payload
 */
function validateWebhookPayload(event) {
    // Add custom validation logic here
    return true;
}
/**
 * Utility function to extract order metadata
 */
function extractOrderMetadata(paymentIntent) {
    return {
        orderId: paymentIntent.metadata?.orderId,
        userId: paymentIntent.metadata?.userId,
        customerEmail: paymentIntent.receipt_email || undefined,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsbUNBQTRCO0FBRTVCOzs7Ozs7OztHQVFHO0FBRUgscURBQXFEO0FBQ3JELE1BQU0sTUFBTSxHQUFHLElBQUksZ0JBQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixJQUFJLEVBQUUsRUFBRTtJQUM3RCxVQUFVLEVBQUUsbUJBQW1CO0NBQ2hDLENBQUMsQ0FBQztBQUVILHFEQUFxRDtBQUNyRCxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixJQUFJLEVBQUUsQ0FBQztBQVU5RDs7R0FFRztBQUNJLE1BQU0sT0FBTyxHQUEyQixLQUFLLEVBQ2xELEtBQTJCLEVBQ0ssRUFBRTtJQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixFQUFFO1FBQ3RDLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztRQUN0QixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTO0tBQ3pDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQztRQUNILDJCQUEyQjtRQUMzQixNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBRXpGLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQztZQUNqRCxPQUFPO2dCQUNMLFVBQVUsRUFBRSxHQUFHO2dCQUNmLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsS0FBSyxFQUFFLDBCQUEwQixFQUFFLENBQUM7YUFDNUQsQ0FBQztRQUNKLENBQUM7UUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUN0QyxPQUFPO2dCQUNMLFVBQVUsRUFBRSxHQUFHO2dCQUNmLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsS0FBSyxFQUFFLHNCQUFzQixFQUFFLENBQUM7YUFDeEQsQ0FBQztRQUNKLENBQUM7UUFFRCx5Q0FBeUM7UUFDekMsSUFBSSxXQUF5QixDQUFDO1FBQzlCLElBQUksQ0FBQztZQUNILFdBQVcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FDMUMsS0FBSyxDQUFDLElBQUksRUFDVixTQUFTLEVBQ1QsYUFBYSxDQUNkLENBQUM7UUFDSixDQUFDO1FBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0NBQXdDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDN0QsT0FBTztnQkFDTCxVQUFVLEVBQUUsR0FBRztnQkFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEtBQUssRUFBRSxtQkFBbUIsRUFBRSxDQUFDO2FBQ3JELENBQUM7UUFDSixDQUFDO1FBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRTtZQUNwQyxFQUFFLEVBQUUsV0FBVyxDQUFDLEVBQUU7WUFDbEIsSUFBSSxFQUFFLFdBQVcsQ0FBQyxJQUFJO1lBQ3RCLE9BQU8sRUFBRSxXQUFXLENBQUMsT0FBTztTQUM3QixDQUFDLENBQUM7UUFFSCw0QkFBNEI7UUFDNUIsTUFBTSxNQUFNLEdBQUcsTUFBTSxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUV0RCxPQUFPO1lBQ0wsVUFBVSxFQUFFLEdBQUc7WUFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDbkIsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsT0FBTyxFQUFFLFdBQVcsQ0FBQyxFQUFFO2dCQUN2QixTQUFTLEVBQUUsV0FBVyxDQUFDLElBQUk7Z0JBQzNCLE1BQU07YUFDUCxDQUFDO1NBQ0gsQ0FBQztJQUVKLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQywyQkFBMkIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVsRCxPQUFPO1lBQ0wsVUFBVSxFQUFFLEdBQUc7WUFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDbkIsS0FBSyxFQUFFLHVCQUF1QjtnQkFDOUIsT0FBTyxFQUFFLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGVBQWU7YUFDbEUsQ0FBQztTQUNILENBQUM7SUFDSixDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBMUVXLFFBQUEsT0FBTyxXQTBFbEI7QUFFRjs7R0FFRztBQUNILEtBQUssVUFBVSxtQkFBbUIsQ0FBQyxLQUFtQjtJQUNwRCxRQUFRLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNuQixLQUFLLDBCQUEwQjtZQUM3QixPQUFPLE1BQU0sc0JBQXNCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUE4QixDQUFDLENBQUM7UUFFakYsS0FBSywrQkFBK0I7WUFDbEMsT0FBTyxNQUFNLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBOEIsQ0FBQyxDQUFDO1FBRTlFLEtBQUssd0JBQXdCO1lBQzNCLE9BQU8sTUFBTSxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQXdCLENBQUMsQ0FBQztRQUV4RSxLQUFLLDJCQUEyQjtZQUM5QixPQUFPLE1BQU0sNkJBQTZCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUF3QixDQUFDLENBQUM7UUFFbEYsS0FBSywrQkFBK0IsQ0FBQztRQUNyQyxLQUFLLCtCQUErQixDQUFDO1FBQ3JDLEtBQUssK0JBQStCO1lBQ2xDLE9BQU8sTUFBTSx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU5QztZQUNFLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ25ELE9BQU8sRUFBRSxPQUFPLEVBQUUsY0FBYyxLQUFLLENBQUMsSUFBSSxjQUFjLEVBQUUsQ0FBQztJQUMvRCxDQUFDO0FBQ0gsQ0FBQztBQUVEOztHQUVHO0FBQ0gsS0FBSyxVQUFVLHNCQUFzQixDQUFDLGFBQW1DO0lBQ3ZFLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUU7UUFDekMsRUFBRSxFQUFFLGFBQWEsQ0FBQyxFQUFFO1FBQ3BCLE1BQU0sRUFBRSxhQUFhLENBQUMsTUFBTTtRQUM1QixRQUFRLEVBQUUsYUFBYSxDQUFDLFFBQVE7UUFDaEMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxNQUFNO0tBQzdCLENBQUMsQ0FBQztJQUVILGdEQUFnRDtJQUNoRCxNQUFNLE9BQU8sR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQztJQUVoRCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDYixPQUFPLENBQUMsSUFBSSxDQUFDLDZDQUE2QyxDQUFDLENBQUM7UUFDNUQsT0FBTyxFQUFFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxDQUFDO0lBQy9DLENBQUM7SUFFRCxvQ0FBb0M7SUFDcEMsTUFBTSxXQUFXLEdBQXFCO1FBQ3BDLE9BQU87UUFDUCxNQUFNLEVBQUUsWUFBWTtRQUNwQixlQUFlLEVBQUUsYUFBYSxDQUFDLEVBQUU7UUFDakMsYUFBYSxFQUFFLFdBQVc7UUFDMUIsU0FBUyxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFO0tBQ3BDLENBQUM7SUFFRixPQUFPLE1BQU0saUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDOUMsQ0FBQztBQUVEOztHQUVHO0FBQ0gsS0FBSyxVQUFVLG1CQUFtQixDQUFDLGFBQW1DO0lBQ3BFLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUU7UUFDekMsRUFBRSxFQUFFLGFBQWEsQ0FBQyxFQUFFO1FBQ3BCLGdCQUFnQixFQUFFLGFBQWEsQ0FBQyxrQkFBa0I7S0FDbkQsQ0FBQyxDQUFDO0lBRUgsTUFBTSxPQUFPLEdBQUcsYUFBYSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUM7SUFFaEQsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2IsT0FBTyxDQUFDLElBQUksQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO1FBQzVELE9BQU8sRUFBRSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsQ0FBQztJQUMvQyxDQUFDO0lBRUQsbUNBQW1DO0lBQ25DLE1BQU0sV0FBVyxHQUFxQjtRQUNwQyxPQUFPO1FBQ1AsTUFBTSxFQUFFLFdBQVc7UUFDbkIsZUFBZSxFQUFFLGFBQWEsQ0FBQyxFQUFFO1FBQ2pDLGFBQWEsRUFBRSxRQUFRO1FBQ3ZCLFNBQVMsRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRTtLQUNwQyxDQUFDO0lBRUYsT0FBTyxNQUFNLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzlDLENBQUM7QUFFRDs7R0FFRztBQUNILEtBQUssVUFBVSxtQkFBbUIsQ0FBQyxPQUF1QjtJQUN4RCxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixFQUFFO1FBQ3hDLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRTtRQUNkLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtRQUN0QixNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07UUFDdEIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO0tBQ3ZCLENBQUMsQ0FBQztJQUVILDRDQUE0QztJQUM1QyxNQUFNLE1BQU0sR0FBRyxNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFnQixDQUFDLENBQUM7SUFDdkUsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLGNBQXdCLENBQUM7SUFFeEQsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3JCLE9BQU8sQ0FBQyxJQUFJLENBQUMsNkNBQTZDLENBQUMsQ0FBQztRQUM1RCxPQUFPLEVBQUUsT0FBTyxFQUFFLCtCQUErQixFQUFFLENBQUM7SUFDdEQsQ0FBQztJQUVELHNDQUFzQztJQUN0QyxNQUFNLGFBQWEsR0FBRyxNQUFNLE1BQU0sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQzVFLE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDO0lBRWhELElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNiLE9BQU8sQ0FBQyxJQUFJLENBQUMsNkNBQTZDLENBQUMsQ0FBQztRQUM1RCxPQUFPLEVBQUUsT0FBTyxFQUFFLHdCQUF3QixFQUFFLENBQUM7SUFDL0MsQ0FBQztJQUVELGtDQUFrQztJQUNsQyxNQUFNLFdBQVcsR0FBcUI7UUFDcEMsT0FBTztRQUNQLE1BQU0sRUFBRSxVQUFVO1FBQ2xCLGVBQWU7UUFDZixhQUFhLEVBQUUsVUFBVTtRQUN6QixTQUFTLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUU7S0FDcEMsQ0FBQztJQUVGLE9BQU8sTUFBTSxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM5QyxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxLQUFLLFVBQVUsNkJBQTZCLENBQUMsT0FBdUI7SUFDbEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsRUFBRTtRQUNqRCxFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUU7UUFDZCxNQUFNLEVBQUUsT0FBTyxDQUFDLFdBQVc7UUFDM0IsWUFBWSxFQUFHLE9BQWUsQ0FBQyxZQUFZLElBQUksTUFBTTtLQUN0RCxDQUFDLENBQUM7SUFFSCx5Q0FBeUM7SUFDekMsT0FBTyxFQUFFLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxDQUFDO0FBQ2xELENBQUM7QUFFRDs7R0FFRztBQUNILEtBQUssVUFBVSx1QkFBdUIsQ0FBQyxLQUFtQjtJQUN4RCxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxFQUFFO1FBQzVDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtRQUNoQixFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUU7S0FDYixDQUFDLENBQUM7SUFFSCx5Q0FBeUM7SUFDekMsT0FBTyxFQUFFLE9BQU8sRUFBRSxzQkFBc0IsS0FBSyxDQUFDLElBQUksWUFBWSxFQUFFLENBQUM7QUFDbkUsQ0FBQztBQUVEOztHQUVHO0FBQ0gsS0FBSyxVQUFVLGlCQUFpQixDQUFDLEtBQXVCO0lBQ3RELE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFN0MsSUFBSSxDQUFDO1FBQ0gsK0RBQStEO1FBQy9ELCtEQUErRDtRQUUvRCxNQUFNLFFBQVEsR0FBRzs7Ozs7Ozs7OztLQVVoQixDQUFDO1FBRUYsTUFBTSxTQUFTLEdBQUc7WUFDaEIsS0FBSyxFQUFFO2dCQUNMLEVBQUUsRUFBRSxLQUFLLENBQUMsT0FBTztnQkFDakIsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO2dCQUNwQixlQUFlLEVBQUUsS0FBSyxDQUFDLGVBQWU7Z0JBQ3RDLGFBQWEsRUFBRSxLQUFLLENBQUMsYUFBYTtnQkFDbEMsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTO2FBQzNCO1NBQ0YsQ0FBQztRQUVGLG1FQUFtRTtRQUNuRSxPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxFQUFFLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFFeEUsT0FBTztZQUNMLE9BQU8sRUFBRSxJQUFJO1lBQ2IsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO1lBQ3RCLFNBQVMsRUFBRSxLQUFLLENBQUMsTUFBTTtZQUN2QixPQUFPLEVBQUUsbUNBQW1DO1NBQzdDLENBQUM7SUFFSixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsOEJBQThCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckQsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsS0FBSyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztJQUNoSCxDQUFDO0FBQ0gsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBUyxzQkFBc0IsQ0FBQyxLQUFtQjtJQUNqRCxtQ0FBbUM7SUFDbkMsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLG9CQUFvQixDQUFDLGFBQW1DO0lBSy9ELE9BQU87UUFDTCxPQUFPLEVBQUUsYUFBYSxDQUFDLFFBQVEsRUFBRSxPQUFPO1FBQ3hDLE1BQU0sRUFBRSxhQUFhLENBQUMsUUFBUSxFQUFFLE1BQU07UUFDdEMsYUFBYSxFQUFFLGFBQWEsQ0FBQyxhQUFhLElBQUksU0FBUztLQUN4RCxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQVBJR2F0ZXdheVByb3h5SGFuZGxlciwgQVBJR2F0ZXdheVByb3h5RXZlbnQsIEFQSUdhdGV3YXlQcm94eVJlc3VsdCB9IGZyb20gJ2F3cy1sYW1iZGEnO1xyXG5pbXBvcnQgU3RyaXBlIGZyb20gJ3N0cmlwZSc7XHJcblxyXG4vKipcclxuICogU3RyaXBlIFdlYmhvb2sgSGFuZGxlclxyXG4gKiBQcm9jZXNzZXMgcGF5bWVudCBldmVudHMgZnJvbSBTdHJpcGUgYW5kIHVwZGF0ZXMgb3JkZXIgc3RhdHVzIGluIER5bmFtb0RCXHJcbiAqIFxyXG4gKiBTdXBwb3J0ZWQgRXZlbnRzOlxyXG4gKiAtIHBheW1lbnRfaW50ZW50LnN1Y2NlZWRlZDogTWFyayBvcmRlciBhcyBQUk9DRVNTSU5HXHJcbiAqIC0gcGF5bWVudF9pbnRlbnQucGF5bWVudF9mYWlsZWQ6IE1hcmsgb3JkZXIgYXMgQ0FOQ0VMTEVEXHJcbiAqIC0gY2hhcmdlLmRpc3B1dGUuY3JlYXRlZDogTWFyayBvcmRlciBhcyBESVNQVVRFRFxyXG4gKi9cclxuXHJcbi8vIEluaXRpYWxpemUgU3RyaXBlIHdpdGggc2VjcmV0IGtleSBmcm9tIGVudmlyb25tZW50XHJcbmNvbnN0IHN0cmlwZSA9IG5ldyBTdHJpcGUocHJvY2Vzcy5lbnYuU1RSSVBFX1NFQ1JFVF9LRVkgfHwgJycsIHtcclxuICBhcGlWZXJzaW9uOiAnMjAyNS0xMi0xNS5jbG92ZXInLFxyXG59KTtcclxuXHJcbi8vIFdlYmhvb2sgZW5kcG9pbnQgc2VjcmV0IGZvciBzaWduYXR1cmUgdmVyaWZpY2F0aW9uXHJcbmNvbnN0IHdlYmhvb2tTZWNyZXQgPSBwcm9jZXNzLmVudi5TVFJJUEVfV0VCSE9PS19TRUNSRVQgfHwgJyc7XHJcblxyXG5pbnRlcmZhY2UgT3JkZXJVcGRhdGVJbnB1dCB7XHJcbiAgb3JkZXJJZDogc3RyaW5nO1xyXG4gIHN0YXR1czogJ1BFTkRJTkcnIHwgJ1BST0NFU1NJTkcnIHwgJ1NISVBQRUQnIHwgJ0RFTElWRVJFRCcgfCAnQ0FOQ0VMTEVEJyB8ICdESVNQVVRFRCc7XHJcbiAgcGF5bWVudEludGVudElkPzogc3RyaW5nO1xyXG4gIHBheW1lbnRTdGF0dXM/OiBzdHJpbmc7XHJcbiAgdXBkYXRlZEF0OiBzdHJpbmc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNYWluIExhbWJkYSBoYW5kbGVyIGZvciBTdHJpcGUgd2ViaG9va3NcclxuICovXHJcbmV4cG9ydCBjb25zdCBoYW5kbGVyOiBBUElHYXRld2F5UHJveHlIYW5kbGVyID0gYXN5bmMgKFxyXG4gIGV2ZW50OiBBUElHYXRld2F5UHJveHlFdmVudFxyXG4pOiBQcm9taXNlPEFQSUdhdGV3YXlQcm94eVJlc3VsdD4gPT4ge1xyXG4gIGNvbnNvbGUubG9nKCdTdHJpcGUgd2ViaG9vayByZWNlaXZlZDonLCB7XHJcbiAgICBoZWFkZXJzOiBldmVudC5oZWFkZXJzLFxyXG4gICAgYm9keTogZXZlbnQuYm9keSA/ICdQcmVzZW50JyA6ICdNaXNzaW5nJyxcclxuICB9KTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIC8vIFZlcmlmeSB3ZWJob29rIHNpZ25hdHVyZVxyXG4gICAgY29uc3Qgc2lnbmF0dXJlID0gZXZlbnQuaGVhZGVyc1snc3RyaXBlLXNpZ25hdHVyZSddIHx8IGV2ZW50LmhlYWRlcnNbJ1N0cmlwZS1TaWduYXR1cmUnXTtcclxuICAgIFxyXG4gICAgaWYgKCFzaWduYXR1cmUpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignTWlzc2luZyBTdHJpcGUgc2lnbmF0dXJlIGhlYWRlcicpO1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHN0YXR1c0NvZGU6IDQwMCxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGVycm9yOiAnTWlzc2luZyBTdHJpcGUgc2lnbmF0dXJlJyB9KSxcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWV2ZW50LmJvZHkpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignTWlzc2luZyByZXF1ZXN0IGJvZHknKTtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBzdGF0dXNDb2RlOiA0MDAsXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ01pc3NpbmcgcmVxdWVzdCBib2R5JyB9KSxcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDb25zdHJ1Y3QgYW5kIHZlcmlmeSB0aGUgd2ViaG9vayBldmVudFxyXG4gICAgbGV0IHN0cmlwZUV2ZW50OiBTdHJpcGUuRXZlbnQ7XHJcbiAgICB0cnkge1xyXG4gICAgICBzdHJpcGVFdmVudCA9IHN0cmlwZS53ZWJob29rcy5jb25zdHJ1Y3RFdmVudChcclxuICAgICAgICBldmVudC5ib2R5LFxyXG4gICAgICAgIHNpZ25hdHVyZSxcclxuICAgICAgICB3ZWJob29rU2VjcmV0XHJcbiAgICAgICk7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignV2ViaG9vayBzaWduYXR1cmUgdmVyaWZpY2F0aW9uIGZhaWxlZDonLCBlcnIpO1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHN0YXR1c0NvZGU6IDQwMCxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGVycm9yOiAnSW52YWxpZCBzaWduYXR1cmUnIH0pLFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKCdWZXJpZmllZCBTdHJpcGUgZXZlbnQ6Jywge1xyXG4gICAgICBpZDogc3RyaXBlRXZlbnQuaWQsXHJcbiAgICAgIHR5cGU6IHN0cmlwZUV2ZW50LnR5cGUsXHJcbiAgICAgIGNyZWF0ZWQ6IHN0cmlwZUV2ZW50LmNyZWF0ZWQsXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBQcm9jZXNzIHRoZSB3ZWJob29rIGV2ZW50XHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBwcm9jZXNzV2ViaG9va0V2ZW50KHN0cmlwZUV2ZW50KTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzdGF0dXNDb2RlOiAyMDAsXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICByZWNlaXZlZDogdHJ1ZSxcclxuICAgICAgICBldmVudElkOiBzdHJpcGVFdmVudC5pZCxcclxuICAgICAgICBldmVudFR5cGU6IHN0cmlwZUV2ZW50LnR5cGUsXHJcbiAgICAgICAgcmVzdWx0LFxyXG4gICAgICB9KSxcclxuICAgIH07XHJcblxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBwcm9jZXNzaW5nIHdlYmhvb2s6JywgZXJyb3IpO1xyXG4gICAgXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzdGF0dXNDb2RlOiA1MDAsXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICBlcnJvcjogJ0ludGVybmFsIHNlcnZlciBlcnJvcicsXHJcbiAgICAgICAgbWVzc2FnZTogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiAnVW5rbm93biBlcnJvcicsXHJcbiAgICAgIH0pLFxyXG4gICAgfTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogUHJvY2VzcyBkaWZmZXJlbnQgdHlwZXMgb2YgU3RyaXBlIHdlYmhvb2sgZXZlbnRzXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBwcm9jZXNzV2ViaG9va0V2ZW50KGV2ZW50OiBTdHJpcGUuRXZlbnQpOiBQcm9taXNlPGFueT4ge1xyXG4gIHN3aXRjaCAoZXZlbnQudHlwZSkge1xyXG4gICAgY2FzZSAncGF5bWVudF9pbnRlbnQuc3VjY2VlZGVkJzpcclxuICAgICAgcmV0dXJuIGF3YWl0IGhhbmRsZVBheW1lbnRTdWNjZWVkZWQoZXZlbnQuZGF0YS5vYmplY3QgYXMgU3RyaXBlLlBheW1lbnRJbnRlbnQpO1xyXG4gICAgXHJcbiAgICBjYXNlICdwYXltZW50X2ludGVudC5wYXltZW50X2ZhaWxlZCc6XHJcbiAgICAgIHJldHVybiBhd2FpdCBoYW5kbGVQYXltZW50RmFpbGVkKGV2ZW50LmRhdGEub2JqZWN0IGFzIFN0cmlwZS5QYXltZW50SW50ZW50KTtcclxuICAgIFxyXG4gICAgY2FzZSAnY2hhcmdlLmRpc3B1dGUuY3JlYXRlZCc6XHJcbiAgICAgIHJldHVybiBhd2FpdCBoYW5kbGVDaGFyZ2VEaXNwdXRlKGV2ZW50LmRhdGEub2JqZWN0IGFzIFN0cmlwZS5EaXNwdXRlKTtcclxuICAgIFxyXG4gICAgY2FzZSAnaW52b2ljZS5wYXltZW50X3N1Y2NlZWRlZCc6XHJcbiAgICAgIHJldHVybiBhd2FpdCBoYW5kbGVJbnZvaWNlUGF5bWVudFN1Y2NlZWRlZChldmVudC5kYXRhLm9iamVjdCBhcyBTdHJpcGUuSW52b2ljZSk7XHJcbiAgICBcclxuICAgIGNhc2UgJ2N1c3RvbWVyLnN1YnNjcmlwdGlvbi5jcmVhdGVkJzpcclxuICAgIGNhc2UgJ2N1c3RvbWVyLnN1YnNjcmlwdGlvbi51cGRhdGVkJzpcclxuICAgIGNhc2UgJ2N1c3RvbWVyLnN1YnNjcmlwdGlvbi5kZWxldGVkJzpcclxuICAgICAgcmV0dXJuIGF3YWl0IGhhbmRsZVN1YnNjcmlwdGlvbkV2ZW50KGV2ZW50KTtcclxuICAgIFxyXG4gICAgZGVmYXVsdDpcclxuICAgICAgY29uc29sZS5sb2coYFVuaGFuZGxlZCBldmVudCB0eXBlOiAke2V2ZW50LnR5cGV9YCk7XHJcbiAgICAgIHJldHVybiB7IG1lc3NhZ2U6IGBFdmVudCB0eXBlICR7ZXZlbnQudHlwZX0gbm90IGhhbmRsZWRgIH07XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogSGFuZGxlIHN1Y2Nlc3NmdWwgcGF5bWVudFxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gaGFuZGxlUGF5bWVudFN1Y2NlZWRlZChwYXltZW50SW50ZW50OiBTdHJpcGUuUGF5bWVudEludGVudCk6IFByb21pc2U8YW55PiB7XHJcbiAgY29uc29sZS5sb2coJ1Byb2Nlc3NpbmcgcGF5bWVudCBzdWNjZXNzOicsIHtcclxuICAgIGlkOiBwYXltZW50SW50ZW50LmlkLFxyXG4gICAgYW1vdW50OiBwYXltZW50SW50ZW50LmFtb3VudCxcclxuICAgIGN1cnJlbmN5OiBwYXltZW50SW50ZW50LmN1cnJlbmN5LFxyXG4gICAgc3RhdHVzOiBwYXltZW50SW50ZW50LnN0YXR1cyxcclxuICB9KTtcclxuXHJcbiAgLy8gRXh0cmFjdCBvcmRlciBJRCBmcm9tIHBheW1lbnQgaW50ZW50IG1ldGFkYXRhXHJcbiAgY29uc3Qgb3JkZXJJZCA9IHBheW1lbnRJbnRlbnQubWV0YWRhdGE/Lm9yZGVySWQ7XHJcbiAgXHJcbiAgaWYgKCFvcmRlcklkKSB7XHJcbiAgICBjb25zb2xlLndhcm4oJ05vIG9yZGVySWQgZm91bmQgaW4gcGF5bWVudCBpbnRlbnQgbWV0YWRhdGEnKTtcclxuICAgIHJldHVybiB7IG1lc3NhZ2U6ICdObyBvcmRlcklkIGluIG1ldGFkYXRhJyB9O1xyXG4gIH1cclxuXHJcbiAgLy8gVXBkYXRlIG9yZGVyIHN0YXR1cyB0byBQUk9DRVNTSU5HXHJcbiAgY29uc3QgdXBkYXRlSW5wdXQ6IE9yZGVyVXBkYXRlSW5wdXQgPSB7XHJcbiAgICBvcmRlcklkLFxyXG4gICAgc3RhdHVzOiAnUFJPQ0VTU0lORycsXHJcbiAgICBwYXltZW50SW50ZW50SWQ6IHBheW1lbnRJbnRlbnQuaWQsXHJcbiAgICBwYXltZW50U3RhdHVzOiAnc3VjY2VlZGVkJyxcclxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxyXG4gIH07XHJcblxyXG4gIHJldHVybiBhd2FpdCB1cGRhdGVPcmRlclN0YXR1cyh1cGRhdGVJbnB1dCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBIYW5kbGUgZmFpbGVkIHBheW1lbnRcclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVBheW1lbnRGYWlsZWQocGF5bWVudEludGVudDogU3RyaXBlLlBheW1lbnRJbnRlbnQpOiBQcm9taXNlPGFueT4ge1xyXG4gIGNvbnNvbGUubG9nKCdQcm9jZXNzaW5nIHBheW1lbnQgZmFpbHVyZTonLCB7XHJcbiAgICBpZDogcGF5bWVudEludGVudC5pZCxcclxuICAgIGxhc3RQYXltZW50RXJyb3I6IHBheW1lbnRJbnRlbnQubGFzdF9wYXltZW50X2Vycm9yLFxyXG4gIH0pO1xyXG5cclxuICBjb25zdCBvcmRlcklkID0gcGF5bWVudEludGVudC5tZXRhZGF0YT8ub3JkZXJJZDtcclxuICBcclxuICBpZiAoIW9yZGVySWQpIHtcclxuICAgIGNvbnNvbGUud2FybignTm8gb3JkZXJJZCBmb3VuZCBpbiBwYXltZW50IGludGVudCBtZXRhZGF0YScpO1xyXG4gICAgcmV0dXJuIHsgbWVzc2FnZTogJ05vIG9yZGVySWQgaW4gbWV0YWRhdGEnIH07XHJcbiAgfVxyXG5cclxuICAvLyBVcGRhdGUgb3JkZXIgc3RhdHVzIHRvIENBTkNFTExFRFxyXG4gIGNvbnN0IHVwZGF0ZUlucHV0OiBPcmRlclVwZGF0ZUlucHV0ID0ge1xyXG4gICAgb3JkZXJJZCxcclxuICAgIHN0YXR1czogJ0NBTkNFTExFRCcsXHJcbiAgICBwYXltZW50SW50ZW50SWQ6IHBheW1lbnRJbnRlbnQuaWQsXHJcbiAgICBwYXltZW50U3RhdHVzOiAnZmFpbGVkJyxcclxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxyXG4gIH07XHJcblxyXG4gIHJldHVybiBhd2FpdCB1cGRhdGVPcmRlclN0YXR1cyh1cGRhdGVJbnB1dCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBIYW5kbGUgY2hhcmdlIGRpc3B1dGVcclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZUNoYXJnZURpc3B1dGUoZGlzcHV0ZTogU3RyaXBlLkRpc3B1dGUpOiBQcm9taXNlPGFueT4ge1xyXG4gIGNvbnNvbGUubG9nKCdQcm9jZXNzaW5nIGNoYXJnZSBkaXNwdXRlOicsIHtcclxuICAgIGlkOiBkaXNwdXRlLmlkLFxyXG4gICAgYW1vdW50OiBkaXNwdXRlLmFtb3VudCxcclxuICAgIHJlYXNvbjogZGlzcHV0ZS5yZWFzb24sXHJcbiAgICBzdGF0dXM6IGRpc3B1dGUuc3RhdHVzLFxyXG4gIH0pO1xyXG5cclxuICAvLyBHZXQgdGhlIGNoYXJnZSB0byBmaW5kIHRoZSBwYXltZW50IGludGVudFxyXG4gIGNvbnN0IGNoYXJnZSA9IGF3YWl0IHN0cmlwZS5jaGFyZ2VzLnJldHJpZXZlKGRpc3B1dGUuY2hhcmdlIGFzIHN0cmluZyk7XHJcbiAgY29uc3QgcGF5bWVudEludGVudElkID0gY2hhcmdlLnBheW1lbnRfaW50ZW50IGFzIHN0cmluZztcclxuICBcclxuICBpZiAoIXBheW1lbnRJbnRlbnRJZCkge1xyXG4gICAgY29uc29sZS53YXJuKCdObyBwYXltZW50IGludGVudCBmb3VuZCBmb3IgZGlzcHV0ZWQgY2hhcmdlJyk7XHJcbiAgICByZXR1cm4geyBtZXNzYWdlOiAnTm8gcGF5bWVudCBpbnRlbnQgZm9yIGRpc3B1dGUnIH07XHJcbiAgfVxyXG5cclxuICAvLyBHZXQgcGF5bWVudCBpbnRlbnQgdG8gZmluZCBvcmRlciBJRFxyXG4gIGNvbnN0IHBheW1lbnRJbnRlbnQgPSBhd2FpdCBzdHJpcGUucGF5bWVudEludGVudHMucmV0cmlldmUocGF5bWVudEludGVudElkKTtcclxuICBjb25zdCBvcmRlcklkID0gcGF5bWVudEludGVudC5tZXRhZGF0YT8ub3JkZXJJZDtcclxuICBcclxuICBpZiAoIW9yZGVySWQpIHtcclxuICAgIGNvbnNvbGUud2FybignTm8gb3JkZXJJZCBmb3VuZCBpbiBwYXltZW50IGludGVudCBtZXRhZGF0YScpO1xyXG4gICAgcmV0dXJuIHsgbWVzc2FnZTogJ05vIG9yZGVySWQgaW4gbWV0YWRhdGEnIH07XHJcbiAgfVxyXG5cclxuICAvLyBVcGRhdGUgb3JkZXIgc3RhdHVzIHRvIERJU1BVVEVEXHJcbiAgY29uc3QgdXBkYXRlSW5wdXQ6IE9yZGVyVXBkYXRlSW5wdXQgPSB7XHJcbiAgICBvcmRlcklkLFxyXG4gICAgc3RhdHVzOiAnRElTUFVURUQnLFxyXG4gICAgcGF5bWVudEludGVudElkLFxyXG4gICAgcGF5bWVudFN0YXR1czogJ2Rpc3B1dGVkJyxcclxuICAgIHVwZGF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxyXG4gIH07XHJcblxyXG4gIHJldHVybiBhd2FpdCB1cGRhdGVPcmRlclN0YXR1cyh1cGRhdGVJbnB1dCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBIYW5kbGUgaW52b2ljZSBwYXltZW50IHN1Y2NlZWRlZCAoZm9yIHN1YnNjcmlwdGlvbnMpXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVJbnZvaWNlUGF5bWVudFN1Y2NlZWRlZChpbnZvaWNlOiBTdHJpcGUuSW52b2ljZSk6IFByb21pc2U8YW55PiB7XHJcbiAgY29uc29sZS5sb2coJ1Byb2Nlc3NpbmcgaW52b2ljZSBwYXltZW50IHN1Y2Nlc3M6Jywge1xyXG4gICAgaWQ6IGludm9pY2UuaWQsXHJcbiAgICBhbW91bnQ6IGludm9pY2UuYW1vdW50X3BhaWQsXHJcbiAgICBzdWJzY3JpcHRpb246IChpbnZvaWNlIGFzIGFueSkuc3Vic2NyaXB0aW9uIHx8ICdub25lJyxcclxuICB9KTtcclxuXHJcbiAgLy8gSGFuZGxlIHN1YnNjcmlwdGlvbi1yZWxhdGVkIGxvZ2ljIGhlcmVcclxuICByZXR1cm4geyBtZXNzYWdlOiAnSW52b2ljZSBwYXltZW50IHByb2Nlc3NlZCcgfTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEhhbmRsZSBzdWJzY3JpcHRpb24gZXZlbnRzXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVTdWJzY3JpcHRpb25FdmVudChldmVudDogU3RyaXBlLkV2ZW50KTogUHJvbWlzZTxhbnk+IHtcclxuICBjb25zb2xlLmxvZygnUHJvY2Vzc2luZyBzdWJzY3JpcHRpb24gZXZlbnQ6Jywge1xyXG4gICAgdHlwZTogZXZlbnQudHlwZSxcclxuICAgIGlkOiBldmVudC5pZCxcclxuICB9KTtcclxuXHJcbiAgLy8gSGFuZGxlIHN1YnNjcmlwdGlvbi1yZWxhdGVkIGxvZ2ljIGhlcmVcclxuICByZXR1cm4geyBtZXNzYWdlOiBgU3Vic2NyaXB0aW9uIGV2ZW50ICR7ZXZlbnQudHlwZX0gcHJvY2Vzc2VkYCB9O1xyXG59XHJcblxyXG4vKipcclxuICogVXBkYXRlIG9yZGVyIHN0YXR1cyBpbiBEeW5hbW9EQiB2aWEgR3JhcGhRTCBBUElcclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZU9yZGVyU3RhdHVzKGlucHV0OiBPcmRlclVwZGF0ZUlucHV0KTogUHJvbWlzZTxhbnk+IHtcclxuICBjb25zb2xlLmxvZygnVXBkYXRpbmcgb3JkZXIgc3RhdHVzOicsIGlucHV0KTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIC8vIEluIGEgcmVhbCBpbXBsZW1lbnRhdGlvbiwgdGhpcyB3b3VsZCBtYWtlIGEgR3JhcGhRTCBtdXRhdGlvblxyXG4gICAgLy8gdG8gdXBkYXRlIHRoZSBvcmRlciBpbiBEeW5hbW9EQi4gRm9yIG5vdywgd2UnbGwgc2ltdWxhdGUgaXQuXHJcbiAgICBcclxuICAgIGNvbnN0IG11dGF0aW9uID0gYFxyXG4gICAgICBtdXRhdGlvbiBVcGRhdGVPcmRlcigkaW5wdXQ6IFVwZGF0ZU9yZGVySW5wdXQhKSB7XHJcbiAgICAgICAgdXBkYXRlT3JkZXIoaW5wdXQ6ICRpbnB1dCkge1xyXG4gICAgICAgICAgaWRcclxuICAgICAgICAgIHN0YXR1c1xyXG4gICAgICAgICAgcGF5bWVudEludGVudElkXHJcbiAgICAgICAgICBwYXltZW50U3RhdHVzXHJcbiAgICAgICAgICB1cGRhdGVkQXRcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIGA7XHJcblxyXG4gICAgY29uc3QgdmFyaWFibGVzID0ge1xyXG4gICAgICBpbnB1dDoge1xyXG4gICAgICAgIGlkOiBpbnB1dC5vcmRlcklkLFxyXG4gICAgICAgIHN0YXR1czogaW5wdXQuc3RhdHVzLFxyXG4gICAgICAgIHBheW1lbnRJbnRlbnRJZDogaW5wdXQucGF5bWVudEludGVudElkLFxyXG4gICAgICAgIHBheW1lbnRTdGF0dXM6IGlucHV0LnBheW1lbnRTdGF0dXMsXHJcbiAgICAgICAgdXBkYXRlZEF0OiBpbnB1dC51cGRhdGVkQXQsXHJcbiAgICAgIH0sXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIFRPRE86IEltcGxlbWVudCBhY3R1YWwgR3JhcGhRTCBBUEkgY2FsbCB1c2luZyBBV1MgQXBwU3luYyBjbGllbnRcclxuICAgIGNvbnNvbGUubG9nKCdXb3VsZCBleGVjdXRlIEdyYXBoUUwgbXV0YXRpb246JywgeyBtdXRhdGlvbiwgdmFyaWFibGVzIH0pO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgIG9yZGVySWQ6IGlucHV0Lm9yZGVySWQsXHJcbiAgICAgIG5ld1N0YXR1czogaW5wdXQuc3RhdHVzLFxyXG4gICAgICBtZXNzYWdlOiAnT3JkZXIgc3RhdHVzIHVwZGF0ZWQgc3VjY2Vzc2Z1bGx5JyxcclxuICAgIH07XHJcblxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciB1cGRhdGluZyBvcmRlciBzdGF0dXM6JywgZXJyb3IpO1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gdXBkYXRlIG9yZGVyIHN0YXR1czogJHtlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6ICdVbmtub3duIGVycm9yJ31gKTtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVdGlsaXR5IGZ1bmN0aW9uIHRvIHZhbGlkYXRlIHdlYmhvb2sgcGF5bG9hZFxyXG4gKi9cclxuZnVuY3Rpb24gdmFsaWRhdGVXZWJob29rUGF5bG9hZChldmVudDogU3RyaXBlLkV2ZW50KTogYm9vbGVhbiB7XHJcbiAgLy8gQWRkIGN1c3RvbSB2YWxpZGF0aW9uIGxvZ2ljIGhlcmVcclxuICByZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFV0aWxpdHkgZnVuY3Rpb24gdG8gZXh0cmFjdCBvcmRlciBtZXRhZGF0YVxyXG4gKi9cclxuZnVuY3Rpb24gZXh0cmFjdE9yZGVyTWV0YWRhdGEocGF5bWVudEludGVudDogU3RyaXBlLlBheW1lbnRJbnRlbnQpOiB7XHJcbiAgb3JkZXJJZD86IHN0cmluZztcclxuICB1c2VySWQ/OiBzdHJpbmc7XHJcbiAgY3VzdG9tZXJFbWFpbD86IHN0cmluZztcclxufSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG9yZGVySWQ6IHBheW1lbnRJbnRlbnQubWV0YWRhdGE/Lm9yZGVySWQsXHJcbiAgICB1c2VySWQ6IHBheW1lbnRJbnRlbnQubWV0YWRhdGE/LnVzZXJJZCxcclxuICAgIGN1c3RvbWVyRW1haWw6IHBheW1lbnRJbnRlbnQucmVjZWlwdF9lbWFpbCB8fCB1bmRlZmluZWQsXHJcbiAgfTtcclxufSJdfQ==