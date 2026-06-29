"use client";

import { useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function ImportarCatalogPage() {
  const [file, setFile] = useState<File | null>(null);
  const [provider, setProvider] = useState<"anbor" | "forli">("anbor");
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
      setFile(null); // Limpiar archivo
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Error desconocido");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Importar Catálogo</h1>
        <p className="text-gray-500 mt-2">
          Sube tus archivos Excel para actualizar automáticamente el catálogo de productos en la web.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna Izquierda: Configuración */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selecciona el Proveedor
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as "anbor" | "forli")}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                disabled={isUploading}
              >
                <option value="anbor">Anbor (Anbor completo.xls)</option>
                <option value="forli">Forli (Forli.xlsx)</option>
              </select>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
              <h3 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">¿Cómo funciona?</h3>
              <ul className="text-sm text-indigo-700 dark:text-indigo-400 space-y-2 list-disc list-inside">
                <li>Selecciona el proveedor del Excel.</li>
                <li>Sube el archivo desde tu ordenador.</li>
                <li>El sistema lo procesará en segundo plano (tardará entre 1 y 3 minutos).</li>
                <li>Los productos se actualizarán solos en la web.</li>
              </ul>
            </div>
          </div>

          {/* Columna Derecha: Dropzone */}
          <div className="flex flex-col h-full justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Archivo Excel (.xls, .xlsx)
              </label>
              <div 
                className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors ${
                  file 
                  ? 'border-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <input
                  type="file"
                  accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                
                {file ? (
                  <div className="flex flex-col items-center text-center">
                    <FileSpreadsheet className="w-12 h-12 text-indigo-500 mb-3" />
                    <span className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{file.name}</span>
                    <span className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <span className="text-sm text-indigo-600 dark:text-indigo-400 mt-4 underline decoration-indigo-600/30 underline-offset-4">Cambiar archivo</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
                    <span className="font-medium text-gray-900 dark:text-white">Haz clic o arrastra aquí</span>
                    <span className="text-sm text-gray-500 mt-1">Solo archivos .xls o .xlsx</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className={`mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all ${
                !file || isUploading
                  ? 'bg-indigo-300 dark:bg-indigo-800 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Subiendo y Procesando...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Comenzar Importación
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Status Messages */}
        {status === "success" && (
          <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-green-800 dark:text-green-300 font-medium">¡Archivo subido con éxito!</h4>
              <p className="text-green-700 dark:text-green-400 text-sm mt-1">
                El archivo ha sido enviado a AWS y se procesará en unos instantes. Los productos aparecerán en la web de forma automática en breve.
              </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-red-800 dark:text-red-300 font-medium">Error en la subida</h4>
              <p className="text-red-700 dark:text-red-400 text-sm mt-1">{errorMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
