import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadData } from 'aws-amplify/storage';
import { productOperations } from '../../services/graphql';
import type { Product } from '../../services/graphql';
import S3Image from './S3Image';
import {
  Save, X, Upload, Plus, Trash2, Image as ImageIcon,
  Tag, Box, Layers, DollarSign, FileText, Package
} from 'lucide-react';
import '../../styles/AdminProductForm.css';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
}

interface DimensionState {
  length: string;
  width: string;
  height: string;
  unit: string;
}

interface SpecificationItem {
  key: string;
  value: string;
}

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Core Data
  const [formData, setFormData] = useState<any>({
    name: "",
    sku: "",
    price: 0,
    stock: 0,
    description: "",
    category: "",
    subcategory: "",
    brand: "",
    isActive: true,
    imageUrl: "",
    imageUrls: [],
    weight: 0,
  });

  // Complex States
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [specs, setSpecs] = useState<SpecificationItem[]>([]);
  const [dimensions, setDimensions] = useState<DimensionState>({
    length: "", width: "", height: "", unit: "cm"
  });

  // Load existing product data
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        price: product.price,
        stock: product.stock,
        description: product.description || "",
        category: product.category || "",
        subcategory: product.subcategory || "",
        brand: product.brand || "",
        isActive: product.isActive,
        imageUrl: product.imageUrl || "",
        imageUrls: product.imageUrls || [],
        weight: product.weight || 0,
      });

      if (product.tags) setTags(product.tags.filter(t => t !== null) as string[]);

      // Parse Specs
      if (product.specifications) {
        try {
          const parsedSpecs = typeof product.specifications === 'string'
            ? JSON.parse(product.specifications)
            : product.specifications;
          const specArray = Object.entries(parsedSpecs).map(([key, value]) => ({
            key,
            value: typeof value === 'object' && value !== null
              ? JSON.stringify(value)
              : String(value)
          }));
          setSpecs(specArray);
        } catch (e) {
          console.warn("Failed to parse specifications", e);
        }
      }

      // Parse Dimensions
      if (product.dimensions) {
        try {
          const parsedDims = typeof product.dimensions === 'string'
            ? JSON.parse(product.dimensions)
            : product.dimensions;
          setDimensions({
            length: parsedDims.length || "",
            width: parsedDims.width || "",
            height: parsedDims.height || "",
            unit: parsedDims.unit || "cm"
          });
        } catch (e) {
          console.warn("Failed to parse dimensions", e);
        }
      }
    }
  }, [product]);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: checked }));
  };

  // Tag Handling
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Specs Handling
  const addSpec = () => setSpecs([...specs, { key: "", value: "" }]);
  const removeSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index));
  const updateSpec = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  // Dimensions Handling
  const handleDimensionChange = (field: keyof DimensionState, value: string) => {
    setDimensions(prev => ({ ...prev, [field]: value }));
  };

  // Image Upload Logic
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0], 'main');
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploading(true);
      const files = Array.from(e.target.files);
      for (const file of files) {
        await uploadFile(file, 'gallery');
      }
      setUploading(false);
    }
  };

  const uploadFile = async (file: File, type: 'main' | 'gallery') => {
    try {
      setUploading(true);
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const path = `product-images/${Date.now()}-${cleanFileName}`;

      await uploadData({
        path,
        data: file,
      }).result;

      if (type === 'main') {
        setFormData((prev: any) => ({ ...prev, imageUrl: path }));
      } else {
        setFormData((prev: any) => ({
          ...prev,
          imageUrls: [...(prev.imageUrls || []), path]
        }));
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      imageUrls: prev.imageUrls?.filter((_: any, i: number) => i !== index)
    }));
  };

  // Submit Logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Prepare JSON fields
    const specificationsJSON = JSON.stringify(
      specs.reduce((acc, curr) => {
        if (curr.key.trim()) acc[curr.key.trim()] = curr.value;
        return acc;
      }, {} as Record<string, string>)
    );

    const dimensionsJSON = JSON.stringify(dimensions);

    try {
      const productData: any = {
        name: formData.name!,
        sku: formData.sku!,
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description,
        category: formData.category?.trim() || null,
        subcategory: formData.subcategory?.trim() || null,
        brand: formData.brand?.trim() || null,
        isActive: formData.isActive,
        imageUrl: formData.imageUrl,
        imageUrls: formData.imageUrls,
        weight: Number(formData.weight),
        tags: tags,
        specifications: specificationsJSON,
        dimensions: dimensionsJSON,
      };

      await onSubmit(productData);
    } catch (error: any) {
      console.error("Error saving product:", error);
      alert("Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form-container">
      {/* Premium Header */}
      <div className="product-form-header">
        <div className="flex items-center gap-4">
          <div className="product-form-header-icon">
            <Package size={24} strokeWidth={1.5} />
          </div>
          <div className="product-form-header-title">
            <h1>{product ? 'Editar Producto' : 'Nuevo Producto'}</h1>
            <p>Gestiona el inventario y catálogo</p>
          </div>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <button
            type="button"
            onClick={onCancel}
            className="product-form-btn product-form-btn--secondary"
          >
            <X size={18} />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || uploading}
            className="product-form-btn product-form-btn--primary"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      <div className="product-form-grid">
        {/* BIG Column (Main Info) */}
        <div className="product-form-col-main">

          {/* Basic Info Card */}
          <div className="product-form-card">
            <div className="product-form-card-header">
              <FileText size={20} className="product-form-card-icon" />
              <h3 className="product-form-card-title">Información Básica</h3>
            </div>

            <div className="product-form-group">
              <label className="product-form-label">Nombre del Producto</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej. Casco de Seguridad Industrial Pro-X"
                className="product-form-input"
              />
            </div>

            <div className="product-form-row">
              <div className="product-form-group">
                <label className="product-form-label">SKU (Código)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 font-mono text-sm">#</span>
                  <input
                    type="text"
                    name="sku"
                    required
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="PRO-001"
                    className="product-form-input"
                    style={{ paddingLeft: '2rem', fontFamily: 'monospace' }}
                  />
                </div>
              </div>
              <div className="product-form-group">
                <label className="product-form-label">Marca</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand || ""}
                  onChange={handleChange}
                  placeholder="Ej. ProTex"
                  className="product-form-input"
                />
              </div>
            </div>

            <div className="product-form-group" style={{ marginBottom: 0 }}>
              <label className="product-form-label">Descripción</label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                placeholder="Describe las características principales..."
                className="product-form-input product-form-textarea"
              />
            </div>
          </div>

          {/* Specs Card */}
          <div className="product-form-card">
            <div className="product-form-card-header">
              <Layers size={20} className="product-form-card-icon" />
              <h3 className="product-form-card-title">Especificaciones Técnicas</h3>
            </div>

            {/* List of Specs */}
            <div className="product-form-group">
              <label className="product-form-label">Detalles del Producto</label>

              {specs.length === 0 && (
                <div className="text-center py-8 text-gray-400 border border-dashed border-gray-200 rounded-xl">
                  <p className="text-sm">No hay especificaciones añadidas</p>
                </div>
              )}

              {specs.map((spec, index) => (
                <div key={index} className="spec-item">
                  <input
                    placeholder="Propiedad (ej. Material)"
                    value={spec.key}
                    onChange={(e) => updateSpec(index, 'key', e.target.value)}
                    className="product-form-input bg-transparent border-0 p-0 text-sm focus:ring-0 shadow-none"
                    style={{ flex: 1 }}
                  />
                  <div className="hidden sm:block w-px h-4 bg-gray-200 mx-2"></div>
                  <input
                    placeholder="Valor (ej. Acero)"
                    value={spec.value}
                    onChange={(e) => updateSpec(index, 'value', e.target.value)}
                    className="product-form-input bg-transparent border-0 p-0 text-sm focus:ring-0 shadow-none"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(index)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-md transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              <button type="button" onClick={addSpec} className="spec-btn-add">
                <Plus size={16} />
                Añadir Característica
              </button>
            </div>

            {/* Dimensions */}
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #F3F4F6' }}>
              <label className="product-form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Box size={14} /> Dimensiones de Envío
              </label>
              <div className="product-form-row-4">
                {['length', 'width', 'height'].map((dim) => (
                  <div key={dim}>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">
                      {dim === 'length' ? 'Largo' : dim === 'width' ? 'Ancho' : 'Alto'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={dimensions[dim as keyof DimensionState]}
                        onChange={(e) => handleDimensionChange(dim as keyof DimensionState, e.target.value)}
                        className="product-form-input"
                        placeholder="0"
                      />
                      <span className="absolute right-2 top-2.5 text-xs text-gray-400">{dimensions.unit}</span>
                    </div>
                  </div>
                ))}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Peso</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      name="weight"
                      value={formData.weight || ""}
                      onChange={handleChange}
                      className="product-form-input"
                      placeholder="0.0"
                    />
                    <span className="absolute right-2 top-2.5 text-xs text-gray-400">kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="product-form-col-sidebar">

          {/* Status & Category */}
          <div className="product-form-card">
            <h3 className="product-form-label" style={{ marginBottom: '1rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.5rem' }}>Organización</h3>

            <div className="status-toggle">
              <div>
                <span className="text-sm font-bold text-gray-800 block">Estado</span>
                <span className={`text-xs font-bold uppercase mt-1 block ${formData.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                  {formData.isActive ? 'Activo' : 'Borrador'}
                </span>
              </div>
              <div
                className="toggle-switch"
                data-active={formData.isActive}
                onClick={() => setFormData((prev: any) => ({ ...prev, isActive: !prev.isActive }))}
              >
                <div className="toggle-knob"></div>
              </div>
            </div>

            <div className="product-form-group">
              <label className="product-form-label">Categoría</label>
              <input
                type="text"
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
                className="product-form-input"
              />
            </div>
            <div className="product-form-group">
              <label className="product-form-label">Subcategoría</label>
              <input
                type="text"
                name="subcategory"
                value={formData.subcategory || ""}
                onChange={handleChange}
                className="product-form-input"
              />
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F3F4F6' }}>
              <label className="product-form-label flex items-center gap-1">
                <Tag size={12} /> Etiquetas
              </label>
              <div className="tags-container">
                {tags.map((tag, i) => (
                  <span key={i} className="tag-badge">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="cursor-pointer hover:text-red-500" style={{ border: 'none', background: 'none', padding: 0, display: 'flex' }}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Escribir..."
                  className="tags-input"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="product-form-card">
            <h3 className="product-form-label" style={{ marginBottom: '1rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.5rem' }}>Inventario</h3>

            <div className="product-form-group">
              <label className="product-form-label">Precio</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500 font-bold">€</span>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="product-form-input"
                  style={{ paddingLeft: '2rem', fontSize: '1.25rem', fontWeight: 700 }}
                />
              </div>
            </div>

            <div className="product-form-group" style={{ marginBottom: 0 }}>
              <label className="product-form-label">Stock</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  required
                  value={formData.stock}
                  onChange={handleChange}
                  className="product-form-input"
                  style={{ width: '80px', textAlign: 'center' }}
                />
                <span className="text-xs text-gray-500 font-medium">unidades disponibles</span>
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="product-form-card">
            <h3 className="product-form-label" style={{ marginBottom: '1rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.5rem' }}>Galería</h3>

            <div className="product-form-group">
              <label className="product-form-label">Imagen Principal</label>
              <div
                className={`image-upload-area ${formData.imageUrl ? 'has-image' : ''}`}
                onClick={() => document.getElementById('main-image')?.click()}
              >
                {formData.imageUrl ? (
                  <>
                    <S3Image
                      s3Key={formData.imageUrl}
                      alt="Main"
                      className="w-full h-full object-cover"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/90 text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1">
                        <Upload size={12} /> Cambiar
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-white text-gray-400 rounded-full mb-2 shadow-sm border border-gray-100">
                      <ImageIcon size={20} />
                    </div>
                    <span className="text-xs font-bold text-gray-600">Subir Portada</span>
                  </>
                )}
                <input type="file" accept="image/*" id="main-image" onChange={handleMainImageUpload} className="hidden" />
              </div>
            </div>

            <div>
              <label className="product-form-label">Adicionales ({formData.imageUrls?.length || 0})</label>
              <div className="gallery-grid">
                {formData.imageUrls?.map((url: string, i: number) => (
                  <div key={i} className="gallery-item group">
                    <S3Image
                      s3Key={url}
                      alt={`Gallery ${i}`}
                      className="w-full h-full object-cover"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(i)}
                      className="absolute top-0 right-0 p-1 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}

                <label htmlFor="gallery-input" className="gallery-add-btn" title="Añadir más">
                  <Plus size={20} />
                </label>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                id="gallery-input"
                onChange={handleGalleryUpload}
                className="hidden"
              />
            </div>
          </div>

        </div>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-card">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm font-bold text-gray-900">Procesando...</p>
          </div>
        </div>
      )}
    </form>
  );
}