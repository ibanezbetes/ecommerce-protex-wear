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
  discountCode?: string | null;
  discountAmount?: number | null;
}

// ─── Email Templates ──────────────────────────────────────────────────────────

function customerEmailHTML(data: OrderEmailPayload): string {
  const itemsRows = data.items.map(item => `
    <tr>
      <td style="padding:12px 16px; border-bottom:1px solid #f3f4f6; width:60px; vertical-align:middle;">
        ${item.image ? 
          `<img src="${item.image}" alt="${item.name}" style="width:50px; height:50px; object-fit:cover; border-radius:8px; border:1px solid #e5e7eb;" />` : 
          `<div style="width:50px; height:50px; background:#f3f4f6; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#9ca3af; font-size:10px;">PROTEX</div>`
        }
      </td>
      <td style="padding:12px 16px; border-bottom:1px solid #f3f4f6; vertical-align:middle;">
        <strong style="color:#111827; font-size:14px; font-weight:600; display:block;">${item.name}</strong>
        <span style="color:#6b7280; font-size:13px;">Cantidad: ${item.quantity}</span>
      </td>
      <td style="padding:12px 16px; border-bottom:1px solid #f3f4f6; text-align:right; font-weight:600; color:#111827; vertical-align:middle;">
        ${(item.price * item.quantity).toFixed(2)}€
      </td>
    </tr>
  `).join('');

  const paymentMethodLabel: Record<string, string> = {
    card: 'Tarjeta de Crédito/Débito',
    bizum: 'Bizum Comercial',
    bank_transfer: 'Transferencia Bancaria Cobro Diferido',
  };

  const paymentInstructions = data.paymentMethod === 'bank_transfer' ? `
    <!-- Instrucciones Transferencia -->
    <div style="background:#fffbeb; border-left:4px solid #f59e0b; border-radius:8px; padding:20px; margin: 0 0 32px 0;">
      <h4 style="margin:0 0 8px; color:#b45309; font-size:15px; font-weight:700; display:flex; align-items:center; gap:6px;">
        🏛️ Instrucciones para Transferencia Bancaria
      </h4>
      <p style="margin:0 0 12px; color:#78350f; font-size:14px; line-height:1.5;">
        Tu pedido ha sido registrado con éxito. Para proceder al envío, realiza el pago de <strong>${data.total.toFixed(2)}€</strong> a la cuenta indicada a continuación. Introduce el número de pedido como concepto del pago.
      </p>
      <table style="width:100%; font-size:13px; color:#78350f;">
        <tr><td style="padding:4px 0; width:100px;"><strong>Banco:</strong></td><td>CaixaBank</td></tr>
        <tr><td style="padding:4px 0;"><strong>Beneficiario:</strong></td><td>PROTEX WEAR S.L.</td></tr>
        <tr><td style="padding:4px 0;"><strong>IBAN:</strong></td><td style="font-family:monospace; font-weight:bold; font-size:14px;">ES21 2100 0418 4502 0005 6789</td></tr>
        <tr><td style="padding:4px 0;"><strong>Concepto:</strong></td><td style="font-family:monospace; font-weight:bold; font-size:14px; color:#b45309;">${data.orderNumber}</td></tr>
      </table>
    </div>
  ` : data.paymentMethod === 'bizum' ? `
    <!-- Instrucciones Bizum -->
    <div style="background:#ecfdf5; border-left:4px solid #10b981; border-radius:8px; padding:20px; margin: 0 0 32px 0;">
      <h4 style="margin:0 0 8px; color:#065f46; font-size:15px; font-weight:700;">
        📲 Pago Comercial por Bizum
      </h4>
      <p style="margin:0 0 12px; color:#047857; font-size:14px; line-height:1.5;">
        Para completar tu compra, realiza el envío de <strong>${data.total.toFixed(2)}€</strong> por Bizum al teléfono comercial de la empresa. Introduce tu número de pedido como asunto.
      </p>
      <table style="width:100%; font-size:13px; color:#047857;">
        <tr><td style="padding:4px 0; width:120px;"><strong>Teléfono Bizum:</strong></td><td style="font-weight:bold; font-size:15px;">+34 612 345 678</td></tr>
        <tr><td style="padding:4px 0;"><strong>Concepto/Mensaje:</strong></td><td style="font-family:monospace; font-weight:bold; font-size:14px;">${data.orderNumber}</td></tr>
      </table>
    </div>
  ` : '';

  const discountRow = (data.discountCode && data.discountAmount && data.discountAmount > 0) ? `
    <tr>
      <td style="padding:10px 16px; color:#10b981; font-size:14px; font-weight:600;">Descuento (${data.discountCode})</td>
      <td style="padding:10px 16px; text-align:right; color:#10b981; font-size:14px; font-weight:600;">-${data.discountAmount.toFixed(2)}€</td>
    </tr>
  ` : '';

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Pedido ${data.orderNumber}</title>
</head>
<body style="margin:0; padding:0; background-color:#f9fafb; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-radius:16px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #1a365d, #2b6cb0); padding:48px 40px 40px; text-align:center;">
              <div style="font-size:32px; margin-bottom:12px;">🛡️</div>
              <h1 style="margin:0; color:white; font-size:26px; font-weight:800; letter-spacing:-0.5px; line-height:1.2;">
                ¡Tu pedido está en marcha!
              </h1>
              <p style="margin:8px 0 0; color:rgba(255,255,255,0.9); font-size:15px;">
                Gracias por confiar en Protex Wear, ${data.customerName.split(' ')[0]}
              </p>
            </td>
          </tr>

          <!-- Order Number Banner -->
          <tr>
            <td style="background:#1a202c; padding:16px 40px; text-align:center;">
              <p style="margin:0; color:rgba(255,255,255,0.6); font-size:11px; text-transform:uppercase; letter-spacing:0.15em;">Localizador de Pedido</p>
              <p style="margin:4px 0 0; color:#ecc94b; font-size:22px; font-weight:800; font-family:monospace; letter-spacing:0.05em;">${data.orderNumber}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:white; padding:40px;">
              
              <p style="color:#4a5568; font-size:15px; line-height:1.6; margin:0 0 28px;">
                Hola ${data.customerName}, hemos recibido tu pedido y nuestro equipo de logística ya está trabajando en su preparación. A continuación, encontrarás todos los detalles de tu compra.
              </p>

              ${paymentInstructions}

              <!-- Items -->
              <h3 style="margin:0 0 16px; color:#1a202c; font-size:15px; font-weight:700; border-bottom:2px solid #edf2f7; padding-bottom:8px; text-transform:uppercase; letter-spacing:0.05em;">
                Productos del Pedido
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #edf2f7; border-radius:8px; overflow:hidden; margin-bottom:32px;">
                ${itemsRows}
                <tr>
                  <td style="padding:10px 16px; color:#718096; font-size:14px;">Subtotal</td>
                  <td style="padding:10px 16px; text-align:right; color:#4a5568; font-size:14px; font-weight:500;">${data.subtotal.toFixed(2)}€</td>
                </tr>
                ${discountRow}
                <tr>
                  <td style="padding:10px 16px; color:#718096; font-size:14px;">IVA (21%)</td>
                  <td style="padding:10px 16px; text-align:right; color:#4a5568; font-size:14px; font-weight:500;">${data.tax.toFixed(2)}€</td>
                </tr>
                <tr>
                  <td style="padding:10px 16px; color:#718096; font-size:14px;">Envío</td>
                  <td style="padding:10px 16px; text-align:right; color:#718096; font-size:14px;">${data.shippingCost === 0 ? '<span style="color:#48bb78; font-weight:600;">Gratis</span>' : `${data.shippingCost.toFixed(2)}€`}</td>
                </tr>
                <tr style="background:#f7fafc; border-top:1px solid #edf2f7;">
                  <td style="padding:16px 16px; font-weight:800; font-size:18px; color:#1a202c;">Total Final</td>
                  <td style="padding:16px 16px; text-align:right; font-weight:800; font-size:18px; color:#2b6cb0;">${data.total.toFixed(2)}€</td>
                </tr>
              </table>

              <!-- Info columns -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                <tr>
                  <td width="50%" style="vertical-align:top; padding-right:12px;">
                    <div style="background:#f7fafc; border-radius:10px; padding:20px; min-height:140px;">
                      <h4 style="margin:0 0 10px; color:#718096; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; font-weight:700;">Dirección de Envío</h4>
                      <p style="margin:0; color:#2d3748; font-size:13px; line-height:1.6;">
                        <strong>${data.shippingAddress.firstName} ${data.shippingAddress.lastName}</strong><br>
                        ${data.shippingAddress.street}<br>
                        ${data.shippingAddress.postalCode} ${data.shippingAddress.city}<br>
                        ${data.shippingAddress.country}
                      </p>
                    </div>
                  </td>
                  <td width="50%" style="vertical-align:top; padding-left:12px;">
                    <div style="background:#f7fafc; border-radius:10px; padding:20px; min-height:140px;">
                      <h4 style="margin:0 0 10px; color:#718096; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; font-weight:700;">Método de Pago</h4>
                      <p style="margin:0 0 12px; color:#2d3748; font-size:13px; font-weight:600;">
                        ${paymentMethodLabel[data.paymentMethod] || data.paymentMethod}
                      </p>
                      <h4 style="margin:0 0 8px; color:#718096; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; font-weight:700;">Tipo de Envío</h4>
                      <p style="margin:0; color:#2d3748; font-size:13px; font-weight:600;">
                        ${data.shippingMethod === 'express' ? 'Seur Express (24h)' : 'Correos Standard'}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Help CTA -->
              <div style="text-align:center; background:#ebf8ff; border-radius:10px; padding:20px; margin-top:32px;">
                <p style="margin:0 0 4px; color:#2b6cb0; font-size:13px; font-weight:600;">¿Tienes alguna pregunta sobre tu pedido?</p>
                <p style="margin:0; font-size:13px; color:#4a5568;">Escríbenos a <a href="mailto:pedidos@protexwear.com" style="color:#2b6cb0; font-weight:700; text-decoration:none;">pedidos@protexwear.com</a> o responde a este email.</p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1a202c; padding:32px 40px; text-align:center; border-top:1px solid #2d3748;">
              <p style="margin:0 0 6px; color:#a0aec0; font-size:12px; font-weight:600;">Protex Wear — Ropa Laboral y Equipamiento de Seguridad</p>
              <p style="margin:0 0 12px; color:#718096; font-size:11px;">© ${new Date().getFullYear()} Protex Wear S.L. Todos los derechos reservados.</p>
              <div style="font-size:11px; color:#4a5568;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/terminos-y-condiciones" style="color:#718096; text-decoration:underline; margin:0 8px;">Términos de Venta</a> | 
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/politica-de-privacidad" style="color:#718096; text-decoration:underline; margin:0 8px;">Privacidad</a> | 
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/devoluciones" style="color:#718096; text-decoration:underline; margin:0 8px;">Envíos y Devoluciones</a>
              </div>
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
  const itemsList = data.items.map(i => `• ${i.name} [Cant: ${i.quantity}] — ${(i.price * i.quantity).toFixed(2)}€`).join('\n');
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Nuevo Pedido ${data.orderNumber}</title>
</head>
<body style="margin:0; padding:0; background:#f7fafc; font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7fafc; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; box-shadow:0 4px 10px rgba(0,0,0,0.05); border-radius:12px; overflow:hidden; background:white;">
          <tr>
            <td style="background:#2f855a; padding:32px; text-align:center;">
              <h1 style="margin:0; color:white; font-size:22px; font-weight:800;">🔔 NUEVO PEDIDO COMERCIAL RECIBIDO</h1>
              <p style="margin:6px 0 0; color:rgba(255,255,255,0.8); font-size:14px; font-family:monospace;">${data.orderNumber}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px; color:#2d3748;">
                <tr>
                  <td style="padding:10px 0; border-bottom:1px solid #edf2f7; width:130px;"><strong>Cliente:</strong></td>
                  <td style="padding:10px 0; border-bottom:1px solid #edf2f7;"><strong>${data.customerName}</strong> (${data.customerEmail})</td>
                </tr>
                <tr>
                  <td style="padding:10px 0; border-bottom:1px solid #edf2f7; vertical-align:top;"><strong>Dirección Envío:</strong></td>
                  <td style="padding:10px 0; border-bottom:1px solid #edf2f7; line-height:1.5;">
                    ${data.shippingAddress.firstName} ${data.shippingAddress.lastName}<br>
                    ${data.shippingAddress.street}<br>
                    ${data.shippingAddress.postalCode} ${data.shippingAddress.city}<br>
                    ${data.shippingAddress.country}
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0; border-bottom:1px solid #edf2f7;"><strong>Método de Pago:</strong></td>
                  <td style="padding:10px 0; border-bottom:1px solid #edf2f7; text-transform:uppercase; font-weight:bold;">${data.paymentMethod}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0; border-bottom:1px solid #edf2f7;"><strong>Método de Envío:</strong></td>
                  <td style="padding:10px 0; border-bottom:1px solid #edf2f7;">${data.shippingMethod} (Portes: ${data.shippingCost.toFixed(2)}€)</td>
                </tr>
                ${data.discountCode ? `
                <tr>
                  <td style="padding:10px 0; border-bottom:1px solid #edf2f7;"><strong>Descuento Aplicado:</strong></td>
                  <td style="padding:10px 0; border-bottom:1px solid #edf2f7; color:#38a169;">${data.discountCode} (-${data.discountAmount?.toFixed(2)}€)</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding:10px 0; border-bottom:1px solid #edf2f7;"><strong>Total Recaudado:</strong></td>
                  <td style="padding:10px 0; border-bottom:1px solid #edf2f7; color:#2f855a; font-weight:800; font-size:18px;">${data.total.toFixed(2)}€</td>
                </tr>
              </table>
              
              <h3 style="margin:30px 0 12px; color:#1a202c; font-size:15px; font-weight:700;">ARTÍCULOS A PREPARAR:</h3>
              <pre style="background:#f7fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px; font-family:monospace; font-size:13px; color:#2d3748; white-space:pre-wrap; line-height:1.5;">${itemsList}</pre>
              
              <div style="margin-top:30px; text-align:center;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/pedidos" style="background:#2f855a; color:white; padding:12px 24px; border-radius:6px; font-weight:bold; font-size:14px; text-decoration:none; display:inline-block;">Acceder al Panel de Gestión</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#22543d; padding:16px; text-align:center; border-radius:0 0 12px 12px;">
              <p style="margin:0; color:rgba(255,255,255,0.7); font-size:12px;">Notificación Interna del Sistema de Ventas — Protex Wear</p>
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
      from: 'Protex Wear <onboarding@resend.dev>',
      to: data.customerEmail,
      subject: `✅ Pedido ${data.orderNumber} confirmado — Protex Wear`,
      html: customerEmailHTML(data),
    });

    // Email to owner
    const ownerEmail = process.env.OWNER_EMAIL || 'pedidos@protexwear.com';
    await resend.emails.send({
      from: 'Sistema Protex <onboarding@resend.dev>',
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
