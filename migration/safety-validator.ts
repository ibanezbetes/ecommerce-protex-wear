/**
 * Safety Standards Cross-Validation System
 * 
 * This module provides comprehensive validation for industrial safety products,
 * ensuring logical consistency between categories, standards, and protection levels.
 * Acts as a "quality guardian" during manual data entry from PDF catalogs.
 */

import {
  IndustrialSpecifications,
  IndustrialProductSource,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ProtectionLevels,
  SafetyStandard,
  hasEN388Specification,
  hasS3Specification,
  hasVisibilitySpecification
} from './types';

export interface CrossValidationResult extends ValidationResult {
  productSku?: string;
  category?: string;
  friendlyErrors: string[];
  friendlyWarnings: string[];
}

export class SafetyValidator {
  
  /**
   * Comprehensive validation for industrial products with cross-validation logic
   */
  validateIndustrialProduct(product: IndustrialProductSource): CrossValidationResult {
    const result: CrossValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      productSku: product.sku,
      category: product.category,
      friendlyErrors: [],
      friendlyWarnings: []
    };

    // Validate basic product structure
    this.validateBasicStructure(product, result);
    
    // Cross-validate category with standards and protection levels
    this.validateCategoryStandardsConsistency(product, result);
    
    // Validate specific safety standards
    this.validateEN388Requirements(product, result);
    this.validateS3Requirements(product, result);
    this.validateVisibilityRequirements(product, result);
    
    // Validate protection level completeness
    this.validateProtectionLevelCompleteness(product, result);
    
    // Generate friendly error messages
    this.generateFriendlyMessages(result);
    
    // Determine overall validity
    result.isValid = result.errors.filter(e => e.severity === 'critical' || e.severity === 'error').length === 0;
    
