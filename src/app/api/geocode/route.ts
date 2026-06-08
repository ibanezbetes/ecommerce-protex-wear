import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy para CartoCiudad (IGN — Instituto Geográfico Nacional)
 * Base de datos oficial con TODAS las calles de España. Gratuito, sin API key.
 * Evita problemas de CORS llamando desde el servidor.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || q.trim().length < 2) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const url = `https://www.cartociudad.es/geocoder/api/geocoder/candidates?q=${encodeURIComponent(q)}&type=callejero&limit=10`;

    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ProtexWear-Ecommerce/1.0',
      },
      // Timeout de 5 segundos
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      throw new Error(`CartoCiudad respondió con ${res.status}`);
    }

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Patrones que indican un negocio/POI, NO una calle
    const BUSINESS_PATTERNS = [
      /\[/,                           // Contiene corchete → negocio con dirección embebida
      /\bS\.L\.U?\b/i,               // S.L. / S.L.U.
      /\bS\.A\.U?\b/i,               // S.A. / S.A.U.
      /\bS\.C\b/i,                   // S.C.
      /\bSociedad\b/i,               // "Sociedad..."
      /\bServicio\b/i,               // "Servicio..."
      /\bConsulta\b/i,               // "Consulta..."
      /\bCentro\b/i,                 // "Centro..."
      /\bInstituto\b/i,              // "Instituto..."
      /\bHospital\b/i,               // "Hospital..."
      /\bFarmacia\b/i,               // "Farmacia..."
    ];

    const isBusinessResult = (item: any): boolean => {
      const raw = (item.address || '') + ' ' + (item.id || '');
      return BUSINESS_PATTERNS.some(pat => pat.test(raw));
    };

    // Transformar la respuesta al formato que espera el frontend
    const suggestions: string[] = data
      .filter((item: any) => {
        // Debe tener tipo de vía (CALLE, AVENIDA, PASEO, etc.)
        if (!item.tip_via || item.tip_via.trim().length === 0) return false;
        // Descartar negocios / POIs
        if (isBusinessResult(item)) return false;
        return true;
      })
      .map((item: any) => {
        const tipVia  = item.tip_via   ? capitalizeWords(item.tip_via)  : '';
        const address = item.address   ? capitalizeWords(item.address)  : '';
        const muni    = item.muniNombre ? capitalizeWords(item.muniNombre) : '';
        const cp      = item.postalCode || '';
        const prov    = item.province  ? capitalizeWords(item.province) : '';

        const street = [tipVia, address].filter(Boolean).join(' ');
        if (!street) return null;

        let result = street;
        if (muni)  result += `, ${muni}`;
        if (prov && prov.toLowerCase() !== muni.toLowerCase()) result += ` (${prov})`;
        if (cp)    result += `, ${cp}`;
        result += ', España';

        return result;
      })
      .filter(Boolean) as string[];

    // Eliminar duplicados
    const unique = [...new Set(suggestions)];

    return NextResponse.json(unique, {
      status: 200,
      headers: { 'Cache-Control': 'public, max-age=300' }, // Cache 5 min
    });
  } catch (err: any) {
    console.warn('[Geocode API] Error CartoCiudad:', err?.message || err);
    return NextResponse.json([], { status: 200 });
  }
}

/** Convierte "CALLE DEL GLOBO" → "Calle Del Globo" */
function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
