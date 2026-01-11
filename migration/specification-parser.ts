/**
 * Enhanced Specification Parser for Industrial Products
 * 
 * This module provides parsing and validation functionality for complex
 * industrial safety equipment specifications with regulatory compliance.
 */

import {
  IndustrialSpecifications,
  SafetyStandard,
  SafetyCategory,
  ProtectionLevels,
  TechnicalDetails,
  RegulatoryInfo,
  SizeInformation,
  ParsedSpecifications,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  EN388Specification,
  S3Specification,
  VisibilitySpecification
} from './types.js';

export class SpecificationParser {
  private readonly SUPPORTED_STANDARDS = new Map<string, SafetyCategory>([
    ['EN 388', 'MECHANICAL'],
    ['EN 374', 'CHEMICAL'],
    ['EN 407', 'THERMAL'],
    ['EN 511', 'COLD'],
    ['EN 60903', 'ELECTRICAL'],
    ['EN ISO 20471', 'VISIBILITY'],
    ['EN ISO 20345', 'FOOTWEAR'],
    ['EN 149', 'RESPIRATORY'],
    ['EN 397', 'HEAD'],
    ['EN 361', 'FALL_PROTECTION'],
    ['EN 420', 'GENERAL'],
    ['CE', 'GENERAL'],
    ['ANSI Z87.1', 'GENERAL'],
    ['ANSI Z89.1', 'HEAD'],
    ['ANSI/ISEA 107', 'VISIBILITY']
  ]);

