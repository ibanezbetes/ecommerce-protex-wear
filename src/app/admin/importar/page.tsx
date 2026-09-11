"use client";

import { useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, Download, Info, Check } from "lucide-react";
import { downloadProtexProductTemplate } from "@/utils/exportHelpers";

export default function ImportarCatalogPage() {
  const [file, setFile] = useState<File | null>(null);
  const [provider, setProvider] = useState<"protex" | "anbor" | "forli">("protex");
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus("idle");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      // 1. Obtener Presigned URL desde nuestra API
      const res = await fetch("/api/admin/upload-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type || "application/vnd.ms-excel",
          provider,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al obtener URL de subida");
      }

      const { uploadUrl } = await res.json();

      // 2. Subir archivo directamente a S3
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/vnd.ms-excel",
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Error al subir el archivo a AWS S3");
      }

      // 3. Éxito
      setStatus("success");
      setFile(null);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Error desconocido");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 font-sans">
      {/* Header & Download Template Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
              Sincronización de Catálogo
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Importar Catálogo desde Excel
          </h1>
          <p className="text-gray-500 mt-1">
            Sube hojas de cálculo en formato Excel (.xlsx o .xls) para crear o actualizar masivamente los productos, tallas, colores y precios en la web.
          </p>
        </div>

        {/* 1-Click Download Template Button */}
        <div>
          <button
            onClick={downloadProtexProductTemplate}
            className="inline-flex items-center gap-2.5 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Descargar la plantilla Excel oficial de ProtexWear pre-rellenada"
          >
            <Download className="w-5 h-5" />
            <span>Descargar Plantilla Oficial Excel</span>
          </button>
        </div>
      </div>

      {/* Main Upload Box */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna Izquierda: Configuración */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                1. Formato o Proveedor del Archivo
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as "protex" | "anbor" | "forli")}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                disabled={isUploading}
              >
                <option value="protex">🌟 Plantilla Oficial ProtexWear (.xlsx / .xls) - Recomendado</option>
                <option value="anbor">Catálogo Anbor (Anbor completo.xls)</option>
                <option value="forli">Catálogo Forli (Forli.xlsx)</option>
              </select>
            </div>

            <div className="bg-indigo-50/70 p-5 rounded-xl border border-indigo-100/80 space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                <Info className="w-4 h-4 text-indigo-600" />
                <span>Instrucciones de Importación</span>
              </div>
              <ul className="text-xs text-indigo-950 space-y-2 list-disc list-inside leading-relaxed font-medium">
                <li>Descarga la <strong>Plantilla Oficial</strong> con el botón superior si vas a añadir productos nuevos.</li>
                <li>Rellena las columnas requeridas (Referencia, Nombre, Categoría, Talla, Color, Precio...).</li>
                <li>Sube el archivo aquí. El procesamiento en la nube toma entre <strong>1 y 2 minutos</strong>.</li>
                <li>Los productos, filtros y fichas técnicas se actualizarán automáticamente en la web.</li>
              </ul>
            </div>
          </div>

          {/* Columna Derecha: Dropzone */}
          <div className="flex flex-col h-full justify-between">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                2. Selecciona o Arrastra el Archivo Excel
              </label>
              <div 
                className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${
                  file 
                  ? 'border-indigo-500 bg-indigo-50/30' 
                  : 'border-gray-300 hover:border-indigo-400 bg-gray-50/50 hover:bg-gray-50'
                }`}
              >
                <input
                  type="file"
                  accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                
                {file ? (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
                      <FileSpreadsheet className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-gray-900 truncate max-w-xs text-sm">{file.name}</span>
                    <span className="text-xs text-gray-400 mt-1 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <span className="text-xs text-indigo-600 font-bold mt-3 underline decoration-indigo-300 underline-offset-4">
                      Hacer clic para cambiar archivo
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mb-3">
                      <Upload className="w-7 h-7" />
                    </div>
                    <span className="font-bold text-gray-800 text-sm">Arrastra aquí tu archivo Excel</span>
                    <span className="text-xs text-gray-500 mt-1">o haz clic para explorar tu ordenador (.xlsx, .xls, .csv)</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className={`mt-6 w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl shadow-sm text-sm font-bold text-white transition-all ${
                !file || isUploading
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.01] active:scale-[0.99] shadow-md hover:shadow-emerald-600/20'
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Subiendo y Procesando Catálogo...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Subir e Importar Productos a la Web
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Status Messages */}
        {status === "success" && (
          <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-3.5">
            <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-emerald-900 font-bold text-base">¡Archivo subido y enviado a procesamiento con éxito!</h4>
              <p className="text-emerald-800 text-sm mt-1 leading-relaxed">
                El archivo se está procesando en segundo plano en la nube. Los productos, precios y variantes estarán disponibles en el catálogo en breves minutos.
              </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3.5">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-red-900 font-bold text-base">Error al procesar el archivo</h4>
              <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* Guide: Structure of the Official Template */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <span>📖</span> Guía de Campos del Excel (Plantilla Oficial)
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Esta es la estructura exacta que contiene la plantilla para que la web procese fotos, tallas agrupadas, colores, categorías del menú y enlaces a la Ficha Técnica PDF:
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/75 text-gray-600 font-bold text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4">Columna en Excel</th>
                <th className="py-3.5 px-4">Obligatorio</th>
                <th className="py-3.5 px-4">Ejemplo</th>
                <th className="py-3.5 px-4">Función en la Web</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50/50">
                <td className="py-3.5 px-4 font-bold text-indigo-700 font-mono text-xs">
                  Referencia Padre
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs font-bold">
                    <Check className="w-3 h-3" /> Sí
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-xs text-gray-800">PW-BOTA-VOLCANO</td>
                <td className="py-3.5 px-4 text-xs text-gray-600">
                  Identificador único del modelo. Si un artículo tiene varias variantes de color, comparten la misma Referencia Padre.
                </td>
              </tr>

              <tr className="hover:bg-gray-50/50">
                <td className="py-3.5 px-4 font-bold text-indigo-700 font-mono text-xs">
                  Nombre
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs font-bold">
                    <Check className="w-3 h-3" /> Sí
                  </span>
                </td>
                <td className="py-3.5 px-4 text-xs text-gray-800 font-medium">Bota de Seguridad S3 SRC Hidrófuga Volcano</td>
                <td className="py-3.5 px-4 text-xs text-gray-600">
                  Título comercial que se mostrará en el catálogo, ficha de producto, buscador y pedidos.
                </td>
              </tr>

              <tr className="hover:bg-gray-50/50">
                <td className="py-3.5 px-4 font-bold text-indigo-700 font-mono text-xs">
                  Marca
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-gray-400 text-xs font-medium">Opcional</span>
                </td>
                <td className="py-3.5 px-4 text-xs text-gray-800 font-medium">Protex Wear</td>
                <td className="py-3.5 px-4 text-xs text-gray-600">
                  Marca o fabricante. Si se deja en blanco se asigna <em>&quot;Protex Wear&quot;</em> por defecto.
                </td>
              </tr>

              <tr className="hover:bg-gray-50/50">
                <td className="py-3.5 px-4 font-bold text-indigo-700 font-mono text-xs">
                  Categoría 1 (Familia)
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs font-bold">
                    <Check className="w-3 h-3" /> Sí
                  </span>
                </td>
                <td className="py-3.5 px-4 text-xs font-medium text-indigo-900">Ropa de Trabajo, Calzado de Seguridad...</td>
                <td className="py-3.5 px-4 text-xs text-gray-600">
                  Grupo principal de navegación en el menú y en la barra lateral de filtros (ver árbol de categorías abajo).
                </td>
              </tr>

              <tr className="hover:bg-gray-50/50">
                <td className="py-3.5 px-4 font-bold text-indigo-700 font-mono text-xs">
                  Categoría 2 (Subcategoría)
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs font-bold">
                    <Check className="w-3 h-3" /> Sí
                  </span>
                </td>
                <td className="py-3.5 px-4 text-xs font-medium text-indigo-900">Pantalones de trabajo, Botas de seguridad...</td>
                <td className="py-3.5 px-4 text-xs text-gray-600">
                  Subcategoría específica que permite a los usuarios filtrar exactamente el tipo de prenda o calzado.
                </td>
              </tr>

              <tr className="hover:bg-gray-50/50">
                <td className="py-3.5 px-4 font-bold text-indigo-700 font-mono text-xs">
                  Tallas (separadas por coma)
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs font-bold">
                    <Check className="w-3 h-3" /> Sí
                  </span>
                </td>
                <td className="py-3.5 px-4 text-xs text-gray-800 font-mono">38, 39, 40, 41, 42, 43, 44, 45, 46 (o S, M, L, XL, XXL)</td>
                <td className="py-3.5 px-4 text-xs text-gray-600">
                  Tallas disponibles agrupadas en la misma celda. La web creará automáticamente los botones de selección de talla en la ficha de producto.
                </td>
              </tr>

              <tr className="hover:bg-gray-50/50">
                <td className="py-3.5 px-4 font-bold text-indigo-700 font-mono text-xs">
                  Color
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs font-bold">
                    <Check className="w-3 h-3" /> Sí
                  </span>
                </td>
                <td className="py-3.5 px-4 text-xs text-gray-800 font-medium">Negro, Azul Marino, Gris, Amarillo Flúor...</td>
                <td className="py-3.5 px-4 text-xs text-gray-600">
                  Color del artículo. Habilita las muestras de color en el catálogo y los selectores de color al comprar.
                </td>
              </tr>

              <tr className="hover:bg-gray-50/50">
                <td className="py-3.5 px-4 font-bold text-indigo-700 font-mono text-xs">
                  Precio Venta (Sin IVA)
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs font-bold">
                    <Check className="w-3 h-3" /> Sí
                  </span>
                </td>
                <td className="py-3.5 px-4 text-xs text-emerald-700 font-bold font-mono">38,95</td>
                <td className="py-3.5 px-4 text-xs text-gray-600">
                  Precio base en Euros sin IVA. La web calculará automáticamente el IVA del 21% para el precio con impuestos.
                </td>
              </tr>


              <tr className="hover:bg-gray-50/50">
                <td className="py-3.5 px-4 font-bold text-indigo-700 font-mono text-xs">
                  Ficha Técnica (URL PDF)
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-gray-400 text-xs font-medium">Opcional</span>
                </td>
                <td className="py-3.5 px-4 text-xs text-indigo-600 font-mono truncate max-w-[200px]">https://dominio.com/fichas/bota-volcano.pdf</td>
                <td className="py-3.5 px-4 text-xs text-gray-600">
                  Enlace directo a la Ficha Técnica oficial en PDF. Si se proporciona, el botón <em>&quot;Descargar Ficha Técnica PDF&quot;</em> abrirá directamente este PDF.
                </td>
              </tr>

              <tr className="hover:bg-gray-50/50">
                <td className="py-3.5 px-4 font-bold text-indigo-700 font-mono text-xs">
                  Imágenes (URLs)
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-gray-400 text-xs font-medium">Recomendado</span>
                </td>
                <td className="py-3.5 px-4 text-xs text-gray-500 font-mono truncate max-w-[200px]">https://dominio.com/foto1.jpg, https://dominio.com/foto2.jpg</td>
                <td className="py-3.5 px-4 text-xs text-gray-600">
                  URLs directas a las fotos del producto separadas por comas. Si tiene varias fotos se habilitará la galería con zoom.
                </td>
              </tr>

              <tr className="hover:bg-gray-50/50">
                <td className="py-3.5 px-4 font-bold text-indigo-700 font-mono text-xs">
                  Descripción
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-gray-400 text-xs font-medium">Recomendado</span>
                </td>
                <td className="py-3.5 px-4 text-xs text-gray-600">Puntera de composite no metálica, plantilla antiperforación...</td>
                <td className="py-3.5 px-4 text-xs text-gray-600">
                  Descripción técnica, composición de materiales y normativas de seguridad laboral vigentes.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tree of Categories 1 and 2 from the Products Tab */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200/80 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏷️</span>
            <h3 className="font-extrabold text-gray-900 text-sm uppercase tracking-wider">
              Árbol Oficial de Categorías (Coincide 1:1 con la pestaña de Productos):
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-1.5">
              <span className="font-extrabold text-indigo-700 block uppercase tracking-wide">
                1. Ropa de Trabajo
              </span>
              <ul className="text-gray-600 space-y-1 pl-2 border-l-2 border-indigo-100">
                <li>• Pantalones de trabajo</li>
                <li>• Ropa de alta visibilidad</li>
                <li>• Polos y camisetas</li>
                <li>• Chalecos de trabajo</li>
                <li>• Monos de trabajo</li>
                <li>• Sudaderas y polares</li>
                <li>• Chaquetas y abrigos</li>
                <li>• Ropa impermeable</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-1.5">
              <span className="font-extrabold text-indigo-700 block uppercase tracking-wide">
                2. Calzado de Seguridad
              </span>
              <ul className="text-gray-600 space-y-1 pl-2 border-l-2 border-indigo-100">
                <li>• Zapatos de seguridad S1P / S3</li>
                <li>• Botas de seguridad</li>
                <li>• Zapatillas de trabajo</li>
                <li>• Botas de agua y PVC</li>
                <li>• Calcetines y plantillas</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-1.5">
              <span className="font-extrabold text-indigo-700 block uppercase tracking-wide">
                3. Protección de Manos
              </span>
              <ul className="text-gray-600 space-y-1 pl-2 border-l-2 border-indigo-100">
                <li>• Guantes anticorte</li>
                <li>• Guantes de nitrilo y látex</li>
                <li>• Guantes térmicos para frío</li>
                <li>• Guantes de cuero y soldador</li>
                <li>• Guantes riesgo químico</li>
                <li>• Guantes desechables</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-1.5">
              <span className="font-extrabold text-indigo-700 block uppercase tracking-wide">
                4. Protección de Cabeza y Facial
              </span>
              <ul className="text-gray-600 space-y-1 pl-2 border-l-2 border-indigo-100">
                <li>• Cascos de seguridad</li>
                <li>• Gorras antigolpes</li>
                <li>• Gafas de seguridad</li>
                <li>• Pantallas faciales</li>
                <li>• Mascarillas FFP2 / FFP3</li>
                <li>• Protectores auditivos</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-1.5 md:col-span-2 lg:col-span-2">
              <span className="font-extrabold text-indigo-700 block uppercase tracking-wide">
                5. Sectores Especializados
              </span>
              <ul className="grid grid-cols-2 gap-1 text-gray-600 pl-2 border-l-2 border-indigo-100">
                <li>• Industria e Instaladores</li>
                <li>• Construcción y Obra</li>
                <li>• Hostelería y Cocina</li>
                <li>• Sanidad y Laboratorio</li>
                <li>• Arneses y Alturas</li>
                <li>• Accesorios y Otros</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
