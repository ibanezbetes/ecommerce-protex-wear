'use client';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { graphqlFetch } from '@/services/graphqlClient';
import styles from './page.module.css';

interface ProductVariant {
  basePrice: number;
  images?: string[];
}

interface Product {
  id: string;
  name: string;
  brand: string;
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
        }
      }
      nextToken
    }
  }
`;

function CatalogContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('categoria') || undefined;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');

  const fetchProducts = async (isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      let fetchedItems: Product[] = [];
      let currentNextToken = isLoadMore && nextToken ? nextToken : undefined;

      while (fetchedItems.length < 20) {
        const variables: { brand?: string; category?: string; limit: number; nextToken?: string } = { limit: 50 };
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
    } catch (error) {
      console.error('Error cargando productos', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrand, urlCategory]);

  const displayTitle = urlCategory 
    ? `Catálogo > ${urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1)}` 
    : 'Catálogo';

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <h1 className={styles.title}>{displayTitle}</h1>

        <div className={styles.filtersContainer} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className={styles.brandFilter} aria-label="Filtrar por marca">
            {['ALL', 'Anbor', 'Forli'].map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`${styles.filterButton} ${selectedBrand === brand ? styles.filterButtonActive : ''}`}
              >
                {brand === 'ALL' ? 'Todas las marcas' : brand}
              </button>
            ))}
          </div>

          <div className={styles.brandFilter} aria-label="Filtrar por categoría">
            {[
              { id: 'ALL', label: 'Todas las categorías' },
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
              { id: 'otros', label: 'Otros' }
            ].map((cat) => (
              <Link
                key={cat.id}
                href={cat.id === 'ALL' ? '/productos' : `/productos?categoria=${cat.id}`}
                className={`${styles.filterButton} ${(urlCategory || 'ALL') === cat.id ? styles.filterButtonActive : ''}`}
                style={{ textDecoration: 'none' }}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
        {loading ? (
          <div className={styles.state}>Actualizando cat&aacute;logo...</div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className={styles.state}>No se encontraron productos para los filtros seleccionados.</div>
            ) : (
              <div className={styles.grid}>
                {products.map((product) => {
                  const firstVariant = product.variants?.[0];
                  const price = firstVariant?.basePrice || 0;
                  let image = firstVariant?.images?.[0];
                  
                  if (!image || image.includes('.html') || !image.match(/\.(jpeg|jpg|gif|png|webp)/i)) {
                    image = 'https://via.placeholder.com/400?text=Sin+Foto';
                  }

                  return (
                    <Link key={product.id} href={`/productos/${product.id}`} className={styles.card}>
                      <div className={styles.imageWrap}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image}
                          alt={product.name}
                          className={styles.image}
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/400?text=Sin+Foto';
                          }}
                        />
                        <div className={styles.brandBadge}>{product.brand}</div>
                        {product.category && (
                          <div className={styles.categoryBadge} style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            background: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            textTransform: 'capitalize'
                          }}>
                            {product.category}
                          </div>
                        )}
                      </div>
                      <div className={styles.cardBody}>
                        <h3 className={styles.productName}>{product.name}</h3>
                        <p className={styles.price}>{price.toFixed(2)}&euro;</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {nextToken && (
              <div className={styles.loadMore}>
                <button
                  onClick={() => fetchProducts(true)}
                  disabled={loadingMore}
                  className={styles.outlineButton}
                >
                  {loadingMore ? 'Cargando m\u00e1s...' : 'Cargar m\u00e1s productos'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
  );
}

export default function CatalogPage() {
  return (
    <main className={styles.page}>
      <Suspense fallback={<div className={styles.container}><div className={styles.state}>Cargando catálogo...</div></div>}>
        <CatalogContent />
      </Suspense>
    </main>
  );
}
