import { NextResponse } from 'next/server';
import { generateInvoicePDF, InvoiceData } from '@/lib/invoice';

export async function GET() {
  try {
    const sampleData: InvoiceData = {
      orderNumber: 'ORD-TEST-1234',
      customerName: 'Juan Pérez',
      customerEmail: 'juan.perez@example.com',
      items: [
        { name: 'Polo A.V. PRAGA (M - AMA.AVMARINO)', quantity: 2, price: 8.45 },
        { name: 'Pantalón Trabajo Multibolsillos', quantity: 1, price: 15.00 }
      ],
      subtotal: 31.90,
      tax: 6.70,
      shippingCost: 9.00,
      total: 47.60,
      shippingAddress: {
        firstName: 'Juan',
        lastName: 'Pérez',
        street: 'Calle Principal 45, 2ºA',
        city: 'Madrid',
        postalCode: '28080',
        country: 'España'
      },
      date: new Date()
    };

    const pdfBuffer = await generateInvoicePDF(sampleData);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="Factura_Prueba.pdf"'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
