import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderEmailPayload {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  shippingMethod: string;
}

// ─── Email Templates ──────────────────────────────────────────────────────────

function customerEmailHTML(data: OrderEmailPayload): string {
  const itemsRows = data.items.map(item => `
    <tr>
      <td style="padding:12px 16px; border-bottom:1px solid #f3f4f6;">
        <strong style="color:#111827;">${item.name}</strong>
        <br><span style="color:#6b7280; font-size:13px;">x${item.quantity}</span>
      </td>
      <td style="padding:12px 16px; border-bottom:1px solid #f3f4f6; text-align:right; font-weight:600; color:#111827;">
        ${(item.price * item.quantity).toFixed(2)}€
      </td>
    </tr>
  `).join('');

  const paymentMethodLabel: Record<string, string> = {
    card: 'Tarjeta de Crédito/Débito',
    bizum: 'Bizum',
    bank_transfer: 'Transferencia Bancaria',
  };

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Pedido ${data.orderNumber}</title>
</head>
<body style="margin:0; padding:0; background-color:#f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #1e3a6e, #2e559e); border-radius:16px 16px 0 0; padding:40px 40px 32px; text-align:center;">
              <h1 style="margin:0; color:white; font-size:28px; font-weight:800; letter-spacing:-0.5px;">
                ¡Pedido Confirmado! ✅
              </h1>
              <p style="margin:8px 0 0; color:rgba(255,255,255,0.8); font-size:16px;">
                Gracias por tu compra, ${data.customerName.split(' ')[0]}
              </p>
            </td>
          </tr>

          <!-- Order Number Banner -->
          <tr>
            <td style="background:#2e559e; padding:16px 40px; text-align:center;">
              <p style="margin:0; color:rgba(255,255,255,0.7); font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">Número de pedido</p>
              <p style="margin:4px 0 0; color:white; font-size:22px; font-weight:800; font-family:monospace; letter-spacing:0.05em;">${data.orderNumber}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:white; padding:40px;">
              
              <p style="color:#374151; font-size:16px; line-height:1.6; margin:0 0 32px;">
                Hemos recibido tu pedido correctamente y ya lo estamos preparando. 
                Te notificaremos cuando salga de nuestro almacén.
              </p>

              <!-- Items -->
              <h3 style="margin:0 0 16px; color:#111827; font-size:16px; font-weight:700; border-bottom:2px solid #f3f4f6; padding-bottom:12px;">
                Resumen del pedido
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f3f4f6; border-radius:8px; overflow:hidden; margin-bottom:24px;">
                ${itemsRows}
                <tr>
                  <td style="padding:10px 16px; color:#6b7280; font-size:14px;">Subtotal</td>
                  <td style="padding:10px 16px; text-align:right; color:#6b7280; font-size:14px;">${data.subtotal.toFixed(2)}€</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px; color:#6b7280; font-size:14px;">IVA (21%)</td>
                  <td style="padding:10px 16px; text-align:right; color:#6b7280; font-size:14px;">${data.tax.toFixed(2)}€</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px; color:#6b7280; font-size:14px;">Envío</td>
                  <td style="padding:10px 16px; text-align:right; color:#6b7280; font-size:14px;">${data.shippingCost === 0 ? 'Gratis' : `${data.shippingCost.toFixed(2)}€`}</td>
                </tr>
                <tr style="background:#f9fafb;">
                  <td style="padding:14px 16px; font-weight:800; font-size:17px; color:#111827;">Total</td>
                  <td style="padding:14px 16px; text-align:right; font-weight:800; font-size:17px; color:#2e559e;">${data.total.toFixed(2)}€</td>
                </tr>
              </table>

              <!-- Info columns -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td width="50%" style="vertical-align:top; padding-right:16px;">
                    <div style="background:#f9fafb; border-radius:12px; padding:20px;">
                      <h4 style="margin:0 0 12px; color:#6b7280; font-size:11px; text-transform:uppercase; letter-spacing:0.1em;">Dirección de envío</h4>
                      <p style="margin:0; color:#111827; font-size:14px; line-height:1.6;">
                        ${data.shippingAddress.firstName} ${data.shippingAddress.lastName}<br>
                        ${data.shippingAddress.street}<br>
                        ${data.shippingAddress.postalCode} ${data.shippingAddress.city}<br>
                        ${data.shippingAddress.country}
                      </p>
                    </div>
                  </td>
                  <td width="50%" style="vertical-align:top; padding-left:16px;">
                    <div style="background:#f9fafb; border-radius:12px; padding:20px;">
                      <h4 style="margin:0 0 12px; color:#6b7280; font-size:11px; text-transform:uppercase; letter-spacing:0.1em;">Método de pago</h4>
                      <p style="margin:0 0 8px; color:#111827; font-size:14px; font-weight:600;">${paymentMethodLabel[data.paymentMethod] || data.paymentMethod}</p>
                      <h4 style="margin:12px 0 8px; color:#6b7280; font-size:11px; text-transform:uppercase; letter-spacing:0.1em;">Método de envío</h4>
                      <p style="margin:0; color:#111827; font-size:14px; font-weight:600;">${data.shippingMethod === 'express' ? 'Express 24h' : 'Estándar 4-5 días'}</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <div style="text-align:center; background:linear-gradient(135deg, #eff6ff, #dbeafe); border-radius:12px; padding:24px; margin-bottom:24px;">
                <p style="margin:0 0 4px; color:#1e40af; font-size:14px;">¿Necesitas ayuda con tu pedido?</p>
                <a href="mailto:pedidos@protexwear.com" style="color:#2e559e; font-weight:700; font-size:15px; text-decoration:none;">pedidos@protexwear.com</a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1a2a4a; border-radius:0 0 16px 16px; padding:24px 40px; text-align:center;">
              <p style="margin:0 0 4px; color:rgba(255,255,255,0.6); font-size:13px;">© ${new Date().getFullYear()} Protex Wear · Todos los derechos reservados</p>
              <p style="margin:0; color:rgba(255,255,255,0.4); font-size:12px;">Este email es una confirmación automática, no respondas directamente.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function ownerEmailHTML(data: OrderEmailPayload): string {
  const itemsList = data.items.map(i => `• ${i.name} x${i.quantity} — ${(i.price * i.quantity).toFixed(2)}€`).join('\n');
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Nuevo Pedido ${data.orderNumber}</title></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#065f46,#059669);border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:white;font-size:24px;font-weight:800;">🛒 Nuevo Pedido Recibido</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:15px;">${data.orderNumber}</p>
          </td>
        </tr>
        <tr>
          <td style="background:white;padding:40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;"><strong>Cliente:</strong></td>
                <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">${data.customerName} &lt;${data.customerEmail}&gt;</td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;"><strong>Dirección:</strong></td>
                <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">${data.shippingAddress.street}, ${data.shippingAddress.postalCode} ${data.shippingAddress.city}, ${data.shippingAddress.country}</td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;"><strong>Método de pago:</strong></td>
                <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;">${data.paymentMethod}</td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;"><strong>Total:</strong></td>
                <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#059669;font-weight:800;font-size:18px;">${data.total.toFixed(2)}€</td>
              </tr>
            </table>
            <h3 style="margin:24px 0 12px;color:#111827;">Productos:</h3>
            <pre style="background:#f9fafb;border-radius:8px;padding:16px;font-size:14px;color:#374151;white-space:pre-wrap;">${itemsList}</pre>
          </td>
        </tr>
        <tr>
          <td style="background:#065f46;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
            <p style="margin:0;color:rgba(255,255,255,0.7);font-size:13px;">Panel de Protex Wear · Notificación automática de pedido</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `;
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    // If no Resend key, just log and return ok (don't break checkout)
    console.warn('⚠️ RESEND_API_KEY no configurada. Emails no enviados.');
    return NextResponse.json({ sent: false, reason: 'No RESEND_API_KEY' });
  }

  const data: OrderEmailPayload = await request.json();

  try {
    // Email to customer
    await resend.emails.send({
      from: 'Protex Wear <pedidos@protexwear.com>',
      to: data.customerEmail,
      subject: `✅ Pedido ${data.orderNumber} confirmado — Protex Wear`,
      html: customerEmailHTML(data),
    });

    // Email to owner
    const ownerEmail = process.env.OWNER_EMAIL || 'pedidos@protexwear.com';
    await resend.emails.send({
      from: 'Sistema Protex <pedidos@protexwear.com>',
      to: ownerEmail,
      subject: `🛒 Nuevo pedido ${data.orderNumber} — ${data.total.toFixed(2)}€`,
      html: ownerEmailHTML(data),
    });

    return NextResponse.json({ sent: true });
  } catch (error: any) {
    console.error('Error enviando emails:', error);
    return NextResponse.json({ sent: false, error: error.message }, { status: 500 });
  }
}
