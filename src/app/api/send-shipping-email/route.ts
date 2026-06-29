import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { BUSINESS_CONFIG } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const { orderId, customerEmail, customerName, trackingNumber } = await request.json();

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('⚠️ Credenciales SMTP no configuradas. Email de envío no mandado.');
      return NextResponse.json({ sent: false, error: 'Faltan variables SMTP' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const fromEmail = process.env.EMAIL_FROM || 'pedidos@protexwear.com';

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Tu pedido ${orderId} ha sido enviado</title>
</head>
<body style="margin:0; padding:0; background-color:#f9fafb; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-radius:16px; overflow:hidden; background:white;">
          <tr>
            <td style="background:linear-gradient(135deg, #10b981, #059669); padding:48px 40px 40px; text-align:center;">
              <div style="font-size:32px; margin-bottom:12px;">📦</div>
              <h1 style="margin:0; color:white; font-size:26px; font-weight:800; letter-spacing:-0.5px; line-height:1.2;">
                ¡Tu pedido está en camino!
              </h1>
              <p style="margin:8px 0 0; color:rgba(255,255,255,0.9); font-size:15px;">
                Hola ${customerName.split(' ')[0]}, tus productos ya han salido de nuestras instalaciones.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="color:#4a5568; font-size:15px; line-height:1.6; margin:0 0 28px;">
                Hemos entregado tu paquete a la agencia de transportes. Puedes hacer el seguimiento de tu envío utilizando el siguiente localizador:
              </p>
              
              <div style="background:#f7fafc; border:2px dashed #cbd5e1; border-radius:12px; padding:24px; text-align:center; margin-bottom:32px;">
                <p style="margin:0 0 8px; color:#64748b; font-size:12px; text-transform:uppercase; font-weight:700; letter-spacing:0.1em;">Código de Seguimiento</p>
                <p style="margin:0; color:#0f172a; font-size:24px; font-weight:900; font-family:monospace; letter-spacing:0.05em;">${trackingNumber}</p>
              </div>

              <div style="text-align:center; background:#ebf8ff; border-radius:10px; padding:20px;">
                <p style="margin:0 0 4px; color:#2b6cb0; font-size:13px; font-weight:600;">¿Tienes alguna pregunta sobre tu pedido?</p>
                <p style="margin:0; font-size:13px; color:#4a5568;">Escríbenos a <a href="mailto:${BUSINESS_CONFIG.email}" style="color:#2b6cb0; font-weight:700; text-decoration:none;">${BUSINESS_CONFIG.email}</a>.</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#1e293b; padding:24px; text-align:center;">
              <p style="margin:0; color:#94a3b8; font-size:12px;">© ${new Date().getFullYear()} Protex Wear S.L.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await transporter.sendMail({
      from: `"Protex Wear" <${fromEmail}>`,
      to: customerEmail,
      subject: `📦 Tu pedido ${orderId} está en camino`,
      html: html,
    });

    return NextResponse.json({ sent: true });
  } catch (error: any) {
    console.error('Error enviando email de envío:', error);
    return NextResponse.json({ sent: false, error: error.message }, { status: 500 });
  }
}
