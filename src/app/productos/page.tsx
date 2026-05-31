'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
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
      const variables: { brand?: string; limit: number; nextToken?: string } = { limit: 24 };
      if (selectedBrand !== 'ALL') variables.brand = selectedBrand;
      if (isLoadMore && nextToken) variables.nextToken = nextToken;

      const data = await graphqlFetch<ListProductsResponse>(LIST_PRODUCTS, variables);
      const fetchedItems = data.listProducts.items.filter((p) => p && p.variants);

      setProducts((prev) => isLoadMore ? [...prev, ...fetchedItems] : fetchedItems);
      setNextToken(data.listProducts.nextToken);
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
  }, [selectedBrand]);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.toolbar}>
          <h1 className={styles.title}>Cat&aacute;logo</h1>

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
        </div>

        {loading ? (
          <div className={styles.state}>Actualizando cat&aacute;logo...</div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className={styles.state}>No se encontraron productos para esta marca.</div>
            ) : (
              <div className={styles.grid}>
                {products.map((product) => {
                  const firstVariant = product.variants?.[0];
                  const price = firstVariant?.basePrice || 0;
                  const image = firstVariant?.images?.[0] || 'https://via.placeholder.com/400';

                  return (
                    <Link key={product.id} href={`/products/${product.id}`} className={styles.card}>
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
    </main>
  );
}
