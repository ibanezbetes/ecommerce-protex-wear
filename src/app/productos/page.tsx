'use client';
import { useEffect, useState, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { graphqlFetch, userOperations } from '@/services/graphqlClient';
import { useAuth } from '@/store/useAuth';

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

// Definición de las categorías jerárquicas (idénticas a la pestaña de Productos / Mega Menú)
interface CategorySubitem {
  name: string;
  slug: string;
}

interface CategoryGroup {
  id: string;
  groupTitle: string;
  items: CategorySubitem[];
}

const SIDEBAR_CATEGORIES: CategoryGroup[] = [
  {
    id: 'ropa',
    groupTitle: 'Ropa de Trabajo',
    items: [
      { name: 'Pantalones de trabajo', slug: 'pantalones' },
      { name: 'Ropa de alta visibilidad', slug: 'ropa' },
      { name: 'Polos y camisetas', slug: 'camisetas' },
      { name: 'Chalecos de trabajo', slug: 'chalecos' },
      { name: 'Monos de trabajo', slug: 'ropa de trabajo' },
      { name: 'Sudaderas y polares', slug: 'sudaderas' },
      { name: 'Chaquetas y abrigos', slug: 'chaquetas' },
      { name: 'Ropa impermeable', slug: 'ropa' },
    ],
  },
  {
    id: 'calzado',
    groupTitle: 'Calzado de Seguridad',
    items: [
      { name: 'Zapatos de seguridad S1P / S3', slug: 'calzado' },
      { name: 'Botas de seguridad', slug: 'calzado' },
      { name: 'Zapatillas de trabajo', slug: 'calzado' },
      { name: 'Botas de agua y PVC', slug: 'calzado' },
      { name: 'Calcetines y plantillas', slug: 'calcetines' },
    ],
  },
  {
    id: 'guantes',
    groupTitle: 'Protección de Manos',
    items: [
      { name: 'Guantes anticorte', slug: 'guantes' },
      { name: 'Guantes de nitrilo y látex', slug: 'guantes' },
      { name: 'Guantes térmicos para frío', slug: 'guantes' },
      { name: 'Guantes de cuero y soldador', slug: 'guantes' },
      { name: 'Guantes riesgo químico', slug: 'guantes' },
      { name: 'Guantes desechables', slug: 'guantes' },
    ],
  },
  {
    id: 'cabeza',
    groupTitle: 'Protección de Cabeza y Facial',
    items: [
      { name: 'Cascos de seguridad', slug: 'cascos' },
      { name: 'Gorras antigolpes', slug: 'cascos' },
      { name: 'Gafas de seguridad', slug: 'gafas' },
      { name: 'Pantallas faciales', slug: 'pantallas' },
      { name: 'Mascarillas FFP2 / FFP3', slug: 'mascarillas' },
      { name: 'Protectores auditivos', slug: 'auditiva' },
    ],
  },
  {
    id: 'especial',
    groupTitle: 'Sectores Especializados',
    items: [
      { name: 'Industria e Instaladores', slug: 'industria' },
      { name: 'Construcción y Obra', slug: 'construccion' },
      { name: 'Hostelería y Cocina', slug: 'hosteleria' },
      { name: 'Sanidad y Laboratorio', slug: 'sanidad' },
      { name: 'Arneses y Alturas', slug: 'arneses' },
      { name: 'Accesorios y Otros', slug: 'accesorios' },
    ],
  },
];

const COLOR_PALETTE = [
  { id: 'ALL', name: 'Todos los colores', hex: 'linear-gradient(135deg, #f43f5e 0%, #3b82f6 50%, #10b981 100%)', border: '#e2e8f0' },
  { id: 'Negro', name: 'Negro', hex: '#09090b', border: '#27272a' },
  { id: 'Blanco', name: 'Blanco', hex: '#ffffff', border: '#cbd5e1' },
  { id: 'Azul', name: 'Azul Marino / Royal', hex: '#1e3a8a', border: '#1e40af' },
  { id: 'Gris', name: 'Gris', hex: '#64748b', border: '#475569' },
  { id: 'Rojo', name: 'Rojo', hex: '#dc2626', border: '#b91c1c' },
  { id: 'Amarillo', name: 'Amarillo A.V.', hex: '#eab308', border: '#ca8a04' },
  { id: 'Naranja', name: 'Naranja A.V.', hex: '#ea580c', border: '#c2410c' },
  { id: 'Verde', name: 'Verde', hex: '#16a34a', border: '#15803d' },
];

function CatalogContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('categoria') || undefined;
  const urlQuery = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [usingMockCatalog, setUsingMockCatalog] = useState(false);

  // Filtros de barra lateral
  const [selectedSize, setSelectedSize] = useState<string>('ALL');
  const [selectedColor, setSelectedColor] = useState<string>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(500);

  // Estado de acordeones desplegables para grupos de categorías (por defecto todos recogidos)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    ropa: false,
    calzado: false,
    guantes: false,
    cabeza: false,
    especial: false,
  });

  // Si el usuario entra con una categoría seleccionada en la URL, auto-desplegar solo ese grupo
  useEffect(() => {
    if (urlCategory) {
      const activeGroup = SIDEBAR_CATEGORIES.find((g) =>
        g.items.some((item) => item.slug.toLowerCase() === urlCategory.toLowerCase())
      );
      if (activeGroup) {
        setOpenGroups((prev) => ({ ...prev, [activeGroup.id]: true }));
      }
    }
  }, [urlCategory]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
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
        const variables: { category?: string; limit: number; nextToken?: string } = { limit: 100 };
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
      console.warn('[CatalogPage] Error cargando productos de AppSync. Activando catálogo local simulado...', error);
      
      const { MOCK_PRODUCTS } = await import('@/utils/mockCatalog');

      let mockItems = MOCK_PRODUCTS;
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
  }, [urlCategory]);

  useEffect(() => {
    if (user && !user.specialPrices) {
      userOperations.getUserProfile().then(profile => {
        if (profile?.specialPrices) {
          useAuth.setState(state => ({
            ...state,
            user: state.user ? { ...state.user, specialPrices: profile.specialPrices as any } : null
          }));
        }
      }).catch(console.error);
    }
  }, [user]);

  // Aplicar filtros locales (búsqueda, talla, color, precio)
  const filteredProducts = products.filter(product => {
    if (urlQuery && !product.name.toLowerCase().includes(urlQuery.toLowerCase()) && !product.brand.toLowerCase().includes(urlQuery.toLowerCase())) {
      return false;
    }

    const hasMatchingVariant = product.variants?.some(v => {
      const matchSize = selectedSize === 'ALL' || v.size?.toLowerCase() === selectedSize.toLowerCase();
      const matchColor = selectedColor === 'ALL' || v.color?.toLowerCase() === selectedColor.toLowerCase();
      
      let variantPrice = v.basePrice;
      if (user?.specialPrices) {
        const sp = user.specialPrices.find((s: any) => s.productId === product.id);
        if (sp) variantPrice = sp.specialPrice;
      }
      
      const matchPrice = variantPrice <= maxPrice;
      return matchSize && matchColor && matchPrice;
    });

    return hasMatchingVariant;
  });

  const displayTitle = urlQuery
    ? `Resultados de "${urlQuery}"`
    : urlCategory 
      ? `Catálogo de ${urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1)}` 
      : 'Catálogo de Productos';

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-900">
      {/* Cabecera Limpia y Profesional (Sin botones de marcas ni scroll horizontal) */}
      <div className="bg-white border-b border-slate-200/80 pt-10 pb-8 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <nav className="flex items-center text-xs font-medium text-slate-500 mb-2 space-x-2">
                <Link href="/" className="hover:text-[#3b6d9c] transition-colors">Inicio</Link>
                <span className="text-slate-300 font-mono">/</span>
                <Link href="/productos" className="hover:text-[#3b6d9c] transition-colors">Catálogo</Link>
                {urlCategory && (
                  <>
                    <span className="text-slate-300 font-mono">/</span>
                    <span className="text-slate-900 font-bold capitalize">{urlCategory}</span>
                  </>
                )}
              </nav>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{displayTitle}</h1>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono font-medium text-slate-600 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {filteredProducts.length} {filteredProducts.length === 1 ? 'artículo' : 'artículos'} disponibles
            </span>
          </div>
        </div>
      </div>

      {/* Contenedor Principal: Sidebar Izquierda + Catálogo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar Izquierda (Categorías Desplegables + Colores Verticales) */}
        <aside className="w-full lg:w-72 shrink-0 space-y-6">
          
          {/* Bloque 1: Categorías y Subcategorías Desplegables */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span>Categorías</span>
              </h2>
              {urlCategory && (
                <Link 
                  href="/productos" 
                  className="text-[11px] font-bold text-[#3b6d9c] hover:underline"
                >
                  Ver todas
                </Link>
              )}
            </div>

            {/* Enlace a "Todos los productos" */}
            <div className="mb-2">
              <Link
                href="/productos"
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  !urlCategory
                    ? 'bg-[#3b6d9c] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Todos los Productos</span>
                <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${!urlCategory ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {products.length}
                </span>
              </Link>
            </div>

            {/* Lista de Grupos Desplegables */}
            <div className="space-y-1.5">
              {SIDEBAR_CATEGORIES.map((group) => {
                const isOpen = openGroups[group.id];
                const hasActiveCategory = group.items.some((item) => item.slug.toLowerCase() === urlCategory?.toLowerCase());

                return (
                  <div key={group.id} className="border-b border-slate-100 last:border-0 pb-1.5 pt-1">
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-left ${
                        hasActiveCategory ? 'text-[#3b6d9c]' : 'text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{group.groupTitle}</span>
                      <svg
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                          isOpen ? 'rotate-180 text-[#3b6d9c]' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Subcategorías anidadas */}
                    {isOpen && (
                      <ul className="mt-1 pl-2.5 space-y-1 border-l-2 border-slate-100 ml-2 animate-in fade-in duration-150">
                        {group.items.map((sub) => {
                          const isActive = urlCategory?.toLowerCase() === sub.slug.toLowerCase();
                          return (
                            <li key={sub.name}>
                              <Link
                                href={`/productos?categoria=${encodeURIComponent(sub.slug)}`}
                                className={`block px-2.5 py-1.5 rounded-md text-xs transition-all ${
                                  isActive
                                    ? 'bg-[#3b6d9c]/10 text-[#3b6d9c] font-bold'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                                }`}
                              >
                                {sub.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bloque 2: Filtro de Colores (Ordenado verticalmente con cuadradito de color) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Filtrar por Color
              </h2>
              {selectedColor !== 'ALL' && (
                <button
                  onClick={() => setSelectedColor('ALL')}
                  className="text-[11px] font-bold text-[#3b6d9c] hover:underline"
                >
                  Limpiar
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              {COLOR_PALETTE.map((c) => {
                const isSelected = selectedColor.toLowerCase() === c.id.toLowerCase();

                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all text-left ${
                      isSelected
                        ? 'bg-[#3b6d9c]/10 text-[#3b6d9c] ring-1 ring-[#3b6d9c]/30 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Cuadradito de color */}
                      <span
                        className="w-4 h-4 rounded-md shrink-0 shadow-xs border"
                        style={{
                          background: c.hex,
                          borderColor: c.border,
                        }}
                      />
                      <span>{c.name}</span>
                    </div>

                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3b6d9c]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bloque 3: Filtro de Tallas */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Tallas Homologadas
              </h2>
              {selectedSize !== 'ALL' && (
                <button
                  onClick={() => setSelectedSize('ALL')}
                  className="text-[11px] font-bold text-[#3b6d9c] hover:underline"
                >
                  Limpiar
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {['ALL', 'S', 'M', 'L', 'XL', 'XXL', '38', '39', '40', '41', '42', '43', '44', '45', '46'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[36px] h-8 px-2 rounded-lg text-xs font-bold border transition-all ${
                    selectedSize === size
                      ? 'border-[#3b6d9c] bg-[#3b6d9c] text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {size === 'ALL' ? 'Todas' : size}
                </button>
              ))}
            </div>
          </div>

          {/* Bloque 4: Filtro de Precio */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3">
              Precio Máximo
            </h2>
            <div className="space-y-2">
              <input 
                type="range" 
                min="0" 
                max="500" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#3b6d9c]"
              />
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>0€</span>
                <span className="text-[#3b6d9c] font-black text-sm">{maxPrice}€</span>
              </div>
            </div>
          </div>

        </aside>

        {/* Product Grid */}
        <div className="flex-1 w-full">
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
                  let price = firstVariant?.basePrice || 0;
                  
                  if (user?.specialPrices) {
                    const sp = user.specialPrices.find((s: any) => s.productId === product.id);
                    if (sp) {
                      price = sp.specialPrice;
                    }
                  }

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
                            <span className="bg-[#3b6d9c]/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider text-[10px]">
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
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-[#3b6d9c] transition-colors">
                          {product.name}
                        </h3>
                        <div className="mt-auto flex items-end justify-between">
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Precio</span>
                            <span className="text-2xl font-extrabold text-[#3b6d9c]">{price.toFixed(2)}&euro;</span>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#3b6d9c] group-hover:text-white transition-colors">
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
                  className="px-8 py-3.5 bg-white border-2 border-[#3b6d9c] text-[#3b6d9c] font-bold rounded-xl hover:bg-[#3b6d9c]/10 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  {loadingMore && <div className="w-5 h-5 border-2 border-[#3b6d9c]/30 border-t-[#3b6d9c] rounded-full animate-spin" />}
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
