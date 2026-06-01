/* ============================================================================
 * mockCatalog.ts — Catálogo de Respaldo Local (Datos Reales del Cliente)
 * ============================================================================
 *
 * Este archivo contiene una selección representativa de productos reales extraídos
 * directamente de la base de datos migrada (migration/unified_products.json).
 * Sirve como fallback local resiliente cuando la API de AWS AppSync/Amplify
 * no está disponible o las credenciales públicas están expiradas.
 * ========================================================================= */

export interface MockVariant {
  id: string;
  sku?: string;
  size?: string;
  color?: string;
  basePrice: number;
  images?: string[];
}

export interface MockProduct {
  id: string;
  name: string;
  description?: string;
  brand: string;
  variants: MockVariant[];
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    "id": "12001",
    "name": "Polo A.V. BERLIN",
    "brand": "Anbor",
    "description": "Polo A.V. manga corta modelo BERLIN<br><br>Material contraste: 100% poliéster, 150 gr<br>Material flúor: 100% poliéster, 150 gr<br><br>Bolsillo en pecho izquierdo<br>Tapeta con 3 botones<br>Tejido transpirable y secado rápido<br>Cuello de canalé<br><br>Bandas reflectantes:<br>2 bandas reflectantes cosidas en torso de 5 cm<br>(ancho banda especial en la talla S de 7 cm).<br><br>Normativa:<br>EN ISO 13688:2013 + EN ISO 13688:2013/A1:2021<br>EN ISO 20471:2013 + EN ISO 20471:2013/A1:2016<br><br>Pack 1 unidad<br>Caja 25 unidades<br>Tallas S - M - L - XL - XXL - 3XL - 4XL<br><br>Condiciones de lavado:<br>Lavado a temperatura máxima de 30ºC. No usar lejía u otros agentes blanqueantes. No lavar en seco. No usar secadora. Planchar a 1 punto (temperatura baja, máx. 110ºC). No planchar o aplicar vapor sobre las bandas o módulos reflectantes.",
    "variants": [
      {
        "id": "12001090026",
        "sku": "8447416030498",
        "size": "S",
        "color": "AMA.AV.GRIS",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001090026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001090024",
        "sku": "8447416030566",
        "size": "S",
        "color": "AMA.AVMARINO",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001090024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001090027",
        "sku": "8447416030634",
        "size": "S",
        "color": "AMA.AVVERDE",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001090027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001090029",
        "sku": "8447416030702",
        "size": "S",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001090029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001100024",
        "sku": "8447416030573",
        "size": "M",
        "color": "AMA.AVMARINO",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001100024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001100027",
        "sku": "8447416030641",
        "size": "M",
        "color": "AMA.AVVERDE",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001100027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001100029",
        "sku": "8447416030719",
        "size": "M",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001100029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001100192",
        "sku": "8447416030788",
        "size": "M",
        "color": "NAR.AVMARINO",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001100192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001110026",
        "sku": "8447416030511",
        "size": "L",
        "color": "AMA.AV.GRIS",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001110026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001110024",
        "sku": "8447416030580",
        "size": "L",
        "color": "AMA.AVMARINO",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001110024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001110027",
        "sku": "8447416030658",
        "size": "L",
        "color": "AMA.AVVERDE",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001110027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001110029",
        "sku": "8447416030726",
        "size": "L",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001110029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001090192",
        "sku": "8447416030771",
        "size": "S",
        "color": "NAR.AVMARINO",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001090192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001100026",
        "sku": "8447416030504",
        "size": "M",
        "color": "AMA.AV.GRIS",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001100026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001120027",
        "sku": "8447416030665",
        "size": "XL",
        "color": "AMA.AVVERDE",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001120027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001120029",
        "sku": "8447416030733",
        "size": "XL",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001120029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001120192",
        "sku": "8447416030801",
        "size": "XL",
        "color": "NAR.AVMARINO",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001120192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001130026",
        "sku": "8447416030535",
        "size": "XXL",
        "color": "AMA.AV.GRIS",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001130026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001130024",
        "sku": "8447416030603",
        "size": "XXL",
        "color": "AMA.AVMARINO",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001130024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001130027",
        "sku": "8447416030672",
        "size": "XXL",
        "color": "AMA.AVVERDE",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001130027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001130029",
        "sku": "8447416030740",
        "size": "XXL",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001130029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001110192",
        "sku": "8447416030795",
        "size": "L",
        "color": "NAR.AVMARINO",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001110192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001120026",
        "sku": "8447416030528",
        "size": "XL",
        "color": "AMA.AV.GRIS",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001120026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001120024",
        "sku": "8447416030597",
        "size": "XL",
        "color": "AMA.AVMARINO",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001120024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001140029",
        "sku": "8447416030757",
        "size": "3XL",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 7.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001140029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001140192",
        "sku": "8447416030825",
        "size": "3XL",
        "color": "NAR.AVMARINO",
        "basePrice": 7.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001140192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001141026",
        "sku": "8447416030559",
        "size": "4XL",
        "color": "AMA.AV.GRIS",
        "basePrice": 7.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001141026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001141024",
        "sku": "8447416030627",
        "size": "4XL",
        "color": "AMA.AVMARINO",
        "basePrice": 7.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001141024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001141027",
        "sku": "8447416030696",
        "size": "4XL",
        "color": "AMA.AVVERDE",
        "basePrice": 7.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001141027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001141029",
        "sku": "8447416030764",
        "size": "4XL",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 7.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001141029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001130192",
        "sku": "8447416030818",
        "size": "XXL",
        "color": "NAR.AVMARINO",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001130192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001140026",
        "sku": "8447416030542",
        "size": "3XL",
        "color": "AMA.AV.GRIS",
        "basePrice": 7.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001140026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001140024",
        "sku": "8447416030610",
        "size": "3XL",
        "color": "AMA.AVMARINO",
        "basePrice": 7.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001140024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001140027",
        "sku": "8447416030689",
        "size": "3XL",
        "color": "AMA.AVVERDE",
        "basePrice": 7.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001140027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001080192",
        "sku": "8447416071217",
        "size": "XS",
        "color": "NAR.AVMARINO",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001080192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001141192",
        "sku": "8447416030832",
        "size": "4XL",
        "color": "NAR.AVMARINO",
        "basePrice": 7.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001141192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001080024",
        "sku": "8447416071200",
        "size": "XS",
        "color": "AMA.AVMARINO",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001080024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001141019",
        "sku": "8447416030979",
        "size": "4XL",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 7.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001141019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001141018",
        "sku": "8447416030900",
        "size": "4XL",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 7.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001141018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001090018",
        "sku": "8447416030849",
        "size": "S",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001090018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001100018",
        "sku": "8447416030856",
        "size": "M",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001100018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001090019",
        "sku": "8447416030917",
        "size": "S",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001090019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001110018",
        "sku": "8447416030863",
        "size": "L",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001110018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001100019",
        "sku": "8447416030924",
        "size": "M",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001100019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001110019",
        "sku": "8447416030931",
        "size": "L",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001110019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001120019",
        "sku": "8447416030948",
        "size": "XL",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001120019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001120018",
        "sku": "8447416030870",
        "size": "XL",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001120018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001130019",
        "sku": "8447416030955",
        "size": "XXL",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001130019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001130018",
        "sku": "8447416030887",
        "size": "XXL",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 6.75,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001130018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001140019",
        "sku": "8447416030962",
        "size": "3XL",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 7.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001140019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      },
      {
        "id": "12001140018",
        "sku": "8447416030894",
        "size": "3XL",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 7.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/12001140018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/325F/AE6D/2B70/ACA7/2E10/8520/106F/EMBALAJE.png"
        ]
      }
    ]
  },
  {
    "id": "12002",
    "name": "Polar A.V. ROMA",
    "brand": "Anbor",
    "description": "Forro polar A.V. ROMA<br><br>Material contraste: 100% poliéster 280 g<br>Material flúor: 100% poliéster 280 g<br><br>Tratamiento antipilling de la cara exterior<br>Bajo con reguladores para ajustar cintura<br>Puño elástico<br>Cremallera entera<br>Bolsillos laterales con cremallera<br>Bandas reflectantes:<br>2 bandas reflectantes cosidas en torso y mangas<br><br>Normativa:<br>EN ISO 13688:2013 + EN ISO 13688:2013/A1:2021<br>EN ISO 20471:2013 + EN ISO 20471:2013/A1:2016<br><br>Pack 1 unidad<br>Caja 20 unidad<br>Tallas XS - S - M - L - XL - XXL - 3XL - 4XL<br><br>Condiciones de lavado:<br>Lavado a temperatura máxima de 30ºC. No usar lejía u otros agentes blanqueantes. No lavar en seco. No usar secadora. Planchar a 1 punto (temperatura baja, máx. 110ºC). No planchar o aplicar vapor sobre las bandas o módulos reflectantes.",
    "variants": [
      {
        "id": "12002090026",
        "sku": "8447416035356",
        "size": "S",
        "color": "AMA.AV.GRIS",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002090026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002090024",
        "sku": "8447416035424",
        "size": "S",
        "color": "AMA.AVMARINO",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002090024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002090027",
        "sku": "8447416035493",
        "size": "S",
        "color": "AMA.AVVERDE",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002090027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002090029",
        "sku": "8447416035561",
        "size": "S",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002090029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002090192",
        "sku": "8447416035639",
        "size": "S",
        "color": "NAR.AVMARINO",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002090192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002100026",
        "sku": "8447416035363",
        "size": "M",
        "color": "AMA.AV.GRIS",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002100026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002100029",
        "sku": "8447416035578",
        "size": "M",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002100029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002100192",
        "sku": "8447416035646",
        "size": "M",
        "color": "NAR.AVMARINO",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002100192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002110026",
        "sku": "8447416035370",
        "size": "L",
        "color": "AMA.AV.GRIS",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002110026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002110024",
        "sku": "8447416035448",
        "size": "L",
        "color": "AMA.AVMARINO",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002110024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002110027",
        "sku": "8447416067531",
        "size": "L",
        "color": "AMA.AVVERDE",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002110027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002110029",
        "sku": "8447416035585",
        "size": "L",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002110029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002110192",
        "sku": "8447416035653",
        "size": "L",
        "color": "NAR.AVMARINO",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002110192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002120026",
        "sku": "8447416035387",
        "size": "XL",
        "color": "AMA.AV.GRIS",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002120026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002100024",
        "sku": "8447416035431",
        "size": "M",
        "color": "AMA.AVMARINO",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002100024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002100027",
        "sku": "8447416035509",
        "size": "M",
        "color": "AMA.AVVERDE",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002100027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002120192",
        "sku": "8447416035660",
        "size": "XL",
        "color": "NAR.AVMARINO",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002120192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002130026",
        "sku": "8447416035394",
        "size": "XXL",
        "color": "AMA.AV.GRIS",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002130026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002130024",
        "sku": "8447416035462",
        "size": "XXL",
        "color": "AMA.AVMARINO",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002130024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002130027",
        "sku": "8447416035530",
        "size": "XXL",
        "color": "AMA.AVVERDE",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002130027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002130029",
        "sku": "8447416035608",
        "size": "XXL",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002130029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002130192",
        "sku": "8447416035677",
        "size": "XXL",
        "color": "NAR.AVMARINO",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002130192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002140026",
        "sku": "8447416035400",
        "size": "3XL",
        "color": "AMA.AV.GRIS",
        "basePrice": 16.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002140026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002120024",
        "sku": "8447416035455",
        "size": "XL",
        "color": "AMA.AVMARINO",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002120024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002120027",
        "sku": "8447416035523",
        "size": "XL",
        "color": "AMA.AVVERDE",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002120027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002120029",
        "sku": "8447416035592",
        "size": "XL",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002120029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002140192",
        "sku": "8447416035684",
        "size": "3XL",
        "color": "NAR.AVMARINO",
        "basePrice": 16.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002140192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002141026",
        "sku": "8447416035417",
        "size": "4XL",
        "color": "AMA.AV.GRIS",
        "basePrice": 16.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002141026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002141024",
        "sku": "8447416035486",
        "size": "4XL",
        "color": "AMA.AVMARINO",
        "basePrice": 16.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002141024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002141027",
        "sku": "8447416035554",
        "size": "4XL",
        "color": "AMA.AVVERDE",
        "basePrice": 16.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002141027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002141029",
        "sku": "8447416035622",
        "size": "4XL",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 16.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002141029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002141192",
        "sku": "8447416035691",
        "size": "4XL",
        "color": "NAR.AVMARINO",
        "basePrice": 16.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002141192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002080024",
        "sku": "8447416071224",
        "size": "XS",
        "color": "AMA.AVMARINO",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002080024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002140024",
        "sku": "8447416035479",
        "size": "3XL",
        "color": "AMA.AVMARINO",
        "basePrice": 16.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002140024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002140027",
        "sku": "8447416035547",
        "size": "3XL",
        "color": "AMA.AVVERDE",
        "basePrice": 16.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002140027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002140029",
        "sku": "8447416035615",
        "size": "3XL",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 16.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002140029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002080192",
        "sku": "8447416071231",
        "size": "XS",
        "color": "NAR.AVMARINO",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002080192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002090019",
        "sku": "8447416035776",
        "size": "S",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002090019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002090018",
        "sku": "8447416035707",
        "size": "S",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002090018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002100018",
        "sku": "8447416035714",
        "size": "M",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002100018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002141018",
        "sku": "8447416035769",
        "size": "4XL",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 16.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002141018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002140019",
        "sku": "8447416035820",
        "size": "3XL",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 16.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002140019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002100019",
        "sku": "8447416035783",
        "size": "M",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002100019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002110019",
        "sku": "8447416035790",
        "size": "L",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002110019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002110018",
        "sku": "8447416035721",
        "size": "L",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002110018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002120019",
        "sku": "8447416035806",
        "size": "XL",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002120019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002120018",
        "sku": "8447416035738",
        "size": "XL",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002120018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002130018",
        "sku": "8447416035745",
        "size": "XXL",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002130018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002140018",
        "sku": "8447416035752",
        "size": "3XL",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 16.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002140018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002130019",
        "sku": "8447416035813",
        "size": "XXL",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 15.18,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002130019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      },
      {
        "id": "12002141019",
        "sku": "8447416035837",
        "size": "4XL",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 16.43,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/12002141019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/4228/EBF8/5EC2/5275/2E10/8520/908F/EMBALAJE.png"
        ]
      }
    ]
  },
  {
    "id": "12003",
    "name": "Polo A.V. PRAGA",
    "brand": "Anbor",
    "description": "Polo A.V. manga larga PRAGA<br><br>Material contraste: 100% poliéster, 150 gr<br>Material flúor: 100% poliéster, 150 gr<br><br>Bolsillo en pecho izquierdo<br>Tapeta con 3 botones<br>Tejido transpirable y secado rápido<br>Cuello y puños de canalé<br><br>Bandas reflectantes:<br>2 bandas reflectantes cosidas en torso y mangas de 5 cm<br>(ancho banda especial en la talla S de 7 cm.).<br><br>Normativa:<br>EN ISO 13688:2013 + EN ISO 13688:2013/A1:2021<br>EN ISO 20471:2013 + EN ISO 20471:2013/A1:2016<br><br>Pack 1 unidad<br>Caja 25 unidades<br>Tallas S - M - L - XL - XXL - 3XL - 4XL<br><br>Condiciones de lavado:<br>Lavado a temperatura máxima de 30ºC. No usar lejía u otros agentes blanqueantes. No lavar en seco. No usar secadora. Planchar a 1 punto (temperatura baja, máx. 110ºC). No planchar o aplicar vapor sobre las bandas o módulos reflectantes.",
    "variants": [
      {
        "id": "12003100024",
        "sku": "8447416031068",
        "size": "M",
        "color": "AMA.AVMARINO",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003100024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003090026",
        "sku": "8447416030986",
        "size": "S",
        "color": "AMA.AV.GRIS",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003090026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003090024",
        "sku": "8447416031051",
        "size": "S",
        "color": "AMA.AVMARINO",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003090024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003090027",
        "sku": "8447416031129",
        "size": "S",
        "color": "AMA.AVVERDE",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003090027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003090029",
        "sku": "8447416031198",
        "size": "S",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003090029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003090192",
        "sku": "8447416031266",
        "size": "S",
        "color": "NAR.AVMARINO",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003090192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003100026",
        "sku": "8447416030993",
        "size": "M",
        "color": "AMA.AV.GRIS",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003100026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003120024",
        "sku": "8447416031082",
        "size": "XL",
        "color": "AMA.AVMARINO",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003120024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003100027",
        "sku": "8447416031136",
        "size": "M",
        "color": "AMA.AVVERDE",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003100027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003100029",
        "sku": "8447416031204",
        "size": "M",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003100029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003100192",
        "sku": "8447416031273",
        "size": "M",
        "color": "NAR.AVMARINO",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003100192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003110026",
        "sku": "8447416031006",
        "size": "L",
        "color": "AMA.AV.GRIS",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003110026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003110024",
        "sku": "8447416031075",
        "size": "L",
        "color": "AMA.AVMARINO",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003110024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003110027",
        "sku": "8447416031143",
        "size": "L",
        "color": "AMA.AVVERDE",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003110027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003110029",
        "sku": "8447416031211",
        "size": "L",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003110029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003110192",
        "sku": "8447416031280",
        "size": "L",
        "color": "NAR.AVMARINO",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003110192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003120026",
        "sku": "8447416031013",
        "size": "XL",
        "color": "AMA.AV.GRIS",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003120026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003120027",
        "sku": "8447416031150",
        "size": "XL",
        "color": "AMA.AVVERDE",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003120027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003120029",
        "sku": "8447416031228",
        "size": "XL",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003120029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003120192",
        "sku": "8447416031297",
        "size": "XL",
        "color": "NAR.AVMARINO",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003120192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003130026",
        "sku": "8447416031020",
        "size": "XXL",
        "color": "AMA.AV.GRIS",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003130026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003130024",
        "sku": "8447416031099",
        "size": "XXL",
        "color": "AMA.AVMARINO",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003130024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003130027",
        "sku": "8447416031167",
        "size": "XXL",
        "color": "AMA.AVVERDE",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003130027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003130029",
        "sku": "8447416031235",
        "size": "XXL",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003130029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003130192",
        "sku": "8447416031303",
        "size": "XXL",
        "color": "NAR.AVMARINO",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003130192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003140026",
        "sku": "8447416031037",
        "size": "3XL",
        "color": "AMA.AV.GRIS",
        "basePrice": 9.15,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003140026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003140024",
        "sku": "8447416031105",
        "size": "3XL",
        "color": "AMA.AVMARINO",
        "basePrice": 9.15,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003140024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003141026",
        "sku": "8447416031044",
        "size": "4XL",
        "color": "AMA.AV.GRIS",
        "basePrice": 9.15,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003141026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003141024",
        "sku": "8447416031112",
        "size": "4XL",
        "color": "AMA.AVMARINO",
        "basePrice": 9.15,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003141024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003141027",
        "sku": "8447416031181",
        "size": "4XL",
        "color": "AMA.AVVERDE",
        "basePrice": 9.15,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003141027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003141029",
        "sku": "8447416067470",
        "size": "4XL",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 9.15,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003141029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003141192",
        "sku": "8447416031327",
        "size": "4XL",
        "color": "NAR.AVMARINO",
        "basePrice": 9.15,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003141192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003080024",
        "sku": "8447416071248",
        "size": "XS",
        "color": "AMA.AVMARINO",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003080024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003140027",
        "sku": "8447416031174",
        "size": "3XL",
        "color": "AMA.AVVERDE",
        "basePrice": 9.15,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003140027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003140029",
        "sku": "8447416031242",
        "size": "3XL",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 9.15,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003140029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003080192",
        "sku": "8447416071255",
        "size": "XS",
        "color": "NAR.AVMARINO",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003080192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003140192",
        "sku": "8447416031310",
        "size": "3XL",
        "color": "NAR.AVMARINO",
        "basePrice": 9.15,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003140192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003090018",
        "sku": "8447416031334",
        "size": "S",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003090018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003100018",
        "sku": "8447416031341",
        "size": "M",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003100018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003090019",
        "sku": "8447416031402",
        "size": "S",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003090019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003110018",
        "sku": "8447416031358",
        "size": "L",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003110018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003100019",
        "sku": "8447416031419",
        "size": "M",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003100019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003120018",
        "sku": "8447416031365",
        "size": "XL",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003120018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003110019",
        "sku": "8447416031426",
        "size": "L",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003110019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003130018",
        "sku": "8447416031372",
        "size": "XXL",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003130018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003120019",
        "sku": "8447416031433",
        "size": "XL",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003120019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003140018",
        "sku": "8447416031389",
        "size": "3XL",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 9.15,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003140018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003130019",
        "sku": "8447416031440",
        "size": "XXL",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 8.45,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003130019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003141019",
        "sku": "8447416031464",
        "size": "4XL",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 9.15,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003141019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003141018",
        "sku": "8447416031396",
        "size": "4XL",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 9.15,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003141018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      },
      {
        "id": "12003140019",
        "sku": "8447416031457",
        "size": "3XL",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 9.15,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/12003140019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3434/B72C/013F/042A/2E10/8520/10BD/EMBALAJE.png"
        ]
      }
    ]
  },
  {
    "id": "12004",
    "name": "Pantalón A.V. CAIRO",
    "brand": "Anbor",
    "description": "Pantalón multibolsillos combinado A.V. modelo CAIRO<br><br>Material contraste: 80% poliéster 20% algodón, 240 gr<br>Material flúor: 80% poliéster 20% algodón, 240 gr<br><br>Cierre con cremallera y botón<br>Color de contraste en fuelles de bolsillos lateral y traseros<br>Todas las costuras reforzadas<br>Cinturilla elástica y trabillas<br><br>6 bolsillos:<br>2 bolsillos delanteros<br>2 bolsillos traseros con solapa y fuelle en contraste<br>2 bolsillos laterales con fuelle en contraste<br><br>Bandas reflectantes:<br>2 bandas reflectantes cosidas en el bajo de las piernas<br><br>Normativa:<br>EN ISO 13688:2013 + EN ISO 13688:2013/A1:2021<br>EN ISO 20471:2013 + EN ISO 20471:2013/A1:2016<br><br>Pack 1 unidad<br>Caja 25 unidades<br>Tallas 36 - 38 - 40 - 42 - 44 - 46 - 48 - 50 - 52 - 54 - 56 - 58 - 60<br><br>Recomendaciones de lavado:<br>Lavado a temperatura máxima de 30ºC. No usar lejía u otros agentes blanqueantes. No lavar en seco. No usar secadora. Planchar a 1 punto (temperatura baja, máx. 110ºC). No planchar o aplicar vapor sobre las bandas o módulos reflectantes.",
    "variants": [
      {
        "id": "12004150026",
        "sku": "8447416032317",
        "size": "36",
        "color": "AMA.AV.GRIS",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004150026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004150024",
        "sku": "8447416032447",
        "size": "36",
        "color": "AMA.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004150024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004150027",
        "sku": "8447416032577",
        "size": "36",
        "color": "AMA.AVVERDE",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004150027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004150029",
        "sku": "8447416032706",
        "size": "36",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004150029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004150192",
        "sku": "8447416032836",
        "size": "36",
        "color": "NAR.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004150192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004155026",
        "sku": "8447416032324",
        "size": "38",
        "color": "AMA.AV.GRIS",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004155026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004155024",
        "sku": "8447416032454",
        "size": "38",
        "color": "AMA.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004155024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004155027",
        "sku": "8447416032584",
        "size": "38",
        "color": "AMA.AVVERDE",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004155027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004155029",
        "sku": "8447416032713",
        "size": "38",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004155029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004155192",
        "sku": "8447416032843",
        "size": "38",
        "color": "NAR.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004155192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004160027",
        "sku": "8447416032591",
        "size": "40",
        "color": "AMA.AVVERDE",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004160027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004160029",
        "sku": "8447416032720",
        "size": "40",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004160029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004160192",
        "sku": "8447416032850",
        "size": "40",
        "color": "NAR.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004160192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004165026",
        "sku": "8447416032348",
        "size": "42",
        "color": "AMA.AV.GRIS",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004165026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004165024",
        "sku": "8447416032478",
        "size": "42",
        "color": "AMA.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004165024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004165027",
        "sku": "8447416032607",
        "size": "42",
        "color": "AMA.AVVERDE",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004165027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004165029",
        "sku": "8447416032737",
        "size": "42",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004165029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004165192",
        "sku": "8447416032867",
        "size": "42",
        "color": "NAR.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004165192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004160026",
        "sku": "8447416032331",
        "size": "40",
        "color": "AMA.AV.GRIS",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004160026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004160024",
        "sku": "8447416032461",
        "size": "40",
        "color": "AMA.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004160024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004170029",
        "sku": "8447416032744",
        "size": "44",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004170029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004170192",
        "sku": "8447416032874",
        "size": "44",
        "color": "NAR.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004170192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004175026",
        "sku": "8447416032362",
        "size": "46",
        "color": "AMA.AV.GRIS",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004175026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004175024",
        "sku": "8447416032492",
        "size": "46",
        "color": "AMA.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004175024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004175027",
        "sku": "8447416032621",
        "size": "46",
        "color": "AMA.AVVERDE",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004175027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004175029",
        "sku": "8447416032751",
        "size": "46",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004175029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004175192",
        "sku": "8447416032881",
        "size": "46",
        "color": "NAR.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004175192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004170026",
        "sku": "8447416032355",
        "size": "44",
        "color": "AMA.AV.GRIS",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004170026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004170024",
        "sku": "8447416032485",
        "size": "44",
        "color": "AMA.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004170024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004170027",
        "sku": "8447416032614",
        "size": "44",
        "color": "AMA.AVVERDE",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004170027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004180192",
        "sku": "8447416032898",
        "size": "48",
        "color": "NAR.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004180192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004185026",
        "sku": "8447416032386",
        "size": "50",
        "color": "AMA.AV.GRIS",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004185026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004185024",
        "sku": "8447416032515",
        "size": "50",
        "color": "AMA.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004185024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004185027",
        "sku": "8447416032645",
        "size": "50",
        "color": "AMA.AVVERDE",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004185027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004185029",
        "sku": "8447416032775",
        "size": "50",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004185029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004185192",
        "sku": "8447416067500",
        "size": "50",
        "color": "NAR.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004185192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004180026",
        "sku": "8447416032379",
        "size": "48",
        "color": "AMA.AV.GRIS",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004180026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004180024",
        "sku": "8447416032508",
        "size": "48",
        "color": "AMA.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004180024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004180027",
        "sku": "8447416032638",
        "size": "48",
        "color": "AMA.AVVERDE",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004180027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004180029",
        "sku": "8447416032768",
        "size": "48",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004180029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004195026",
        "sku": "8447416032409",
        "size": "54",
        "color": "AMA.AV.GRIS",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004195026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004195024",
        "sku": "8447416032539",
        "size": "54",
        "color": "AMA.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004195024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004195027",
        "sku": "8447416032669",
        "size": "54",
        "color": "AMA.AVVERDE",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004195027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004195029",
        "sku": "8447416032799",
        "size": "54",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004195029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004195192",
        "sku": "8447416032928",
        "size": "54",
        "color": "NAR.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004195192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004190026",
        "sku": "8447416032393",
        "size": "52",
        "color": "AMA.AV.GRIS",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004190026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004190024",
        "sku": "8447416032522",
        "size": "52",
        "color": "AMA.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004190024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004190027",
        "sku": "8447416032652",
        "size": "52",
        "color": "AMA.AVVERDE",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004190027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004190029",
        "sku": "8447416032782",
        "size": "52",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004190029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004190192",
        "sku": "8447416032911",
        "size": "52",
        "color": "NAR.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004190192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004205024",
        "sku": "8447416032553",
        "size": "58",
        "color": "AMA.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004205024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004205027",
        "sku": "8447416032683",
        "size": "58",
        "color": "AMA.AVVERDE",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004205027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004205029",
        "sku": "8447416032812",
        "size": "58",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004205029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004205192",
        "sku": "8447416032942",
        "size": "58",
        "color": "NAR.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004205192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004200026",
        "sku": "8447416032416",
        "size": "56",
        "color": "AMA.AV.GRIS",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004200026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004200024",
        "sku": "8447416032546",
        "size": "56",
        "color": "AMA.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004200024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004200027",
        "sku": "8447416032676",
        "size": "56",
        "color": "AMA.AVVERDE",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004200027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004200029",
        "sku": "8447416032805",
        "size": "56",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004200029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004200192",
        "sku": "8447416032935",
        "size": "56",
        "color": "NAR.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004200192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004205026",
        "sku": "8447416032423",
        "size": "58",
        "color": "AMA.AV.GRIS",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004205026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004210026",
        "sku": "8447416032430",
        "size": "60",
        "color": "AMA.AV.GRIS",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004210026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004210024",
        "sku": "8447416032560",
        "size": "60",
        "color": "AMA.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004210024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004210027",
        "sku": "8447416032690",
        "size": "60",
        "color": "AMA.AVVERDE",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004210027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004210029",
        "sku": "8447416032829",
        "size": "60",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004210029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004210192",
        "sku": "8447416032959",
        "size": "60",
        "color": "NAR.AVMARINO",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004210192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004160019",
        "sku": "8447416033116",
        "size": "40",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004160019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004160018",
        "sku": "8447416032980",
        "size": "40",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004160018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004165019",
        "sku": "8447416033123",
        "size": "42",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004165019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004165018",
        "sku": "8447416032997",
        "size": "42",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004165018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004170018",
        "sku": "8447416033000",
        "size": "44",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004170018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004150018",
        "sku": "8447416032966",
        "size": "36",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004150018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004155018",
        "sku": "8447416032973",
        "size": "38",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004155018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004150019",
        "sku": "8447416033093",
        "size": "36",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004150019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004155019",
        "sku": "8447416033109",
        "size": "38",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004155019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004190018",
        "sku": "8447416033048",
        "size": "52",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004190018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004185019",
        "sku": "8447416033161",
        "size": "50",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004185019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004195018",
        "sku": "8447416033055",
        "size": "54",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004195018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004190019",
        "sku": "8447416033178",
        "size": "52",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004190019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004170019",
        "sku": "8447416033130",
        "size": "44",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004170019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004175019",
        "sku": "8447416033147",
        "size": "46",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004175019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004175018",
        "sku": "8447416033017",
        "size": "46",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004175018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004180019",
        "sku": "8447416033154",
        "size": "48",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004180019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004180018",
        "sku": "8447416033024",
        "size": "48",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004180018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004185018",
        "sku": "8447416033031",
        "size": "50",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004185018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004200018",
        "sku": "8447416033062",
        "size": "56",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004200018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004195019",
        "sku": "8447416033185",
        "size": "54",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004195019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004205018",
        "sku": "8447416033079",
        "size": "58",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004205018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004200019",
        "sku": "8447416033192",
        "size": "56",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004200019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004205019",
        "sku": "8447416033208",
        "size": "58",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004205019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004210019",
        "sku": "8447416033215",
        "size": "60",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004210019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      },
      {
        "id": "12004210018",
        "sku": "8447416033086",
        "size": "60",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 13.25,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/12004210018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/3938/8849/E845/969A/2E10/8520/10A3/EMBALAJE.png"
        ]
      }
    ]
  },
  {
    "id": "12005",
    "name": "Chaleco A.V. TRAFFIC",
    "brand": "Anbor",
    "description": "Chaleco A.V. TRAFFIC<br><br>Material contraste: 100% poliéster, 125 gr<br>Material flúor: 100% poliéster, 125 gr<br><br>Cierre central cruzado con dos velcros ajustables<br>Ribeteado con bies<br>Escote pico<br><br>Bandas reflectantes:<br>2 bandas reflectantes cosidas en torso<br><br>Normativa:<br>EN ISO 13688:2013 + EN ISO 13688:2013/A1:2021<br>EN ISO 20471:2013 + EN ISO 20471:2013/A1:2016<br><br>Pack 1 unidad<br>Caja 100 unidades<br>Tallas XL<br><br>Condiciones de lavado:<br>Lavado a temperatura máxima de 30ºC. No usar lejía u otros agentes blanqueantes. No lavar en seco. No usar secadora. No planchar o aplicar vapor sobre las bandas o módulos reflectantes.",
    "variants": [
      {
        "id": "12005120025",
        "sku": "8447416036964",
        "size": "XL",
        "color": "AMARILLO AV",
        "basePrice": 1.83,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/465F/E574/64B9/E341/2E10/8520/9053/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/465F/E574/64B9/E341/2E10/8520/9053/12005120025.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/465F/E574/64B9/E341/2E10/8520/9053/EMBALAJE.png"
        ]
      },
      {
        "id": "12005120193",
        "sku": "8447416036971",
        "size": "XL",
        "color": "NARANJA AV",
        "basePrice": 1.83,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/465F/E574/64B9/E341/2E10/8520/9053/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/465F/E574/64B9/E341/2E10/8520/9053/12005120193.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/465F/E574/64B9/E341/2E10/8520/9053/EMBALAJE.png"
        ]
      }
    ]
  },
  {
    "id": "12006",
    "name": "Parka A.V. VIENA",
    "brand": "Anbor",
    "description": "Parka combinado A.V. modelo VIENA<br><br>Composición exterior 100% poliéster Oxford 300D imprimación PVC<br>Material acolchado 100% poliéster 160 gr<br>Material forro interior 100% poliéster 190D<br><br>Cierre central con cremallera oculta con tapeta<br>Capucha plegable en el cuello<br>Interior del cuello micropolar<br>Ojal metálico en las axilas para favorecer la transpirabilidad<br>Puño elástico de canalé en las mangas<br>Dos bolsillos laterales con tapeta y un bolsillo interior<br>Costuras termo selladas<br><br>Bandas reflectantes:<br>2 bandas reflectantes cosidas en torso y mangas<br><br>Normativa:<br>EN ISO 13688:2013 + EN ISO 13688:2013/A1:2021<br>EN ISO 20471:2013 + EN ISO 20471:2013/A1:2016<br><br>Pack 1 unidad<br>Caja 10 unidades<br>Tallas S - M - L - XL - XXL - 3XL - 4XL<br><br>Recomendaciones de lavado:<br>Lavado a temperatura máxima de 40ºC. No usar lejía u otros agentes blanqueantes. No lavar en seco. No usar secadora. No aplicar vapor sobre las bandas o módulos reflectantes. Planchar a 1 punto (temperatura baja, máx. 110ºC).",
    "variants": [
      {
        "id": "12006090029",
        "sku": "8447416036056",
        "size": "S",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006090029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006090192",
        "sku": "8447416036124",
        "size": "S",
        "color": "NAR.AVMARINO",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006090192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006090026",
        "sku": "8447416035844",
        "size": "S",
        "color": "AMA.AV.GRIS",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006090026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006090024",
        "sku": "8447416035912",
        "size": "S",
        "color": "AMA.AVMARINO",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006090024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006090027",
        "sku": "8447416035981",
        "size": "S",
        "color": "AMA.AVVERDE",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006090027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006110029",
        "sku": "8447416036070",
        "size": "L",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006110029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006110192",
        "sku": "8447416036148",
        "size": "L",
        "color": "NAR.AVMARINO",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006110192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006100026",
        "sku": "8447416035851",
        "size": "M",
        "color": "AMA.AV.GRIS",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006100026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006100024",
        "sku": "8447416035929",
        "size": "M",
        "color": "AMA.AVMARINO",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006100024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006100027",
        "sku": "8447416035998",
        "size": "M",
        "color": "AMA.AVVERDE",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006100027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006100029",
        "sku": "8447416036063",
        "size": "M",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006100029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006100192",
        "sku": "8447416036131",
        "size": "M",
        "color": "NAR.AVMARINO",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006100192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006110026",
        "sku": "8447416035868",
        "size": "L",
        "color": "AMA.AV.GRIS",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006110026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006110024",
        "sku": "8447416035936",
        "size": "L",
        "color": "AMA.AVMARINO",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006110024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006110027",
        "sku": "8447416036001",
        "size": "L",
        "color": "AMA.AVVERDE",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006110027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006130192",
        "sku": "8447416036162",
        "size": "XXL",
        "color": "NAR.AVMARINO",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006130192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006120026",
        "sku": "8447416035875",
        "size": "XL",
        "color": "AMA.AV.GRIS",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006120026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006120024",
        "sku": "8447416035943",
        "size": "XL",
        "color": "AMA.AVMARINO",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006120024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006120027",
        "sku": "8447416036018",
        "size": "XL",
        "color": "AMA.AVVERDE",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006120027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006120029",
        "sku": "8447416036087",
        "size": "XL",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006120029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006120192",
        "sku": "8447416036155",
        "size": "XL",
        "color": "NAR.AVMARINO",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006120192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006130026",
        "sku": "8447416035882",
        "size": "XXL",
        "color": "AMA.AV.GRIS",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006130026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006130024",
        "sku": "8447416035950",
        "size": "XXL",
        "color": "AMA.AVMARINO",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006130024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006130027",
        "sku": "8447416036025",
        "size": "XXL",
        "color": "AMA.AVVERDE",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006130027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006130029",
        "sku": "8447416036094",
        "size": "XXL",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006130029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006140026",
        "sku": "8447416035899",
        "size": "3XL",
        "color": "AMA.AV.GRIS",
        "basePrice": 30.85,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006140026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006140024",
        "sku": "8447416035967",
        "size": "3XL",
        "color": "AMA.AVMARINO",
        "basePrice": 30.85,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006140024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006140027",
        "sku": "8447416036032",
        "size": "3XL",
        "color": "AMA.AVVERDE",
        "basePrice": 30.85,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006140027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006140029",
        "sku": "8447416036100",
        "size": "3XL",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 30.85,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006140029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006140192",
        "sku": "8447416036179",
        "size": "3XL",
        "color": "NAR.AVMARINO",
        "basePrice": 30.85,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006140192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006141026",
        "sku": "8447416035905",
        "size": "4XL",
        "color": "AMA.AV.GRIS",
        "basePrice": 30.85,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006141026.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006141024",
        "sku": "8447416035974",
        "size": "4XL",
        "color": "AMA.AVMARINO",
        "basePrice": 30.85,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006141024.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006141027",
        "sku": "8447416036049",
        "size": "4XL",
        "color": "AMA.AVVERDE",
        "basePrice": 30.85,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006141027.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006141029",
        "sku": "8447416036117",
        "size": "4XL",
        "color": "AMA.AVVERDE OSCURO",
        "basePrice": 30.85,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006141029.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006141192",
        "sku": "8447416036186",
        "size": "4XL",
        "color": "NAR.AVMARINO",
        "basePrice": 30.85,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006141192.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006120019",
        "sku": "8447416036292",
        "size": "XL",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006120019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006120018",
        "sku": "8447416036223",
        "size": "XL",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006120018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006130018",
        "sku": "8447416036230",
        "size": "XXL",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006130018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006090018",
        "sku": "8447416036193",
        "size": "S",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006090018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006090019",
        "sku": "8447416036261",
        "size": "S",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006090019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006100019",
        "sku": "8447416036278",
        "size": "M",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006100019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006100018",
        "sku": "8447416036209",
        "size": "M",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006100018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006110019",
        "sku": "8447416036285",
        "size": "L",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006110019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006110018",
        "sku": "8447416036216",
        "size": "L",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006110018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006130019",
        "sku": "8447416036308",
        "size": "XXL",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 29.07,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006130019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006140019",
        "sku": "8447416036315",
        "size": "3XL",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 30.85,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006140019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006140018",
        "sku": "8447416036247",
        "size": "3XL",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 30.85,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006140018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006141018",
        "sku": "8447416036254",
        "size": "4XL",
        "color": "AMA.AV/TURQUESA",
        "basePrice": 30.85,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006141018.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      },
      {
        "id": "12006141019",
        "sku": "8447416036322",
        "size": "4XL",
        "color": "AMA.AV/VERDE LIMA",
        "basePrice": 30.85,
        "images": [
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/template_image.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/12006141019.png",
          "http://anbor.eu/WebRoot/Store/Shops/Anbor/6570/443D/A814/9314/FEA1/2E10/8520/90D7/EMBALAJE.png"
        ]
      }
    ]
  },
  {
    "id": "FOR.ALASKA",
    "name": "Modelo FOR.ALASKA",
    "brand": "Forli",
    "description": "BOTA MF S3+CI+SRC+ESD Negro 35",
    "variants": [
      {
        "id": "FOR.ALASKA-99-35",
        "sku": "8457780310713",
        "size": "35",
        "color": "NEGRO",
        "basePrice": 36.11,
        "images": [
          "https://forli.es/388-thickbox_default/ALASKA.jpg"
        ]
      },
      {
        "id": "FOR.ALASKA-99-36",
        "sku": "8457780310720",
        "size": "36",
        "color": "NEGRO",
        "basePrice": 36.11,
        "images": [
          "https://forli.es/388-thickbox_default/ALASKA.jpg"
        ]
      },
      {
        "id": "FOR.ALASKA-99-37",
        "sku": "8457780310737",
        "size": "37",
        "color": "NEGRO",
        "basePrice": 36.11,
        "images": [
          "https://forli.es/388-thickbox_default/ALASKA.jpg"
        ]
      },
      {
        "id": "FOR.ALASKA-99-38",
        "sku": "8457780310744",
        "size": "38",
        "color": "NEGRO",
        "basePrice": 36.11,
        "images": [
          "https://forli.es/388-thickbox_default/ALASKA.jpg"
        ]
      },
      {
        "id": "FOR.ALASKA-99-39",
        "sku": "8457780310751",
        "size": "39",
        "color": "NEGRO",
        "basePrice": 36.11,
        "images": [
          "https://forli.es/388-thickbox_default/ALASKA.jpg"
        ]
      },
      {
        "id": "FOR.ALASKA-99-40",
        "sku": "8457780310768",
        "size": "40",
        "color": "NEGRO",
        "basePrice": 36.11,
        "images": [
          "https://forli.es/388-thickbox_default/ALASKA.jpg"
        ]
      },
      {
        "id": "FOR.ALASKA-99-41",
        "sku": "8457780310775",
        "size": "41",
        "color": "NEGRO",
        "basePrice": 36.11,
        "images": [
          "https://forli.es/388-thickbox_default/ALASKA.jpg"
        ]
      },
      {
        "id": "FOR.ALASKA-99-42",
        "sku": "8457780310782",
        "size": "42",
        "color": "NEGRO",
        "basePrice": 36.11,
        "images": [
          "https://forli.es/388-thickbox_default/ALASKA.jpg"
        ]
      },
      {
        "id": "FOR.ALASKA-99-43",
        "sku": "8457780310799",
        "size": "43",
        "color": "NEGRO",
        "basePrice": 36.11,
        "images": [
          "https://forli.es/388-thickbox_default/ALASKA.jpg"
        ]
      },
      {
        "id": "FOR.ALASKA-99-44",
        "sku": "8457780310805",
        "size": "44",
        "color": "NEGRO",
        "basePrice": 36.11,
        "images": [
          "https://forli.es/388-thickbox_default/ALASKA.jpg"
        ]
      },
      {
        "id": "FOR.ALASKA-99-45",
        "sku": "8457780310812",
        "size": "45",
        "color": "NEGRO",
        "basePrice": 36.11,
        "images": [
          "https://forli.es/388-thickbox_default/ALASKA.jpg"
        ]
      },
      {
        "id": "FOR.ALASKA-99-46",
        "sku": "8457780310829",
        "size": "46",
        "color": "NEGRO",
        "basePrice": 36.11,
        "images": [
          "https://forli.es/388-thickbox_default/ALASKA.jpg"
        ]
      },
      {
        "id": "FOR.ALASKA-99-47",
        "sku": "8457780310836",
        "size": "47",
        "color": "NEGRO",
        "basePrice": 36.11,
        "images": [
          "https://forli.es/388-thickbox_default/ALASKA.jpg"
        ]
      },
      {
        "id": "FOR.ALASKA-99-48",
        "sku": "8457780310843",
        "size": "48",
        "color": "NEGRO",
        "basePrice": 36.11,
        "images": [
          "https://forli.es/388-thickbox_default/ALASKA.jpg"
        ]
      },
      {
        "id": "FOR.ALASKA-99-49",
        "sku": "8457780347177",
        "size": "49",
        "color": "NEGRO",
        "basePrice": 36.11,
        "images": [
          "https://forli.es/388-thickbox_default/ALASKA.jpg"
        ]
      },
      {
        "id": "FOR.ALASKA-99-50",
        "sku": "8457780347184",
        "size": "50",
        "color": "NEGRO",
        "basePrice": 36.11,
        "images": [
          "https://forli.es/388-thickbox_default/ALASKA.jpg"
        ]
      }
    ]
  },
  {
    "id": "FOR.ASPEN",
    "name": "Modelo FOR.ASPEN",
    "brand": "Forli",
    "description": "BOTA S3S +CI+HI+ FO+HRO+SR+ESD Gris 35",
    "variants": [
      {
        "id": "FOR.ASPEN-94-35",
        "sku": "8457780336980",
        "size": "35",
        "color": "NEGRO",
        "basePrice": 56.81,
        "images": [
          "https://forli.es/572-thickbox_default/ASPEN.jpg"
        ]
      },
      {
        "id": "FOR.ASPEN-94-36",
        "sku": "8457780336997",
        "size": "36",
        "color": "NEGRO",
        "basePrice": 56.81,
        "images": [
          "https://forli.es/572-thickbox_default/ASPEN.jpg"
        ]
      },
      {
        "id": "FOR.ASPEN-94-37",
        "sku": "8457780337000",
        "size": "37",
        "color": "NEGRO",
        "basePrice": 56.81,
        "images": [
          "https://forli.es/572-thickbox_default/ASPEN.jpg"
        ]
      },
      {
        "id": "FOR.ASPEN-94-38",
        "sku": "8457780337017",
        "size": "38",
        "color": "NEGRO",
        "basePrice": 56.81,
        "images": [
          "https://forli.es/572-thickbox_default/ASPEN.jpg"
        ]
      },
      {
        "id": "FOR.ASPEN-94-39",
        "sku": "8457780337024",
        "size": "39",
        "color": "NEGRO",
        "basePrice": 56.81,
        "images": [
          "https://forli.es/572-thickbox_default/ASPEN.jpg"
        ]
      },
      {
        "id": "FOR.ASPEN-94-40",
        "sku": "8457780337031",
        "size": "40",
        "color": "NEGRO",
        "basePrice": 56.81,
        "images": [
          "https://forli.es/572-thickbox_default/ASPEN.jpg"
        ]
      },
      {
        "id": "FOR.ASPEN-94-41",
        "sku": "8457780337048",
        "size": "41",
        "color": "NEGRO",
        "basePrice": 56.81,
        "images": [
          "https://forli.es/572-thickbox_default/ASPEN.jpg"
        ]
      },
      {
        "id": "FOR.ASPEN-94-42",
        "sku": "8457780337055",
        "size": "42",
        "color": "NEGRO",
        "basePrice": 56.81,
        "images": [
          "https://forli.es/572-thickbox_default/ASPEN.jpg"
        ]
      },
      {
        "id": "FOR.ASPEN-94-43",
        "sku": "8457780337062",
        "size": "43",
        "color": "NEGRO",
        "basePrice": 56.81,
        "images": [
          "https://forli.es/572-thickbox_default/ASPEN.jpg"
        ]
      },
      {
        "id": "FOR.ASPEN-94-44",
        "sku": "8457780337079",
        "size": "44",
        "color": "NEGRO",
        "basePrice": 56.81,
        "images": [
          "https://forli.es/572-thickbox_default/ASPEN.jpg"
        ]
      },
      {
        "id": "FOR.ASPEN-94-45",
        "sku": "8457780337086",
        "size": "45",
        "color": "NEGRO",
        "basePrice": 56.81,
        "images": [
          "https://forli.es/572-thickbox_default/ASPEN.jpg"
        ]
      },
      {
        "id": "FOR.ASPEN-94-46",
        "sku": "8457780337093",
        "size": "46",
        "color": "NEGRO",
        "basePrice": 56.81,
        "images": [
          "https://forli.es/572-thickbox_default/ASPEN.jpg"
        ]
      },
      {
        "id": "FOR.ASPEN-94-47",
        "sku": "8457780337109",
        "size": "47",
        "color": "NEGRO",
        "basePrice": 56.81,
        "images": [
          "https://forli.es/572-thickbox_default/ASPEN.jpg"
        ]
      },
      {
        "id": "FOR.ASPEN-94-48",
        "sku": "8457780337116",
        "size": "48",
        "color": "NEGRO",
        "basePrice": 56.81,
        "images": [
          "https://forli.es/572-thickbox_default/ASPEN.jpg"
        ]
      }
    ]
  },
  {
    "id": "FOR.ATLANTA",
    "name": "Modelo FOR.ATLANTA",
    "brand": "Forli",
    "description": "ZAPATO MF S3+CI+SRC+ESD Negro 35",
    "variants": [
      {
        "id": "FOR.ATLANTA-99-35",
        "sku": "8457780304002",
        "size": "35",
        "color": "NEGRO",
        "basePrice": 34.13,
        "images": [
          "https://forli.es/506-thickbox_default/ATLANTA.jpg"
        ]
      },
      {
        "id": "FOR.ATLANTA-99-36",
        "sku": "8457780268847",
        "size": "36",
        "color": "NEGRO",
        "basePrice": 34.13,
        "images": [
          "https://forli.es/506-thickbox_default/ATLANTA.jpg"
        ]
      },
      {
        "id": "FOR.ATLANTA-99-37",
        "sku": "8457780268854",
        "size": "37",
        "color": "NEGRO",
        "basePrice": 34.13,
        "images": [
          "https://forli.es/506-thickbox_default/ATLANTA.jpg"
        ]
      },
      {
        "id": "FOR.ATLANTA-99-38",
        "sku": "8457780268861",
        "size": "38",
        "color": "NEGRO",
        "basePrice": 34.13,
        "images": [
          "https://forli.es/506-thickbox_default/ATLANTA.jpg"
        ]
      },
      {
        "id": "FOR.ATLANTA-99-39",
        "sku": "8457780268878",
        "size": "39",
        "color": "NEGRO",
        "basePrice": 34.13,
        "images": [
          "https://forli.es/506-thickbox_default/ATLANTA.jpg"
        ]
      },
      {
        "id": "FOR.ATLANTA-99-40",
        "sku": "8457780268885",
        "size": "40",
        "color": "NEGRO",
        "basePrice": 34.13,
        "images": [
          "https://forli.es/506-thickbox_default/ATLANTA.jpg"
        ]
      },
      {
        "id": "FOR.ATLANTA-99-41",
        "sku": "8457780268892",
        "size": "41",
        "color": "NEGRO",
        "basePrice": 34.13,
        "images": [
          "https://forli.es/506-thickbox_default/ATLANTA.jpg"
        ]
      },
      {
        "id": "FOR.ATLANTA-99-42",
        "sku": "8457780268908",
        "size": "42",
        "color": "NEGRO",
        "basePrice": 34.13,
        "images": [
          "https://forli.es/506-thickbox_default/ATLANTA.jpg"
        ]
      },
      {
        "id": "FOR.ATLANTA-99-43",
        "sku": "8457780268915",
        "size": "43",
        "color": "NEGRO",
        "basePrice": 34.13,
        "images": [
          "https://forli.es/506-thickbox_default/ATLANTA.jpg"
        ]
      },
      {
        "id": "FOR.ATLANTA-99-44",
        "sku": "8457780268922",
        "size": "44",
        "color": "NEGRO",
        "basePrice": 34.13,
        "images": [
          "https://forli.es/506-thickbox_default/ATLANTA.jpg"
        ]
      },
      {
        "id": "FOR.ATLANTA-99-45",
        "sku": "8457780268939",
        "size": "45",
        "color": "NEGRO",
        "basePrice": 34.13,
        "images": [
          "https://forli.es/506-thickbox_default/ATLANTA.jpg"
        ]
      },
      {
        "id": "FOR.ATLANTA-99-46",
        "sku": "8457780268946",
        "size": "46",
        "color": "NEGRO",
        "basePrice": 34.13,
        "images": [
          "https://forli.es/506-thickbox_default/ATLANTA.jpg"
        ]
      },
      {
        "id": "FOR.ATLANTA-99-47",
        "sku": "8457780268953",
        "size": "47",
        "color": "NEGRO",
        "basePrice": 34.13,
        "images": [
          "https://forli.es/506-thickbox_default/ATLANTA.jpg"
        ]
      },
      {
        "id": "FOR.ATLANTA-99-48",
        "sku": "8457780304019",
        "size": "48",
        "color": "NEGRO",
        "basePrice": 34.13,
        "images": [
          "https://forli.es/506-thickbox_default/ATLANTA.jpg"
        ]
      }
    ]
  },
  {
    "id": "FOR.AUSTIN",
    "name": "Modelo FOR.AUSTIN",
    "brand": "Forli",
    "description": "BOTA SERRAJE S1+P+CI+SRC METALICO Gris 35",
    "variants": [
      {
        "id": "FOR.AUSTIN-94-35",
        "sku": "8457780313943",
        "size": "35",
        "color": "GRIS",
        "basePrice": 17,
        "images": [
          "https://forli.es/512-thickbox_default/AUSTIN.jpg"
        ]
      },
      {
        "id": "FOR.AUSTIN-94-36",
        "sku": "8457780313950",
        "size": "36",
        "color": "GRIS",
        "basePrice": 17,
        "images": [
          "https://forli.es/512-thickbox_default/AUSTIN.jpg"
        ]
      },
      {
        "id": "FOR.AUSTIN-94-37",
        "sku": "8457780313967",
        "size": "37",
        "color": "GRIS",
        "basePrice": 17,
        "images": [
          "https://forli.es/512-thickbox_default/AUSTIN.jpg"
        ]
      },
      {
        "id": "FOR.AUSTIN-94-38",
        "sku": "8457780313974",
        "size": "38",
        "color": "GRIS",
        "basePrice": 17,
        "images": [
          "https://forli.es/512-thickbox_default/AUSTIN.jpg"
        ]
      },
      {
        "id": "FOR.AUSTIN-94-39",
        "sku": "8457780313981",
        "size": "39",
        "color": "GRIS",
        "basePrice": 17,
        "images": [
          "https://forli.es/512-thickbox_default/AUSTIN.jpg"
        ]
      },
      {
        "id": "FOR.AUSTIN-94-40",
        "sku": "8457780313998",
        "size": "40",
        "color": "GRIS",
        "basePrice": 17,
        "images": [
          "https://forli.es/512-thickbox_default/AUSTIN.jpg"
        ]
      },
      {
        "id": "FOR.AUSTIN-94-41",
        "sku": "8457780314001",
        "size": "41",
        "color": "GRIS",
        "basePrice": 17,
        "images": [
          "https://forli.es/512-thickbox_default/AUSTIN.jpg"
        ]
      },
      {
        "id": "FOR.AUSTIN-94-42",
        "sku": "8457780314018",
        "size": "42",
        "color": "GRIS",
        "basePrice": 17,
        "images": [
          "https://forli.es/512-thickbox_default/AUSTIN.jpg"
        ]
      },
      {
        "id": "FOR.AUSTIN-94-43",
        "sku": "8457780314025",
        "size": "43",
        "color": "GRIS",
        "basePrice": 17,
        "images": [
          "https://forli.es/512-thickbox_default/AUSTIN.jpg"
        ]
      },
      {
        "id": "FOR.AUSTIN-94-44",
        "sku": "8457780314032",
        "size": "44",
        "color": "GRIS",
        "basePrice": 17,
        "images": [
          "https://forli.es/512-thickbox_default/AUSTIN.jpg"
        ]
      },
      {
        "id": "FOR.AUSTIN-94-45",
        "sku": "8457780314049",
        "size": "45",
        "color": "GRIS",
        "basePrice": 17,
        "images": [
          "https://forli.es/512-thickbox_default/AUSTIN.jpg"
        ]
      },
      {
        "id": "FOR.AUSTIN-94-46",
        "sku": "8457780314056",
        "size": "46",
        "color": "GRIS",
        "basePrice": 17,
        "images": [
          "https://forli.es/512-thickbox_default/AUSTIN.jpg"
        ]
      },
      {
        "id": "FOR.AUSTIN-94-47",
        "sku": "8457780314063",
        "size": "47",
        "color": "GRIS",
        "basePrice": 17,
        "images": [
          "https://forli.es/512-thickbox_default/AUSTIN.jpg"
        ]
      },
      {
        "id": "FOR.AUSTIN-94-48",
        "sku": "8457780314070",
        "size": "48",
        "color": "GRIS",
        "basePrice": 17,
        "images": [
          "https://forli.es/512-thickbox_default/AUSTIN.jpg"
        ]
      }
    ]
  },
  {
    "id": "FOR.BALTIMORE",
    "name": "Modelo FOR.BALTIMORE",
    "brand": "Forli",
    "description": "BOTA PU S4+CI+SRC Blanco 36",
    "variants": [
      {
        "id": "FOR.BALTIMORE-00-36",
        "sku": "8457780321894",
        "size": "36",
        "color": "BLANCO",
        "basePrice": 35.56,
        "images": [
          "https://forli.es/img/logo-1643882024.jpg"
        ]
      },
      {
        "id": "FOR.BALTIMORE-00-37",
        "sku": "8457780321900",
        "size": "37",
        "color": "BLANCO",
        "basePrice": 35.56,
        "images": [
          "https://forli.es/img/logo-1643882024.jpg"
        ]
      },
      {
        "id": "FOR.BALTIMORE-00-38",
        "sku": "8457780321917",
        "size": "38",
        "color": "BLANCO",
        "basePrice": 35.56,
        "images": [
          "https://forli.es/img/logo-1643882024.jpg"
        ]
      },
      {
        "id": "FOR.BALTIMORE-00-39",
        "sku": "8457780321924",
        "size": "39",
        "color": "BLANCO",
        "basePrice": 35.56,
        "images": [
          "https://forli.es/img/logo-1643882024.jpg"
        ]
      },
      {
        "id": "FOR.BALTIMORE-00-40",
        "sku": "8457780321931",
        "size": "40",
        "color": "BLANCO",
        "basePrice": 35.56,
        "images": [
          "https://forli.es/img/logo-1643882024.jpg"
        ]
      },
      {
        "id": "FOR.BALTIMORE-00-41",
        "sku": "8457780321948",
        "size": "41",
        "color": "BLANCO",
        "basePrice": 35.56,
        "images": [
          "https://forli.es/img/logo-1643882024.jpg"
        ]
      },
      {
        "id": "FOR.BALTIMORE-00-42",
        "sku": "8457780321955",
        "size": "42",
        "color": "BLANCO",
        "basePrice": 35.56,
        "images": [
          "https://forli.es/img/logo-1643882024.jpg"
        ]
      },
      {
        "id": "FOR.BALTIMORE-00-43",
        "sku": "8457780321962",
        "size": "43",
        "color": "BLANCO",
        "basePrice": 35.56,
        "images": [
          "https://forli.es/img/logo-1643882024.jpg"
        ]
      },
      {
        "id": "FOR.BALTIMORE-00-44",
        "sku": "8457780321979",
        "size": "44",
        "color": "BLANCO",
        "basePrice": 35.56,
        "images": [
          "https://forli.es/img/logo-1643882024.jpg"
        ]
      },
      {
        "id": "FOR.BALTIMORE-00-45",
        "sku": "8457780321986",
        "size": "45",
        "color": "BLANCO",
        "basePrice": 35.56,
        "images": [
          "https://forli.es/img/logo-1643882024.jpg"
        ]
      },
      {
        "id": "FOR.BALTIMORE-00-46",
        "sku": "8457780321993",
        "size": "46",
        "color": "BLANCO",
        "basePrice": 35.56,
        "images": [
          "https://forli.es/img/logo-1643882024.jpg"
        ]
      },
      {
        "id": "FOR.BALTIMORE-00-47",
        "sku": "8457780322006",
        "size": "47",
        "color": "BLANCO",
        "basePrice": 35.56,
        "images": [
          "https://forli.es/img/logo-1643882024.jpg"
        ]
      },
      {
        "id": "FOR.BALTIMORE-00-48",
        "sku": "8457780322013",
        "size": "48",
        "color": "BLANCO",
        "basePrice": 35.56,
        "images": [
          "https://forli.es/img/logo-1643882024.jpg"
        ]
      }
    ]
  },
  {
    "id": "FOR.BOSTON",
    "name": "Modelo FOR.BOSTON",
    "brand": "Forli",
    "description": "ZAPATO PIEL S3+SRC METALICO Negro 35",
    "variants": [
      {
        "id": "FOR.BOSTON-99-35",
        "sku": "8457780303906",
        "size": "35",
        "color": "NEGRO",
        "basePrice": 14.14,
        "images": [
          "https://forli.es/408-thickbox_default/BOSTON.jpg"
        ]
      },
      {
        "id": "FOR.BOSTON-99-36",
        "sku": "8457780267765",
        "size": "36",
        "color": "NEGRO",
        "basePrice": 14.14,
        "images": [
          "https://forli.es/408-thickbox_default/BOSTON.jpg"
        ]
      },
      {
        "id": "FOR.BOSTON-99-37",
        "sku": "8457780267772",
        "size": "37",
        "color": "NEGRO",
        "basePrice": 14.14,
        "images": [
          "https://forli.es/408-thickbox_default/BOSTON.jpg"
        ]
      },
      {
        "id": "FOR.BOSTON-99-38",
        "sku": "8457780267789",
        "size": "38",
        "color": "NEGRO",
        "basePrice": 14.14,
        "images": [
          "https://forli.es/408-thickbox_default/BOSTON.jpg"
        ]
      },
      {
        "id": "FOR.BOSTON-99-39",
        "sku": "8457780267796",
        "size": "39",
        "color": "NEGRO",
        "basePrice": 14.14,
        "images": [
          "https://forli.es/408-thickbox_default/BOSTON.jpg"
        ]
      },
      {
        "id": "FOR.BOSTON-99-40",
        "sku": "8457780267802",
        "size": "40",
        "color": "NEGRO",
        "basePrice": 14.14,
        "images": [
          "https://forli.es/408-thickbox_default/BOSTON.jpg"
        ]
      },
      {
        "id": "FOR.BOSTON-99-41",
        "sku": "8457780267819",
        "size": "41",
        "color": "NEGRO",
        "basePrice": 14.14,
        "images": [
          "https://forli.es/408-thickbox_default/BOSTON.jpg"
        ]
      },
      {
        "id": "FOR.BOSTON-99-42",
        "sku": "8457780267826",
        "size": "42",
        "color": "NEGRO",
        "basePrice": 14.14,
        "images": [
          "https://forli.es/408-thickbox_default/BOSTON.jpg"
        ]
      },
      {
        "id": "FOR.BOSTON-99-43",
        "sku": "8457780267833",
        "size": "43",
        "color": "NEGRO",
        "basePrice": 14.14,
        "images": [
          "https://forli.es/408-thickbox_default/BOSTON.jpg"
        ]
      },
      {
        "id": "FOR.BOSTON-99-44",
        "sku": "8457780267840",
        "size": "44",
        "color": "NEGRO",
        "basePrice": 14.14,
        "images": [
          "https://forli.es/408-thickbox_default/BOSTON.jpg"
        ]
      },
      {
        "id": "FOR.BOSTON-99-45",
        "sku": "8457780267857",
        "size": "45",
        "color": "NEGRO",
        "basePrice": 14.14,
        "images": [
          "https://forli.es/408-thickbox_default/BOSTON.jpg"
        ]
      },
      {
        "id": "FOR.BOSTON-99-46",
        "sku": "8457780267864",
        "size": "46",
        "color": "NEGRO",
        "basePrice": 14.14,
        "images": [
          "https://forli.es/408-thickbox_default/BOSTON.jpg"
        ]
      },
      {
        "id": "FOR.BOSTON-99-47",
        "sku": "8457780267871",
        "size": "47",
        "color": "NEGRO",
        "basePrice": 14.14,
        "images": [
          "https://forli.es/408-thickbox_default/BOSTON.jpg"
        ]
      },
      {
        "id": "FOR.BOSTON-99-48",
        "sku": "8457780303913",
        "size": "48",
        "color": "NEGRO",
        "basePrice": 14.14,
        "images": [
          "https://forli.es/408-thickbox_default/BOSTON.jpg"
        ]
      }
    ]
  }
];
