'use client';
import { useEffect, useState, use } from 'react';
import { graphqlFetch } from '@/services/graphqlClient';
import { MOCK_PRODUCTS } from '@/utils/mockCatalog';
import { useAuth } from '@/store/useAuth';
import { useCart } from '@/store/useCart';
import { useToast } from '@/components/Feedback/ToastProvider';

interface ProductVariant {
  id: string;
  sku?: string;
  size?: string;
  color?: string;
  basePrice: number;
  images?: string[];
}

interface Product {
  id: string;
  name: string;
  description?: string;
  brand: string;
  variants: ProductVariant[];
}

interface GetProductResponse {
  getProduct: Product | null;
}

const GET_PRODUCT = `
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      id
      name
      description
      brand
      variants {
        id
        sku
        size
        color
        basePrice
        images
      }
    }
  }
`;

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = decodeURIComponent(resolvedParams.id);

  const { user } = useAuth();
  const addItem = useCart((state) => state.addItem);
  const toast = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await graphqlFetch<GetProductResponse>(GET_PRODUCT, { id });
        if (data.getProduct) {
          setProduct(data.getProduct);
          if (data.getProduct.variants?.length) {
            setSelectedSize(data.getProduct.variants[0].size || '');
            setSelectedColor(data.getProduct.variants[0].color || '');
          }
        } else {
          throw new Error('Product not found in cloud database');
        }
      } catch (error) {
        console.warn('[ProductDetailPage] Error cargando producto de AppSync. Intentando recuperar de catálogo local...', error);
        const localProduct = MOCK_PRODUCTS.find((p) => p.id === id);
        if (localProduct) {
          setProduct(localProduct);
          if (localProduct.variants?.length) {
            setSelectedSize(localProduct.variants[0].size || '');
            setSelectedColor(localProduct.variants[0].color || '');
          }
        } else {
          setProduct(null);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50/50">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Preparando detalles del producto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50/50">
        <div className="text-center bg-white p-12 rounded-3xl border border-gray-200 shadow-sm max-w-lg mx-4">
          <svg className="w-20 h-20 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
          <p className="text-gray-500 mb-8">El producto que estás buscando no existe o ha sido retirado de nuestro catálogo.</p>
          <button onClick={() => window.history.back()} className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-colors">
            Volver al Catálogo
          </button>
        </div>
      </div>
    );
  }

  const availableSizes = Array.from(new Set(product.variants.map((variant) => variant.size))).filter(Boolean) as string[];
  const availableColors = Array.from(new Set(product.variants.map((variant) => variant.color))).filter(Boolean) as string[];

  const activeVariant = product.variants.find((variant) =>
    (!selectedSize || variant.size === selectedSize) &&
    (!selectedColor || variant.color === selectedColor)
  ) || product.variants[0];

  const images = activeVariant.images?.length ? activeVariant.images : ['https://via.placeholder.com/800x1000?text=Protex+Wear'];
  const mainImage = images[selectedImageIndex] || images[0];

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: activeVariant.id,
      name: `${product.name} (${activeVariant.size || 'Única'} - ${activeVariant.color || 'Único'})`,
      price: activeVariant.basePrice,
      quantity: 1,
      image: mainImage,
    });
    toast.success({
      title: 'Producto añadido',
      message: 'Se ha añadido al carrito correctamente.',
    });
  };

  return (
    <main className="min-h-screen bg-gray-50/50 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500 font-medium mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-2">
            <li><a href="/" className="hover:text-indigo-600 transition-colors">Inicio</a></li>
            <li><span className="mx-2 text-gray-300">/</span></li>
            <li><a href="/productos" className="hover:text-indigo-600 transition-colors">Catálogo</a></li>
            <li><span className="mx-2 text-gray-300">/</span></li>
            <li className="text-gray-900" aria-current="page">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Gallery Area */}
          <div className="flex flex-col gap-6">
            <div className="relative bg-white aspect-[4/5] rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center p-8 group">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/5 to-transparent mix-blend-multiply pointer-events-none" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-darken transform group-hover:scale-105 transition-transform duration-700 ease-out"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/800x1000?text=Protex+Wear';
                }}
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative flex-none w-24 h-32 rounded-2xl overflow-hidden bg-white border-2 transition-all duration-300 ${
                      selectedImageIndex === idx 
                        ? 'border-indigo-600 shadow-md scale-105' 
                        : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-200'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Vista ${idx + 1}`}
                      className="w-full h-full object-cover mix-blend-darken"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/150?text=Error';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Area */}
          <div className="flex flex-col lg:py-8">
            <div className="mb-8">
              <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                {product.brand}
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-6">
                <span className="text-4xl font-extrabold text-indigo-600">
                  {activeVariant.basePrice.toFixed(2)}&euro;
                </span>
                {user?.can_pay_later && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    Tarifa B2B
                  </span>
                )}
              </div>
            </div>

            <div className="w-full h-px bg-gray-200 mb-8" />

            <div className="flex flex-col gap-8 mb-10">
              {availableSizes.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Seleccionar Talla</h3>
                  <div className="flex flex-wrap gap-3">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSize(size);
                          setSelectedImageIndex(0);
                        }}
                        className={`min-w-[4rem] px-4 py-3 rounded-xl font-bold transition-all duration-200 border-2 ${
                          selectedSize === size 
                            ? 'bg-gray-900 border-gray-900 text-white shadow-md' 
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {availableColors.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Seleccionar Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setSelectedColor(color);
                          setSelectedImageIndex(0);
                        }}
                        className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 border-2 capitalize ${
                          selectedColor === color 
                            ? 'bg-gray-900 border-gray-900 text-white shadow-md' 
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={handleAddToCart} 
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-extrabold rounded-2xl shadow-[0_8px_30px_rgb(79,70,229,0.3)] hover:shadow-[0_12px_40px_rgb(79,70,229,0.4)] transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 mb-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              Añadir al carrito
            </button>

            {/* Description Tab */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Descripción del producto</h3>
              <div 
                className="prose prose-indigo prose-sm sm:prose-base text-gray-600 max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description || '<p>Este producto no tiene descripción detallada por el momento.</p>' }} 
              />
            </div>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </main>
  );
}
