import Stripe from 'stripe';
import type { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: 'latest' as any,
});

// Initialize DynamoDB Client
const ddbClient = new DynamoDBClient({});

export const handler: APIGatewayProxyHandler = async (event) => {
  const signature = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return { statusCode: 400, body: 'Missing signature or webhook secret' };
  }

  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body || '',
      signature,
      webhookSecret
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  // Handle the event
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object as Stripe.Checkout.Session;

    // In a real flow, metadata would contain the orderId.
    // session.metadata?.orderId
    // Since we created a "Provisional" order in DB (mocked for now, but in real flow we insert before checkout),
    // we would update it here.

    // For this scope, user asked "Pedido queda paid tras webhook".
    // We assume the sessionId or clientReferenceId matches something.
    // Or we just log it for now as we don't have the order creation logic connecting frontend -> db -> stripe metadata yet.
    // Wait, the CartPage doesn't save to DB yet. It just calls checkout.

    // To satisfy the requirement "Pedido queda 'paid' tras webhook", we ideally need an order created FIRST.
    // But since the current CartPage is mock-only, we can't update a non-existent order.
    // I will log the success for now and leave a TODO for connecting the Order ID logic.

    console.log(`Payment successful for session: ${session.id}`);

    if (session.metadata?.orderId) {
      const TableName = process.env.ORDER_TABLE_NAME;
      if (TableName) {
        try {
          await ddbClient.send(new UpdateItemCommand({
            TableName,
            Key: { id: { S: session.metadata.orderId } },
            UpdateExpression: 'SET paymentStatus = :status, stripePaymentIntentId = :pi, status = :orderStatus',
            ExpressionAttributeValues: {
              ':status': { S: 'PAID' },
              ':pi': { S: session.payment_intent as string },
              ':orderStatus': { S: 'CONFIRMED' } // Update order status to CONFIRMED
            }
          }));
          console.log(`Order ${session.metadata.orderId} updated to PAID`);
        } catch (dbError) {
          console.error('Error updating order status:', dbError);
          // Don't fail the webhook 200 response to Stripe, but log error
        }
      } else {
        console.error('ORDER_TABLE_NAME not set');
      }
    } else {
      console.warn('No orderId in session metadata');
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};