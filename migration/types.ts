/**
 * Enhanced Types for Industrial Products Migration
 * 
 * This file defines TypeScript interfaces for handling complex industrial
 * safety equipment (EPIs) with comprehensive regulatory compliance data.
 */

// Base product interface (extends existing ProductSource)
export interface ProductSource {
  sku: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  subcategory?: string;
  brand?: string;
  imageUrl?: string;
  imageUrls?: string[];
  specifications?: Record<string, any>;
  isActive?: boolean;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  tags?: string[];
}

// Enhanced industrial product interface
export interface IndustrialProductSource extends ProductSource {
  specifications: IndustrialSpecifications;
  safetyCategory: 'EPI' | 'STANDARD';
  complianceRequired: boolean;
}

// Comprehensive specifications for industrial products
export interface IndustrialSpecifications {
  // Safety Standards - array of regulatory compliance codes
  normativas: string[]; // e.g., ['EN 388', 'Cat II', 'CE']
  
  // Materials - flexible string or array format
  materiales: string | string[]; // e.g., "Cuero sintético" or ["Nylon", "Poliéster"]
  
  // Sizes - array of available sizes
  tallas: string[]; // e.g., ["7", "8", "9"] or ["S", "M", "L"]
  
  // Protection levels - key-value object for performance ratings
  niveles_proteccion: ProtectionLevels;
  
  // Additional technical specifications (optional)
  detalles_tecnicos?: TechnicalDetails;
  
  // Regulatory information (optional)
  informacion_regulatoria?: RegulatoryInfo;
}

// Protection levels with specific performance ratings
export interface ProtectionLevels {
  // EN 388 Mechanical protection levels (1-5 scale)
  abrasion?: number; // Abrasion resistance (1-4)
  corte?: number; // Cut resistance (1-5)
  desgarro?: number; // Tear resistance (1-4)
  puncion?: number; // Puncture resistance (1-4)
  
  // EN ISO 20345 Safety footwear levels
  categoria_calzado?: 'S1' | 'S2' | 'S3' | 'S4' | 'S5'; // Safety category
  energia_impacto?: number; // Impact energy in Joules (e.g., 200)
  resistencia_perforacion?: number; // Puncture resistance in Newtons (e.g., 1100)
  
  // EN ISO 20471 High visibility levels
  clase_visibilidad?: '1' | '2' | '3'; // Visibility class
  ancho_banda_reflectante?: number; // Reflective tape width in mm
  
  // Custom protection levels for specific products
  [key: string]: string | number | undefined;
}

// Technical details structure
export interface TechnicalDetails {
  peso?: string; // Weight specification
  dimensiones?: Record<string, number>; // Dimensions object
  caracteristicas?: string[]; // Feature list
  uso_recomendado?: string[]; // Recommended usage
  temperatura_trabajo?: {
    minima?: number;
    maxima?: number;
  };
  resistencia_quimica?: boolean;
  antistatico?: boolean;
  [key: string]: any; // Allow additional custom fields
}

// Regulatory compliance information
export interface RegulatoryInfo {
  marcado_ce: boolean; // CE marking compliance
  fabricante: string; // Manufacturer information
  fecha_fabricacion?: string; // Manufacturing date
  fecha_caducidad?: string; // Expiration date (if applicable)
  certificados?: string[]; // Certificate numbers
  laboratorio_ensayo?: string; // Testing laboratory
}

// Safety standard definitions
export interface SafetyStandard {
  code: string; // Standard code (e.g., "EN 388")
  description: string; // Human-readable description
  levels?: Record<string, any>; // Specific performance levels
  mandatory: boolean; // Whether this standard is required
  category: SafetyCategory; // Category of safety standard
}

// Safety categories for different types of protection
export type SafetyCategory = 
  | 'MECHANICAL' // EN 388 - Mechanical risks
  | 'CHEMICAL' // EN 374 - Chemical protection
  | 'THERMAL' // EN 407 - Heat protection
  | 'COLD' // EN 511 - Cold protection
  | 'ELECTRICAL' // EN 60903 - Electrical protection
  | 'VISIBILITY' // EN ISO 20471 - High visibility
  | 'FOOTWEAR' // EN ISO 20345 - Safety footwear
  | 'RESPIRATORY' // EN 149 - Respiratory protection
  | 'HEAD' // EN 397 - Head protection
  | 'FALL_PROTECTION' // EN 361 - Fall protection
  | 'GENERAL'; // General safety requirements

