import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { validateDiscount, DISCOUNT_CODES } from '@/lib/discounts';

/* ============================================================================
 * /api/checkout — Creación de Stripe Checkout Sessions
 * ============================================================================
 *
 * Recibe los ítems del carrito, coste de envío, y opcionalmente un código
 * de descuento. El código se RE-VALIDA server-side antes de aplicarse.
 *
 * Si hay un descuento válido, se crea (o reutiliza) un Stripe Coupon nativo
 * y se aplica a la sesión, de forma que el usuario ve el precio correcto
 * directamente en la página de pago de Stripe.
 * ========================================================================= */

/**
 * Obtiene o crea un Stripe Coupon para un código de descuento dado.
 *
 * Usa el código como ID del cupón (e.g. "VERANO20") para idempotencia:
 * si ya existe lo reutiliza, si no lo crea.
 */
async function getOrCreateStripeCoupon(
  stripe: Stripe,
  code: string
): Promise<string> {
  const promo = DISCOUNT_CODES[code];
  if (!promo || !promo.active) {
    throw new Error(`Código de descuento "${code}" no válido o inactivo.`);
  }

  // Intentar recuperar un cupón existente con este ID
  try {
    const existing = await stripe.coupons.retrieve(code);
    if (existing && !existing.deleted) {
      return existing.id;
    }
  } catch {
    // No existe → lo creamos
  }

  // Crear el cupón en Stripe
  const couponParams: Stripe.CouponCreateParams = {
    id: code,
    name: `Protex Wear — ${code}`,
    duration: 'once',
  };

  if (promo.type === 'percentage') {
    couponParams.percent_off = promo.value;
  } else {
    couponParams.amount_off = Math.round(promo.value * 100); // centavos
    couponParams.currency = 'eur';
  }

  const coupon = await stripe.coupons.create(couponParams);
  return coupon.id;
}

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Falta STRIPE_SECRET_KEY en las variables de entorno' },
      { status: 500 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const { items, shippingCost, customerEmail, orderNumber, discountCode, paymentMethod } =
      await request.json();

    // ── Line Items ────────────────────────────────────────────────────────
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item: any) => ({
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
    let pmTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] | undefined;
    let pmOptions: Stripe.Checkout.SessionCreateParams.PaymentMethodOptions | undefined;
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
            eu_bank_transfer: { country: 'DE' }
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
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
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
        ...(discountCode ? { discountCode } : {}),
      },
      billing_address_collection: 'auto',
      locale: 'es',
    };

    if (discountCode && typeof discountCode === 'string') {
      const cleanCode = discountCode.trim().toUpperCase();
      const subtotal = items.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      );
      const validation = validateDiscount(cleanCode, subtotal);

      if (validation.valid) {
        const couponId = await getOrCreateStripeCoupon(stripe, cleanCode);
        sessionParams.discounts = [{ coupon: couponId }];
        console.log(
          `[Checkout] Cupón "${couponId}" aplicado a la sesión de Stripe para el pedido ${orderNumber}`
        );
      } else {
        console.warn(
          `[Checkout] Código de descuento "${cleanCode}" rechazado en re-validación:`,
          validation.error
        );
        // No aplicamos descuento, pero seguimos con el checkout sin descuento
        // para no bloquear la venta
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creando la sesión de Stripe:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
