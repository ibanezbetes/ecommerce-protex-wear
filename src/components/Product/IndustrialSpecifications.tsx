import React from 'react';

interface IndustrialSpecificationsProps {
  specifications: Record<string, any>;
}

/**
 * Component to display industrial safety equipment specifications
 * Handles complex EPI data like EN 388 protection levels, safety standards, etc.
 */
function IndustrialSpecifications({ specifications }: IndustrialSpecificationsProps) {
  // Parse specifications if they're stored as JSON string
  let specs = specifications;
  if (typeof specifications === 'string') {
    try {
      specs = JSON.parse(specifications);
    } catch (e) {
      specs = specifications;
    }
  }

  // Check if this is an industrial product with safety specifications
  const hasIndustrialSpecs = specs.normativas || specs.niveles_proteccion || specs.materiales || specs.tallas;
  
  if (!hasIndustrialSpecs) {
    // Fallback to generic specifications display
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <dl className="grid grid-cols-1 gap-3">
          {Object.entries(specs).map(([key, value]) => (
            <div key={key} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
              <dt className="font-medium text-gray-700">{key}:</dt>
              <dd className="text-gray-900">{JSON.stringify(value)}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Safety Standards */}
      {specs.normativas && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Normativas de Seguridad
          </h4>
          <div className="flex flex-wrap gap-2">
            {specs.normativas.map((norma: string, index: number) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {norma}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Protection Levels */}
      {specs.niveles_proteccion && Object.keys(specs.niveles_proteccion).length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
            </svg>
            Niveles de Protección
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* EN 388 Mechanical Protection */}
            {(specs.niveles_proteccion.abrasion || specs.niveles_proteccion.corte || 
              specs.niveles_proteccion.desgarro || specs.niveles_proteccion.puncion) && (
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <h5 className="font-semibold text-green-800 mb-2">EN 388 - Protección Mecánica</h5>
                <div className="space-y-1 text-sm">
                  {specs.niveles_proteccion.abrasion && (
                    <div className="flex justify-between">
                      <span>Abrasión:</span>
                      <span className="font-mono font-bold">{specs.niveles_proteccion.abrasion}</span>
                    </div>
                  )}
                  {specs.niveles_proteccion.corte && (
                    <div className="flex justify-between">
                      <span>Corte:</span>
                      <span className="font-mono font-bold">{specs.niveles_proteccion.corte}</span>
                    </div>
                  )}
                  {specs.niveles_proteccion.desgarro && (
                    <div className="flex justify-between">
                      <span>Desgarro:</span>
                      <span className="font-mono font-bold">{specs.niveles_proteccion.desgarro}</span>
                    </div>
                  )}
                  {specs.niveles_proteccion.puncion && (
                    <div className="flex justify-between">
                      <span>Perforación:</span>
                      <span className="font-mono font-bold">{specs.niveles_proteccion.puncion}</span>
                    </div>
                  )}
                  {specs.niveles_proteccion.cutTDM && (
                    <div className="flex justify-between">
                      <span>Corte TDM:</span>
                      <span className="font-mono font-bold">{specs.niveles_proteccion.cutTDM}</span>
                    </div>
                  )}
                </div>
                {/* Display as combined code (e.g., "4121X") */}
                <div className="mt-2 pt-2 border-t border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-green-600">Código EN 388:</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-mono font-bold">
                      {specs.niveles_proteccion.abrasion || 'X'}
                      {specs.niveles_proteccion.corte || 'X'}
                      {specs.niveles_proteccion.desgarro || 'X'}
                      {specs.niveles_proteccion.puncion || 'X'}
                      {specs.niveles_proteccion.cutTDM || 'X'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* S3 Footwear Protection */}
            {specs.niveles_proteccion.categoria_calzado && (
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <h5 className="font-semibold text-green-800 mb-2">Calzado de Seguridad</h5>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Categoría:</span>
                    <span className="font-mono font-bold">{specs.niveles_proteccion.categoria_calzado}</span>
                  </div>
                  {specs.niveles_proteccion.energia_impacto && (
                    <div className="flex justify-between">
                      <span>Energía Impacto:</span>
                      <span className="font-mono font-bold">{specs.niveles_proteccion.energia_impacto}J</span>
                    </div>
                  )}
                  {specs.niveles_proteccion.resistencia_perforacion && (
                    <div className="flex justify-between">
                      <span>Resistencia Perforación:</span>
                      <span className="font-mono font-bold">{specs.niveles_proteccion.resistencia_perforacion}N</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* High Visibility Protection */}
            {specs.niveles_proteccion.clase_visibilidad && (
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <h5 className="font-semibold text-green-800 mb-2">Alta Visibilidad</h5>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Clase:</span>
                    <span className="font-mono font-bold">{specs.niveles_proteccion.clase_visibilidad}</span>
                  </div>
                  {specs.niveles_proteccion.ancho_banda_reflectante && (
                    <div className="flex justify-between">
                      <span>Banda Reflectante:</span>
                      <span className="font-mono font-bold">{specs.niveles_proteccion.ancho_banda_reflectante}mm</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Materials */}
      {specs.materiales && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z" clipRule="evenodd" />
            </svg>
            Materiales
          </h4>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(specs.materiales) ? (
              specs.materiales.map((material: string, index: number) => (
                <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  {material}
                </span>
              ))
            ) : (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                {specs.materiales}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Sizes */}
      {specs.tallas && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Tallas Disponibles
          </h4>
          <div className="flex flex-wrap gap-2">
            {specs.tallas.map((talla: string, index: number) => (
              <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg text-sm font-medium border border-purple-200">
                {talla}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Technical Details */}
      {specs.detalles_tecnicos && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Detalles Técnicos
          </h4>
          <dl className="grid grid-cols-1 gap-3">
            {Object.entries(specs.detalles_tecnicos).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                <dt className="font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}:</dt>
                <dd className="text-gray-900">
                  {Array.isArray(value) ? value.join(', ') : JSON.stringify(value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Other specifications */}
      {Object.keys(specs).some(key => !['normativas', 'niveles_proteccion', 'materiales', 'tallas', 'detalles_tecnicos'].includes(key)) && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Otras Especificaciones</h4>
          <dl className="grid grid-cols-1 gap-3">
            {Object.entries(specs)
              .filter(([key]) => !['normativas', 'niveles_proteccion', 'materiales', 'tallas', 'detalles_tecnicos'].includes(key))
              .map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                  <dt className="font-medium text-gray-700">{key}:</dt>
                  <dd className="text-gray-900">{JSON.stringify(value)}</dd>
                </div>
              ))}
          </dl>
        </div>
      )}
    </div>
  );
}

export default IndustrialSpecifications;