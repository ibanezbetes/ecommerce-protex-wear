'use client';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { graphqlFetch } from '@/services/graphqlClient';
import { MOCK_PRODUCTS } from '@/utils/mockCatalog';
import { useAuth } from '@/store/useAuth';
import { useCart } from '@/store/useCart';
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
  const [quantity, setQuantity] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

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

  return (
    <main className="min-h-screen bg-[#F4F6F9] text-slate-900 pb-24 relative overflow-hidden">
      {/* Trama milimétrica técnica industrial de fondo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

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

            {/* Precio y Tarifa B2B */}
            <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-4 mb-5 flex items-baseline justify-between">
              <div>
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {basePrice.toFixed(2)}&euro;
                </span>
                <span className="block text-xs font-semibold text-slate-500 mt-0.5">
                  {priceWithTax.toFixed(2)}&euro; con IVA incluido
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Stock Disponible
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
                onClick={() => setIsFavorite(!isFavorite)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                  isFavorite 
                    ? 'bg-amber-400 border-amber-400 text-slate-950 shadow-xs' 
                    : 'bg-amber-400 hover:bg-amber-500 border-amber-400 text-slate-950 shadow-xs'
                }`}
                title="Añadir a favoritos"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-slate-950' : ''}`} />
              </button>
            </div>

            {/* Banner de Envíos */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center gap-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Truck className="w-4 h-4 text-slate-500" />
              <span>Envíos directos 24h · Devolución profesional garantizada</span>
            </div>
          </div>
        </div>

        {/* Sección Inferior: 2 Cajas Técnicas Independientes y Centradas */}
        <div className="mt-12 lg:mt-16 pt-8 border-t border-slate-200/80">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            
            {/* Caja 1: Documentación Oficial y Ficha Técnica */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 text-[#3b6d9c] text-xs font-bold uppercase tracking-widest mb-3">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Documentación Oficial</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">
                  Ficha Técnica y Homologación
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                  Dossier oficial con estándares de confección, normativas laborales aplicadas y especificaciones del fabricante.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#3b6d9c]" />
                    <span className="font-semibold text-slate-700">Formato PDF · A4</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">v2.4</span>
                </div>

                <a
                  href={`/api/pdf/technical-sheet?id=${encodeURIComponent(product.id)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    toast.info({
                      title: 'Ficha técnica',
                      message: 'Descargando ficha técnica oficial en PDF...',
                    });
                  }}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#3b6d9c] hover:bg-[#335e87] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-[#3b6d9c]/20 transition-all active:scale-[0.99]"
                >
                  <Download className="w-4 h-4 text-white stroke-[2.5]" />
                  <span>Descargar Ficha Técnica (PDF)</span>
                </a>
              </div>
            </div>

            {/* Caja 2: Especificaciones de Fabricación y Descripción */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col">
              <div className="inline-flex items-center gap-2 text-[#3b6d9c] text-xs font-bold uppercase tracking-widest mb-3">
                <Award className="w-4 h-4" />
                <span>Especificaciones de Fabricación</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-4">
                Detalles del Producto y Materiales
              </h3>

              <div
                className="prose prose-sm text-slate-600 max-w-none leading-relaxed space-y-2.5 font-normal overflow-y-auto"
                dangerouslySetInnerHTML={{
                  __html: product.description || '<p>No hay descripción adicional disponible para este producto.</p>',
                }}
              />
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
