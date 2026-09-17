'use client';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { graphqlFetch } from '@/services/graphqlClient';
import { MOCK_PRODUCTS } from '@/utils/mockCatalog';
import { useAuth } from '@/store/useAuth';
import { useCart } from '@/store/useCart';
import { useFavorites } from '@/store/useFavorites';
import { useToast } from '@/components/Feedback/ToastProvider';
import { Download, Heart, Minus, Plus, ShoppingCart, Truck, X, ChevronLeft, ChevronRight, ZoomIn, ShieldCheck, Award, FileText } from 'lucide-react';

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
  category?: string;
  categoryGroup?: string;
  subcategory?: string;
  pdfUrl?: string;
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
      category
      categoryGroup
      subcategory
      pdfUrl
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
  const { toggleFavorite, isFavorite: checkIsFavorite } = useFavorites();
  const toast = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [activeInfoTab, setActiveInfoTab] = useState<'descripcion' | 'normativas' | 'marca' | 'descargas'>('descripcion');

  const isFavorite = product ? checkIsFavorite(product.id, user?.email || user?.id) : false;

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
        console.warn('[ProductDetailPage] Fallback a catálogo local...', error);
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
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#F4F6F9]">
        <div className="w-12 h-12 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 text-sm font-medium tracking-wide">Cargando especificaciones técnicas...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#F4F6F9]">
        <div className="text-center bg-white p-12 rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-4">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Producto no disponible</h2>
          <p className="text-slate-500 mb-6 text-sm">El artículo solicitado no existe o ha sido retirado.</p>
          <Link href="/productos" className="inline-block px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 transition-colors">
            Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  const availableSizes = Array.from(new Set(product.variants.map((v) => v.size))).filter(Boolean) as string[];
  const availableColors = Array.from(new Set(product.variants.map((v) => v.color))).filter(Boolean) as string[];

  const activeVariant = product.variants.find((variant) =>
    (!selectedSize || variant.size === selectedSize) &&
    (!selectedColor || variant.color === selectedColor)
  ) || product.variants[0];

  const images = activeVariant?.images?.length ? activeVariant.images : ['https://via.placeholder.com/800x1000?text=Protex+Wear'];
  const mainImage = images[selectedImageIndex] || images[0];

  const basePrice = activeVariant ? activeVariant.basePrice : 0;
  const priceWithTax = basePrice * 1.21;
  const skuCode = activeVariant?.sku || `PRO-${product.id}`;

  // Extraer una descripción corta limpia
  const plainDescription = product.description ? product.description.replace(/<[^>]*>?/gm, ' ').trim() : '';
  const shortDescription = plainDescription 
    ? plainDescription.split('.')[0] + '.' 
    : 'Equipamiento laboral de máxima calidad y protección certificada para profesionales e industria.';

  const handleAddToCart = () => {
    if (availableSizes.length > 0 && !selectedSize) {
      toast.error({
        title: 'Selecciona una talla',
        message: 'Por favor, selecciona una talla antes de añadir al carrito.',
      });
      return;
    }

    addItem({
      productId: product.id,
      variantId: activeVariant?.id || product.id,
      name: `${product.name} ${selectedSize ? `(Talla ${selectedSize})` : ''} ${selectedColor ? `(${selectedColor})` : ''}`,
      price: basePrice,
      quantity,
      image: mainImage,
    });

    toast.success({
      title: 'Añadido a la cesta',
      message: `${quantity}x ${product.name} añadido a tu pedido.`,
    });
  };

  const handleToggleFavorite = () => {
    if (!product) return;
    const isNowFav = toggleFavorite(
      {
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: basePrice,
        image: mainImage,
      },
      user?.email || user?.id
    );

    if (isNowFav) {
      toast.success({
        title: 'Añadido a Favoritos',
        message: `${product.name} se ha guardado en tu lista de favoritos.`,
      });
    } else {
      toast.info({
        title: 'Eliminado de Favoritos',
        message: `${product.name} se ha quitado de tus favoritos.`,
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F6F9] text-slate-900 pb-24 relative overflow-hidden">
      {/* Barra Técnica Superior / Breadcrumb */}
      <div className="border-b border-slate-200/80 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center text-xs font-medium text-slate-500 space-x-2 overflow-x-auto">
            <Link href="/" className="hover:text-[#3b6d9c] transition-colors shrink-0">Inicio</Link>
            <span className="text-slate-300 font-mono">/</span>
            <Link href="/productos" className="hover:text-[#3b6d9c] transition-colors shrink-0">Catálogo</Link>
            {product.category && (
              <>
                <span className="text-slate-300 font-mono">/</span>
                <Link href={`/productos?categoria=${encodeURIComponent(product.category.toLowerCase())}`} className="hover:text-[#3b6d9c] capitalize transition-colors shrink-0">
                  {product.category}
                </Link>
              </>
            )}
            <span className="text-slate-300 font-mono">/</span>
            <span className="text-slate-900 font-bold truncate max-w-xs sm:max-w-md">{product.name}</span>
          </nav>

          {/* Badges Técnicos de Ingeniería */}
          <div className="hidden sm:flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              REF // {skuCode}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#3b6d9c]/10 border border-[#3b6d9c]/20 text-[11px] font-bold text-[#3b6d9c] uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" />
              EPI Certificado
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Columna Izquierda: Galería Slate Técnica */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex flex-col-reverse md:flex-row gap-4 lg:gap-5 items-start">
              {/* Miniaturas a la izquierda */}
              {images.length > 1 && (
                <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[540px] w-full md:w-20 shrink-0 pb-2 md:pb-0">
                  {images.map((img, idx) => (
                    <button
                      key={`${img}-${idx}`}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden border bg-white transition-all duration-200 shrink-0 ${
                        selectedImageIndex === idx
                          ? 'border-[#3b6d9c] ring-2 ring-[#3b6d9c]/20 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`Miniatura ${idx + 1}`}
                        className="w-full h-full object-contain p-1.5"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/150?text=Protex';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Imagen Principal Grande */}
              <div 
                onClick={() => setIsZoomOpen(true)}
                className="relative w-full bg-white border border-slate-200/90 rounded-2xl overflow-hidden flex items-center justify-center p-6 md:p-8 min-h-[400px] md:min-h-[520px] shadow-sm hover:shadow-md transition-all cursor-zoom-in group"
                title="Haz clic para ampliar la imagen"
              >
                {/* Badge flotante de Marca */}
                <div className="absolute top-4 left-4 bg-slate-900 text-white font-mono text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md shadow-xs">
                  {product.brand}
                </div>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full max-h-[460px] object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800x1000?text=Protex+Wear';
                  }}
                />

                {/* Icono de Lupa flotante */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl border border-slate-200 text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  <ZoomIn className="w-4 h-4" />
                </div>

                {images.length > 1 && (
                  <div className="absolute bottom-3.5 flex justify-center gap-1.5 w-full left-0 pointer-events-none">
                    {images.map((_, idx) => (
                      <span
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all ${
                          selectedImageIndex === idx ? 'bg-[#3b6d9c] w-5' : 'bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta de Especificaciones y Compra Slate */}
          <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-start">
            {/* Header del Producto */}
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-xs font-black text-[#3b6d9c] uppercase tracking-widest">
                {product.brand}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                ID // {product.id}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4 leading-snug">
              {product.name}
            </h1>

            {/* Precio */}
            <div className="mb-5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {basePrice.toFixed(2)}&euro;
              </span>
              <span className="block text-xs font-semibold text-slate-500 mt-0.5">
                {priceWithTax.toFixed(2)}&euro; con IVA incluido
              </span>
            </div>

            {/* Descripción Corta */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pb-5 border-b border-slate-100 mb-6 font-normal">
              {shortDescription}
            </p>

            {/* Selector de Color (si aplica) */}
            {availableColors.length > 1 && (
              <div className="mb-5">
                <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  COLOR: <span className="text-[#3b6d9c] font-semibold">{selectedColor || 'SELECCIONE'}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        setSelectedImageIndex(0);
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border uppercase transition-all ${
                        selectedColor === color
                          ? 'border-[#3b6d9c] bg-[#3b6d9c] text-white shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-[#3b6d9c]/50 hover:bg-[#3b6d9c]/5'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selector de Talla */}
            {availableSizes.length > 0 && (
              <div className="mb-6">
                <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  TALLA HOMOLOGADA
                </span>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[42px] h-10 px-3 flex items-center justify-center rounded-lg text-xs font-bold border uppercase transition-all ${
                        selectedSize === size
                          ? 'border-[#3b6d9c] bg-[#3b6d9c] text-white shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-[#3b6d9c]/50 hover:bg-[#3b6d9c]/5'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selector de Cantidad */}
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex items-center border border-slate-200 rounded-xl bg-slate-50/60 p-1 shadow-xs">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white text-slate-700 transition-colors"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-slate-900 font-mono">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#3b6d9c] hover:bg-[#335e87] text-white transition-colors shadow-xs"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Botón de Añadir a la Cesta + Favoritos */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 bg-[#3b6d9c] hover:bg-[#335e87] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-[#3b6d9c]/20 transition-all flex items-center justify-center gap-2 transform active:scale-[0.99]"
              >
                <ShoppingCart className="w-4 h-4" />
                {availableSizes.length > 0 && !selectedSize
                  ? 'Por favor, seleccione una talla'
                  : 'Añadir a la cesta'}
              </button>

              <button
                onClick={handleToggleFavorite}
                className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                  isFavorite 
                    ? 'bg-red-50 hover:bg-red-100 border-red-200 text-red-500 shadow-xs' 
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
                }`}
                title={isFavorite ? "Eliminar de favoritos" : "Añadir a favoritos"}
                aria-label={isFavorite ? "Eliminar de favoritos" : "Añadir a favoritos"}
              >
                <Heart className={`w-5 h-5 transition-transform active:scale-125 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            {/* Banner de Envíos */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center gap-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Truck className="w-4 h-4 text-slate-500" />
              <span>Envíos directos 24h · Devolución profesional garantizada</span>
            </div>
          </div>
        </div>

        {/* Sección Inferior: Pestañas de Información estilo Safeguru */}
        <div className="mt-14 lg:mt-20 pt-8 border-t border-slate-200/80">
          <div className="max-w-5xl mx-auto">
            
            {/* Barra de Pestañas Horizontales Centradas */}
            <div className="flex items-center justify-center border-b border-slate-200 gap-6 sm:gap-12 text-sm sm:text-base font-semibold">
              <button
                type="button"
                onClick={() => setActiveInfoTab('descripcion')}
                className={`pb-3.5 transition-all relative cursor-pointer ${
                  activeInfoTab === 'descripcion'
                    ? 'text-slate-950 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Descripción
                {activeInfoTab === 'descripcion' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f59e0b] rounded-full" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveInfoTab('normativas')}
                className={`pb-3.5 transition-all relative cursor-pointer ${
                  activeInfoTab === 'normativas'
                    ? 'text-slate-950 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Normativas
                {activeInfoTab === 'normativas' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f59e0b] rounded-full" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveInfoTab('marca')}
                className={`pb-3.5 transition-all relative cursor-pointer ${
                  activeInfoTab === 'marca'
                    ? 'text-slate-950 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Marca
                {activeInfoTab === 'marca' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f59e0b] rounded-full" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveInfoTab('descargas')}
                className={`pb-3.5 transition-all relative cursor-pointer ${
                  activeInfoTab === 'descargas'
                    ? 'text-slate-950 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Descargas
                {activeInfoTab === 'descargas' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f59e0b] rounded-full" />
                )}
              </button>
            </div>

            {/* Contenido de la Pestaña Activa */}
            <div className="py-8 text-sm sm:text-base leading-relaxed text-slate-700 animate-in fade-in duration-300">
              
              {/* Pestaña: Descripción */}
              {activeInfoTab === 'descripcion' && (
                <div className="space-y-4 max-w-4xl">
                  {product.description ? (
                    <div
                      className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-normal"
                      dangerouslySetInnerHTML={{
                        __html: product.description,
                      }}
                    />
                  ) : (
                    <p className="text-slate-500 italic">No hay descripción detallada disponible para este artículo.</p>
                  )}
                </div>
              )}

              {/* Pestaña: Normativas */}
              {activeInfoTab === 'normativas' && (
                <div className="space-y-6 max-w-3xl">
                  {(() => {
                    const desc = product.description || '';
                    const regex = /(EN\s+ISO\s+[0-9A-Za-z:/+.-]+|EN\s+[0-9A-Za-z:/+.-]+|ISO\s+[0-9A-Za-z:/+.-]+|UNE-EN\s+[0-9A-Za-z:/+.-]+)/gi;
                    const matches = desc.match(regex);
                    const list = matches ? Array.from(new Set(matches.map(m => m.trim()))) : [];

                    if (list.length > 0) {
                      return (
                        <ul className="list-disc list-inside space-y-2.5 text-slate-800 font-medium">
                          {list.map((norm, idx) => (
                            <li key={idx} className="leading-snug">{norm}</li>
                          ))}
                        </ul>
                      );
                    }

                    return (
                      <div className="space-y-3">
                        <ul className="list-disc list-inside space-y-2 text-slate-800 font-medium">
                          <li>Cumplimiento del Reglamento (UE) 2016/425 sobre Equipos de Protección Individual (EPI)</li>
                          <li>Marcado CE de Conformidad Europea</li>
                          <li>Estándar industrial de confección técnica y seguridad laboral</li>
                        </ul>
                        <p className="text-xs text-slate-500 pt-2">
                          Para verificar las normas técnicas específicas y certificados de laboratorio de este modelo, consulta el documento en la pestaña de <strong>Descargas</strong>.
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Pestaña: Marca */}
              {activeInfoTab === 'marca' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-slate-900 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-md">
                      {product.brand}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" /> Fabricante Homologado
                    </span>
                  </div>

                  <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                    <strong>{product.brand}</strong> es una firma especializada en equipamiento laboral, uniformidad profesional y soluciones de seguridad industrial (EPI). Todos sus productos cumplen rigurosos estándares de fabricación para garantizar la máxima protección, comodidad y durabilidad en el entorno de trabajo.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200/60">
                    <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">Garantía Oficial</div>
                      <div className="text-xs text-slate-500">Distribución directa 100% original con trazabilidad y soporte técnico.</div>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">Calidad Industrial</div>
                      <div className="text-xs text-slate-500">Tejidos y componentes ensayados para resistir uso continuo y lavado profesional.</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pestaña: Descargas */}
              {activeInfoTab === 'descargas' && (
                <div className="space-y-6 max-w-2xl">
                  <p className="text-slate-600 text-sm">
                    Accede a la documentación técnica oficial del fabricante para consultar especificaciones de patronaje, niveles de protección certificados y directrices de mantenimiento.
                  </p>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Ficha Técnica Oficial y Homologación</h4>
                        <span className="text-xs text-slate-500 font-medium">Documento PDF · Formato A4 · Versión Completa</span>
                      </div>
                    </div>

                    <a
                      href={product.pdfUrl || `/api/pdf/technical-sheet?id=${encodeURIComponent(product.id)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        toast.info({
                          title: 'Ficha técnica',
                          message: 'Descargando ficha técnica oficial en PDF...',
                        });
                      }}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#3b6d9c] hover:bg-[#335e87] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all active:scale-[0.98] shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar PDF</span>
                    </a>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </div>

      {/* Popup / Lightbox Modal de Imagen en Grande */}
      {isZoomOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsZoomOpen(false)}
        >
          {/* Botón Cerrar */}
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full backdrop-blur-md transition-all z-10"
            aria-label="Cerrar vista ampliada"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Flecha Anterior */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
              }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transition-all z-10"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Contenedor de la Imagen */}
          <div 
            className="relative max-w-4xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mainImage}
              alt={product.name}
              className="max-h-[75vh] max-w-full object-contain drop-shadow-2xl rounded-2xl bg-white p-4"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/800x1000?text=Protex+Wear';
              }}
            />

            {/* Miniaturas dentro del Popup */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto max-w-full py-2">
                {images.map((img, idx) => (
                  <button
                    key={`modal-${img}-${idx}`}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-16 rounded-xl overflow-hidden border-2 bg-white p-1 transition-all ${
                      selectedImageIndex === idx ? 'border-[#3b6d9c] scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="thumb" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Flecha Siguiente */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transition-all z-10"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </main>
  );
}
