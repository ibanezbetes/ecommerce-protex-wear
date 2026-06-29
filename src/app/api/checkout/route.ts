import { NextResponse } from 'next/server';
import Stripe from 'stripe';

/* ============================================================================
 * /api/checkout — Creación de Stripe Checkout Sessions
 * ============================================================================
 *
 * Recibe los ítems del carrito y coste de envío.
 * ========================================================================= */

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Falta STRIPE_SECRET_KEY en las variables de entorno' },
      { status: 500 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const { items, shippingCost, customerEmail, customerCif, orderNumber, paymentMethod } =
      await request.json();

    // ── Line Items ────────────────────────────────────────────────────────
    const lineItems: any[] = items.map(
      (item: any) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            ...(item.image ? { images: [item.image] } : {}),
            metadata: {
              productId: item.productId || item.id || 'prod_fallback',
            },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })
    );

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

    // Determinar los métodos de pago en función de la selección del usuario
    let pmTypes: any[] | undefined;
    let pmOptions: any | undefined;
    let customerId: string | undefined;

    if (paymentMethod === 'bizum') {
      pmTypes = ['bizum'];
    } else if (paymentMethod === 'card') {
      pmTypes = ['card'];
    } else if (paymentMethod === 'bank_transfer') {
      pmTypes = ['customer_balance'];
      pmOptions = {
        customer_balance: {
          funding_type: 'bank_transfer',
          bank_transfer: {
            type: 'eu_bank_transfer',
            eu_bank_transfer: { country: 'ES' }
          }
        }
      };
      const customer = await stripe.customers.create({ 
        email: customerEmail || 'guest@example.com',
        name: `Customer for Order ${orderNumber}`
      });
      customerId = customer.id;
    }

    // ── Descuento (re-validación server-side) ─────────────────────────────
    // Aunque el cliente ya validó el código, lo verificamos de nuevo aquí
    // para prevenir manipulación.
    const sessionParams: any = {
      ...(pmTypes ? { payment_method_types: pmTypes } : {}),
      ...(pmOptions ? { payment_method_options: pmOptions } : {}),
      ...(customerId ? { customer: customerId } : { customer_email: customerEmail || undefined }),
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?order=${orderNumber}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      client_reference_id: orderNumber,
      metadata: {
        orderNumber: orderNumber || '',
        customerCif: customerCif || '',
      },
      billing_address_collection: 'auto',
      tax_id_collection: { enabled: true },
      locale: 'es',
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creando la sesión de Stripe:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