  /**
   * Parse complex specifications from various input formats
   */
  parseSpecifications(specs: Record<string, any>): ParsedSpecifications {
    const errors: ValidationError[] = [];
    const result: ParsedSpecifications = {
      safetyStandards: [],
      sizeInformation: { type: 'custom', availableSizes: [] },
      technicalDetails: {},
      protectionLevels: {},
      isValid: true,
      errors: []
    };

    try {
      // Parse safety standards
      result.safetyStandards = this.parseSafetyStandards(specs, errors);
      
      // Parse size information
      result.sizeInformation = this.parseSizeInformation(specs, errors);
      
      // Parse technical details
      result.technicalDetails = this.parseTechnicalDetails(specs, errors);
      
      // Parse protection levels
      result.protectionLevels = this.parseProtectionLevels(specs, errors);
      
      // Validate consistency between standards and protection levels
      this.validateConsistency(result, errors);
      
    } catch (error) {
      errors.push({
        field: 'specifications',
        value: specs,
        expectedFormat: 'Valid industrial specifications object',
        severity: 'critical',
        message: `Failed to parse specifications: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'PARSE_ERROR'
      });
    }

    result.errors = errors;
    result.isValid = errors.filter(e => e.severity === 'critical' || e.severity === 'error').length === 0;

    return result;
  }

  /**
   * Parse safety standards from various field names and formats
   */
  private parseSafetyStandards(specs: Record<string, any>, errors: ValidationError[]): SafetyStandard[] {
    const standards: SafetyStandard[] = [];
    
    // Try different field names for standards
    const standardFields = ['normativas', 'standards', 'safetyStandards', 'certifications'];
    let standardsArray: string[] = [];

    for (const field of standardFields) {
      if (specs[field]) {
        if (Array.isArray(specs[field])) {
          standardsArray = specs[field];
          break;
        } else if (typeof specs[field] === 'string') {
          standardsArray = [specs[field]];
          break;
        }
      }
    }

    // Parse each standard
    for (const standardCode of standardsArray) {
      if (typeof standardCode !== 'string') {
        errors.push({
          field: 'normativas',
          value: standardCode,
          expectedFormat: 'string',
          severity: 'error',
          message: 'Safety standard must be a string',
          code: 'INVALID_STANDARD_TYPE'
        });
        continue;
      }

      const category = this.SUPPORTED_STANDARDS.get(standardCode) || 'GENERAL';
      const standard: SafetyStandard = {
        code: standardCode,
        description: this.getStandardDescription(standardCode),
        mandatory: this.isMandatoryStandard(standardCode),
        category: category
      };

      // Parse specific levels for known standards
      if (standardCode === 'EN 388') {
        standard.levels = this.parseEN388Levels(specs, errors);
      } else if (standardCode.includes('EN ISO 20345')) {
        standard.levels = this.parseS3Levels(specs, errors);
      } else if (standardCode.includes('EN ISO 20471')) {
        standard.levels = this.parseVisibilityLevels(specs, errors);
      }

      standards.push(standard);
    }

    return standards;
  }

  /**
   * Parse size information from various formats
   */
  private parseSizeInformation(specs: Record<string, any>, errors: ValidationError[]): SizeInformation {
    const sizeFields = ['tallas', 'sizes', 'availableSizes'];
    let sizes: string[] = [];
    let sizeType: 'numeric' | 'alphanumeric' | 'european' | 'custom' = 'custom';

    // Find size information
    for (const field of sizeFields) {
      if (specs[field] && Array.isArray(specs[field])) {
        sizes = specs[field].map(size => String(size)).filter(size => size.trim().length > 0);
        break;
      }
    }

    // Determine size type
    if (sizes.length > 0) {
      // Remove duplicates for type detection
      const uniqueSizes = [...new Set(sizes)];
      
      if (uniqueSizes.every(size => /^\d+$/.test(size))) {
        // Check if it's European sizing (typically 35-48 for shoes)
        const numericSizes = uniqueSizes.map(s => parseInt(s));
        const isEuropeanRange = numericSizes.every(n => n >= 35 && n <= 48) && uniqueSizes.length > 1;
        sizeType = isEuropeanRange ? 'european' : 'numeric';
      } else if (uniqueSizes.every(size => /^[A-Z]+$/.test(size))) {
        sizeType = 'alphanumeric';
      }
    }

    return {
      type: sizeType,
      availableSizes: sizes,
      unisex: true // Default assumption
    };
  }

  /**
   * Parse technical details from specifications
   */
  private parseTechnicalDetails(specs: Record<string, any>, errors: ValidationError[]): TechnicalDetails {
    const details: TechnicalDetails = {};

    // Parse materials
    if (specs.materiales || specs.material || specs.materials) {
      const materialValue = specs.materiales || specs.material || specs.materials;
      if (typeof materialValue === 'string' || Array.isArray(materialValue)) {
        details.material = materialValue;
      }
    }

    // Parse weight
    if (specs.peso || specs.weight) {
      details.peso = String(specs.peso || specs.weight);
    }

    // Parse dimensions
    if (specs.dimensiones || specs.dimensions) {
      details.dimensiones = specs.dimensiones || specs.dimensions;
    }

    // Parse features
    if (specs.caracteristicas || specs.features) {
      const features = specs.caracteristicas || specs.features;
      if (Array.isArray(features)) {
        details.caracteristicas = features;
      }
    }

    // Parse usage recommendations
    if (specs.uso || specs.usage || specs.uso_recomendado) {
      const usage = specs.uso || specs.usage || specs.uso_recomendado;
      if (Array.isArray(usage)) {
        details.uso_recomendado = usage;
      }
    }

    return details;
  }

  /**
   * Parse protection levels from specifications
   */
  private parseProtectionLevels(specs: Record<string, any>, errors: ValidationError[]): ProtectionLevels {
    const levels: ProtectionLevels = {};
    
    // Get the protection levels object
    const protectionData = specs.niveles_proteccion || specs.protectionLevels || specs;

    // Parse EN 388 levels (mechanical protection)
    if (protectionData.abrasion !== undefined && protectionData.abrasion !== null) {
      levels.abrasion = this.parseNumericLevel(protectionData.abrasion, 1, 4, errors, 'abrasion');
    }
    if (protectionData.corte !== undefined && protectionData.corte !== null) {
      levels.corte = this.parseNumericLevel(protectionData.corte, 1, 5, errors, 'corte');
    }
    if (protectionData.desgarro !== undefined && protectionData.desgarro !== null) {
      levels.desgarro = this.parseNumericLevel(protectionData.desgarro, 1, 4, errors, 'desgarro');
    }
    if (protectionData.puncion !== undefined && protectionData.puncion !== null) {
      levels.puncion = this.parseNumericLevel(protectionData.puncion, 1, 4, errors, 'puncion');
    }

    // Parse footwear levels
    if (protectionData.categoria || protectionData.category || protectionData.categoria_calzado) {
      const category = protectionData.categoria || protectionData.category || protectionData.categoria_calzado;
      if (['S1', 'S2', 'S3', 'S4', 'S5'].includes(category)) {
        levels.categoria_calzado = category;
      }
    }

    if (protectionData.energia_impacto || protectionData.impactEnergy) {
      const energy = protectionData.energia_impacto || protectionData.impactEnergy;
      if (energy !== null && energy !== undefined) {
        levels.energia_impacto = Number(energy);
      }
    }

    if (protectionData.resistencia_perforacion || protectionData.punctureResistance) {
      const resistance = protectionData.resistencia_perforacion || protectionData.punctureResistance;
      if (resistance !== null && resistance !== undefined) {
        levels.resistencia_perforacion = Number(resistance);
      }
    }

    // Parse visibility levels
    if (protectionData.clase_visibilidad || protectionData.visibilityClass) {
      const visClass = protectionData.clase_visibilidad || protectionData.visibilityClass;
      if (visClass !== null && visClass !== undefined && ['1', '2', '3'].includes(String(visClass))) {
        levels.clase_visibilidad = String(visClass) as '1' | '2' | '3';
      }
    }

    if (protectionData.ancho_banda_reflectante || protectionData.reflectiveTapeWidth) {
      const width = protectionData.ancho_banda_reflectante || protectionData.reflectiveTapeWidth;
      if (width !== null && width !== undefined) {
        levels.ancho_banda_reflectante = Number(width);
      }
    }

    return levels;
  }

  /**
   * Parse numeric protection level with validation
   */
  private parseNumericLevel(
    value: any, 
    min: number, 
    max: number, 
    errors: ValidationError[], 
    field: string
  ): number | undefined {
    // Handle null values
    if (value === null || value === undefined) {
      return undefined;
    }
    
    const numValue = Number(value);
    
    if (isNaN(numValue)) {
      errors.push({
        field,
        value,
        expectedFormat: `number between ${min} and ${max}`,
        severity: 'error',
        message: `${field} must be a valid number`,
        code: 'INVALID_NUMERIC_LEVEL'
      });
      return undefined;
    }

    if (numValue < min || numValue > max) {
      errors.push({
        field,
        value: numValue,
        expectedFormat: `number between ${min} and ${max}`,
        severity: 'error',
        message: `${field} must be between ${min} and ${max}`,
        code: 'LEVEL_OUT_OF_RANGE'
      });
      return undefined;
    }

    return numValue;
  }

  /**
   * Parse EN 388 specific levels
   */
  private parseEN388Levels(specs: Record<string, any>, errors: ValidationError[]): EN388Specification | undefined {
    const levels: Partial<EN388Specification> = {};

    if (specs.abrasion !== undefined) levels.abrasion = this.parseNumericLevel(specs.abrasion, 1, 4, errors, 'abrasion');
    if (specs.cut !== undefined || specs.corte !== undefined) {
      levels.cut = this.parseNumericLevel(specs.cut || specs.corte, 1, 5, errors, 'cut');
    }
    if (specs.tear !== undefined || specs.desgarro !== undefined) {
      levels.tear = this.parseNumericLevel(specs.tear || specs.desgarro, 1, 4, errors, 'tear');
    }
    if (specs.puncture !== undefined || specs.puncion !== undefined) {
      levels.puncture = this.parseNumericLevel(specs.puncture || specs.puncion, 1, 4, errors, 'puncture');
    }

    // Parse TDM cut level
    if (specs.cutTDM && ['A', 'B', 'C', 'D', 'E', 'F'].includes(specs.cutTDM)) {
      levels.cutTDM = specs.cutTDM;
    }

    // Parse impact protection
    if (specs.impact !== undefined) {
      levels.impact = Boolean(specs.impact);
    }

    return Object.keys(levels).length > 0 ? levels as EN388Specification : undefined;
  }

  /**
   * Parse S3 footwear specific levels
   */
  private parseS3Levels(specs: Record<string, any>, errors: ValidationError[]): S3Specification | undefined {
    if (specs.categoria !== 'S3' && specs.category !== 'S3') {
      return undefined;
    }

    return {
      category: 'S3',
      steelToe: specs.punta || specs.steelToe || '200J',
      punctureResistance: specs.plantilla || specs.punctureResistance || '1100N',
      waterResistance: Boolean(specs.waterResistance || specs.resistencia_agua),
      antislip: Boolean(specs.antislip || specs.antideslizante),
      antistaticProperties: Boolean(specs.antistatic || specs.antistatico)
    };
  }

  /**
   * Parse visibility specific levels
   */
  private parseVisibilityLevels(specs: Record<string, any>, errors: ValidationError[]): VisibilitySpecification | undefined {
    const visClass = specs.clase_visibilidad || specs.visibilityClass;
    
    if (!['1', '2', '3'].includes(String(visClass))) {
      return undefined;
    }

    return {
      class: String(visClass) as '1' | '2' | '3',
      reflectiveTapeWidth: Number(specs.ancho_banda_reflectante || specs.reflectiveTapeWidth || 50),
      backgroundMaterial: specs.backgroundMaterial || 'fluorescent',
      colorOptions: specs.colorOptions || ['yellow', 'orange']
    };
  }

  /**
   * Validate consistency between standards and protection levels
   */
  private validateConsistency(result: ParsedSpecifications, errors: ValidationError[]): void {
    const hasEN388 = result.safetyStandards.some(s => s.code === 'EN 388');
    const hasEN388Levels = result.protectionLevels.abrasion !== undefined;

    if (hasEN388 && !hasEN388Levels) {
      errors.push({
        field: 'niveles_proteccion',
        value: result.protectionLevels,
        expectedFormat: 'EN 388 protection levels (abrasion, cut, tear, puncture)',
        severity: 'warning',
        message: 'EN 388 standard declared but protection levels missing',
        code: 'MISSING_PROTECTION_LEVELS'
      });
    }

    const hasFootwearStandard = result.safetyStandards.some(s => s.code.includes('EN ISO 20345'));
    const hasFootwearLevels = result.protectionLevels.categoria_calzado !== undefined;

    if (hasFootwearStandard && !hasFootwearLevels) {
      errors.push({
        field: 'niveles_proteccion',
        value: result.protectionLevels,
        expectedFormat: 'Safety footwear category (S1, S2, S3, etc.)',
        severity: 'warning',
        message: 'Footwear safety standard declared but category missing',
        code: 'MISSING_FOOTWEAR_CATEGORY'
      });
    }
  }

  /**
   * Get human-readable description for safety standard
   */
  private getStandardDescription(code: string): string {
    const descriptions: Record<string, string> = {
      'EN 388': 'Protective gloves against mechanical risks',
      'EN 374': 'Protective gloves against chemicals and micro-organisms',
      'EN 407': 'Protective gloves against thermal risks',
      'EN 511': 'Protective gloves against cold',
      'EN 60903': 'Gloves and mitts of insulating material for live working',
      'EN ISO 20471': 'High visibility clothing',
      'EN ISO 20345': 'Personal protective equipment - Safety footwear',
      'EN 149': 'Respiratory protective devices - Filtering half masks',
      'EN 397': 'Industrial safety helmets',
      'EN 361': 'Personal fall protection equipment - Full body harnesses',
      'EN 420': 'General requirements for gloves',
      'CE': 'Conformité Européenne marking',
      'ANSI Z87.1': 'Occupational and Educational Personal Eye and Face Protection',
      'ANSI Z89.1': 'Industrial Head Protection',
      'ANSI/ISEA 107': 'High-Visibility Safety Apparel'
    };

    return descriptions[code] || `Safety standard: ${code}`;
  }

  /**
   * Check if a safety standard is mandatory for the product type
   */
  private isMandatoryStandard(code: string): boolean {
    // CE marking is mandatory for EU products
    if (code === 'CE') return true;
    
    // EN standards are typically mandatory for their respective product categories
    return code.startsWith('EN');
  }

  /**
   * Validate safety standards against known standards
   */
  validateSafetyStandards(standards: string[]): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    for (const standard of standards) {
      if (!this.SUPPORTED_STANDARDS.has(standard)) {
        warnings.push({
          field: 'normativas',
          message: `Unknown safety standard: ${standard}`,
          suggestion: 'Verify the standard code is correct'
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate size information format and consistency
   */
  validateSizeInformation(sizes: string[] | Record<string, any>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (Array.isArray(sizes)) {
      if (sizes.length === 0) {
        warnings.push({
          field: 'tallas',
          message: 'No sizes specified',
          suggestion: 'Add available sizes for the product'
        });
      }

      // Check for consistent size format
      const hasNumeric = sizes.some(size => /^\d+$/.test(String(size)));
      const hasAlpha = sizes.some(size => /^[A-Z]+$/.test(String(size)));
      
      if (hasNumeric && hasAlpha) {
        warnings.push({
          field: 'tallas',
          message: 'Mixed size formats detected',
          suggestion: 'Use consistent size format (all numeric or all alphabetic)'
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}