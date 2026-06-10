import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import { BUSINESS_CONFIG } from './config';

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

export interface InvoiceData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerCif?: string;
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
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const BRAND_COLOR = '#1e3a8a'; // Tailwind blue-900
      const ACCENT_COLOR = '#3b82f6'; // Tailwind blue-500
      const TEXT_MAIN = '#1e293b'; // Tailwind slate-800
      const TEXT_MUTED = '#64748b'; // Tailwind slate-500
      const BG_LIGHT = '#f8fafc'; // Tailwind slate-50

      // --- LOGO OR BRAND NAME ---
      const logoPath = path.join(process.cwd(), 'public', 'logo.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 45, { width: 160 });
      } else {
        doc.fontSize(28).font('Helvetica-Bold').fillColor(BRAND_COLOR).text('PROTEX WEAR', 50, 45);
      }

      // --- DOCUMENT TITLE ---
      doc.fontSize(24).font('Helvetica-Bold').fillColor(BRAND_COLOR).text('FACTURA', 50, 45, { align: 'right' });

      // --- INVOICE DETAILS (Top Right) ---
      const formattedDate = data.date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
      doc.fontSize(10).fillColor(TEXT_MUTED);
      
      doc.font('Helvetica-Bold').text('Nº Factura:', 350, 80, { width: 90, align: 'right' });
      doc.font('Helvetica').fillColor(TEXT_MAIN).text(data.orderNumber, 450, 80, { width: 90, align: 'right' });
      
      doc.font('Helvetica-Bold').fillColor(TEXT_MUTED).text('Fecha Emisión:', 350, 95, { width: 90, align: 'right' });
      doc.font('Helvetica').fillColor(TEXT_MAIN).text(formattedDate, 450, 95, { width: 90, align: 'right' });
      
      doc.font('Helvetica-Bold').fillColor(TEXT_MUTED).text('Pedido Ref:', 350, 110, { width: 90, align: 'right' });
      doc.font('Helvetica').fillColor(TEXT_MAIN).text(data.orderNumber, 450, 110, { width: 90, align: 'right' });

      // --- COMPANY DETAILS (Below Logo) ---
      let compY = 120;
      doc.fontSize(10).font('Helvetica-Bold').fillColor(TEXT_MAIN).text('Protex Wear S.L.', 50, compY);
      doc.font('Helvetica').fillColor(TEXT_MUTED);
      doc.text(`NIF/CIF: ${BUSINESS_CONFIG.cif}`, 50, compY + 15);
      doc.text(BUSINESS_CONFIG.address, 50, compY + 30);
      doc.text('pedidos@protexwear.es', 50, compY + 45);
      doc.text(BUSINESS_CONFIG.phone, 50, compY + 60);

      // --- SEPARATOR LINE ---
      doc.moveTo(50, 205).lineTo(545, 205).lineWidth(1).strokeColor('#e2e8f0').stroke();

      // --- BILLING DETAILS (Client) ---
      doc.fontSize(11).font('Helvetica-Bold').fillColor(BRAND_COLOR).text('Facturar a:', 50, 225);
      doc.fontSize(10).font('Helvetica-Bold').fillColor(TEXT_MAIN)
        .text(`${data.shippingAddress.firstName} ${data.shippingAddress.lastName}`, 50, 245);
      
      let currentY = 260;
      doc.font('Helvetica').fillColor(TEXT_MUTED);
      if (data.customerCif) {
        doc.font('Helvetica-Bold').text(`NIF/CIF: ${data.customerCif}`, 50, currentY);
        doc.font('Helvetica');
        currentY += 15;
      }
      doc.text(data.shippingAddress.street, 50, currentY);
      doc.text(`${data.shippingAddress.postalCode} ${data.shippingAddress.city}`, 50, currentY + 15);
      doc.text(data.shippingAddress.country, 50, currentY + 30);

      // --- TABLE HEADER ---
      const tableTop = 330;
      doc.rect(50, tableTop, 495, 30).fill(BRAND_COLOR);
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(10);
      doc.text('DESCRIPCIÓN', 65, tableTop + 10);
      doc.text('CANT.', 280, tableTop + 10, { width: 50, align: 'center' });
      doc.text('PRECIO', 350, tableTop + 10, { width: 80, align: 'right' });
      doc.text('IMPORTE', 450, tableTop + 10, { width: 80, align: 'right' });

      // --- TABLE ROWS ---
      let y = tableTop + 30;
      doc.font('Helvetica');

      data.items.forEach((item, i) => {
        // Alternating row colors
        if (i % 2 === 0) {
          doc.rect(50, y, 495, Math.max(doc.heightOfString(item.name, { width: 200 }) + 20, 30)).fill(BG_LIGHT);
        }

        doc.fillColor(TEXT_MAIN).text(item.name, 65, y + 10, { width: 200 });
        doc.fillColor(TEXT_MUTED).text(item.quantity.toString(), 280, y + 10, { width: 50, align: 'center' });
        doc.text(`${item.price.toFixed(2)} €`, 350, y + 10, { width: 80, align: 'right' });
        doc.fillColor(TEXT_MAIN).font('Helvetica-Bold').text(`${(item.price * item.quantity).toFixed(2)} €`, 450, y + 10, { width: 80, align: 'right' });
        
        y += Math.max(doc.heightOfString(item.name, { width: 200 }), 15) + 20;
        doc.font('Helvetica'); // Reset font weight
      });

      // Bottom border for table
      doc.moveTo(50, y).lineTo(545, y).lineWidth(2).strokeColor(BRAND_COLOR).stroke();

      y += 25;

      // --- TOTALS SECTION ---
      doc.fillColor(TEXT_MUTED).font('Helvetica');
      doc.text('Subtotal', 350, y, { width: 80, align: 'right' });
      doc.fillColor(TEXT_MAIN).text(`${data.subtotal.toFixed(2)} €`, 450, y, { width: 80, align: 'right' });
      y += 20;

      if (data.discountAmount && data.discountAmount > 0) {
        doc.fillColor('#10b981').text('Descuento', 350, y, { width: 80, align: 'right' });
        doc.text(`-${data.discountAmount.toFixed(2)} €`, 450, y, { width: 80, align: 'right' });
        y += 20;
      }

      doc.fillColor(TEXT_MUTED).text('Base Imponible', 350, y, { width: 80, align: 'right' });
      doc.fillColor(TEXT_MAIN).text(`${(data.total - data.tax).toFixed(2)} €`, 450, y, { width: 80, align: 'right' });
      y += 20;

      doc.fillColor(TEXT_MUTED).text('IVA (21%)', 350, y, { width: 80, align: 'right' });
      doc.fillColor(TEXT_MAIN).text(`${data.tax.toFixed(2)} €`, 450, y, { width: 80, align: 'right' });
      y += 20;

      if (data.shippingCost > 0) {
        doc.fillColor(TEXT_MUTED).text('Gastos de Envío', 350, y, { width: 80, align: 'right' });
        doc.fillColor(TEXT_MAIN).text(`${data.shippingCost.toFixed(2)} €`, 450, y, { width: 80, align: 'right' });
        y += 20;
      }

      y += 10;
      
      // Total Box
      doc.rect(340, y, 205, 40).fill(BRAND_COLOR);
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(14);
      doc.text('TOTAL', 355, y + 14, { width: 80, align: 'left' });
      doc.text(`${data.total.toFixed(2)} €`, 440, y + 14, { width: 90, align: 'right' });

      // --- PAYMENT METHOD NOTE ---
      y += 60;
      doc.fontSize(9).font('Helvetica-Bold').fillColor(TEXT_MAIN).text('Información de Pago:', 50, y);
      doc.font('Helvetica').fillColor(TEXT_MUTED).text('El pago ha sido procesado de forma segura. Esta factura sirve como justificante de pago.', 50, y + 15, { width: 250 });

      // --- FOOTER ---
      doc.fontSize(8).fillColor('#94a3b8');
      doc.text('Gracias por su confianza. Para cualquier consulta sobre esta factura, contáctenos en pedidos@protexwear.es', 50, 780, { align: 'center', width: 495 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
