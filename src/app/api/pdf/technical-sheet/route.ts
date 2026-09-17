import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import { MOCK_PRODUCTS } from '@/utils/mockCatalog';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Falta el ID del producto' }, { status: 400 });
  }

  const product = MOCK_PRODUCTS.find((p) => p.id === id);

  return new Promise<NextResponse>((resolve) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const result = Buffer.concat(chunks);
        resolve(
          new NextResponse(result as unknown as BodyInit, {
            status: 200,
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="Ficha_Tecnica_${id}.pdf"`,
            },
          })
        );
      });

      // Cabecera del PDF
      doc.rect(40, 40, 515, 60).fill('#1e1b4b');
      doc.fillColor('#ffffff').fontSize(20).text('PROTEX WEAR', 60, 55, { bold: true } as any);
      doc.fontSize(10).text('FICHA TÉCNICA DE PRODUCTO Y HOMOLOGACIÓN', 60, 80);

      doc.moveDown(3);
      doc.fillColor('#111827');

      // Nombre y Marca
      const productName = product?.name || `Producto #${id}`;
      const productBrand = product?.brand || 'PROTEX WEAR';

      doc.fontSize(16).text(productName, 40, 120, { bold: true } as any);
      doc.fontSize(10).fillColor('#6b7280').text(`Fabricante / Marca: ${productBrand}`);

      doc.moveDown(1.5);
      doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
      doc.moveDown(1.5);

      // Descripción y Especificaciones
      doc.fontSize(12).fillColor('#111827').text('Descripción Técnica y Características:', { bold: true } as any);
      doc.moveDown(0.8);

      const descriptionText = product?.description
        ? product.description.replace(/<br\s*[\/]?>/gi, '\n').replace(/<[^>]+>/g, '')
        : 'Equipamiento y ropa de protección laboral certificada. Fabricada con materiales de alta resistencia conforme a los estándares europeos de seguridad en el trabajo.';

      doc.fontSize(10).fillColor('#374151').text(descriptionText, {
        lineGap: 4,
        align: 'justify',
      });

      doc.moveDown(2);

      // Variantes / Tallas disponibles
      if (product?.variants && product.variants.length > 0) {
        doc.fontSize(12).fillColor('#111827').text('Variantes y Disponibilidad:', { bold: true } as any);
        doc.moveDown(0.5);

        const sizes = Array.from(new Set(product.variants.map((v) => v.size))).filter(Boolean).join(', ');
        const colors = Array.from(new Set(product.variants.map((v) => v.color))).filter(Boolean).join(', ');

        if (sizes) {
          doc.fontSize(10).fillColor('#4b5563').text(`• Tallas homologadas: ${sizes}`);
        }
        if (colors) {
          doc.fontSize(10).fillColor('#4b5563').text(`• Colores disponibles: ${colors}`);
        }
      }

      // Pie de página
      doc.fontSize(8).fillColor('#9ca3af').text(
        'Documento generado automáticamente por Protex Wear E-Commerce. Certificación sujeta a las normativas de seguridad laboral vigentes.',
        40,
        770,
        { align: 'center', width: 515 }
      );

      doc.end();
    } catch (err: any) {
      resolve(NextResponse.json({ error: err.message }, { status: 500 }));
    }
  });
}
