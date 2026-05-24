import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { fetchGraphQL } from '@/utils/graphqlClient'; 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const UPDATE_ORDER_STATUS_MUTATION = `
  mutation UpdateOrderStatus($orderId: ID!, $status: String!) {
    updateOrderStatus(orderId: $orderId, status: $status) {
      orderId
      status
    }
  }
`;

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Faltan credenciales del webhook' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error(`⚠️ Error de Firma de Webhook: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.client_reference_id; 

      if (orderId) {
        if (session.payment_status === 'paid') {
          console.log(`✅ Pago completado instantáneo. Actualizando pedido ${orderId}`);
          await fetchGraphQL(UPDATE_ORDER_STATUS_MUTATION, {
            orderId: orderId,
            status: 'EN_PREPARACION'
          });
        } else {
           console.log(`⏳ Pedido ${orderId} guardado. Pendiente de recepción de Transferencia (Asíncrono).`);
        }
      }
    }
    
    if (event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.client_reference_id;
      
      if (orderId) {
         console.log(`✅ Transferencia recibida. Actualizando pedido ${orderId}`);
         await fetchGraphQL(UPDATE_ORDER_STATUS_MUTATION, {
            orderId: orderId,
            status: 'EN_PREPARACION'
         });
      }
    }

    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('Error interno procesando el Webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
