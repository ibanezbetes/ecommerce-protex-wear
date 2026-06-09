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
      doc.fontSize(28).font('Helvetica-Bold').fillColor('#1a365d').text('PROTEX WEAR', 50, 50);
      doc.fontSize(12).font('Helvetica').fillColor('#4a5568').text('Factura Comercial', 50, 85);
      
      // Detalles de la empresa (Placeholder)
      doc.fontSize(10).fillColor('#2d3748')
        .text('PROTEX WEAR S.L.', 50, 115)
        .text('CIF: B-00000000', 50, 130) // PENDIENTE
        .text('Dirección pendiente', 50, 145) // PENDIENTE
        .text('pedidos@protexwear.es', 50, 160)
        .text('+34 876 44 12 75', 50, 175);

      // Detalles de la factura (alineados a la derecha)
      const formattedDate = data.date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
      
      doc.fontSize(10).fillColor('#4a5568');
      doc.font('Helvetica-Bold').text('Factura Nº:', 350, 50, { width: 80, align: 'right' });
      doc.font('Helvetica').fillColor('#1a202c').text(data.orderNumber, 440, 50, { width: 100, align: 'left' });
      
      doc.font('Helvetica-Bold').fillColor('#4a5568').text('Fecha:', 350, 65, { width: 80, align: 'right' });
      doc.font('Helvetica').fillColor('#1a202c').text(formattedDate, 440, 65, { width: 100, align: 'left' });
      
      doc.font('Helvetica-Bold').fillColor('#4a5568').text('Pedido Nº:', 350, 80, { width: 80, align: 'right' });
      doc.font('Helvetica').fillColor('#1a202c').text(data.orderNumber, 440, 80, { width: 100, align: 'left' });

      // --- Detalles del Cliente ---
      doc.rect(350, 105, 190, 85).fillAndStroke('#f7fafc', '#e2e8f0');
      doc.fillColor('#2d3748').font('Helvetica-Bold').text('Facturar a:', 360, 115);
      doc.font('Helvetica').fillColor('#4a5568')
        .text(`${data.shippingAddress.firstName} ${data.shippingAddress.lastName}`, 360, 130)
        .text(data.shippingAddress.street, 360, 145)
        .text(`${data.shippingAddress.postalCode} ${data.shippingAddress.city}`, 360, 160)
        .text(data.shippingAddress.country, 360, 175);

      doc.moveDown(4);

      // --- Tabla de Productos ---
      const tableTop = 230;
      
      // Cabecera de tabla
      doc.rect(50, tableTop, 490, 25).fill('#edf2f7');
      doc.fillColor('#2d3748').font('Helvetica-Bold');
      doc.text('Concepto', 60, tableTop + 8);
      doc.text('Cant.', 300, tableTop + 8, { width: 50, align: 'center' });
      doc.text('Precio Uni.', 350, tableTop + 8, { width: 80, align: 'right' });
      doc.text('Total', 440, tableTop + 8, { width: 90, align: 'right' });

      let y = tableTop + 35;
      doc.font('Helvetica');

      data.items.forEach(item => {
        doc.fillColor('#1a202c').text(item.name, 60, y, { width: 230 });
        doc.fillColor('#4a5568').text(item.quantity.toString(), 300, y, { width: 50, align: 'center' });
        doc.text(`${item.price.toFixed(2)} €`, 350, y, { width: 80, align: 'right' });
        doc.fillColor('#1a202c').text(`${(item.price * item.quantity).toFixed(2)} €`, 440, y, { width: 90, align: 'right' });
        
        y += Math.max(doc.heightOfString(item.name, { width: 230 }), 20) + 10;
        doc.moveTo(50, y - 5).lineTo(540, y - 5).lineWidth(0.5).strokeColor('#e2e8f0').stroke();
      });

      y += 15;

      // --- Totales ---
      doc.fillColor('#4a5568');
      doc.text('Subtotal:', 350, y, { width: 80, align: 'right' });
      doc.fillColor('#1a202c').text(`${data.subtotal.toFixed(2)} €`, 440, y, { width: 90, align: 'right' });
      y += 20;

      if (data.discountAmount && data.discountAmount > 0) {
        doc.fillColor('#38a169').text('Descuento:', 350, y, { width: 80, align: 'right' });
        doc.text(`-${data.discountAmount.toFixed(2)} €`, 440, y, { width: 90, align: 'right' });
        y += 20;
      }

      doc.fillColor('#4a5568').text('Base Imponible:', 350, y, { width: 80, align: 'right' });
      doc.fillColor('#1a202c').text(`${(data.total - data.tax).toFixed(2)} €`, 440, y, { width: 90, align: 'right' });
      y += 20;

      doc.fillColor('#4a5568').text('IVA (21%):', 350, y, { width: 80, align: 'right' });
      doc.fillColor('#1a202c').text(`${data.tax.toFixed(2)} €`, 440, y, { width: 90, align: 'right' });
      y += 20;

      if (data.shippingCost > 0) {
        doc.fillColor('#4a5568').text('Envío:', 350, y, { width: 80, align: 'right' });
        doc.fillColor('#1a202c').text(`${data.shippingCost.toFixed(2)} €`, 440, y, { width: 90, align: 'right' });
        y += 20;
      }

      y += 5;
      doc.rect(340, y, 200, 30).fill('#edf2f7');
      doc.fillColor('#1a365d').font('Helvetica-Bold');
      doc.text('TOTAL FACTURA:', 350, y + 10, { width: 80, align: 'right' });
      doc.fontSize(12).text(`${data.total.toFixed(2)} €`, 440, y + 9, { width: 90, align: 'right' });

      // --- Footer ---
      doc.font('Helvetica').fontSize(9).fillColor('#a0aec0');
      doc.text(
        'Gracias por confiar en Protex Wear. El pago ha sido procesado correctamente.',
        50,
        750,
        { align: 'center', width: 490 }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
