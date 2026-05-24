import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const { items, orderId, userEmail } = await request.json();

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          metadata: {
            productId: item.productId,
            variantId: item.variantId,
          }
        },
        unit_amount: Math.round(item.price * 100), 
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'bizum', 'customer_balance'],
      payment_method_options: {
        customer_balance: {
          funding_type: 'bank_transfer',
          bank_transfer: {
            type: 'eu_bank_transfer',
            eu_bank_transfer: {
              country: 'ES', 
            }
          }
        }
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      customer_email: userEmail || undefined, 
      client_reference_id: orderId, 
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creando la sesión de Stripe:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
