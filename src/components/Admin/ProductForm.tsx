import React, { useState, useEffect } from 'react';
import type { Product } from '../../services/graphql';

/**
 * Product Form Component for Admin
 * Handles creation and editing of products
 */

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
}

interface ProductFormData {
  sku: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  subcategory: string;
  brand: string;
  imageUrl: string;
  imageUrls: string[];
  specifications: Record<string, any>;
  isActive: boolean;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  tags: string[];
}

function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    sku: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    subcategory: '',
    brand: '',
    imageUrl: '',
    imageUrls: [],
    specifications: {},
    isActive: true,
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
      unit: 'cm',
    },
    tags: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  // Categories for dropdown
  const categories = [
    'Protección Cabeza',
    'Protección Manos',
    'Protección Pies',
    'Protección Respiratoria',
    'Alta Visibilidad',
    'Ropa de Trabajo',
    'Protección Auditiva',
    'Protección Ocular',
    'Equipos de Altura',
    'Señalización',
  ];

  // Load product data if editing
  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku,
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        category: product.category || '',
        subcategory: product.subcategory || '',
        brand: product.brand || '',
        imageUrl: product.imageUrl || '',
        imageUrls: product.imageUrls || [],
        specifications: (product.specifications as Record<string, any>) || {},
        isActive: product.isActive,
        weight: product.weight || 0,
        dimensions: (product.dimensions as any) || {
          length: 0,
          width: 0,
          height: 0,
          unit: 'cm',
        },
        tags: product.tags || [],
      });
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDimensionChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [field]: field === 'unit' ? value : parseFloat(value) || 0,
      },
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim() && !formData.imageUrls.includes(newImageUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        imageUrls: [...prev.imageUrls, newImageUrl.trim()],
      }));
      setNewImageUrl('');
    }
  };

  const handleRemoveImageUrl = (urlToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter(url => url !== urlToRemove),
    }));
  };

  const handleAddSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpecKey.trim()]: newSpecValue.trim(),
        },
      }));
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const handleRemoveSpecification = (keyToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: Object.fromEntries(
        Object.entries(prev.specifications).filter(([key]) => key !== keyToRemove)
      ),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.sku.trim()) {
      newErrors.sku = 'El SKU es obligatorio';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor que 0';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKU *
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.sku ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="EPP-001"
            />
            {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Casco de Seguridad Industrial"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Descripción detallada del producto..."
          />
        </div>

        {/* Price and Stock */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio (€) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.price ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              min="0"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.stock ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peso (kg)
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category and Brand */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Seleccionar categoría</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subcategoría
            </label>
            <input
              type="text"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Cascos, Guantes, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marca
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="3M, Honeywell, etc."
            />
          </div>
        </div>

        {/* Main Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL de Imagen Principal
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>

        {/* Additional Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imágenes Adicionales
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="URL de imagen adicional"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="btn btn-outline"
            >
              Añadir
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.imageUrls.map((url, index) => (
              <div key={index} className="flex items-center bg-gray-100 rounded px-2 py-1 text-sm">
                <span className="truncate max-w-32">{url}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveImageUrl(url)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dimensiones
          </label>
          <div className="grid grid-cols-4 gap-2">
            <input
              type="number"
              value={formData.dimensions.length}
              onChange={(e) => handleDimensionChange('length', e.target.value)}
              placeholder="Largo"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <input
              type="number"
              value={formData.dimensions.width}
              onChange={(e) => handleDimensionChange('width', e.target.value)}
              placeholder="Ancho"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <input
              type="number"
              value={formData.dimensions.height}
              onChange={(e) => handleDimensionChange('height', e.target.value)}
              placeholder="Alto"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <select
              value={formData.dimensions.unit}
              onChange={(e) => handleDimensionChange('unit', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="cm">cm</option>
              <option value="mm">mm</option>
              <option value="in">in</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Etiquetas
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Nueva etiqueta"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="btn btn-outline"
            >
              Añadir
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex items-center bg-blue-100 text-blue-800 rounded px-2 py-1 text-sm">
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Specifications */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Especificaciones Técnicas
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={newSpecKey}
              onChange={(e) => setNewSpecKey(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Clave (ej: Material)"
            />
            <input
              type="text"
              value={newSpecValue}
              onChange={(e) => setNewSpecValue(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Valor (ej: ABS)"
            />
            <button
              type="button"
              onClick={handleAddSpecification}
              className="btn btn-outline"
            >
              Añadir
            </button>
          </div>
          <div className="space-y-2">
            {Object.entries(formData.specifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                <span className="text-sm">
                  <strong>{key}:</strong> {value}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveSpecification(key)}
                  className="text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Producto activo</span>
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-outline"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : product ? 'Actualizar Producto' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;