
import Stripe from 'stripe';
import type { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const dynamoClient = new DynamoDBClient({});
const ORDER_TABLE_NAME = process.env.ORDER_TABLE_NAME;

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: 'latest' as any,
});

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const body = event.body ? JSON.parse(event.body) : event;
        const items: CartItem[] = body.items;
        const customerEmail = body.customerEmail || 'unknown@guest.com'; // Capture email

        if (!items || !items.length) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Cart is empty' }),
            };
        }

        // 1. Calculate totals
        const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const shippingCost = subtotal >= 100 ? 0 : 5; // 5 EUR constant
        const total = subtotal + shippingCost; // Simplified Tax logic (assumed inclusive or handled)

        // 2. Create Order in DynamoDB (Status: PENDING)
        const orderId = uuidv4();
        const now = new Date().toISOString();

        // Note: Using low-level DynamoDB Client for speed/compatibility in Lambda
        if (ORDER_TABLE_NAME) {
            await dynamoClient.send(new PutItemCommand({
                TableName: ORDER_TABLE_NAME,
                Item: {
                    id: { S: orderId },
                    userId: { S: 'GUEST' }, // Or actual user ID if auth
                    customerEmail: { S: customerEmail },
                    customerName: { S: 'Guest User' }, // Placeholder
                    status: { S: 'PENDING' },
                    items: { S: JSON.stringify(items) },
                    shippingAddress: { S: JSON.stringify({}) }, // Placeholder
                    subtotal: { N: subtotal.toString() },
                    totalAmount: { N: total.toString() },
                    orderDate: { S: now },
                    createdAt: { S: now },
                    updatedAt: { S: now },
                    paymentStatus: { S: 'PENDING' }
                }
            }));
            console.log(`Order created: ${orderId}`);
        } else {
            console.warn('ORDER_TABLE_NAME not set. Order record skipped.');
        }

        // 3. Create Stripe Session
        const lineItems = items.map((item) => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.name,
                    images: [],
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        if (shippingCost > 0) {
            lineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: { name: 'Envío (Tarifa Plana)', images: [] },
                    unit_amount: shippingCost * 100,
                },
                quantity: 1,
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: customerEmail !== 'unknown@guest.com' ? customerEmail : undefined,
            line_items: lineItems,
            mode: 'payment',
            success_url: `${event.headers?.origin || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${event.headers?.origin || 'http://localhost:3000'}/cart`,
            metadata: {
                orderId: orderId, // LINK STRIPE TO OUR DB
            },
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ sessionId: session.id, url: session.url }),
        };

    } catch (error: any) {
        console.error('Error creating checkout session:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
