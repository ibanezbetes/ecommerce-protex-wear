/**
 * Email Service - Protex Wear
 * Sends order confirmation emails to customer and owner
 * Uses EmailJS (client-side) - no backend required
 */

// ============================================================
// CONFIGURACIÓN DEL NEGOCIO - Editar con datos reales
// ============================================================
export const BUSINESS_CONFIG = {
  name: 'Protex Wear',
  email: 'pedidos@protexwear.com', // ← Cambiar al email real del dueño
  phone: '+34 600 000 000',        // ← Cambiar al teléfono real

  // Métodos de pago
  bankIBAN: 'ES91 2100 0418 4502 0005 1332', // ← Cambiar al IBAN real
  bankBIC: 'CAIXESBBXXX',                     // ← Cambiar al BIC real
  bankName: 'CaixaBank',                      // ← Cambiar al banco real
  bankAccountHolder: 'Protex Wear S.L.',      // ← Cambiar al titular real

  bizumPhone: '+34 600 000 000',              // ← Cambiar al teléfono Bizum real
};
// ============================================================

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  paymentMethod: 'card' | 'bank_transfer' | 'bizum';
  shippingAddress: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    postalCode: string;
    city: string;
    country: string;
  };
  shippingMethod: string;
}

function getPaymentMethodText(method: string): string {
  switch (method) {
    case 'card': return 'Tarjeta de Crédito/Débito (Stripe)';
    case 'bank_transfer': return 'Transferencia Bancaria';
    case 'bizum': return 'Bizum';
    default: return method;
  }
}

function getCountryName(code: string): string {
  const countries: Record<string, string> = {
    ES: 'España', PT: 'Portugal', FR: 'Francia', DE: 'Alemania', IT: 'Italia'
  };
  return countries[code] || code;
}

function formatCurrency(amount: number): string {
  return `€${amount.toFixed(2)}`;
}

