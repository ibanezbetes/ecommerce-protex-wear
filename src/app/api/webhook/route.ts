import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { graphqlFetch } from '@/services/graphqlClient'; 
import { sendOrderEmails, OrderEmailPayload } from '@/lib/email'; 

const UPDATE_ORDER_STATUS_MUTATION = `
  mutation UpdateOrderStatus($orderId: ID!, $status: String!) {
    updateOrderStatus(orderId: $orderId, status: $status) {
      orderId
      status
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

          // 2. Extraer datos y enviar emails
          try {
            const lineItemsList = await stripe.checkout.sessions.listLineItems(session.id, { expand: ['data.price.product'] });
            
            const parsedShippingAddress = session.metadata?.shippingAddress 
                ? JSON.parse(session.metadata.shippingAddress)
                : {
                    firstName: session.customer_details?.name?.split(' ')[0] || '',
                    lastName: session.customer_details?.name?.split(' ').slice(1).join(' ') || '',
                    street: session.customer_details?.address?.line1 || '',
                    city: session.customer_details?.address?.city || '',
                    postalCode: session.customer_details?.address?.postal_code || '',
                    country: session.customer_details?.address?.country || 'ES',
                  };

            const emailPayload: OrderEmailPayload = {
              orderNumber: orderId,
              customerName: session.customer_details?.name || (parsedShippingAddress.firstName ? `${parsedShippingAddress.firstName} ${parsedShippingAddress.lastName}`.trim() : 'Cliente'),
              customerEmail: session.customer_details?.email || session.customer_email || session.metadata?.customerEmail || '',
              customerCif: session.metadata?.customerCif || '',
              items: lineItemsList.data
                .filter(li => li.description !== 'Gastos de envío')
                .map(li => ({
                  name: li.description || 'Producto',
                  quantity: li.quantity || 1,
                  price: (li.price?.unit_amount || 0) / 100,
                  // Si necesitas la imagen, asegúrate de añadirla en metadata al crear la sesión
                })),
              subtotal: (session.amount_subtotal || 0) / 100, // Ajustar si hay envío
              tax: session.metadata?.tax ? parseFloat(session.metadata.tax) : 0, 
              shippingCost: session.metadata?.shippingCost ? parseFloat(session.metadata.shippingCost) : 0,
              total: (session.amount_total || 0) / 100,
              paymentMethod: session.payment_method_types?.[0] || 'card',
              shippingAddress: parsedShippingAddress,
              shippingMethod: 'agencia_externa',
            };

            // Recalculate subtotal roughly for display if metadata wasn't passed (fallback)
            if (!session.metadata?.tax && emailPayload.total > 0) {
              emailPayload.tax = emailPayload.total - emailPayload.shippingCost - ((emailPayload.total - emailPayload.shippingCost) / 1.21);
            }
            if (emailPayload.total > 0 && !session.metadata?.shippingCost) {
               emailPayload.subtotal = emailPayload.total - emailPayload.shippingCost - emailPayload.tax;
            } else if (session.metadata?.shippingCost) {
               emailPayload.subtotal = emailPayload.total - emailPayload.shippingCost - emailPayload.tax;
            }

            await sendOrderEmails(emailPayload);
            console.log(`✉️ Email de confirmación enviado para pedido ${orderId}`);
          } catch (emailErr) {
            console.error(`[Webhook] Fallo al enviar emails para el pedido ${orderId}:`, emailErr);
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

         // 2. Enviar emails
         try {
            const lineItemsList = await stripe.checkout.sessions.listLineItems(session.id, { expand: ['data.price.product'] });
            
            const parsedShippingAddress = session.metadata?.shippingAddress 
                ? JSON.parse(session.metadata.shippingAddress)
                : {
                    firstName: session.customer_details?.name?.split(' ')[0] || '',
                    lastName: session.customer_details?.name?.split(' ').slice(1).join(' ') || '',
                    street: session.customer_details?.address?.line1 || '',
                    city: session.customer_details?.address?.city || '',
                    postalCode: session.customer_details?.address?.postal_code || '',
                    country: session.customer_details?.address?.country || 'ES',
                  };

            const emailPayload: OrderEmailPayload = {
              orderNumber: orderId,
              customerName: session.customer_details?.name || (parsedShippingAddress.firstName ? `${parsedShippingAddress.firstName} ${parsedShippingAddress.lastName}`.trim() : 'Cliente'),
              customerEmail: session.customer_details?.email || session.customer_email || '',
              customerCif: session.metadata?.customerCif || '',
              items: lineItemsList.data
                .filter(li => li.description !== 'Gastos de envío')
                .map(li => ({
                  name: li.description || 'Producto',
                  quantity: li.quantity || 1,
                  price: (li.price?.unit_amount || 0) / 100,
                })),
              subtotal: 0,
              tax: session.metadata?.tax ? parseFloat(session.metadata.tax) : 0, 
              shippingCost: session.metadata?.shippingCost ? parseFloat(session.metadata.shippingCost) : 0,
              total: (session.amount_total || 0) / 100,
              paymentMethod: 'bank_transfer',
              shippingAddress: parsedShippingAddress,
              shippingMethod: 'agencia_externa',
            };

            if (!session.metadata?.tax && emailPayload.total > 0) {
              emailPayload.tax = emailPayload.total - emailPayload.shippingCost - ((emailPayload.total - emailPayload.shippingCost) / 1.21);
            }
            if (emailPayload.total > 0 && !session.metadata?.shippingCost) {
               emailPayload.subtotal = emailPayload.total - emailPayload.shippingCost - emailPayload.tax;
            } else if (session.metadata?.shippingCost) {
               emailPayload.subtotal = emailPayload.total - emailPayload.shippingCost - emailPayload.tax;
            }

            await sendOrderEmails(emailPayload);
            console.log(`✉️ Email de confirmación enviado para pedido ${orderId}`);
         } catch (emailErr) {
            console.error(`[Webhook] Fallo al enviar emails para el pedido asíncrono ${orderId}:`, emailErr);
         }
      }
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.client_reference_id;
      if (orderId) {
        console.log(`❌ Sesión expirada/Carrito abandonado. Actualizando pedido ${orderId}`);
        try {
          await graphqlFetch(UPDATE_ORDER_STATUS_MUTATION, {
            orderId: orderId,
            status: 'CANCELADO'
          });
        } catch (dbErr) {
          console.warn(`[Webhook] Fallo al actualizar estado de expiración para el pedido ${orderId}:`, dbErr);
        }
      }
    }

    if (event.type === 'charge.refunded') {
      const charge = event.data.object as Stripe.Charge;
      if (charge.payment_intent) {
        try {
          const sessions = await stripe.checkout.sessions.list({ payment_intent: charge.payment_intent as string });
          const orderId = sessions.data[0]?.client_reference_id;
          if (orderId) {
            console.log(`💸 Reembolso detectado. Actualizando pedido ${orderId} a DEVUELTO`);
            await graphqlFetch(UPDATE_ORDER_STATUS_MUTATION, {
              orderId: orderId,
              status: 'DEVUELTO'
            });
          }
        } catch (dbErr) {
          console.warn(`[Webhook] Fallo al actualizar reembolso para el charge ${charge.id}:`, dbErr);
        }
      }
    }

    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('Error interno procesando el Webhook:', error);
    return NextResponse.json({ received: false, error: 'Processed with errors' }, { status: 500 });
  }
}
