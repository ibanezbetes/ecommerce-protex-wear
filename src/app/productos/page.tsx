'use client';
import { useEffect, useState, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { graphqlFetch } from '@/services/graphqlClient';

interface ProductVariant {
  basePrice: number;
  images?: string[];
  size?: string;
  color?: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  category?: string;
  variants?: ProductVariant[];
}

interface ListProductsResponse {
  listProducts: {
    items: Product[];
    nextToken: string | null;
  };
}

const LIST_PRODUCTS = `
  query ListProducts($brand: String, $category: String, $limit: Int, $nextToken: String) {
    listProducts(brand: $brand, category: $category, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        brand
        category
        variants {
          basePrice
          images
          size
          color
        }
      }
      nextToken
    }
  }
`;

function CatalogContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('categoria') || undefined;
  const urlQuery = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [usingMockCatalog, setUsingMockCatalog] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filters State
  const [selectedSize, setSelectedSize] = useState<string>('ALL');
  const [selectedColor, setSelectedColor] = useState<string>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(500);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const fetchProducts = async (isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      let fetchedItems: Product[] = [];
      let currentNextToken = isLoadMore && nextToken ? nextToken : undefined;

      while (fetchedItems.length < 50) {
        const variables: { brand?: string; category?: string; limit: number; nextToken?: string } = { limit: 100 };
        if (selectedBrand !== 'ALL') variables.brand = selectedBrand;
        if (urlCategory) variables.category = urlCategory;
        if (currentNextToken) variables.nextToken = currentNextToken;

        const data = await graphqlFetch<ListProductsResponse>(LIST_PRODUCTS, variables);
        const validItems = data.listProducts.items.filter((p) => p && p.variants);
        fetchedItems = [...fetchedItems, ...validItems];
        currentNextToken = data.listProducts.nextToken || undefined;

        if (!currentNextToken) break;
      }

      setProducts((prev) => isLoadMore ? [...prev, ...fetchedItems] : fetchedItems);
      setNextToken(currentNextToken || null);
      setUsingMockCatalog(false);
    } catch (error) {
      console.warn('[CatalogPage] Error cargando productos de AppSync. Activando catálogo local simulado (Sandbox Fallback)...', error);
      
      const { MOCK_PRODUCTS } = await import('@/utils/mockCatalog');

      // Filtrar catálogo simulado local según marca seleccionada y categoría si aplica
      let mockItems = selectedBrand === 'ALL'
        ? MOCK_PRODUCTS
        : MOCK_PRODUCTS.filter((p) => p.brand.toLowerCase() === selectedBrand.toLowerCase());

      if (urlCategory) {
        mockItems = mockItems.filter(p => p.category?.toLowerCase() === urlCategory.toLowerCase());
      }

      setProducts((prev) => isLoadMore ? [...prev, ...mockItems] : mockItems);
      setNextToken(null);
      setUsingMockCatalog(true);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProducts(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrand, urlCategory]);

  // Aplicar filtros locales (búsqueda, talla, color, precio)
  const filteredProducts = products.filter(product => {
    // Buscar por texto
    if (urlQuery && !product.name.toLowerCase().includes(urlQuery.toLowerCase()) && !product.brand.toLowerCase().includes(urlQuery.toLowerCase())) {
      return false;
    }

    const hasMatchingVariant = product.variants?.some(v => {
      const matchSize = selectedSize === 'ALL' || v.size?.toLowerCase() === selectedSize.toLowerCase();
      const matchColor = selectedColor === 'ALL' || v.color?.toLowerCase() === selectedColor.toLowerCase();
      const matchPrice = v.basePrice <= maxPrice;
      return matchSize && matchColor && matchPrice;
    });

    return hasMatchingVariant;
  });

  const displayTitle = urlQuery
    ? `Resultados de "${urlQuery}"`
    : urlCategory 
      ? `Catálogo de ${urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1)}` 
      : 'Catálogo de Productos';

  const categories = [
    { id: 'ALL', label: 'Todas' },
    { id: 'pantalones', label: 'Pantalones' },
    { id: 'camisetas', label: 'Camisetas' },
    { id: 'sudaderas', label: 'Sudaderas' },
    { id: 'chaquetas', label: 'Chaquetas' },
    { id: 'chalecos', label: 'Chalecos' },
    { id: 'ropa de trabajo', label: 'Ropa de Trabajo' },
    { id: 'calzado', label: 'Calzado' },
    { id: 'calcetines', label: 'Calcetines' },
    { id: 'guantes', label: 'Guantes' },
    { id: 'cascos', label: 'Cascos' },
    { id: 'accesorios', label: 'Accesorios' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      {/* Premium Header */}
      <div className="bg-white border-b border-gray-200/60 pt-16 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-sm font-bold tracking-widest text-indigo-600 uppercase mb-3">Equipamiento Profesional</p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">{displayTitle}</h1>
            </div>
            
            {/* Brand Filter */}
            <div className="flex bg-gray-100/80 p-1.5 rounded-2xl backdrop-blur-sm self-start">
              {['ALL', 'Anbor', 'Forli'].map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    selectedBrand === brand 
                      ? 'bg-white text-indigo-900 shadow-sm ring-1 ring-gray-900/5' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                  }`}
                >
                  {brand === 'ALL' ? 'Todas las Marcas' : brand}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Filter Scroll with Arrows */}
          <div className="mt-10 relative group">
            {/* Left Gradient/Arrow */}
            <div className="absolute left-0 top-0 bottom-4 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none flex items-center justify-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={() => scroll('left')}
                className="pointer-events-auto bg-white border border-gray-200 shadow-md rounded-full p-2 -ml-2 text-indigo-600 hover:bg-indigo-50 hover:scale-110 transition-all"
                aria-label="Desplazar a la izquierda"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
              </button>
            </div>

            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto pb-4 hide-scrollbar gap-3 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
            >
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.id === 'ALL' ? '/productos' : `/productos?categoria=${cat.id}`}
                  className={`flex-none px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                    (urlCategory || 'ALL') === cat.id 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                      : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50'
                  }`}
                >
                  {cat.label}
                </Link>
              ))}
            </div>

            {/* Right Gradient/Arrow */}
            <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={() => scroll('right')}
                className="pointer-events-auto bg-white border border-gray-200 shadow-md rounded-full p-2 -mr-2 text-indigo-600 hover:bg-indigo-50 hover:scale-110 transition-all"
                aria-label="Desplazar a la derecha"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 shrink-0 space-y-8">
          {/* Price Filter */}
          {urlCategory && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Precio Máximo</h3>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-semibold text-gray-500">0€</span>
                <input 
                  type="range" 
                  min="0" 
                  max="500" 
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="text-sm font-semibold text-indigo-600">{maxPrice}€</span>
              </div>
            </div>
          )}

          {/* Size Filter */}
          {urlCategory && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Talla</h3>
              <div className="flex flex-wrap gap-2">
                {['ALL', 'S', 'M', 'L', 'XL', 'XXL', '38', '39', '40', '41', '42', '43', '44', '45', '46'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold flex items-center justify-center transition-all ${
                      selectedSize === size
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {size === 'ALL' ? 'Todas' : size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Filter */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Color</h3>
            <div className="flex flex-wrap gap-2">
              {['ALL', 'Negro', 'Blanco', 'Azul', 'Gris', 'Rojo', 'Amarillo'].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    selectedColor === color
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {color === 'ALL' ? 'Todos' : color}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Actualizando catálogo premium...</p>
          </div>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-300">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron productos</h3>
                <p className="text-gray-500">Prueba a seleccionar otros filtros o categorías.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => {
                  const firstVariant = product.variants?.[0];
                  const price = firstVariant?.basePrice || 0;
                  let image = firstVariant?.images?.[0];
                  
                  if (!image || image.includes('.html') || !image.match(/\.(jpeg|jpg|gif|png|webp)/i)) {
                    image = 'https://via.placeholder.com/600x800?text=Protex+Wear';
                  }

                  return (
                    <Link key={product.id} href={`/productos/${product.id}`} className="group flex flex-col bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-900/5 hover:-translate-y-1 transition-all duration-300">
                      
                      {/* Image Container */}
                      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 to-transparent z-10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Badges */}
                        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                          <span className="bg-white/90 backdrop-blur-md text-gray-900 text-xs font-extrabold px-3 py-1.5 rounded-full shadow-sm ring-1 ring-gray-900/5">
                            {product.brand}
                          </span>
                        </div>

                        {product.category && (
                          <div className="absolute top-4 right-4 z-20">
                            <span className="bg-indigo-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                              {product.category}
                            </span>
                          </div>
                        )}

                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image}
                          alt={product.name}
                          className="w-full h-full object-cover mix-blend-darken transform group-hover:scale-105 transition-transform duration-500 ease-out"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/600x800?text=Protex+Wear';
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                          {product.name}
                        </h3>
                        <div className="mt-auto flex items-end justify-between">
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Precio B2B</span>
                            <span className="text-2xl font-extrabold text-indigo-600">{price.toFixed(2)}&euro;</span>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {nextToken && (
              <div className="mt-16 flex justify-center">
                <button
                  onClick={() => fetchProducts(true)}
                  disabled={loadingMore}
                  className="px-8 py-4 bg-white border-2 border-indigo-600 text-indigo-600 font-bold rounded-full hover:bg-indigo-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  {loadingMore && <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />}
                  {loadingMore ? 'Cargando...' : 'Ver Más Productos'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
      
      {/* Inline styles for hiding scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>}>
      <CatalogContent />
    </Suspense>
  );
}