function buildCustomerEmailHTML(data: OrderEmailData): string {
  const itemsHTML = data.items.map(item => `
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151;">${item.name}</td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151; text-align: right;">${formatCurrency(item.unitPrice)}</td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #f3f4f6; font-size: 14px; font-weight: 600; color: #1a2a4a; text-align: right;">${formatCurrency(item.totalPrice)}</td>
    </tr>
  `).join('');

  const paymentInstructions = data.paymentMethod === 'bank_transfer' ? `
    <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); border: 1.5px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <h3 style="color: #065f46; font-size: 16px; font-weight: 700; margin: 0 0 16px 0;">🏦 Instrucciones de Transferencia Bancaria</h3>
      <p style="color: #065f46; font-size: 14px; margin: 0 0 12px 0;">Por favor, realiza la transferencia con los siguientes datos:</p>
      <table style="width: 100%;">
        <tr><td style="padding: 6px 0; font-size: 13px; color: #065f46; opacity: 0.7; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; width: 40%;">Banco</td><td style="padding: 6px 0; font-size: 14px; font-weight: 700; color: #065f46; font-family: monospace;">${BUSINESS_CONFIG.bankName}</td></tr>
        <tr><td style="padding: 6px 0; font-size: 13px; color: #065f46; opacity: 0.7; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Titular</td><td style="padding: 6px 0; font-size: 14px; font-weight: 700; color: #065f46; font-family: monospace;">${BUSINESS_CONFIG.bankAccountHolder}</td></tr>
        <tr><td style="padding: 6px 0; font-size: 13px; color: #065f46; opacity: 0.7; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">IBAN</td><td style="padding: 6px 0; font-size: 14px; font-weight: 700; color: #065f46; font-family: monospace;">${BUSINESS_CONFIG.bankIBAN}</td></tr>
        <tr><td style="padding: 6px 0; font-size: 13px; color: #065f46; opacity: 0.7; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">BIC/SWIFT</td><td style="padding: 6px 0; font-size: 14px; font-weight: 700; color: #065f46; font-family: monospace;">${BUSINESS_CONFIG.bankBIC}</td></tr>
        <tr><td style="padding: 6px 0; font-size: 13px; color: #065f46; opacity: 0.7; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Importe</td><td style="padding: 6px 0; font-size: 14px; font-weight: 700; color: #065f46; font-family: monospace;">${formatCurrency(data.total)}</td></tr>
        <tr><td style="padding: 6px 0; font-size: 13px; color: #065f46; opacity: 0.7; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Concepto</td><td style="padding: 6px 0; font-size: 14px; font-weight: 700; color: #065f46; font-family: monospace; background: #d1fae5; padding: 4px 8px; border-radius: 4px;">${data.orderNumber}</td></tr>
      </table>
      <p style="color: #065f46; font-size: 13px; margin: 16px 0 0 0; padding: 12px; background: rgba(255,255,255,0.5); border-radius: 8px;">⚠️ <strong>Importante:</strong> Indica el número de pedido <strong>${data.orderNumber}</strong> como concepto de la transferencia para que podamos identificar tu pago.</p>
    </div>
  ` : data.paymentMethod === 'bizum' ? `
    <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); border: 1.5px solid #bfdbfe; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <h3 style="color: #1e40af; font-size: 16px; font-weight: 700; margin: 0 0 16px 0;">📱 Instrucciones de Bizum</h3>
      <p style="color: #1e40af; font-size: 14px; margin: 0 0 12px 0;">Envía el pago mediante Bizum al siguiente número:</p>
      <div style="background: white; border-radius: 10px; padding: 16px; text-align: center; margin: 12px 0; border: 2px solid rgba(59, 130, 246, 0.2);">
        <div style="font-size: 28px; font-weight: 900; color: #1e40af; font-family: monospace; letter-spacing: 2px;">${BUSINESS_CONFIG.bizumPhone}</div>
        <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">${BUSINESS_CONFIG.name}</div>
      </div>
      <table style="width: 100%;">
        <tr><td style="padding: 6px 0; font-size: 13px; color: #1e40af; opacity: 0.7; font-weight: 600; text-transform: uppercase; width: 40%;">Importe</td><td style="padding: 6px 0; font-size: 14px; font-weight: 700; color: #1e40af; font-family: monospace;">${formatCurrency(data.total)}</td></tr>
        <tr><td style="padding: 6px 0; font-size: 13px; color: #1e40af; opacity: 0.7; font-weight: 600; text-transform: uppercase;">Concepto</td><td style="padding: 6px 0; font-size: 14px; font-weight: 700; color: #1e40af; font-family: monospace; background: #dbeafe; padding: 4px 8px; border-radius: 4px;">${data.orderNumber}</td></tr>
      </table>
      <p style="color: #1e40af; font-size: 13px; margin: 16px 0 0 0; padding: 12px; background: rgba(255,255,255,0.5); border-radius: 8px;">⚠️ <strong>Importante:</strong> Indica el número de pedido <strong>${data.orderNumber}</strong> como concepto del Bizum.</p>
    </div>
  ` : '';

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Pedido - ${BUSINESS_CONFIG.name}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 32px 16px;">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1e3a6e 0%, #2e559e 50%, #3a6bc9 100%); border-radius: 16px 16px 0 0; padding: 40px 32px; text-align: center;">
      <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.15); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px; font-size: 32px;">🛡️</div>
      <h1 style="color: white; font-size: 24px; font-weight: 700; margin: 0 0 8px 0;">${BUSINESS_CONFIG.name}</h1>
      <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin: 0;">Protección de alta calidad</p>
    </div>

    <!-- Body -->
    <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 8px 40px rgba(0,0,0,0.08);">

      <!-- Success message -->
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="width: 72px; height: 72px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px; font-size: 32px;">✓</div>
        <h2 style="color: #1a2a4a; font-size: 22px; font-weight: 700; margin: 0 0 8px 0;">¡Pedido confirmado!</h2>
        <p style="color: #6b7280; font-size: 15px; margin: 0;">Gracias, <strong>${data.customerName}</strong>. Hemos recibido tu pedido correctamente.</p>
      </div>

      <!-- Order number banner -->
      <div style="background: linear-gradient(135deg, #f0f4ff, #eef2ff); border: 1.5px solid rgba(46, 85, 158, 0.15); border-radius: 12px; padding: 16px 24px; text-align: center; margin-bottom: 28px;">
        <p style="font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 4px 0;">Número de Pedido</p>
        <p style="font-size: 20px; font-weight: 900; color: #2e559e; font-family: monospace; letter-spacing: 0.05em; margin: 0;">${data.orderNumber}</p>
      </div>

      <!-- Payment instructions if needed -->
      ${paymentInstructions}

      <!-- Items table -->
      <h3 style="color: #1a2a4a; font-size: 16px; font-weight: 700; margin: 0 0 16px 0; padding-bottom: 12px; border-bottom: 2px solid #f3f4f6;">🛍️ Productos</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="padding: 10px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Producto</th>
            <th style="padding: 10px 16px; text-align: center; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Cant.</th>
            <th style="padding: 10px 16px; text-align: right; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">P.U.</th>
            <th style="padding: 10px 16px; text-align: right; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <!-- Totals -->
      <div style="background: #f9fafb; border-radius: 12px; padding: 20px 24px; margin-bottom: 28px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-size: 14px; color: #6b7280;">Subtotal</span>
          <span style="font-size: 14px; color: #374151;">${formatCurrency(data.subtotal)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-size: 14px; color: #6b7280;">IVA (21%)</span>
          <span style="font-size: 14px; color: #374151;">${formatCurrency(data.tax)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
          <span style="font-size: 14px; color: #6b7280;">Envío</span>
          <span style="font-size: 14px; color: ${data.shippingCost === 0 ? '#10b981' : '#374151'};">${data.shippingCost === 0 ? 'Gratis' : formatCurrency(data.shippingCost)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding-top: 16px; border-top: 2px solid #e5e7eb;">
          <span style="font-size: 17px; font-weight: 700; color: #1a2a4a;">Total</span>
          <span style="font-size: 17px; font-weight: 700; color: #2e559e;">${formatCurrency(data.total)}</span>
        </div>
      </div>

      <!-- Shipping address -->
      <div style="margin-bottom: 28px;">
        <h3 style="color: #1a2a4a; font-size: 16px; font-weight: 700; margin: 0 0 12px 0;">📦 Dirección de Envío</h3>
        <div style="background: #f8faff; border: 1px solid rgba(46, 85, 158, 0.1); border-radius: 10px; padding: 16px 20px;">
          <p style="color: #374151; font-size: 14px; margin: 0; line-height: 1.7;">
            <strong>${data.shippingAddress.firstName} ${data.shippingAddress.lastName}</strong><br>
            ${data.shippingAddress.addressLine1}<br>
            ${data.shippingAddress.postalCode} ${data.shippingAddress.city}<br>
            ${getCountryName(data.shippingAddress.country)}
          </p>
        </div>
      </div>

      <!-- Payment method -->
      <div style="margin-bottom: 32px;">
        <h3 style="color: #1a2a4a; font-size: 16px; font-weight: 700; margin: 0 0 12px 0;">💳 Método de Pago</h3>
        <div style="background: #f8faff; border: 1px solid rgba(46, 85, 158, 0.1); border-radius: 10px; padding: 14px 20px;">
          <p style="color: #374151; font-size: 14px; margin: 0;">${getPaymentMethodText(data.paymentMethod)}</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding-top: 24px; border-top: 1px solid #f3f4f6;">
        <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px 0;">¿Tienes alguna pregunta? Contáctanos en</p>
        <a href="mailto:${BUSINESS_CONFIG.email}" style="color: #2e559e; font-weight: 600; font-size: 14px; text-decoration: none;">${BUSINESS_CONFIG.email}</a>
        <p style="color: #9ca3af; font-size: 12px; margin: 16px 0 0 0;">© ${new Date().getFullYear()} ${BUSINESS_CONFIG.name}. Todos los derechos reservados.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

function buildOwnerEmailHTML(data: OrderEmailData): string {
  const itemsHTML = data.items.map(item => `
    <tr>
      <td style="padding: 10px 14px; border-bottom: 1px solid #f3f4f6; font-size: 13px; color: #374151;">${item.name}</td>
      <td style="padding: 10px 14px; border-bottom: 1px solid #f3f4f6; font-size: 13px; color: #374151; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px 14px; border-bottom: 1px solid #f3f4f6; font-size: 13px; font-weight: 600; color: #1a2a4a; text-align: right;">${formatCurrency(item.totalPrice)}</td>
    </tr>
  `).join('');

  const paymentStatusColor = data.paymentMethod === 'card' ? '#10b981' : '#f59e0b';
  const paymentStatusText = data.paymentMethod === 'card' ? '✅ Pagado (Stripe)' : `⏳ Pendiente (${getPaymentMethodText(data.paymentMethod)})`;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Nuevo Pedido - ${data.orderNumber}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 560px; margin: 0 auto; padding: 24px 16px;">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1e3a6e, #2e559e); border-radius: 12px 12px 0 0; padding: 24px 28px;">
      <p style="color: rgba(255,255,255,0.7); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 6px 0;">🛡️ ${BUSINESS_CONFIG.name} — Panel de Pedidos</p>
      <h1 style="color: white; font-size: 20px; font-weight: 700; margin: 0;">🛎️ Nuevo Pedido Recibido</h1>
    </div>

    <!-- Body -->
    <div style="background: white; padding: 28px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">

      <!-- Key info -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;">
        <div style="background: #f0f4ff; border-radius: 10px; padding: 14px 16px;">
          <p style="font-size: 11px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">Pedido</p>
          <p style="font-size: 15px; font-weight: 700; color: #2e559e; font-family: monospace; margin: 0;">${data.orderNumber}</p>
        </div>
        <div style="background: ${data.paymentMethod === 'card' ? '#f0fdf4' : '#fffbeb'}; border-radius: 10px; padding: 14px 16px;">
          <p style="font-size: 11px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0;">Estado Pago</p>
          <p style="font-size: 13px; font-weight: 700; color: ${paymentStatusColor}; margin: 0;">${paymentStatusText}</p>
        </div>
      </div>

      <!-- Customer -->
      <div style="background: #f9fafb; border-radius: 10px; padding: 16px 20px; margin-bottom: 20px;">
        <h3 style="color: #374151; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 10px 0;">Cliente</h3>
        <p style="color: #1a2a4a; font-size: 14px; margin: 0 0 4px 0;"><strong>${data.customerName}</strong></p>
        <p style="color: #6b7280; font-size: 13px; margin: 0;"><a href="mailto:${data.customerEmail}" style="color: #2e559e;">${data.customerEmail}</a></p>
      </div>

      <!-- Items -->
      <h3 style="color: #374151; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px 0;">Productos</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #f3f4f6; border-radius: 10px; overflow: hidden;">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="padding: 10px 14px; text-align: left; font-size: 12px; color: #9ca3af;">Producto</th>
            <th style="padding: 10px 14px; text-align: center; font-size: 12px; color: #9ca3af;">Cant.</th>
            <th style="padding: 10px 14px; text-align: right; font-size: 12px; color: #9ca3af;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHTML}</tbody>
      </table>

      <!-- Total -->
      <div style="background: linear-gradient(135deg, #f0f4ff, #eef2ff); border-radius: 10px; padding: 16px 20px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 16px; font-weight: 700; color: #1a2a4a;">Total del pedido</span>
        <span style="font-size: 20px; font-weight: 900; color: #2e559e;">${formatCurrency(data.total)}</span>
      </div>

      <!-- Shipping -->
      <div style="background: #f9fafb; border-radius: 10px; padding: 16px 20px; margin-bottom: 20px;">
        <h3 style="color: #374151; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 10px 0;">Dirección de Envío</h3>
        <p style="color: #374151; font-size: 13px; margin: 0; line-height: 1.7;">
          ${data.shippingAddress.firstName} ${data.shippingAddress.lastName}<br>
          ${data.shippingAddress.addressLine1}<br>
          ${data.shippingAddress.postalCode} ${data.shippingAddress.city}<br>
          ${getCountryName(data.shippingAddress.country)}
        </p>
      </div>

      <!-- Payment method reminder -->
      ${data.paymentMethod !== 'card' ? `
      <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 10px; padding: 16px 20px;">
        <p style="color: #92400e; font-size: 13px; font-weight: 700; margin: 0 0 6px 0;">⚠️ Acción requerida — Pendiente de verificar pago</p>
        <p style="color: #78350f; font-size: 13px; margin: 0;">El cliente ha seleccionado <strong>${getPaymentMethodText(data.paymentMethod)}</strong>. Verifica el pago de <strong>${formatCurrency(data.total)}</strong> con concepto <strong>${data.orderNumber}</strong> antes de procesar el pedido.</p>
      </div>
      ` : ''}
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Sends order confirmation emails using EmailJS
 * You need to configure EmailJS with your service and template IDs
 * See: https://www.emailjs.com/docs/
 */
export async function sendOrderConfirmationEmails(data: OrderEmailData): Promise<void> {
  const customerHTML = buildCustomerEmailHTML(data);
  const ownerHTML = buildOwnerEmailHTML(data);

  // ---- EmailJS Integration ----
  // To enable, install: npm install @emailjs/browser
  // Configure your EmailJS service at: https://www.emailjs.com/
  // Then uncomment and configure:
  /*
  import emailjs from '@emailjs/browser';
  const SERVICE_ID = 'YOUR_SERVICE_ID';
  const CUSTOMER_TEMPLATE_ID = 'YOUR_CUSTOMER_TEMPLATE_ID';
  const OWNER_TEMPLATE_ID = 'YOUR_OWNER_TEMPLATE_ID';
  const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

  await emailjs.send(SERVICE_ID, CUSTOMER_TEMPLATE_ID, {
    to_email: data.customerEmail,
    to_name: data.customerName,
    subject: `Confirmación de pedido ${data.orderNumber} - ${BUSINESS_CONFIG.name}`,
    html_content: customerHTML,
    order_number: data.orderNumber,
    order_total: formatCurrency(data.total),
    payment_method: getPaymentMethodText(data.paymentMethod),
  }, PUBLIC_KEY);

  await emailjs.send(SERVICE_ID, OWNER_TEMPLATE_ID, {
    to_email: BUSINESS_CONFIG.email,
    subject: `🛎️ Nuevo Pedido ${data.orderNumber} — ${formatCurrency(data.total)}`,
    html_content: ownerHTML,
    order_number: data.orderNumber,
    customer_name: data.customerName,
    customer_email: data.customerEmail,
    order_total: formatCurrency(data.total),
    payment_method: getPaymentMethodText(data.paymentMethod),
  }, PUBLIC_KEY);
  */

  // ---- Fallback: Log to console until EmailJS is configured ----
  console.log('%c📧 EMAIL CLIENTE:', 'color: #10b981; font-weight: bold; font-size: 14px;');
  console.log('To:', data.customerEmail);
  console.log('Subject:', `Confirmación de pedido ${data.orderNumber} - ${BUSINESS_CONFIG.name}`);
  console.log('Pedido:', data.orderNumber, '| Total:', formatCurrency(data.total));

  console.log('%c📧 EMAIL DUEÑO:', 'color: #2e559e; font-weight: bold; font-size: 14px;');
  console.log('To:', BUSINESS_CONFIG.email);
  console.log('Nuevo pedido de:', data.customerName, '| Total:', formatCurrency(data.total));
  console.log('Método de pago:', getPaymentMethodText(data.paymentMethod));

  // Store in localStorage for demo purposes
  const sentEmails = JSON.parse(localStorage.getItem('protex-sent-emails') || '[]');
  sentEmails.push({
    orderNumber: data.orderNumber,
    customerEmail: data.customerEmail,
    ownerEmail: BUSINESS_CONFIG.email,
    total: data.total,
    paymentMethod: data.paymentMethod,
    timestamp: new Date().toISOString(),
    customerHTML,
    ownerHTML,
  });
  localStorage.setItem('protex-sent-emails', JSON.stringify(sentEmails));
}

/**
 * Generates a unique order number
 */
export function generateOrderNumber(): string {
  const prefix = 'PW';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}
