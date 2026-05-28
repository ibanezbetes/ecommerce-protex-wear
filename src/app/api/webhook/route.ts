import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { graphqlFetch } from '@/services/graphqlClient'; 

const UPDATE_ORDER_STATUS_MUTATION = `
  mutation UpdateOrderStatus($orderId: ID!, $status: String!) {
    updateOrderStatus(orderId: $orderId, status: $status) {
      orderId
      status
    }
  }
`;

const DECREMENT_STOCK_MUTATION = `
  mutation DecrementProductStock($productId: ID!, $quantity: Int!) {
    decrementProductStock(productId: $productId, quantity: $quantity) {
      id
      stock
    }
  }
`;

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Falta STRIPE_SECRET_KEY' }, { status: 500 });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  
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
          
          // 1. Update order status in database
          try {
            await graphqlFetch(UPDATE_ORDER_STATUS_MUTATION, {
              orderId: orderId,
              status: 'EN_PREPARACION'
            });
          } catch (dbErr) {
            console.warn(`[Webhook] Fallo al actualizar estado del pedido ${orderId} en AppSync:`, dbErr);
          }

          // 2. Retrieve purchased items from Stripe and decrement stock
          try {
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
              expand: ['data.price.product']
            });

            console.log(`📦 Procesando reducción de stock para ${lineItems.data.length} artículos del pedido ${orderId}`);
            for (const item of lineItems.data) {
              const product = item.price?.product as Stripe.Product;
              const productId = product?.metadata?.productId || product?.id;
              const quantity = item.quantity || 1;

              if (productId) {
                console.log(`📉 Decrementando stock: Producto ${productId}, Cantidad: ${quantity}`);
                try {
                  await graphqlFetch(DECREMENT_STOCK_MUTATION, {
                    productId: productId,
                    quantity: quantity
                  });
                } catch (stockErr) {
                  console.warn(`[Webhook] No se pudo decrementar el stock del producto ${productId} en AppSync:`, stockErr);
                }
              }
            }
          } catch (stripeItemsErr) {
            console.warn('[Webhook] Error al listar los artículos del carrito desde Stripe:', stripeItemsErr);
          }

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
         try {
           await graphqlFetch(UPDATE_ORDER_STATUS_MUTATION, {
              orderId: orderId,
              status: 'EN_PREPARACION'
           });
         } catch (dbErr) {
           console.warn(`[Webhook] Fallo al actualizar estado de transferencia para el pedido ${orderId}:`, dbErr);
         }
      }
    }

    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('Error interno procesando el Webhook:', error);
    // Para entornos sandbox, no hacemos fallar el webhook ante errores de red secundarios
    return NextResponse.json({ received: true, warning: 'Processed with minor errors' });
  }
}
