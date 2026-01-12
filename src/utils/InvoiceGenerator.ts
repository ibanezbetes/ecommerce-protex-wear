import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoImg from '../assets/logo.png';

// Define the Order interface loosely based on what we see in ProfilePage
interface OrderItem {
    name?: string;
    product?: { name: string };
    quantity: number;
    price?: number;
    unitPrice?: number;
    totalPrice?: number;
}

interface Order {
    id: string;
    createdAt: string;
    totalAmount: number;
    subtotal?: number;
    shippingCost?: number;
    taxAmount?: number;
    items: any; // Can be string or object
    customerName?: string;
    customerEmail?: string;
    shippingAddress?: any;
}

const getBase64ImageFromURL = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.setAttribute("crossOrigin", "anonymous");
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL("image/png");
            resolve(dataURL);
        };
        img.onerror = error => reject(error);
        img.src = url;
    });
};

export const generateInvoice = async (order: Order) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // -- Parse Items --
    let items: OrderItem[] = [];
    try {
        items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    } catch (e) {
        items = [];
    }

    // Parses address if string
    let address: any = {};
    try {
        address = typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : order.shippingAddress;
    } catch (e) {
        address = {};
    }


    // -- Company Logo --
    try {
        const logoBase64 = await getBase64ImageFromURL(logoImg);
        doc.addImage(logoBase64, 'PNG', 20, 10, 40, 40); // x, y, w, h
    } catch (err) {
        console.error("Error loading logo", err);
    }

    // Header Layout:
    // Logo is at x=20, w=40. Ends at x=60.
    // We place Company Details at x=70.

    // -- Company Details (Sender) --
    doc.setFontSize(9);
    doc.setTextColor(80);

    // Removed redundant "Protex Wear" text since it's in the logo
    // Align address block to the right of the logo (x=70)
    doc.text("Pol. Industrial Malpica", 70, 20);
    doc.text("C. de la Letra L, 6, Nave 1", 70, 25);
    doc.text("50016 Zaragoza, España", 70, 30);
    doc.text("Tel: 876 44 12 75", 70, 35);
    doc.text("Web: https://protexwear.es", 70, 40);

    // Remove the old Big Blue Title and overlapping text block
    // (The previous code blocks at lines 53-62 are replaced by this new layout)

    // -- Invoice Details (Right Side) --
    const rightColX = pageWidth - 80;
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("FACTURA", rightColX, 20);

    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Nº Factura: ${order.id.split('-')[0].toUpperCase()}`, rightColX, 30);
    doc.text(`Fecha: ${new Date(order.createdAt).toLocaleDateString('es-ES')}`, rightColX, 35);
    doc.text(`ID Pedido: ${order.id}`, rightColX, 40);

    // -- Bill To (Customer) --
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("Facturar a:", 20, 70);

    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(address.firstName ? `${address.firstName} ${address.lastName}` : (order.customerName || 'Cliente'), 20, 76);
    if (address.addressLine1) {
        doc.text(address.addressLine1, 20, 81);
        doc.text(`${address.city || ''} ${address.postalCode || ''}`, 20, 86);
        doc.text(address.country || 'España', 20, 91);
    } else {
        doc.text(order.customerEmail || '', 20, 81);
    }

    // -- Items Table --
    const tableRows = items.map((item) => [
        item.name || item.product?.name || 'Producto',
        item.quantity,
        `€${(item.price || item.unitPrice || 0).toFixed(2)}`,
        `€${((item.price || item.unitPrice || 0) * item.quantity).toFixed(2)}`
    ]);

    autoTable(doc, {
        startY: 100,
        head: [['Descripción', 'Cant.', 'Precio Unit.', 'Total']],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235] },
        columnStyles: {
            0: { cellWidth: 'auto' }, // Description
            1: { cellWidth: 20, halign: 'center' }, // Qty
            2: { cellWidth: 30, halign: 'right' }, // Unit Price
            3: { cellWidth: 30, halign: 'right' }, // Total
        },
    });

    // -- Totals --
    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY + 10;

    const subtotal = order.subtotal || order.totalAmount; // Fallback if subtotal missing
    const shipping = order.shippingCost || 0;
    const total = order.totalAmount;

    doc.setFontSize(10);
    doc.text(`Subtotal:`, pageWidth - 60, finalY);
    doc.text(`€${subtotal?.toFixed(2)}`, pageWidth - 20, finalY, { align: 'right' });

    doc.text(`Envío:`, pageWidth - 60, finalY + 6);
    doc.text(`€${shipping.toFixed(2)}`, pageWidth - 20, finalY + 6, { align: 'right' });

    doc.text(`IVA (21%):`, pageWidth - 60, finalY + 12);
    const tax = (order.taxAmount) || (total! - subtotal! - shipping); // Approx check
    doc.text(`€${tax.toFixed(2)}`, pageWidth - 20, finalY + 12, { align: 'right' });

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL:`, pageWidth - 60, finalY + 20);
    doc.text(`€${total?.toFixed(2)}`, pageWidth - 20, finalY + 20, { align: 'right' });

    // -- Footer --
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Gracias por su compra. Para cualquier duda contacte con soporte.", pageWidth / 2, 280, { align: 'center' });

    // Save PDF
    doc.save(`Factura_Protex_${order.id.split('-')[0]}.pdf`);
};
