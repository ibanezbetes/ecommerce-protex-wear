"use client";

import { useState, useEffect, useRef } from "react";
import { generateClient } from "aws-amplify/data";
import { uploadData } from "aws-amplify/storage";
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";
import { productOperations } from "../services/graphql";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import {
    Save, X, Upload, Plus, Trash2, Image as ImageIcon,
    Tag, Box, Layers, DollarSign, FileText, Info, Package
} from "lucide-react";
import S3Image from "./S3Image";

interface ProductFormProps {
    product?: Product;
    isEditing?: boolean;
}

interface DimensionState {
    length: string;
    width: string;
    height: string;
    unit: string;
}

interface SpecificationItem {
    key: string;
    value: string;
}

export default function ProductForm({ product, isEditing = false }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Core Data
    const [formData, setFormData] = useState<Partial<Product>>({
        name: "",
        sku: "",
        price: 0,
        stock: 0,
        description: "",
        category: "",
        subcategory: "",
        brand: "",
        isActive: true, // Default to active
        imageUrl: "",
        imageUrls: [],
        weight: 0,
    });

    // Complex States
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [specs, setSpecs] = useState<SpecificationItem[]>([]);
    const [dimensions, setDimensions] = useState<DimensionState>({
        length: "", width: "", height: "", unit: "cm"
    });

    // Load existing product data
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                sku: product.sku,
                price: product.price,
                stock: product.stock,
                description: product.description || "",
                category: product.category || "",
                subcategory: product.subcategory || "",
                brand: product.brand || "",
                isActive: product.isActive,
                imageUrl: product.imageUrl || "",
                imageUrls: product.imageUrls || [],
                weight: product.weight || 0,
            });

            if (product.tags) setTags(product.tags.filter(t => t !== null) as string[]);

            // Parse Specs
            if (product.specifications) {
                try {
                    const parsedSpecs = typeof product.specifications === 'string'
                        ? JSON.parse(product.specifications)
                        : product.specifications;
                    const specArray = Object.entries(parsedSpecs).map(([key, value]) => ({
                        key,
                        value: typeof value === 'object' && value !== null
                            ? JSON.stringify(value)
                            : String(value)
                    }));
                    setSpecs(specArray);
                } catch (e) {
                    console.warn("Failed to parse specifications", e);
                }
            }

            // Parse Dimensions
            if (product.dimensions) {
                try {
                    const parsedDims = typeof product.dimensions === 'string'
                        ? JSON.parse(product.dimensions)
                        : product.dimensions;
                    setDimensions({
                        length: parsedDims.length || "",
                        width: parsedDims.width || "",
                        height: parsedDims.height || "",
                        unit: parsedDims.unit || "cm"
                    });
                } catch (e) {
                    console.warn("Failed to parse dimensions", e);
                }
            }
        }
    }, [product]);

    // Handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    // Tag Handling
    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    // Specs Handling
    const addSpec = () => setSpecs([...specs, { key: "", value: "" }]);
    const removeSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index));
    const updateSpec = (index: number, field: 'key' | 'value', value: string) => {
        const newSpecs = [...specs];
        newSpecs[index][field] = value;
        setSpecs(newSpecs);
    };

    // Dimensions Handling
    const handleDimensionChange = (field: keyof DimensionState, value: string) => {
        setDimensions(prev => ({ ...prev, [field]: value }));
    };

    // Image Upload Logic
    const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            await uploadFile(e.target.files[0], 'main');
        }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setUploading(true);
            const files = Array.from(e.target.files);
            for (const file of files) {
                await uploadFile(file, 'gallery');
            }
            setUploading(false);
        }
    };

    const uploadFile = async (file: File, type: 'main' | 'gallery') => {
        try {
            setUploading(true);
            const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
            const path = `product-images/${Date.now()}-${cleanFileName}`;

            await uploadData({
                path,
                data: file,
            }).result;

            if (type === 'main') {
                setFormData(prev => ({ ...prev, imageUrl: path }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    imageUrls: [...(prev.imageUrls || []), path]
                }));
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const removeGalleryImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            imageUrls: prev.imageUrls?.filter((_, i) => i !== index)
        }));
    };

    // Submit Logic
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("🚀 [FORM DEBUG] handleSubmit called", { formData, isEditing });
        setLoading(true);

        // Prepare JSON fields
        const specificationsJSON = JSON.stringify(
            specs.reduce((acc, curr) => {
                if (curr.key.trim()) acc[curr.key.trim()] = curr.value;
                return acc;
            }, {} as Record<string, string>)
        );

        const dimensionsJSON = JSON.stringify(dimensions);

        try {
            // Client usage replaced by service

            const input: any = {
                name: formData.name!,
                sku: formData.sku!,
                price: Number(formData.price),
                stock: Number(formData.stock),
                description: formData.description,
                // Convert empty strings to null for indexed fields (DynamoDB requirement)
                category: formData.category?.trim() || null,
                subcategory: formData.subcategory?.trim() || null,
                brand: formData.brand?.trim() || null,
                isActive: formData.isActive,
                imageUrl: formData.imageUrl,
                imageUrls: formData.imageUrls,
                weight: Number(formData.weight),
                tags: tags,
                specifications: specificationsJSON,
                dimensions: dimensionsJSON,
            };

            if (isEditing && product) {
                console.log("🔄 [FORM DEBUG] Updating product...", input);
                const result = await productOperations.updateProduct({
                    id: product.id,
                    ...input
                });
                console.log("✅ [FORM DEBUG] Product update result:", result);
                if (result.errors && result.errors.length > 0) {
                    console.error("❌ [FORM DEBUG] Update errors:", result.errors);
                    throw new Error(result.errors[0].message || "Failed to update product");
                }
            } else {
                console.log("➕ [FORM DEBUG] Creating new product...", input);
                const result = await productOperations.createProduct(input);
                console.log("✅ [FORM DEBUG] Product creation result:", result);
                if (result.errors && result.errors.length > 0) {
                    console.error("❌ [FORM DEBUG] Creation errors:", result.errors);
                    throw new Error(result.errors[0].message || "Failed to create product");
                }
            }
            console.log("🔀 [FORM DEBUG] Redirecting to products list...");
            router.push("/dashboard/products");
            router.refresh();
        } catch (error: any) {
            console.error("❌ [FORM DEBUG] Error saving product:", error);
            const isUnauthorized = error && (
                error.message?.includes("Unauthorized") ||
                (error.errors && error.errors.some((e: any) => e.message?.includes("Unauthorized")))
            );

            if (isUnauthorized) {
                alert("⛔ ACCESO DENEGADO\n\nNo tienes los permisos de Administrador necesarios para guardar productos.\nVerifica que tu usuario pertenezca al grupo ADMIN en Cognito.");
            } else {
                alert("Error al guardar el producto. Por favor revisa la consola para más detalles.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto pb-10">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sticky top-0 bg-gray-50/95 p-3 sm:p-4 rounded-2xl backdrop-blur-sm z-30 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-xl hidden sm:block">
                        <Package size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h1>
                        <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">Información de inventario</p>
                    </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <X size={18} />
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        {loading ? 'Guardando...' : 'Guardar Producto'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Main Info) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Basic Info Card */}
                    <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                            <Info size={20} className="text-blue-600" />
                            Información Básica
                        </h3>
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ej. Camiseta de Seguridad Pro"
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border text-gray-900"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                                    <input
                                        type="text"
                                        name="sku"
                                        required
                                        value={formData.sku}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                                    <input
                                        type="text"
                                        name="brand"
                                        value={formData.brand || ""}
                                        onChange={handleChange}
                                        placeholder="Ej. ProTex"
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border text-gray-900"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    value={formData.description || ""}
                                    onChange={handleChange}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Detailed Specs Card */}
                    <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                            <Layers size={20} className="text-purple-600" />
                            Especificaciones Técnicas
                        </h3>

                        {/* Dynamic Specs */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Características (Clave - Valor)</label>
                            {specs.map((spec, index) => (
                                <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_40px] gap-2 mb-4 bg-gray-50 p-2 sm:p-0 rounded-xl sm:bg-transparent sm:mb-2">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] uppercase font-bold text-gray-400 sm:hidden px-1">Característica</label>
                                        <input
                                            placeholder="Ej. Color"
                                            value={spec.key}
                                            onChange={(e) => updateSpec(index, 'key', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 shadow-sm border p-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] uppercase font-bold text-gray-400 sm:hidden px-1">Valor</label>
                                        <input
                                            placeholder="Ej. Azul"
                                            value={spec.value}
                                            onChange={(e) => updateSpec(index, 'value', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 shadow-sm border p-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeSpec(index)}
                                        className="flex items-center justify-center p-2.5 text-red-500 hover:bg-red-50 rounded-lg self-end sm:self-center bg-white sm:bg-transparent border sm:border-0 border-red-100 shadow-sm sm:shadow-none transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addSpec}
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium mt-1"
                            >
                                <Plus size={16} /> Agregar Característica
                            </button>
                        </div>

                        {/* Dimensions & Weight */}
                        <div className="border-t pt-4 mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                <Box size={16} /> Dimensiones y Peso
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div>
                                    <label className="text-xs text-gray-700 font-medium">Largo</label>
                                    <input
                                        type="text"
                                        placeholder="0"
                                        value={dimensions.length}
                                        onChange={(e) => handleDimensionChange('length', e.target.value)}
                                        className="w-full rounded border-gray-300 p-2 text-sm border text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-700 font-medium">Ancho</label>
                                    <input
                                        type="text"
                                        placeholder="0"
                                        value={dimensions.width}
                                        onChange={(e) => handleDimensionChange('width', e.target.value)}
                                        className="w-full rounded border-gray-300 p-2 text-sm border text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-700 font-medium">Alto</label>
                                    <input
                                        type="text"
                                        placeholder="0"
                                        value={dimensions.height}
                                        onChange={(e) => handleDimensionChange('height', e.target.value)}
                                        className="w-full rounded border-gray-300 p-2 text-sm border text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-700 font-medium">Unidad</label>
                                    <select
                                        value={dimensions.unit}
                                        onChange={(e) => handleDimensionChange('unit', e.target.value)}
                                        className="w-full rounded border-gray-300 p-2 text-sm border text-gray-900"
                                    >
                                        <option value="cm">cm</option>
                                        <option value="m">m</option>
                                        <option value="in">in</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-3">
                                <label className="text-xs text-gray-700 font-medium">Peso (kg)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="weight"
                                    value={formData.weight || ""}
                                    onChange={handleChange}
                                    className="w-full sm:w-1/4 rounded border-gray-300 p-2 text-sm border text-gray-900"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Status, Pricing, Media) */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Estado & Organización</h3>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 mb-4">
                            <span className="text-sm font-medium text-gray-700">Activo en tienda</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleCheckboxChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                            </label>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category || ""}
                                    onChange={handleChange}
                                    className="block w-full rounded-lg border-gray-300 p-2 border text-sm text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subcategoría</label>
                                <input
                                    type="text"
                                    name="subcategory"
                                    value={formData.subcategory || ""}
                                    onChange={handleChange}
                                    className="block w-full rounded-lg border-gray-300 p-2 border text-sm text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                    <Tag size={16} /> Etiquetas
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {tags.map((tag, i) => (
                                        <span key={i} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                            {tag}
                                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-indigo-900"><X size={12} /></button>
                                        </span>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    placeholder="Escribe y presiona Enter"
                                    className="block w-full rounded-lg border-gray-300 p-2 border text-sm text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <DollarSign size={16} /> Precio e Inventario
                        </h3>
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-gray-500 sm:text-sm">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="price"
                                        min="0"
                                        step="0.01"
                                        required
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="block w-full rounded-lg border-gray-300 pl-7 p-2 border text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Disponible</label>
                                <input
                                    type="number"
                                    name="stock"
                                    min="0"
                                    required
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className="block w-full rounded-lg border-gray-300 p-2 border text-sm text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Media Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <ImageIcon size={16} /> Imágenes
                        </h3>

                        {/* Main Image */}
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-700 mb-2">Imagen Principal</label>
                            <div className="flex items-center gap-4">
                                <div className="relative h-20 w-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                    <S3Image
                                        path={formData.imageUrl}
                                        alt="Main"
                                        className="h-full w-full"
                                        fallbackIcon={<Package size={24} />}
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="main-image"
                                        onChange={handleMainImageUpload}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="main-image"
                                        className="cursor-pointer inline-flex items-center px-3 py-2 border border-blue-600 rounded text-xs font-medium text-blue-600 bg-white hover:bg-blue-50 transition-colors"
                                    >
                                        <Upload size={14} className="mr-1" /> Subir Principal
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Gallery */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">Galería (Adicionales)</label>
                            <div className="grid grid-cols-3 gap-2 mb-2">
                                {formData.imageUrls?.map((url, i) => (
                                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                        <S3Image
                                            path={url}
                                            alt={`Gallery ${i}`}
                                            className="h-full w-full"
                                            fallbackIcon={<Package size={14} />}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(i)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                id="gallery-input"
                                onChange={handleGalleryUpload}
                                className="hidden"
                            />
                            <label
                                htmlFor="gallery-input"
                                className="cursor-pointer w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors text-xs text-gray-500 hover:text-blue-600 hover:bg-gray-50"
                            >
                                <Plus size={16} className="mr-1" /> Añadir Imágenes
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {uploading && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
                        <p className="text-gray-900 font-medium">Subiendo imágenes...</p>
                    </div>
                </div>
            )}
        </form>
    );
}