    return result;
  }

  /**
   * Validate basic product structure
   */
  private validateBasicStructure(product: IndustrialProductSource, result: CrossValidationResult): void {
    if (!product.specifications) {
      result.errors.push({
        field: 'specifications',
        value: undefined,
        expectedFormat: 'IndustrialSpecifications object',
        severity: 'critical',
        message: 'Industrial product must have specifications',
        code: 'MISSING_SPECIFICATIONS'
      });
      return;
    }

    if (!product.specifications.normativas || product.specifications.normativas.length === 0) {
      result.errors.push({
        field: 'normativas',
        value: product.specifications.normativas,
        expectedFormat: 'Array of safety standards',
        severity: 'error',
        message: 'Industrial product must have at least one safety standard',
        code: 'MISSING_SAFETY_STANDARDS'
      });
    }

    if (!product.specifications.tallas || product.specifications.tallas.length === 0) {
      result.warnings.push({
        field: 'tallas',
        message: 'No sizes specified for product',
        suggestion: 'Add available sizes for the product'
      });
    }
  }

  /**
   * Cross-validate category with standards and protection levels
   */
  private validateCategoryStandardsConsistency(product: IndustrialProductSource, result: CrossValidationResult): void {
    const category = product.category?.toLowerCase() || '';
    const specs = product.specifications;
    
    if (!specs.normativas) return;

    // Hand protection validation
    if (category.includes('mano') || category.includes('guante')) {
      this.validateHandProtectionConsistency(specs, result);
    }
    
    // Foot protection validation
    if (category.includes('calzado') || category.includes('bota') || category.includes('zapato')) {
      this.validateFootProtectionConsistency(specs, result);
    }
    
    // High visibility validation
    if (category.includes('visibilidad') || category.includes('reflectante') || category.includes('chaleco')) {
      this.validateVisibilityConsistency(specs, result);
    }
    
    // Head protection validation
    if (category.includes('cabeza') || category.includes('casco')) {
      this.validateHeadProtectionConsistency(specs, result);
    }
  }

  /**
   * Validate hand protection consistency
   */
  private validateHandProtectionConsistency(specs: IndustrialSpecifications, result: CrossValidationResult): void {
    const hasEN388 = specs.normativas.some(norm => norm.includes('EN 388'));
    const hasEN420 = specs.normativas.some(norm => norm.includes('EN 420'));
    
    if (hasEN388) {
      if (!hasEN420) {
        result.warnings.push({
          field: 'normativas',
          message: 'EN 388 gloves typically also require EN 420 (general requirements)',
          suggestion: 'Consider adding EN 420 to normativas array'
        });
      }
      
      // EN 388 requires mechanical protection levels
      const levels = specs.niveles_proteccion;
      if (!levels.abrasion && !levels.corte && !levels.desgarro && !levels.puncion) {
        result.errors.push({
          field: 'niveles_proteccion',
          value: levels,
          expectedFormat: 'EN 388 protection levels (abrasion, corte, desgarro, puncion)',
          severity: 'error',
          message: 'EN 388 standard requires mechanical protection levels',
          code: 'MISSING_EN388_LEVELS'
        });
      }
    }
  }

  /**
   * Validate foot protection consistency
   */
  private validateFootProtectionConsistency(specs: IndustrialSpecifications, result: CrossValidationResult): void {
    const hasFootwearStandard = specs.normativas.some(norm => 
      norm.includes('EN ISO 20345') || norm.includes('S1') || norm.includes('S2') || 
      norm.includes('S3') || norm.includes('S4') || norm.includes('S5')
    );
    
    if (hasFootwearStandard) {
      const levels = specs.niveles_proteccion;
      
      if (!levels.categoria_calzado) {
        result.errors.push({
          field: 'niveles_proteccion.categoria_calzado',
          value: undefined,
          expectedFormat: 'S1, S2, S3, S4, or S5',
          severity: 'error',
          message: 'Safety footwear must specify category (S1-S5)',
          code: 'MISSING_FOOTWEAR_CATEGORY'
        });
      }
      
      // S3 specific requirements
      if (levels.categoria_calzado === 'S3' || specs.normativas.some(n => n === 'S3')) {
        if (!levels.energia_impacto) {
          result.warnings.push({
            field: 'niveles_proteccion.energia_impacto',
            message: 'S3 footwear should specify impact energy (typically 200J)',
            suggestion: 'Add energia_impacto value (e.g., 200)'
          });
        }
        
        if (!levels.resistencia_perforacion) {
          result.warnings.push({
            field: 'niveles_proteccion.resistencia_perforacion',
            message: 'S3 footwear should specify puncture resistance (typically 1100N)',
            suggestion: 'Add resistencia_perforacion value (e.g., 1100)'
          });
        }
      }
    }
  }

  /**
   * Validate visibility consistency
   */
  private validateVisibilityConsistency(specs: IndustrialSpecifications, result: CrossValidationResult): void {
    const hasVisibilityStandard = specs.normativas.some(norm => norm.includes('EN ISO 20471'));
    
    if (hasVisibilityStandard) {
      const levels = specs.niveles_proteccion;
      
      if (!levels.clase_visibilidad) {
        result.errors.push({
          field: 'niveles_proteccion.clase_visibilidad',
          value: undefined,
          expectedFormat: '1, 2, or 3',
          severity: 'error',
          message: 'High visibility garments must specify visibility class',
          code: 'MISSING_VISIBILITY_CLASS'
        });
      }
      
      if (!levels.ancho_banda_reflectante) {
        result.warnings.push({
          field: 'niveles_proteccion.ancho_banda_reflectante',
          message: 'High visibility garments should specify reflective tape width',
          suggestion: 'Add ancho_banda_reflectante value in mm (e.g., 50)'
        });
      }
    }
  }

  /**
   * Validate head protection consistency
   */
  private validateHeadProtectionConsistency(specs: IndustrialSpecifications, result: CrossValidationResult): void {
    const hasHeadStandard = specs.normativas.some(norm => 
      norm.includes('EN 397') || norm.includes('ANSI Z89')
    );
    
    if (hasHeadStandard) {
      // Head protection typically doesn't have numeric protection levels
      // but should have material and impact specifications in technical details
      if (!specs.detalles_tecnicos?.material && !specs.materiales) {
        result.warnings.push({
          field: 'materiales',
          message: 'Head protection should specify shell material',
          suggestion: 'Add material information (e.g., "Polietileno de alta densidad")'
        });
      }
    }
  }

  /**
   * Validate EN 388 specific requirements
   */
  private validateEN388Requirements(product: IndustrialProductSource, result: CrossValidationResult): void {
    if (!hasEN388Specification(product.specifications)) return;
    
    const levels = product.specifications.niveles_proteccion;
    const requiredLevels = ['abrasion', 'corte', 'desgarro', 'puncion'];
    const missingLevels: string[] = [];
    
    for (const level of requiredLevels) {
      if (levels[level as keyof ProtectionLevels] === undefined || levels[level as keyof ProtectionLevels] === null) {
        missingLevels.push(level);
      }
    }
    
    if (missingLevels.length > 0) {
      result.errors.push({
        field: 'niveles_proteccion',
        value: levels,
        expectedFormat: 'Complete EN 388 levels (abrasion: 1-4, corte: 1-5, desgarro: 1-4, puncion: 1-4)',
        severity: 'error',
        message: `EN 388 standard requires all protection levels. Missing: ${missingLevels.join(', ')}`,
        code: 'INCOMPLETE_EN388_LEVELS'
      });
    }
    
    // Validate level ranges
    if (levels.abrasion !== undefined && (levels.abrasion < 1 || levels.abrasion > 4)) {
      result.errors.push({
        field: 'niveles_proteccion.abrasion',
        value: levels.abrasion,
        expectedFormat: '1-4',
        severity: 'error',
        message: 'EN 388 abrasion level must be between 1 and 4',
        code: 'INVALID_ABRASION_LEVEL'
      });
    }
    
    if (levels.corte !== undefined && (levels.corte < 1 || levels.corte > 5)) {
      result.errors.push({
        field: 'niveles_proteccion.corte',
        value: levels.corte,
        expectedFormat: '1-5',
        severity: 'error',
        message: 'EN 388 cut level must be between 1 and 5',
        code: 'INVALID_CUT_LEVEL'
      });
    }
  }

  /**
   * Validate S3 specific requirements
   */
  private validateS3Requirements(product: IndustrialProductSource, result: CrossValidationResult): void {
    if (!hasS3Specification(product.specifications)) return;
    
    const levels = product.specifications.niveles_proteccion;
    
    if (levels.categoria_calzado !== 'S3') {
      result.errors.push({
        field: 'niveles_proteccion.categoria_calzado',
        value: levels.categoria_calzado,
        expectedFormat: 'S3',
        severity: 'error',
        message: 'Product with S3 standard must have categoria_calzado set to "S3"',
        code: 'INCONSISTENT_S3_CATEGORY'
      });
    }
    
    // Check for typical S3 requirements
    const expectedFeatures = ['punta de acero', 'plantilla antiperforación', 'suela antideslizante'];
    const description = product.description?.toLowerCase() || '';
    const materials = Array.isArray(product.specifications.materiales) 
      ? product.specifications.materiales.join(' ').toLowerCase()
      : (product.specifications.materiales || '').toLowerCase();
    
    const missingFeatures = expectedFeatures.filter(feature => 
      !description.includes(feature.replace(' ', '')) && !materials.includes(feature.replace(' ', ''))
    );
    
    if (missingFeatures.length > 0) {
      result.warnings.push({
        field: 'description',
        message: `S3 footwear typically includes: ${missingFeatures.join(', ')}`,
        suggestion: 'Verify product description includes S3 safety features'
      });
    }
  }

  /**
   * Validate visibility specific requirements
   */
  private validateVisibilityRequirements(product: IndustrialProductSource, result: CrossValidationResult): void {
    if (!hasVisibilitySpecification(product.specifications)) return;
    
    const levels = product.specifications.niveles_proteccion;
    
    if (!levels.clase_visibilidad || !['1', '2', '3'].includes(levels.clase_visibilidad)) {
      result.errors.push({
        field: 'niveles_proteccion.clase_visibilidad',
        value: levels.clase_visibilidad,
        expectedFormat: '1, 2, or 3',
        severity: 'error',
        message: 'EN ISO 20471 requires valid visibility class (1, 2, or 3)',
        code: 'INVALID_VISIBILITY_CLASS'
      });
    }
    
    // Check for fluorescent materials
    const materials = Array.isArray(product.specifications.materiales) 
      ? product.specifications.materiales.join(' ').toLowerCase()
      : (product.specifications.materiales || '').toLowerCase();
    
    if (!materials.includes('fluorescente') && !materials.includes('reflectante')) {
      result.warnings.push({
        field: 'materiales',
        message: 'High visibility garments typically use fluorescent or reflective materials',
        suggestion: 'Verify materials include fluorescent or reflective properties'
      });
    }
  }

  /**
   * Validate protection level completeness based on standards
   */
  private validateProtectionLevelCompleteness(product: IndustrialProductSource, result: CrossValidationResult): void {
    const specs = product.specifications;
    const levels = specs.niveles_proteccion;
    
    // Check if protection levels object is empty when standards are present
    const hasStandards = specs.normativas && specs.normativas.length > 0;
    const hasLevels = Object.keys(levels).some(key => levels[key as keyof ProtectionLevels] !== undefined);
    
    if (hasStandards && !hasLevels) {
      result.warnings.push({
        field: 'niveles_proteccion',
        message: 'Product has safety standards but no protection levels specified',
        suggestion: 'Add appropriate protection levels for the specified standards'
      });
    }
  }

  /**
   * Generate user-friendly error and warning messages
   */
  private generateFriendlyMessages(result: CrossValidationResult): void {
    const sku = result.productSku || 'Unknown';
    const category = result.category || 'Unknown Category';
    
    // Generate friendly error messages
    result.friendlyErrors = result.errors.map(error => {
      switch (error.code) {
        case 'MISSING_SPECIFICATIONS':
          return `Error en SKU [${sku}]: Producto industrial debe tener especificaciones completas`;
        
        case 'MISSING_SAFETY_STANDARDS':
          return `Error en SKU [${sku}]: Falta al menos una normativa de seguridad en el array 'normativas'`;
        
        case 'MISSING_EN388_LEVELS':
          return `Error en SKU [${sku}]: Normativa EN 388 requiere niveles de protección (abrasión, corte, desgarro, perforación)`;
        
        case 'INCOMPLETE_EN388_LEVELS':
          return `Error en SKU [${sku}]: Faltan niveles de protección EN 388. ${error.message}`;
        
        case 'INVALID_ABRASION_LEVEL':
          return `Error en SKU [${sku}]: Nivel de abrasión inválido (${error.value}). Debe ser 1-4 para EN 388`;
        
        case 'INVALID_CUT_LEVEL':
          return `Error en SKU [${sku}]: Nivel de corte inválido (${error.value}). Debe ser 1-5 para EN 388`;
        
        case 'MISSING_FOOTWEAR_CATEGORY':
          return `Error en SKU [${sku}]: Calzado de seguridad debe especificar categoría (S1, S2, S3, S4, S5)`;
        
        case 'INCONSISTENT_S3_CATEGORY':
          return `Error en SKU [${sku}]: Producto con normativa S3 debe tener categoria_calzado: "S3"`;
        
        case 'MISSING_VISIBILITY_CLASS':
          return `Error en SKU [${sku}]: Ropa de alta visibilidad debe especificar clase de visibilidad (1, 2, 3)`;
        
        case 'INVALID_VISIBILITY_CLASS':
          return `Error en SKU [${sku}]: Clase de visibilidad inválida (${error.value}). Debe ser 1, 2 o 3`;
        
        default:
          return `Error en SKU [${sku}]: ${error.message}`;
      }
    });
    
    // Generate friendly warning messages
    result.friendlyWarnings = result.warnings.map(warning => {
      return `Advertencia en SKU [${sku}]: ${warning.message}${warning.suggestion ? ` - ${warning.suggestion}` : ''}`;
    });
  }

  /**
   * Validate multiple products and return consolidated report
   */
  validateProductBatch(products: IndustrialProductSource[]): {
    totalProducts: number;
    validProducts: number;
    productsWithErrors: number;
    productsWithWarnings: number;
    allErrors: string[];
    allWarnings: string[];
    detailedResults: CrossValidationResult[];
  } {
    const results = products.map(product => this.validateIndustrialProduct(product));
    
    const allErrors = results.flatMap(r => r.friendlyErrors);
    const allWarnings = results.flatMap(r => r.friendlyWarnings);
    
    return {
      totalProducts: products.length,
      validProducts: results.filter(r => r.isValid).length,
      productsWithErrors: results.filter(r => r.errors.length > 0).length,
      productsWithWarnings: results.filter(r => r.warnings.length > 0).length,
      allErrors,
      allWarnings,
      detailedResults: results
    };
  }
}