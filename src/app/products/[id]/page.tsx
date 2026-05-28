'use client';
import { useEffect, useState, use } from 'react';
import { graphqlFetch } from '@/services/graphqlClient';
import { useAuth } from '@/store/useAuth';
import { useCart } from '@/store/useCart';
import { useToast } from '@/components/Feedback/ToastProvider';
import styles from './page.module.css';

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
        setProduct(data.getProduct);

        if (data.getProduct?.variants?.length) {
          setSelectedSize(data.getProduct.variants[0].size || '');
          setSelectedColor(data.getProduct.variants[0].color || '');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, user]);

  if (loading) return <div className={styles.state}>Cargando producto...</div>;
  if (!product) return <div className={styles.state}>Producto no encontrado.</div>;

  const availableSizes = Array.from(new Set(product.variants.map((variant) => variant.size))).filter(Boolean) as string[];
  const availableColors = Array.from(new Set(product.variants.map((variant) => variant.color))).filter(Boolean) as string[];

  const activeVariant = product.variants.find((variant) =>
    (!selectedSize || variant.size === selectedSize) &&
    (!selectedColor || variant.color === selectedColor)
  ) || product.variants[0];

  const images = activeVariant.images?.length ? activeVariant.images : ['https://via.placeholder.com/600'];
  const mainImage = images[selectedImageIndex] || images[0];

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: activeVariant.id,
      name: `${product.name} (${activeVariant.size || 'Unica'} - ${activeVariant.color || 'Unico'})`,
      price: activeVariant.basePrice,
      quantity: 1,
      image: mainImage,
    });
    toast.success({
      title: 'Producto a\u00f1adido',
      message: 'Se ha a\u00f1adido un producto al carrito.',
    });
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.gallery}>
            <div className={styles.mainImage}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mainImage}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/600?text=Imagen+No+Disponible';
                }}
              />
            </div>

            {images.length > 1 && (
              <div className={styles.thumbs}>
                {images.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`${styles.thumb} ${selectedImageIndex === idx ? styles.thumbActive : ''}`}
                    aria-label={`Vista ${idx + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Vista ${idx + 1}`}
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/150?text=Error';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.details}>
            <span className={styles.brand}>{product.brand}</span>
            <h1 className={styles.title}>{product.name}</h1>

            <div className={styles.priceRow}>
              <span className={styles.price}>{activeVariant.basePrice.toFixed(2)}&euro;</span>
              {user?.can_pay_later && (
                <span className={styles.b2bBadge}>Precio B2B aplicado</span>
              )}
            </div>

            <div className={styles.description}>
              <h3 className="sr-only">Descripci&oacute;n</h3>
              <div dangerouslySetInnerHTML={{ __html: product.description || 'Sin descripci&oacute;n' }} />
            </div>

            <div className={styles.options}>
              <div className={styles.optionGrid}>
                {availableSizes.length > 0 && (
                  <div>
                    <h3 className={styles.optionTitle}>Talla</h3>
                    <div className={styles.choiceGrid}>
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            setSelectedSize(size);
                            setSelectedImageIndex(0);
                          }}
                          className={`${styles.choice} ${selectedSize === size ? styles.choiceActive : ''}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {availableColors.length > 0 && (
                  <div>
                    <h3 className={styles.optionTitle}>Color</h3>
                    <div className={styles.choiceGrid}>
                      {availableColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            setSelectedColor(color);
                            setSelectedImageIndex(0);
                          }}
                          className={`${styles.choice} ${selectedColor === color ? styles.choiceActive : ''}`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.addArea}>
              <button onClick={handleAddToCart} className={styles.addButton}>
                A&ntilde;adir al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
