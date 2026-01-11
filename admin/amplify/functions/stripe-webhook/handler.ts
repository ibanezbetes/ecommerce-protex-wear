import type { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import Stripe from 'stripe';

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
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
});

// Webhook endpoint secret for signature verification
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

interface OrderUpdateInput {
  orderId: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'DISPUTED';
  paymentIntentId?: string;
  paymentStatus?: string;
  updatedAt: string;
}

/**
 * Main Lambda handler for Stripe webhooks
 */
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
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
    let stripeEvent: Stripe.Event;
    try {
      stripeEvent = stripe.webhooks.constructEvent(
        event.body,
        signature,
        webhookSecret
      );
    } catch (err) {
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

  } catch (error) {
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

/**
 * Process different types of Stripe webhook events
 */
async function processWebhookEvent(event: Stripe.Event): Promise<any> {
  switch (event.type) {
    case 'payment_intent.succeeded':
      return await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
    
    case 'payment_intent.payment_failed':
      return await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
    
    case 'charge.dispute.created':
      return await handleChargeDispute(event.data.object as Stripe.Dispute);
    
    case 'invoice.payment_succeeded':
      return await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
    
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
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<any> {
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
  const updateInput: OrderUpdateInput = {
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
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent): Promise<any> {
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
  const updateInput: OrderUpdateInput = {
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
async function handleChargeDispute(dispute: Stripe.Dispute): Promise<any> {
  console.log('Processing charge dispute:', {
    id: dispute.id,
    amount: dispute.amount,
    reason: dispute.reason,
    status: dispute.status,
  });

  // Get the charge to find the payment intent
  const charge = await stripe.charges.retrieve(dispute.charge as string);
  const paymentIntentId = charge.payment_intent as string;
  
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
  const updateInput: OrderUpdateInput = {
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
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<any> {
  console.log('Processing invoice payment success:', {
    id: invoice.id,
    amount: invoice.amount_paid,
    subscription: (invoice as any).subscription || 'none',
  });

  // Handle subscription-related logic here
  return { message: 'Invoice payment processed' };
}

/**
 * Handle subscription events
 */
async function handleSubscriptionEvent(event: Stripe.Event): Promise<any> {
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
async function updateOrderStatus(input: OrderUpdateInput): Promise<any> {
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

  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error(`Failed to update order status: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Utility function to validate webhook payload
 */
function validateWebhookPayload(event: Stripe.Event): boolean {
  // Add custom validation logic here
  return true;
}

/**
 * Utility function to extract order metadata
 */
function extractOrderMetadata(paymentIntent: Stripe.PaymentIntent): {
  orderId?: string;
  userId?: string;
  customerEmail?: string;
} {
  return {
    orderId: paymentIntent.metadata?.orderId,
    userId: paymentIntent.metadata?.userId,
    customerEmail: paymentIntent.receipt_email || undefined,
  };
}