// Size information with different formats
export interface SizeInformation {
  type: 'numeric' | 'alphanumeric' | 'european' | 'custom';
  availableSizes: string[];
  sizeChart?: Record<string, any>; // Optional size chart mapping
  unisex?: boolean; // Whether sizes are unisex
}

// Validation result interfaces
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  value: any;
  expectedFormat: string;
  severity: 'warning' | 'error' | 'critical';
  message: string;
  code: string; // Error code for programmatic handling
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// Migration statistics interface
export interface MigrationStats {
  totalProducts: number;
  successfulInserts: number;
  failedInserts: number;
  errors: Array<{
    sku: string;
    error: string;
    category?: string;
  }>;
  warnings: Array<{
    sku: string;
    warning: string;
  }>;
  processingTime: number; // Processing time in milliseconds
}

// Parsed specifications result
export interface ParsedSpecifications {
  safetyStandards: SafetyStandard[];
  sizeInformation: SizeInformation;
  technicalDetails: TechnicalDetails;
  protectionLevels: ProtectionLevels;
  isValid: boolean;
  errors: ValidationError[];
}

// Image validation interfaces
export interface ImageValidationResult {
  isValid: boolean;
  validUrls: string[];
  invalidUrls: ImageError[];
  fallbackUrls: string[];
}

export interface ImageError {
  url: string;
  errorType: 'invalid_format' | 'unreachable' | 'too_large' | 'missing' | 'malformed';
  fallbackAction: 'use_placeholder' | 'skip_image' | 'fail_product';
  message: string;
}

// Storage recommendations
export interface StorageRecommendations {
  developmentPath: string;
  productionPath: string;
  supportedFormats: string[];
  maxFileSize: number; // in bytes
  recommendedDimensions: {
    width: number;
    height: number;
  };
  namingConvention: string;
}

// Template generation interfaces
export interface TemplateProduct {
  category: 'glove' | 'shoe' | 'visibility_garment';
  example: IndustrialProductSource;
  description: string;
}

export interface TemplateGenerationResult {
  products: TemplateProduct[];
  metadata: {
    generatedAt: string;
    version: string;
    totalExamples: number;
  };
}

// EN 388 specific interface for gloves
export interface EN388Specification {
  abrasion: number; // 1-4
  cut: number; // 1-5
  tear: number; // 1-4
  puncture: number; // 1-4
  cutTDM?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'; // TDM cut test result
  impact?: boolean; // Impact protection
}

// S3 specific interface for safety footwear
export interface S3Specification {
  category: 'S3';
  steelToe: string; // e.g., "200J"
  punctureResistance: string; // e.g., "1100N"
  waterResistance: boolean;
  antislip: boolean;
  antistaticProperties: boolean;
}

// High visibility specific interface
export interface VisibilitySpecification {
  class: '1' | '2' | '3';
  reflectiveTapeWidth: number; // in mm
  backgroundMaterial: 'fluorescent' | 'retroreflective';
  colorOptions: string[];
}

// Type guards for runtime type checking
export function isIndustrialProduct(product: ProductSource): product is IndustrialProductSource {
  return 'safetyCategory' in product && 'complianceRequired' in product;
}

export function hasEN388Specification(specs: IndustrialSpecifications): boolean {
  return specs.normativas.some(norm => norm.includes('EN 388')) &&
         typeof specs.niveles_proteccion.abrasion === 'number';
}

export function hasS3Specification(specs: IndustrialSpecifications): boolean {
  return specs.normativas.some(norm => norm.includes('EN ISO 20345')) &&
         specs.niveles_proteccion.categoria_calzado === 'S3';
}

export function hasVisibilitySpecification(specs: IndustrialSpecifications): boolean {
  return specs.normativas.some(norm => norm.includes('EN ISO 20471')) &&
         typeof specs.niveles_proteccion.clase_visibilidad === 'string';
}