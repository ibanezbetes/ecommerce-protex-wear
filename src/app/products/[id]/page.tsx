'use client';
import { useEffect, useState, use } from 'react';
import { graphqlFetch } from '@/services/graphqlClient';
import { useAuth } from '@/store/useAuth';
import { useCart } from '@/store/useCart';

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
  const addItem = useCart(state => state.addItem);
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await graphqlFetch<any>(GET_PRODUCT, { id });
        setProduct(data.getProduct);
        
        if (data.getProduct?.variants?.length > 0) {
          setSelectedSize(data.getProduct.variants[0].size);
          setSelectedColor(data.getProduct.variants[0].color);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [id, user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando producto...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Producto no encontrado.</div>;

  const availableSizes = Array.from(new Set(product.variants.map((v: any) => v.size))).filter(Boolean) as string[];
  const availableColors = Array.from(new Set(product.variants.map((v: any) => v.color))).filter(Boolean) as string[];

  const activeVariant = product.variants.find((v: any) => 
    (!selectedSize || v.size === selectedSize) && 
    (!selectedColor || v.color === selectedColor)
  ) || product.variants[0];

  const images = activeVariant.images?.length > 0 ? activeVariant.images : ['https://via.placeholder.com/600'];
  const mainImage = images[selectedImageIndex] || images[0];

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: activeVariant.id,
      name: `${product.name} (${activeVariant.size || 'Unica'} - ${activeVariant.color || 'Unico'})`,
      price: activeVariant.basePrice,
      quantity: 1,
      image: mainImage
    });
    alert('Añadido al carrito con éxito!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="flex flex-col gap-4">
          <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-square border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={mainImage} 
              alt={product.name} 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/600?text=Imagen+No+Disponible';
              }} 
            />
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx ? 'border-indigo-600 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={img} 
                    alt={`Vista ${idx + 1}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/150?text=Error';
                    }} 
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-bold text-indigo-600 tracking-wider uppercase mb-2">{product.brand}</span>
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{product.name}</h1>
          
          <div className="mt-4">
            <span className="text-3xl font-bold text-gray-900">{activeVariant.basePrice.toFixed(2)}€</span>
            {user?.can_pay_later && (
               <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                 Precio B2B Aplicado
               </span>
            )}
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="sr-only">Descripción</h3>
            <div 
              className="text-base text-gray-700 space-y-4 prose prose-sm"
              dangerouslySetInnerHTML={{ __html: product.description || 'Sin descripción' }}
            />
          </div>

          <div className="mt-8">
            <div className="flex gap-8">
              {availableSizes.length > 0 && (
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Talla</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {availableSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSize(size);
                          setSelectedImageIndex(0);
                        }}
                        className={`py-2 text-sm font-medium rounded-md border text-center transition-colors
                          ${selectedSize === size 
                            ? 'bg-indigo-600 text-white border-indigo-600' 
                            : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {availableColors.length > 0 && (
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {availableColors.map(color => (
                      <button
                        key={color}
                        onClick={() => {
                          setSelectedColor(color);
                          setSelectedImageIndex(0);
                        }}
                        className={`py-2 text-sm font-medium rounded-md border text-center transition-colors
                          ${selectedColor === color 
                            ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50 text-indigo-700' 
                            : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 flex">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gray-900 border border-transparent rounded-lg py-4 px-8 flex items-center justify-center text-base font-bold text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
            >
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
