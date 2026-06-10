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
            
            const emailPayload: OrderEmailPayload = {
              orderNumber: orderId,
              customerName: session.customer_details?.name || 'Cliente',
              customerEmail: session.customer_details?.email || session.customer_email || '',
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
              tax: 0, // Stripe no calcula tax_amount si no se configuró tax_rates, se calculará abajo
              shippingCost: session.total_details?.amount_shipping ? session.total_details.amount_shipping / 100 : 0,
              total: (session.amount_total || 0) / 100,
              paymentMethod: session.payment_method_types?.[0] || 'card',
              shippingAddress: {
                firstName: session.customer_details?.name?.split(' ')[0] || '',
                lastName: session.customer_details?.name?.split(' ').slice(1).join(' ') || '',
                street: session.customer_details?.address?.line1 || '',
                city: session.customer_details?.address?.city || '',
                postalCode: session.customer_details?.address?.postal_code || '',
                country: session.customer_details?.address?.country || 'ES',
              },
              shippingMethod: 'agencia_externa',
            };

            // Recalculate subtotal/tax roughly for display
            emailPayload.tax = emailPayload.total - emailPayload.shippingCost - ((emailPayload.total - emailPayload.shippingCost) / 1.21);
            emailPayload.subtotal = emailPayload.total - emailPayload.shippingCost - emailPayload.tax;

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
            
            const emailPayload: OrderEmailPayload = {
              orderNumber: orderId,
              customerName: session.customer_details?.name || 'Cliente',
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
              tax: 0,
              shippingCost: session.total_details?.amount_shipping ? session.total_details.amount_shipping / 100 : 0,
              total: (session.amount_total || 0) / 100,
              paymentMethod: 'bank_transfer',
              shippingAddress: {
                firstName: session.customer_details?.name?.split(' ')[0] || '',
                lastName: session.customer_details?.name?.split(' ').slice(1).join(' ') || '',
                street: session.customer_details?.address?.line1 || '',
                city: session.customer_details?.address?.city || '',
                postalCode: session.customer_details?.address?.postal_code || '',
                country: session.customer_details?.address?.country || 'ES',
              },
              shippingMethod: 'agencia_externa',
            };

            emailPayload.tax = emailPayload.total - emailPayload.shippingCost - ((emailPayload.total - emailPayload.shippingCost) / 1.21);
            emailPayload.subtotal = emailPayload.total - emailPayload.shippingCost - emailPayload.tax;

            await sendOrderEmails(emailPayload);
            console.log(`✉️ Email de confirmación enviado para pedido ${orderId}`);
         } catch (emailErr) {
            console.error(`[Webhook] Fallo al enviar emails para el pedido asíncrono ${orderId}:`, emailErr);
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
