"use client";

import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import outputs from "../../../../amplify_outputs.json";
import { useEffect, useState, useMemo } from "react";
import { Product } from "@/types";
import Link from "next/link";
import { Plus, Edit, Trash2, Search, Filter, ArrowUpDown, ChevronDown, Package } from "lucide-react";
import S3Image from "@/components/S3Image";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter & Search States
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); // all, active, inactive
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest"); // newest, price-low, price-high, stock-low, name
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            Amplify.configure(outputs);
            const client = generateClient();
            // @ts-ignore
            const { data: items, errors } = await client.models.Product.list();

            if (errors) {
                console.error('GraphQL errors:', errors);
            } else if (items) {
                // Deduplicate by SKU (or ID as fallback) to prevent ghost duplicates from backend
                const uniqueMap = new Map();
                items.forEach((item: any) => {
                    const key = item.sku || item.id;
                    if (!uniqueMap.has(key)) {
                        uniqueMap.set(key, item);
                    }
                });
                const uniqueItems = Array.from(uniqueMap.values()) as Product[];
                setProducts(uniqueItems);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }

    async function deleteProduct(id: string) {
        if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) return;
        try {
            Amplify.configure(outputs);
            const client = generateClient();
            // @ts-ignore
            await client.models.Product.delete({ id });
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    }

    // Get unique categories for the filter
    const categories = useMemo(() => {
        const cats = new Set(products.map(p => p.category).filter(Boolean));
        return Array.from(cats) as string[];
    }, [products]);

    // Filtering & Sorting Logic
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Search Filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(term) ||
                p.sku.toLowerCase().includes(term)
            );
        }

        // Status Filter
        if (statusFilter !== "all") {
            const isActive = statusFilter === "active";
            result = result.filter(p => p.isActive === isActive);
        }

        // Category Filter
        if (categoryFilter !== "all") {
            result = result.filter(p => p.category === categoryFilter);
        }

        // Sorting
        result.sort((a, b) => {
            switch (sortBy) {
                case "price-low": return a.price - b.price;
                case "price-high": return b.price - a.price;
                case "stock-low": return a.stock - b.stock;
                case "name": return a.name.localeCompare(b.name);
                case "newest":
                default:
                    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
            }
        });

        // Deduplicate before returning by SKU or ID to be 100% sure
        const uniqueMap = new Map();
        result.forEach(p => {
            const key = p.sku || p.id;
            if (!uniqueMap.has(key)) {
                uniqueMap.set(key, p);
            }
        });
        const uniqueResult = Array.from(uniqueMap.values());

        return uniqueResult;
    }, [products, searchTerm, statusFilter, categoryFilter, sortBy]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Productos</h2>
                    <p className="text-sm text-gray-700 font-medium">{filteredProducts.length} productos encontrados</p>
                </div>
                <Link
                    href="/dashboard/products/new"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95"
                >
                    <Plus size={20} />
                    <span className="font-semibold">Nuevo Producto</span>
                </Link>
            </div>

            {/* Search & Filters Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900"
                        />
                    </div>

                    {/* Filters Group */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:w-3/5">
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 transition-all text-sm text-gray-900 font-medium"
                            >
                                <option value="all">Todos los Estados</option>
                                <option value="active">Activos</option>
                                <option value="inactive">Inactivos</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>

                        <div className="relative">
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 transition-all text-sm text-gray-900 font-medium"
                            >
                                <option value="all">Categorías</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>

                        <div className="relative">
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                                <ArrowUpDown size={14} />
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full pl-7 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 transition-all text-sm text-gray-900 font-medium"
                            >
                                <option value="newest">Más reciente</option>
                                <option value="name">Nombre (A-Z)</option>
                                <option value="price-low">Precio: Bajo a Alto</option>
                                <option value="price-high">Precio: Alto a Bajo</option>
                                <option value="stock-low">Stock: Menor primero</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>

                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setStatusFilter("all");
                                setCategoryFilter("all");
                                setSortBy("newest");
                            }}
                            className="flex items-center justify-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            </div>

            {/* Conditional Rendering based on isMobile state */}
            {isMobile ? (
                /* Mobile List View */
                <div className="space-y-4">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white p-4 rounded-xl h-24 animate-pulse border border-gray-100"></div>
                        ))
                    ) : filteredProducts.length === 0 ? (
                        <div className="bg-white p-8 text-center text-gray-500 rounded-xl border border-gray-200">
                            No se encontraron productos.
                        </div>
                    ) : (
                        filteredProducts.map((product) => (
                            <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-3">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 shadow-sm shrink-0">
                                            <S3Image
                                                path={product.imageUrl}
                                                alt={product.name}
                                                className="w-full h-full"
                                                fallbackIcon={<Package size={20} />}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 leading-tight">{product.name}</h3>
                                            <p className="text-xs text-gray-600">{product.category} • {product.sku}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {product.isActive ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>

                                <div className="flex justify-between items-end border-t pt-3">
                                    <div className="flex gap-4">
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Precio</p>
                                            <p className="text-sm font-bold text-gray-900">${product.price.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Stock</p>
                                            <p className={`text-sm font-bold ${product.stock < 10 ? 'text-orange-600' : 'text-gray-900'}`}>{product.stock} und.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/dashboard/products/${product.id}`}
                                            className="p-2 bg-indigo-50 text-indigo-700 rounded-lg"
                                        >
                                            <Edit size={16} />
                                        </Link>
                                        <button
                                            onClick={() => deleteProduct(product.id)}
                                            className="p-2 bg-red-50 text-red-700 rounded-lg"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                /* Desktop Table View */
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Producto</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">SKU</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Precio</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-8 h-20 bg-gray-50/50"></td>
                                    </tr>
                                ))
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">
                                        No se encontraron productos con esos filtros.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 shadow-sm shrink-0">
                                                    <S3Image
                                                        path={product.imageUrl}
                                                        alt={product.name}
                                                        className="w-full h-full"
                                                        fallbackIcon={<Package size={18} />}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{product.name}</div>
                                                    <div className="text-xs text-gray-700">{product.category}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{product.sku}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">${product.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`text-sm font-medium ${product.stock < 10 ? 'text-orange-600 font-bold' : 'text-gray-700'}`}>
                                                {product.stock} und.
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${product.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${product.isActive ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                                {product.isActive ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/dashboard/products/${product.id}`}
                                                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => deleteProduct(product.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
