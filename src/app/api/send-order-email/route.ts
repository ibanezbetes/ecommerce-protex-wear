import { NextResponse } from 'next/server';
import { sendOrderEmails, OrderEmailPayload } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const data: OrderEmailPayload = await request.json();
    const result = await sendOrderEmails(data);
    
    if (!result.sent) {
      if (result.reason === 'Faltan variables SMTP') {
        // En entorno local o sin configurar, no bloqueamos el flujo de compra
        return NextResponse.json({ sent: false, skipped: true, reason: result.reason }, { status: 200 });
      }
      return NextResponse.json({ sent: false, error: result.error || result.reason }, { status: 500 });
    }

    return NextResponse.json({ sent: true });
  } catch (error: any) {
    console.error('Error procesando el endpoint de email:', error);
    return NextResponse.json({ sent: false, error: error.message }, { status: 500 });
  }
}
