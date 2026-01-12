
import Stripe from 'stripe';
import type { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const dynamoClient = new DynamoDBClient({});
const ORDER_TABLE_NAME = process.env.ORDER_TABLE_NAME;
const PRODUCT_TABLE_NAME = process.env.PRODUCT_TABLE_NAME;

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: 'latest' as any,
});

interface CartItem {
    id: string; // This is the cart item ID, usually
    productId: string; // We might need this if passed from frontend
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
        const userId = body.userId || 'GUEST';
        const shippingAddress = body.shippingAddress || {};

        if (!items || !items.length) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Cart is empty' }),
            };
        }

        // 0. Check Stock
        if (PRODUCT_TABLE_NAME) {
            for (const item of items) {
                const productResult = await dynamoClient.send(new GetItemCommand({
                    TableName: PRODUCT_TABLE_NAME,
                    Key: { id: { S: item.productId } }
                }));

                const product = productResult.Item;
                if (!product) {
                    return { statusCode: 400, body: JSON.stringify({ error: `Product ${item.productId} not found` }) };
                }

                const stock = product.stock ? parseInt(product.stock.N || '0') : 0;
                if (stock < item.quantity) {
                    return { statusCode: 400, body: JSON.stringify({ error: `Insufficient stock for ${product.name?.S}. Available: ${stock}` }) };
                }
            }
        }

        // 1. Calculate totals
        const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        // Shipping Logic
        const shippingMethod = body.shippingMethod || 'standard';
        let shippingCost = 0;
        let carrierName = 'Correos';
        let estimatedDays = 4;

        if (shippingMethod === 'express') {
            shippingCost = 12.99;
            carrierName = 'SEUR';
            estimatedDays = 1;
        } else {
            // Standard
            shippingCost = subtotal >= 100 ? 0 : 5.99;
            carrierName = 'Correos';
            estimatedDays = 4;
        }

        const total = subtotal + shippingCost;

        // Generate Realistic Tracking Number
        const generateTracking = (carrier: string) => {
            const randomNums = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
            if (carrier === 'SEUR') {
                return {
                    number: `SU${randomNums}ES`,
                    url: `https://www.seur.com/livetrac?id=SU${randomNums}ES`
                };
            } else {
                return {
                    number: `PK${randomNums}ES`,
                    url: `https://www.correos.es/es/es/herramientas/localizador/envios/detalle?tracking-number=PK${randomNums}ES`
                };
            }
        }

        const trackingInfo = generateTracking(carrierName);

        // 2. Create Order in DynamoDB (Status: PENDING)
        const orderId = uuidv4();
        const now = new Date().toISOString();

        // Estimated Delivery Date
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + estimatedDays);
        if (deliveryDate.getDay() === 0) deliveryDate.setDate(deliveryDate.getDate() + 1);

        if (ORDER_TABLE_NAME) {
            const item: any = {
                id: { S: orderId },
                userId: { S: userId },
                customerEmail: { S: customerEmail },
                customerName: { S: shippingAddress.firstName ? `${shippingAddress.firstName} ${shippingAddress.lastName}` : 'Guest User' },
                status: { S: 'PENDING' },
                items: { S: JSON.stringify(items) },
                shippingAddress: { S: JSON.stringify(shippingAddress) },
                shippingMethod: { S: shippingMethod },
                carrier: { S: carrierName },
                trackingNumber: { S: trackingInfo.number },
                trackingUrl: { S: trackingInfo.url },
                estimatedDelivery: { S: deliveryDate.toISOString() },
                subtotal: { N: subtotal.toString() },
                shippingCost: { N: shippingCost.toString() },
                totalAmount: { N: total.toString() },
                orderDate: { S: now },
                createdAt: { S: now },
                updatedAt: { S: now },
                paymentStatus: { S: 'PENDING' }
            };

            // Add owner field if user is not guest
            if (userId !== 'GUEST') {
                item.owner = { S: userId }; // This enables allow.owner() rule
            }

            await dynamoClient.send(new PutItemCommand({
                TableName: ORDER_TABLE_NAME,
                Item: item
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
                    product_data: { name: `Envío ${carrierName}`, images: [] },
                    unit_amount: Math.round(shippingCost * 100),
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
