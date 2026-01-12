"use client";

import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import ProductForm from "@/components/ProductForm";
import { Product } from "@/types";
import { useParams } from "next/navigation";

export default function EditProductPage() {
    const params = useParams();
    const id = params.id as string;
    const [product, setProduct] = useState<Product | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchProduct(id);
        }
    }, [id]);

    async function fetchProduct(id: string) {
        try {
            const client = generateClient();
            // @ts-ignore
            const { data: item, errors } = await client.models.Product.get({ id });
            if (item) {
                setProduct(item as Product);
            }
        } catch (error) {
            console.error("Error fetching product:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Product</h2>
            <ProductForm product={product} isEditing />
        </div>
    );
}
