'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchGraphQL } from '@/utils/graphqlClient';

const LIST_PRODUCTS = `
  query ListProducts($brand: String, $limit: Int, $nextToken: String) {
    listProducts(brand: $brand, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        brand
        variants {
          basePrice
          images
        }
      }
      nextToken
    }
  }
`;

export default function CatalogPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');

  const fetchProducts = async (isLoadMore = false) => {
    isLoadMore ? setLoadingMore(true) : setLoading(true);
    
    try {
      const variables: any = { limit: 24 };
      if (selectedBrand !== 'ALL') variables.brand = selectedBrand;
      if (isLoadMore && nextToken) variables.nextToken = nextToken;

      const data = await fetchGraphQL<any>(LIST_PRODUCTS, variables);
      const fetchedItems = data.listProducts.items.filter((p: any) => p && p.variants);
      
      setProducts(prev => isLoadMore ? [...prev, ...fetchedItems] : fetchedItems);
      setNextToken(data.listProducts.nextToken);
    } catch (error) {
      console.error("Error cargando productos", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProducts(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrand]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900">Catálogo</h1>
        
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          {['ALL', 'Anbor', 'Forli'].map(brand => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                selectedBrand === brand 
                  ? 'bg-white text-primary-color shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {brand === 'ALL' ? 'Todas las Marcas' : brand}
            </button>
          ))}
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20 text-gray-500 font-medium">Actualizando catálogo...</div>
      ) : (
        <>
          {products.length === 0 ? (
             <div className="text-center py-20 text-gray-500">No se encontraron productos para esta marca.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => {
                const firstVariant = product.variants?.[0];
                const price = firstVariant?.basePrice || 0;
                const image = firstVariant?.images?.[0] || 'https://via.placeholder.com/400';

                return (
                  <Link key={product.id} href={`/products/${product.id}`} className="group block">
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={image} 
                          alt={product.name} 
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/400?text=Sin+Foto';
                          }}
                        />
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-bold text-gray-700 rounded shadow-sm">
                          {product.brand}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                        <p className="mt-2 text-lg font-bold text-primary-color">{price.toFixed(2)}€</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {nextToken && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => fetchProducts(true)}
                disabled={loadingMore}
                className="bg-white border-2 border-primary-color text-primary-color hover:bg-gray-50 font-bold py-3 px-8 rounded-full transition-colors disabled:opacity-50"
              >
                {loadingMore ? 'Cargando más...' : 'Cargar más productos'}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
