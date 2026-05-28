import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Falta STRIPE_SECRET_KEY en las variables de entorno' }, { status: 500 });
  }
  
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  
  try {
    const { items, shippingCost, customerEmail, orderNumber } = await request.json();

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          ...(item.image ? { images: [item.image] } : {}),
          metadata: {
            productId: item.id,
          },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add shipping as a separate line item
    if (shippingCost && shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Gastos de envío',
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?order=${orderNumber}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      customer_email: customerEmail || undefined,
      client_reference_id: orderNumber,
      metadata: {
        orderNumber: orderNumber || '',
      },
      // Allows billing address collection
      billing_address_collection: 'auto',
      // Prefill customer info in Stripe's hosted page
      locale: 'es',
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creando la sesión de Stripe:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
