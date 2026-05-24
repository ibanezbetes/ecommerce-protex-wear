export interface Product {
    id: string;
    sku: string;
    name: string;
    description?: string | null;
    price: number;
    stock: number;
    category?: string | null;
    subcategory?: string | null;
    brand?: string | null;
    imageUrl?: string | null;
    imageUrls?: string[] | null;
    isActive: boolean;
    weight?: number | null;
    tags?: string[] | null;
    specifications?: string | any | null; // AWSJSON comes as string or object depending on context
    dimensions?: string | any | null; // AWSJSON
    createdAt?: string;
    updatedAt?: string;
}

export interface Order {
    id: string;
    userId: string;
    customerEmail: string;
    customerName: string;
    totalAmount: number;
    status?: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED' | null;
    orderDate: string;
    createdAt?: string;
    updatedAt?: string;
}
