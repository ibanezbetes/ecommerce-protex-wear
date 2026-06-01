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
    id: "12001",
    name: "Polo A.V. BERLIN",
    brand: "Anbor",
    description: "Polo de Alta Visibilidad manga corta modelo BERLIN.<br><br>Material contraste: 100% poliéster, 150 gr<br>Material flúor: 100% poliéster, 150 gr<br><br>Bolsillo en pecho izquierdo y tapeta con 3 botones. Tejido transpirable y de secado rápido con cuello de canalé.<br><br>Normativa:<br>EN ISO 13688:2013<br>EN ISO 20471:2013 clase 2",
    variants: [
      {
        id: "12001-S-AM",
        sku: "8447416030498",
        size: "S",
        color: "Amarillo/Marino",
        basePrice: 6.75,
        images: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80"]
      },
      {
        id: "12001-M-AM",
        sku: "8447416030573",
        size: "M",
        color: "Amarillo/Marino",
        basePrice: 6.75,
        images: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80"]
      },
      {
        id: "12001-L-AM",
        sku: "8447416030580",
        size: "L",
        color: "Amarillo/Marino",
        basePrice: 6.75,
        images: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80"]
      },
      {
        id: "12001-S-OR",
        sku: "8447416030771",
        size: "S",
        color: "Naranja/Marino",
        basePrice: 6.75,
        images: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80"]
      }
    ]
  },
  {
    id: "12002",
    name: "Polar A.V. ROMA",
    brand: "Anbor",
    description: "Forro polar de Alta Visibilidad ROMA.<br><br>Material contraste: 100% poliéster 280 g<br>Material flúor: 100% poliéster 280 g<br><br>Tratamiento antipilling de la cara exterior, bajo con reguladores para ajustar cintura y puño elástico. Cremallera entera con bolsillos laterales.",
    variants: [
      {
        id: "12002-S-AM",
        sku: "8447416035356",
        size: "S",
        color: "Amarillo/Gris",
        basePrice: 15.18,
        images: ["https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&auto=format&fit=crop&q=80"]
      },
      {
        id: "12002-M-AM",
        sku: "8447416035363",
        size: "M",
        color: "Amarillo/Gris",
        basePrice: 15.18,
        images: ["https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&auto=format&fit=crop&q=80"]
      },
      {
        id: "12002-L-AM",
        sku: "8447416035370",
        size: "L",
        color: "Amarillo/Gris",
        basePrice: 15.18,
        images: ["https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&auto=format&fit=crop&q=80"]
      }
    ]
  },
  {
    id: "21001",
    name: "Camiseta Premium Forli",
    brand: "Forli",
    description: "Camiseta de algodón peinado de altísima calidad.<br><br>100% algodón, 180 gr/m².<br>Doble costura en hombros y cuello para mayor durabilidad. Tratamiento pre-encogido.<br>Ideal para entornos corporativos y trabajo diario.",
    variants: [
      {
        id: "21001-S-BL",
        sku: "8447416091001",
        size: "S",
        color: "Blanco",
        basePrice: 12.50,
        images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80"]
      },
      {
        id: "21001-M-BL",
        sku: "8447416091002",
        size: "M",
        color: "Blanco",
        basePrice: 12.50,
        images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80"]
      },
      {
        id: "21001-L-BL",
        sku: "8447416091003",
        size: "L",
        color: "Blanco",
        basePrice: 12.50,
        images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80"]
      },
      {
        id: "21001-M-NE",
        sku: "8447416091004",
        size: "M",
        color: "Negro",
        basePrice: 12.50,
        images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80"]
      }
    ]
  },
  {
    id: "21002",
    name: "Chaqueta Softshell Tecno Forli",
    brand: "Forli",
    description: "Chaqueta técnica Softshell de alta resistencia contra viento y lluvia ligera.<br><br>Tejido tricapa elástico de alto rendimiento: 94% poliéster / 6% elastano. Membrana interna de TPU impermeable y micropolar interior térmico.<br>Equipada con 3 bolsillos exteriores impermeables y puños ajustables.",
    variants: [
      {
        id: "21002-S-NE",
        sku: "8447416092001",
        size: "S",
        color: "Negro",
        basePrice: 29.99,
        images: ["https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&auto=format&fit=crop&q=80"]
      },
      {
        id: "21002-M-NE",
        sku: "8447416092002",
        size: "M",
        color: "Negro",
        basePrice: 29.99,
        images: ["https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&auto=format&fit=crop&q=80"]
      },
      {
        id: "21002-L-NE",
        sku: "8447416092003",
        size: "L",
        color: "Negro",
        basePrice: 29.99,
        images: ["https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&auto=format&fit=crop&q=80"]
      },
      {
        id: "21002-XL-AZ",
        sku: "8447416092004",
        size: "XL",
        color: "Azul Marino",
        basePrice: 29.99,
        images: ["https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&auto=format&fit=crop&q=80"]
      }
    ]
  },
  {
    id: "12003",
    name: "Pantalón de Trabajo Multibolsillos Pro",
    brand: "Anbor",
    description: "Pantalón técnico multibolsillos reforzado en rodillas.<br><br>Tejido sarga resistente: 65% poliéster / 35% algodón, 240 gr.<br>Cintura elástica, costuras triples en zonas críticas y múltiples bolsillos portaherramientas.",
    variants: [
      {
        id: "12003-40-NE",
        sku: "8447416039010",
        size: "40",
        color: "Negro",
        basePrice: 18.50,
        images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80"]
      },
      {
        id: "12003-42-NE",
        sku: "8447416039011",
        size: "42",
        color: "Negro",
        basePrice: 18.50,
        images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80"]
      },
      {
        id: "12003-44-AZ",
        sku: "8447416039012",
        size: "44",
        color: "Azul Marino",
        basePrice: 18.50,
        images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80"]
      }
    ]
  },
  {
    id: "21003",
    name: "Camisa Oxford Forli Elegante",
    brand: "Forli",
    description: "Camisa formal tipo Oxford de vestir para personal corporativo y oficina.<br><br>Tejido Oxford premium de algodón mezclado de planchado fácil.<br>Cuello abotonado y puño ajustable para una apariencia profesional premium.",
    variants: [
      {
        id: "21003-M-AZ",
        sku: "8447416093001",
        size: "M",
        color: "Azul Oxford",
        basePrice: 22.00,
        images: ["https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&auto=format&fit=crop&q=80"]
      },
      {
        id: "21003-L-AZ",
        sku: "8447416093002",
        size: "L",
        color: "Azul Oxford",
        basePrice: 22.00,
        images: ["https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&auto=format&fit=crop&q=80"]
      }
    ]
  },
  {
    id: "12004",
    name: "Chaleco A.V. Múnich reflectante",
    brand: "Anbor",
    description: "Chaleco ultraligero de alta visibilidad homologado.<br><br>100% poliéster ligero tipo rejilla. Bandas reflectantes homologadas clase 2 rodeando torso completo. Cierre con velcro frontal.",
    variants: [
      {
        id: "12004-U-AM",
        sku: "8447416041001",
        size: "Única",
        color: "Amarillo Flúor",
        basePrice: 4.99,
        images: ["https://images.unsplash.com/photo-1508847154043-be12a62861c1?w=600&auto=format&fit=crop&q=80"]
      },
      {
        id: "12004-U-NA",
        sku: "8447416041002",
        size: "Única",
        color: "Naranja Flúor",
        basePrice: 4.99,
        images: ["https://images.unsplash.com/photo-1508847154043-be12a62861c1?w=600&auto=format&fit=crop&q=80"]
      }
    ]
  },
  {
    id: "21004",
    name: "Bata de Laboratorio / Industrial Forli",
    brand: "Forli",
    description: "Bata unisex clásica de uso sanitario, laboratorio o industrial.<br><br>Tejido de sarga transpirable de alta densidad: 65% poliéster / 35% algodón, 200 gr.<br>Tres bolsillos frontales tipo parche y cierre por botones cubiertos.",
    variants: [
      {
        id: "21004-M-BL",
        sku: "8447416094001",
        size: "M",
        color: "Blanco Sanitario",
        basePrice: 16.50,
        images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80"]
      },
      {
        id: "21004-L-BL",
        sku: "8447416094002",
        size: "L",
        color: "Blanco Sanitario",
        basePrice: 16.50,
        images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80"]
      }
    ]
  }
];
