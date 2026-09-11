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
    'Total (€)',
    'Nº Artículos',
    'Detalle Artículos',
    'Dirección Envío',
    'Ciudad',
    'Código Postal',
    'País',
    'CIF / DNI',
    'Teléfono'
  ];

  const rows = orders.map((order) => {
    const itemsSummary = (order.items || [])
      .map((item: any) => `${item.name || item.productId} (x${item.quantity}) - €${(item.priceAtPurchase || 0).toFixed(2)}`)
      .join(' | ');

    const totalItems = (order.items || []).reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
    const dateFormatted = order.orderDate ? new Date(order.orderDate).toLocaleString('es-ES') : '';
    const addr = order.shippingAddress || {};

    return [
      order.id || '',
      dateFormatted,
      order.customerName || '',
      order.customerEmail || '',
      order.status || '',
      order.paymentMethod || '',
      (order.totalAmount || 0).toFixed(2).replace('.', ','), // Semicolon format with comma for European Excel
      totalItems,
      itemsSummary,
      addr.street || '',
      addr.city || '',
      addr.postalCode || '',
      addr.country || '',
      addr.cif || '',
      addr.phone || ''
    ].map(escapeCSV).join(';');
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
