import PDFDocument from 'pdfkit';

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

export interface InvoiceData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  discountAmount?: number | null;
  date: Date;
}

export function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
      doc.on('error', reject);

      // --- Header ---
      doc.fontSize(24).font('Helvetica-Bold').text('PROTEX WEAR', 50, 50);
      doc.fontSize(10).font('Helvetica').text('Factura Comercial', 50, 80);
      
      // Detalles de la empresa (Placeholder)
      doc.fontSize(10)
        .text('PROTEX WEAR S.L.', 50, 110)
        .text('CIF: B-12345678', 50, 125)
        .text('Calle Falsa 123, Polígono Industrial', 50, 140)
        .text('28000 Madrid, España', 50, 155)
        .text('pedidos@protexwear.com', 50, 170);

      // Detalles de la factura
      const formattedDate = data.date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
      doc.fontSize(10)
        .font('Helvetica-Bold').text('Factura Nº:', 400, 50).font('Helvetica').text(data.orderNumber, 480, 50)
        .font('Helvetica-Bold').text('Fecha:', 400, 65).font('Helvetica').text(formattedDate, 480, 65)
        .font('Helvetica-Bold').text('Pedido Nº:', 400, 80).font('Helvetica').text(data.orderNumber, 480, 80);

      // --- Detalles del Cliente ---
      doc.font('Helvetica-Bold').text('Facturar a:', 400, 110);
      doc.font('Helvetica')
        .text(`${data.shippingAddress.firstName} ${data.shippingAddress.lastName}`, 400, 125)
        .text(data.shippingAddress.street, 400, 140)
        .text(`${data.shippingAddress.postalCode} ${data.shippingAddress.city}`, 400, 155)
        .text(data.shippingAddress.country, 400, 170)
        .text(data.customerEmail, 400, 185);

      doc.moveDown(4);

      // --- Tabla de Productos ---
      const tableTop = 250;
      doc.font('Helvetica-Bold');
      doc.text('Concepto', 50, tableTop);
      doc.text('Cant.', 300, tableTop, { width: 50, align: 'center' });
      doc.text('Precio Uni.', 350, tableTop, { width: 80, align: 'right' });
      doc.text('Total', 450, tableTop, { width: 90, align: 'right' });

      doc.moveTo(50, tableTop + 15).lineTo(540, tableTop + 15).stroke();

      let y = tableTop + 25;
      doc.font('Helvetica');

      data.items.forEach(item => {
        doc.text(item.name, 50, y, { width: 240 });
        doc.text(item.quantity.toString(), 300, y, { width: 50, align: 'center' });
        doc.text(`${item.price.toFixed(2)} €`, 350, y, { width: 80, align: 'right' });
        doc.text(`${(item.price * item.quantity).toFixed(2)} €`, 450, y, { width: 90, align: 'right' });
        y += 20;
      });

      doc.moveTo(50, y + 10).lineTo(540, y + 10).stroke();
      y += 25;

      // --- Totales ---
      doc.text('Subtotal:', 350, y, { width: 80, align: 'right' });
      doc.text(`${data.subtotal.toFixed(2)} €`, 450, y, { width: 90, align: 'right' });
      y += 20;

      if (data.discountAmount && data.discountAmount > 0) {
        doc.text('Descuento:', 350, y, { width: 80, align: 'right' });
        doc.text(`-${data.discountAmount.toFixed(2)} €`, 450, y, { width: 90, align: 'right' });
        y += 20;
      }

      doc.text('Base Imponible:', 350, y, { width: 80, align: 'right' });
      doc.text(`${(data.total - data.tax).toFixed(2)} €`, 450, y, { width: 90, align: 'right' });
      y += 20;

      doc.text('IVA (21%):', 350, y, { width: 80, align: 'right' });
      doc.text(`${data.tax.toFixed(2)} €`, 450, y, { width: 90, align: 'right' });
      y += 20;

      if (data.shippingCost > 0) {
        doc.text('Envío:', 350, y, { width: 80, align: 'right' });
        doc.text(`${data.shippingCost.toFixed(2)} €`, 450, y, { width: 90, align: 'right' });
        y += 20;
      }

      doc.font('Helvetica-Bold');
      doc.text('TOTAL FACTURA:', 300, y, { width: 130, align: 'right' });
      doc.text(`${data.total.toFixed(2)} €`, 450, y, { width: 90, align: 'right' });

      // --- Footer ---
      doc.font('Helvetica').fontSize(10);
      doc.text(
        'El pago ha sido procesado correctamente. Gracias por su compra en Protex Wear.',
        50,
        700,
        { align: 'center', width: 500 }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
