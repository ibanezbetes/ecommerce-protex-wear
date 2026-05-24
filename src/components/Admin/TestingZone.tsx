import React, { useState } from 'react';
import { orderOperations, productOperations } from '../../services/graphql';
import LoadingSpinner from '../UI/LoadingSpinner';
import '../../styles/AdminProducts.css'; // Reusing styles

function TestingZone() {
    const [loading, setLoading] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [progress, setProgress] = useState<{ current: number, total: number, errors: number } | null>(null);

    // 1. Connection Test
    const testConnection = async () => {
        try {
            setLoading('connection');
            setMessage(null);
            const output = await productOperations.listProducts(undefined, 1000);
            setMessage({ type: 'success', text: `✅ Conexión Exitosa. API Online. Se han leído ${output.data.length} productos del catálogo.` });
        } catch (err: any) {
            console.error(err);
            setMessage({ type: 'error', text: `❌ Error de conexión: ${err.message}` });
        } finally {
            setLoading(null);
        }
    };

    // 2. Create Single Demo Order
    const createDemoOrder = async () => {
        try {
            setLoading('order');
            setMessage(null);

            const testOrder = {
                userId: "demo-user-id",
                customerEmail: "demo@example.com",
                customerName: "Usuario Demo",
                items: JSON.stringify([
                    { productId: "prod-1", quantity: 2, price: 29.99, name: "Casco Seguridad" },
                    { productId: "prod-2", quantity: 1, price: 45.50, name: "Botas Trabajo" }
                ]),
                subtotal: 105.48,
                totalAmount: 126.58, // +tax/shipping
                status: "PENDING",
                shippingAddress: JSON.stringify({
                    street: "Calle Prueba 123",
                    city: "Madrid",
                    zip: "28001",
                    country: "Spain"
                }),
                billingAddress: JSON.stringify({
                    street: "Calle Prueba 123",
                    city: "Madrid",
                    zip: "28001",
                    country: "Spain"
                })
            };

            await orderOperations.createOrder(testOrder as any);
            setMessage({ type: 'success', text: '✅ Pedido de prueba creado correctamente' });
        } catch (err: any) {
            console.error(err);
            setMessage({ type: 'error', text: `❌ Error al crear pedido: ${err.message}` });
        } finally {
            setLoading(null);
        }
    };

    // 3. Generate Bulk Orders (5)
    const generateBulkOrders = async () => {
        try {
            setLoading('bulk-orders');
            setMessage(null);

            const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
            let created = 0;

            for (let i = 0; i < 5; i++) {
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                const randomTotal = Math.floor(Math.random() * 500) + 50;

                const testOrder = {
                    userId: `bulk-user-${i}`,
                    customerEmail: `bulk${i}@test.com`,
                    customerName: `Bulk User ${i + 1}`,
                    items: JSON.stringify([{ productId: "bulk-prod", quantity: 1, price: randomTotal, name: "Bulk Item" }]),
                    subtotal: randomTotal,
                    totalAmount: randomTotal,
                    status: randomStatus,
                    shippingAddress: JSON.stringify({ street: "Bulk St", city: "Test City", country: "ES" }),
                    billingAddress: JSON.stringify({ street: "Bulk St", city: "Test City", country: "ES" })
                };

                await orderOperations.createOrder(testOrder as any);
                created++;
            }

            setMessage({ type: 'success', text: `✅ Se han generado ${created} pedidos aleatorios.` });
        } catch (err: any) {
            console.error(err);
            setMessage({ type: 'error', text: `❌ Error en generación masiva: ${err.message}` });
        } finally {
            setLoading(null);
        }
    };

    // 4. Delete All Orders
    const deleteAllOrders = async () => {
        if (!window.confirm("⚠️ ¿Estás seguro de que quieres ELIMINAR TODOS los pedidos? Esta acción no se puede deshacer.")) {
            return;
        }

        try {
            setLoading('delete-orders');
            setMessage(null);
            setProgress(null);

            // Fetch all orders first
            const orders = await orderOperations.listAllOrders(undefined, 1000);
            const items = orders.data;
            const total = items.length;

            if (total === 0) {
                setMessage({ type: 'success', text: 'No hay pedidos para eliminar.' });
                return;
            }

            let deleted = 0;
            let errors = 0;

            // Delete one by one
            for (let i = 0; i < total; i++) {
                try {
                    await orderOperations.deleteOrder(items[i].id);
                    deleted++;
                } catch (err) {
                    console.error('Error deleting order:', err);
                    errors++;
                }

                // Update progress every 5 items or at the end
                if (i % 5 === 0 || i === total - 1) {
                    setProgress({ current: deleted + errors, total, errors });
                }
            }

            setMessage({ type: 'success', text: `✅ Operación completada: ${deleted} pedidos eliminados.${errors > 0 ? ` (${errors} fallos)` : ''}` });
        } catch (err: any) {
            console.error(err);
            setMessage({ type: 'error', text: `❌ Error eliminando pedidos: ${err.message}` });
        } finally {
            setLoading(null);
            setProgress(null);
        }
    };

    // 5. Delete All Products
    const deleteAllProducts = async () => {
        if (!window.confirm("⚠️ ¿Estás seguro de que quieres ELIMINAR TODO EL CATÁLOGO de productos? Esta acción no se puede deshacer.")) {
            return;
        }

        try {
            setLoading('delete-products');
            setMessage(null);
            setProgress(null);

            // Fetch all products first
            const products = await productOperations.listProducts(undefined, 1000);
            const items = products.data;
            const total = items.length;

            if (total === 0) {
                setMessage({ type: 'success', text: 'No hay productos para eliminar.' });
                return;
            }

            let deleted = 0;
            let errors = 0;

            // Delete one by one
            for (let i = 0; i < total; i++) {
                try {
                    await productOperations.deleteProduct(items[i].id);
                    deleted++;
                } catch (err) {
                    console.error('Error deleting product:', err);
                    errors++;
                }

                // Update progress
                if (i % 5 === 0 || i === total - 1) {
                    setProgress({ current: deleted + errors, total, errors });
                }
            }

            setMessage({ type: 'success', text: `✅ Operación completada: ${deleted} productos eliminados.${errors > 0 ? ` (${errors} fallos)` : ''}` });
        } catch (err: any) {
            console.error(err);
            setMessage({ type: 'error', text: `❌ Error eliminando productos: ${err.message}` });
        } finally {
            setLoading(null);
            setProgress(null);
        }
    };

    // 6. Import Products
    const importProducts = async () => {
        try {
            setLoading('import');
            setMessage(null);
            setProgress(null);

            const response = await fetch('/migration/products_source.json');
            if (!response.ok) throw new Error('No se pudo cargar products_source.json');

            const products = await response.json();
            const total = products.length;
            let imported = 0;
            let errors = 0;

            const batchSize = 5;
            for (let i = 0; i < products.length; i += batchSize) {
                const batch = products.slice(i, i + batchSize);

                await Promise.all(batch.map(async (p: any) => {
                    try {
                        await productOperations.createProduct({
                            sku: p.sku,
                            name: p.name,
                            description: p.description,
                            price: p.price || 0,
                            stock: p.stock || 0,
                            category: p.category,
                            imageUrl: p.imageUrl,
                            isActive: true,
                            tags: p.tags || [],
                            specifications: typeof p.specifications === 'object'
                                ? JSON.stringify(p.specifications)
                                : p.specifications
                        } as any); // Cast to any to avoid type mismatch temporarily
                        imported++;
                    } catch (err) {
                        console.error(`Error importing ${p.sku}:`, err);
                        errors++;
                    }
                }));

                setProgress({ current: Math.min(i + batchSize, total), total, errors });
                await new Promise(resolve => setTimeout(resolve, 500)); // Rate limit protection
            }

            setMessage({
                type: errors > 0 ? 'error' : 'success',
                text: `Importación finalizada: ${imported} importados, ${errors} errores.`
            });

        } catch (err: any) {
            console.error(err);
            setMessage({ type: 'error', text: `❌ Error crítico en importación: ${err.message}` });
        } finally {
            setLoading(null);
            setProgress(null);
        }
    };

    return (
        <div>
            <div className="admin-products-header">
                <div>
                    <h2 className="admin-products-title">🛠️ Testing Zone</h2>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                        Herramientas de desarrollo, pruebas y mantenimiento del sistema.
                    </p>
                </div>
            </div>

            {message && (
                <div className={`p-4 mb-6 rounded-lg border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                    {message.text}
                </div>
            )}

            {progress && (
                <div className="p-4 mb-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between text-sm mb-1 font-medium text-blue-700">
                        <span>Progreso de Operación: {progress.current}/{progress.total}</span>
                        {progress.errors > 0 && <span className="text-red-600">{progress.errors} errores</span>}
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${(progress.current / progress.total) * 100}%` }}
                        ></div>
                    </div>
                </div>
            )}

            <div className="admin-activity-grid">

                {/* Card 1: System Health */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">📡 Estado del Sistema</h3>
                    </div>
                    <div style={{ padding: '1rem' }}>
                        <p className="text-gray-600 mb-4">Verifica la conexión con la API GraphQL y la base de datos DynamoDB.</p>
                        <button
                            onClick={testConnection}
                            disabled={loading !== null}
                            className="btn-modern btn-modern-outline w-full"
                        >
                            {loading === 'connection' ? <LoadingSpinner size="sm" /> : 'Verificar Conexión'}
                        </button>
                    </div>
                </div>

                {/* Card 2: Order Data */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">🛒 Gestión de Pedidos</h3>
                    </div>
                    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <p className="text-gray-600 text-sm">Crear o eliminar datos de pedidos.</p>

                        <button
                            onClick={createDemoOrder}
                            disabled={loading !== null}
                            className="btn-modern btn-modern-primary w-full"
                        >
                            {loading === 'order' ? <LoadingSpinner size="sm" /> : '+ Crea 1 Pedido Demo'}
                        </button>

                        <button
                            onClick={generateBulkOrders}
                            disabled={loading !== null}
                            className="btn-modern btn-modern-outline w-full"
                        >
                            {loading === 'bulk-orders' ? <LoadingSpinner size="sm" /> : '🎲 Generar 5 Random'}
                        </button>

                        <div className="h-px bg-gray-200 my-2"></div>

                        <button
                            onClick={deleteAllOrders}
                            disabled={loading !== null}
                            className="btn-modern w-full"
                            style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}
                        >
                            {loading === 'delete-orders' ? 'Eliminando...' : '🗑️ Eliminar TODOS los Pedidos'}
                        </button>
                    </div>
                </div>

                {/* Card 3: Product Import */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h3 className="admin-card-title">📦 Gestión de Catálogo</h3>
                    </div>
                    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <p className="text-gray-600 text-sm mb-2">
                            Importa productos desde <code>migration/products_source.json</code>.
                            <br />
                            <span className="text-xs text-gray-500 mt-1 block">
                                ℹ️ El proceso lee el archivo JSON local y crea cada producto en la base de datos vía API.
                            </span>
                        </p>

                        <button
                            onClick={importProducts}
                            disabled={loading !== null}
                            className="btn-modern btn-modern-primary w-full"
                            style={{ backgroundColor: '#4f46e5' }}
                        >
                            {loading === 'import' ? 'Importando...' : '📥 Importar Catálogo JSON'}
                        </button>

                        <div className="h-px bg-gray-200 my-2"></div>

                        <button
                            onClick={deleteAllProducts}
                            disabled={loading !== null}
                            className="btn-modern w-full"
                            style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}
                        >
                            {loading === 'delete-products' ? 'Eliminando...' : '🗑️ Eliminar TODO el Catálogo'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default TestingZone;
