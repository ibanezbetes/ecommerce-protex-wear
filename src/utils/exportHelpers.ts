/**
 * Utility functions for exporting data to Microsoft Excel compatible CSV / spreadsheets with UTF-8 BOM.
 */

// Helper to escape CSV fields
function escapeCSV(value: any): string {
  if (value === null || value === undefined) return '""';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
}

// Download utility
export function downloadCSV(csvContent: string, fileName: string) {
  // UTF-8 BOM for Microsoft Excel to recognize accents & special characters automatically
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName.endsWith('.csv') ? fileName : `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export Orders to Excel
 */
export function exportOrdersToExcel(orders: any[], filename = 'reporte_pedidos_protex_wear') {
  const headers = [
    'ID Pedido',
    'Fecha',
    'Cliente',
    'Email',
    'Estado',
    'Método Pago',
    'Total Pedido (€)',
    'Nº Artículos Pedido',
    'Artículo / Producto',
    'SKU / Ref',
    'Cantidad',
    'Precio Unitario (€)',
    'Total Línea (€)',
    'Dirección Envío',
    'Ciudad',
    'Código Postal',
    'País',
    'CIF / DNI',
    'Teléfono'
  ];

  const rows: string[] = [];

  orders.forEach((order) => {
    const totalItems = (order.items || []).reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
    const dateFormatted = order.orderDate ? new Date(order.orderDate).toLocaleString('es-ES') : '';
    const addr = order.shippingAddress || {};

    const baseOrderColumns = [
      order.id || '',
      dateFormatted,
      order.customerName || '',
      order.customerEmail || '',
      order.status || '',
      order.paymentMethod || '',
      (order.totalAmount || 0).toFixed(2).replace('.', ','),
      totalItems
    ];

    const addressColumns = [
      addr.street || '',
      addr.city || '',
      addr.postalCode || '',
      addr.country || '',
      addr.cif || '',
      addr.phone || ''
    ];

    const items = order.items && order.items.length > 0 ? order.items : null;

    if (items) {
      items.forEach((item: any) => {
        const itemQty = item.quantity || 1;
        const itemPrice = Number(item.priceAtPurchase ?? item.price ?? 0);
        const lineTotal = itemQty * itemPrice;
        const itemName = item.name || item.productName || item.productId || 'Artículo';
        const itemSku = item.sku || item.variantId || item.productId || '-';

        const row = [
          ...baseOrderColumns,
          itemName,
          itemSku,
          itemQty,
          itemPrice.toFixed(2).replace('.', ','),
          lineTotal.toFixed(2).replace('.', ','),
          ...addressColumns
        ].map(escapeCSV).join(';');

        rows.push(row);
      });
    } else {
      // Pedido sin artículos desglosados
      const row = [
        ...baseOrderColumns,
        'Sin artículos',
        '-',
        0,
        '0,00',
        '0,00',
        ...addressColumns
      ].map(escapeCSV).join(';');

      rows.push(row);
    }
  });

  const csv = [headers.map(escapeCSV).join(';'), ...rows].join('\r\n');
  const timestamp = new Date().toISOString().slice(0, 10);
  downloadCSV(csv, `${filename}_${timestamp}.csv`);
}

/**
 * Export Product & Category Sales to Excel
 */
export function exportProductSalesToExcel(
  productSales: Array<{
    productId: string;
    productName: string;
    sku?: string;
    category: string;
    unitsSold: number;
    revenue: number;
    ordersCount: number;
    averagePrice: number;
  }>,
  yearFilter = 'Todos',
  filename = 'ventas_por_articulo_protex_wear'
) {
  const headers = [
    'ID Producto',
    'Referencia / SKU',
    'Nombre del Artículo',
    'Categoría',
    'Año / Periodo',
    'Unidades Vendidas',
    'Total Facturación (€)',
    'Nº Pedidos en que aparece',
    'Precio Medio Venta (€)'
  ];

  const rows = productSales.map((p) => {
    return [
      p.productId,
      p.sku || '-',
      p.productName,
      p.category || 'General',
      yearFilter,
      p.unitsSold,
      p.revenue.toFixed(2).replace('.', ','),
      p.ordersCount,
      p.averagePrice.toFixed(2).replace('.', ',')
    ].map(escapeCSV).join(';');
  });

  const csv = [headers.map(escapeCSV).join(';'), ...rows].join('\r\n');
  const timestamp = new Date().toISOString().slice(0, 10);
  downloadCSV(csv, `${filename}_${yearFilter}_${timestamp}.csv`);
}

/**
 * Export Customer Analytics to Excel
 */
export function exportCustomerAnalyticsToExcel(
  customers: Array<{
    customerName: string;
    customerEmail: string;
    cif?: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string;
    statusSummary?: string;
    recentOrderIds?: string;
  }>,
  filename = 'analisis_clientes_pedidos_protex_wear'
) {
  const headers = [
    'Nombre Cliente / Empresa',
    'Email',
    'CIF / NIF',
    'Total Pedidos Realizados',
    'Gasto Total Acumulado (€)',
    'Ticket Medio (€)',
    'Última Compra',
    'Historial IDs de Pedidos'
  ];

  const rows = customers.map((c) => {
    const avgTicket = c.totalOrders > 0 ? (c.totalSpent / c.totalOrders) : 0;
    const lastDate = c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString('es-ES') : 'Sin compras';

    return [
      c.customerName || 'Cliente sin nombre',
      c.customerEmail,
      c.cif || '-',
      c.totalOrders,
      c.totalSpent.toFixed(2).replace('.', ','),
      avgTicket.toFixed(2).replace('.', ','),
      lastDate,
      c.recentOrderIds || '-'
    ].map(escapeCSV).join(';');
  });

  const csv = [headers.map(escapeCSV).join(';'), ...rows].join('\r\n');
  const timestamp = new Date().toISOString().slice(0, 10);
  downloadCSV(csv, `${filename}_${timestamp}.csv`);
}

/**
 * Generates and downloads the Official ProtexWear Product Catalog Excel Template
 */
export function downloadProtexProductTemplate() {
  const headers = [
    'Referencia Padre',
    'Nombre',
    'Marca',
    'Categoría 1 (Familia)',
    'Categoría 2 (Subcategoría)',
    'Tallas (separadas por coma)',
    'Color',
    'Precio Venta (Sin IVA)',
    'Ficha Técnica (URL PDF)',
    'Imágenes (URLs)',
    'Descripción'
  ];

  const sampleRows = [
    [
      'PW-BOTA-VOLCANO',
      'Bota de Seguridad S3 SRC Hidrófuga Volcano',
      'Protex Wear',
      'Calzado de Seguridad',
      'Botas de seguridad',
      '38, 39, 40, 41, 42, 43, 44, 45, 46',
      'Negro',
      '38,95',
      'https://protexwear.es/fichas/bota-volcano-s3.pdf',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800, https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
      'Bota de seguridad profesional S3 SRC con puntera de composite no metálica y plantilla antiperforación textil. Corte en piel flor hidrófuga de alta resistencia. Suela de poliuretano bidensidad antideslizante certificada EN ISO 20345:2011.'
    ],
    [
      'PW-PANT-STRETCH',
      'Pantalón Multibolsillos Stretch Ripstop Pro',
      'Protex Wear',
      'Ropa de Trabajo',
      'Pantalones de trabajo',
      '38, 40, 42, 44, 46, 48, 50, 52',
      'Azul Marino',
      '27,50',
      'https://protexwear.es/fichas/pantalon-stretch-pro.pdf',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800',
      'Pantalón de trabajo técnico multibolsillos fabricado en tejido elástico Stretch 65% poliéster, 32% algodón y 3% elastano (240g/m²). Refuerzo en rodilleras y costuras triples de máxima durabilidad.'
    ],
    [
      'PW-POLO-COOLPASS',
      'Polo Técnico Transpirable Manga Corta',
      'Protex Wear',
      'Ropa de Trabajo',
      'Polos y camisetas',
      'S, M, L, XL, XXL, 3XL',
      'Negro',
      '12,80',
      'https://protexwear.es/fichas/polo-coolpass.pdf',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800',
      'Polo técnico de alta transpirabilidad confeccionado en poliéster piqué con tratamiento antibacteriano y secado rápido. Cuello clásico acanalado con tapeta de 3 botones.'
    ],
    [
      'PW-GUAN-CUT5',
      'Guante de Protección Anticorte Nivel D / Cut 5',
      'Protex Wear',
      'Protección de Manos',
      'Guantes anticorte',
      '7 (S), 8 (M), 9 (L), 10 (XL), 11 (XXL)',
      'Gris / Negro',
      '4,85',
      'https://protexwear.es/fichas/guante-cut5.pdf',
      'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800',
      'Guante de seguridad de alta destreza con recubrimiento de microespuma de nitrilo en palma y fibra HPPE anticorte. Homologado según EN 388:2016 4X43D.'
    ],
    [
      'PW-CASCO-EVO',
      'Casco de Seguridad Industrial EVO3 con Ruleta',
      'Protex Wear',
      'Protección de Cabeza y Facial',
      'Cascos de seguridad',
      'Única',
      'Blanco',
      '14,20',
      'https://protexwear.es/fichas/casco-evo3.pdf',
      'https://images.unsplash.com/photo-1578873375969-d71a938c5387?w=800',
      'Casco de protección para construcción e industria con arnés textil de 6 puntos de anclaje y ajuste mediante ruleta ergonómica. Certificado EN 397:2012.'
    ],
    [
      'PW-CHAL-ALTA-VIS',
      'Chaleco de Alta Visibilidad Clase 2 con Cintas Reflectantes',
      'Protex Wear',
      'Ropa de Trabajo',
      'Ropa de alta visibilidad',
      'M, L, XL, XXL',
      'Amarillo Flúor',
      '3,90',
      'https://protexwear.es/fichas/chaleco-alta-visibilidad.pdf',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800',
      'Chaleco de seguridad reflectante homologado EN ISO 20471 Clase 2 con cierre de velcro y dos bandas reflectantes horizontales.'
    ]
  ];

  const rows = sampleRows.map((row) => row.map(escapeCSV).join(';'));
  const csv = [headers.map(escapeCSV).join(';'), ...rows].join('\r\n');
  downloadCSV(csv, 'Plantilla_Oficial_Catalogo_ProtexWear.csv');
}
