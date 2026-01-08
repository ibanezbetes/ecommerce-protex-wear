/**
 * Property-Based Tests for Safety Standards Preservation and Cross-Validation
 * 
 * Feature: industrial-products-migration, Property 2: Safety Standards Preservation
 * Validates: Requirements 1.2
 * 
 * These tests ensure that safety standards are correctly preserved and that
 * cross-validation logic works properly for industrial products.
 */

import { describe, test, expect } from '@jest/globals';
import * as fc from 'fast-check';
import { SafetyValidator } from '../../migration/safety-validator';
import {
  IndustrialProductSource,
  IndustrialSpecifications,
  ProtectionLevels,
  CrossValidationResult
} from '../../migration/types';

describe('Safety Standards Preservation and Cross-Validation', () => {
  const validator = new SafetyValidator();

  // Property 2: Safety Standards Preservation
  test('Property 2: For any specification with safety standards, all regulatory compliance information is preserved', () => {
    fc.assert(
      fc.property(
        generateValidIndustrialProduct(),
        (product) => {
          const validation = validator.validateIndustrialProduct(product);
          
          // All safety standards should be preserved and validated
          expect(validation.productSku).toBe(product.sku);
          expect(validation.category).toBe(product.category);
          
          // If product has valid structure, validation should not have critical errors
          if (product.specifications && product.specifications.normativas) {
            expect(validation.errors.filter(e => e.severity === 'critical').length).toBe(0);
          }
          
          // Friendly messages should be generated
          expect(Array.isArray(validation.friendlyErrors)).toBe(true);
          expect(Array.isArray(validation.friendlyWarnings)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Cross-validation tests
  describe('Cross-Validation Logic', () => {
    test('EN 388 gloves require mechanical protection levels', () => {
      const gloveProduct: IndustrialProductSource = {
        sku: 'TEST-GLOVE-001',
        name: 'Test Glove',
        price: 15.99,
        stock: 100,
        category: 'Protección Manos',
        safetyCategory: 'EPI',
        complianceRequired: true,
        specifications: {
          normativas: ['EN 388', 'CE'],
          materiales: 'Nitrilo',
          tallas: ['8', '9', '10'],
          niveles_proteccion: {} // Missing protection levels
        }
      };

      const validation = validator.validateIndustrialProduct(gloveProduct);
      
      expect(validation.isValid).toBe(false);
      expect(validation.friendlyErrors.some(error => 
        error.includes('EN 388') && error.includes('niveles de protección')
      )).toBe(true);
    });

    test('S3 footwear requires safety category', () => {
      const shoeProduct: IndustrialProductSource = {
        sku: 'TEST-SHOE-001',
        name: 'Test Safety Shoe',
        price: 89.99,
        stock: 50,
        category: 'Calzado Seguridad',
        safetyCategory: 'EPI',
        complianceRequired: true,
        specifications: {
          normativas: ['EN ISO 20345', 'S3'],
          materiales: 'Cuero',
          tallas: ['42', '43', '44'],
          niveles_proteccion: {} // Missing category
        }
      };

      const validation = validator.validateIndustrialProduct(shoeProduct);
      
      expect(validation.isValid).toBe(false);
      expect(validation.friendlyErrors.some(error => 
        error.includes('categoría') && error.includes('S1, S2, S3')
      )).toBe(true);
    });

    test('High visibility garments require visibility class', () => {
      const vestProduct: IndustrialProductSource = {
        sku: 'TEST-VEST-001',
        name: 'Test High Visibility Vest',
        price: 24.99,
        stock: 200,
        category: 'Alta Visibilidad',
        safetyCategory: 'EPI',
        complianceRequired: true,
        specifications: {
          normativas: ['EN ISO 20471'],
          materiales: 'Poliéster fluorescente',
          tallas: ['M', 'L', 'XL'],
          niveles_proteccion: {} // Missing visibility class
        }
      };

      const validation = validator.validateIndustrialProduct(vestProduct);
      
      expect(validation.isValid).toBe(false);
      expect(validation.friendlyErrors.some(error => 
        error.includes('clase de visibilidad')
      )).toBe(true);
    });

    test('Complete EN 388 glove passes validation', () => {
      const completeGlove: IndustrialProductSource = {
        sku: 'TEST-GLOVE-COMPLETE',
        name: 'Complete Test Glove',
        price: 18.99,
        stock: 150,
        category: 'Protección Manos',
        safetyCategory: 'EPI',
        complianceRequired: true,
        specifications: {
          normativas: ['EN 388', 'EN 420', 'CE'],
          materiales: ['Nitrilo', 'Nylon'],
          tallas: ['7', '8', '9', '10', '11'],
          niveles_proteccion: {
            abrasion: 4,
            corte: 2,
            desgarro: 1,
            puncion: 3
          }
        }
      };

      const validation = validator.validateIndustrialProduct(completeGlove);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors.filter(e => e.severity === 'error' || e.severity === 'critical').length).toBe(0);
    });

    test('Complete S3 shoe passes validation', () => {
      const completeShoe: IndustrialProductSource = {
        sku: 'TEST-SHOE-COMPLETE',
        name: 'Complete S3 Safety Shoe',
        price: 95.99,
        stock: 75,
        category: 'Calzado Seguridad',
        safetyCategory: 'EPI',
        complianceRequired: true,
        specifications: {
          normativas: ['EN ISO 20345', 'S3', 'SRC'],
          materiales: 'Cuero flor hidrofugado',
          tallas: ['38', '39', '40', '41', '42', '43', '44', '45'],
          niveles_proteccion: {
            categoria_calzado: 'S3',
            energia_impacto: 200,
            resistencia_perforacion: 1100
          }
        }
      };

      const validation = validator.validateIndustrialProduct(completeShoe);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors.filter(e => e.severity === 'error' || e.severity === 'critical').length).toBe(0);
    });

    test('Invalid protection level values generate specific errors', () => {
      const invalidGlove: IndustrialProductSource = {
        sku: 'TEST-GLOVE-INVALID',
        name: 'Invalid Test Glove',
        price: 15.99,
        stock: 100,
        category: 'Protección Manos',
        safetyCategory: 'EPI',
        complianceRequired: true,
        specifications: {
          normativas: ['EN 388'],
          materiales: 'Nitrilo',
          tallas: ['8', '9'],
          niveles_proteccion: {
            abrasion: 10, // Invalid: should be 1-4
            corte: 0,     // Invalid: should be 1-5
            desgarro: 2,
            puncion: 1
          }
        }
      };

      const validation = validator.validateIndustrialProduct(invalidGlove);
      
      expect(validation.isValid).toBe(false);
      expect(validation.friendlyErrors.some(error => 
        error.includes('abrasión inválido') && error.includes('1-4')
      )).toBe(true);
    });

    test('Missing materials generate warnings', () => {
      const productWithoutMaterials: IndustrialProductSource = {
        sku: 'TEST-NO-MATERIALS',
        name: 'Product Without Materials',
        price: 25.99,
        stock: 50,
        category: 'Protección Cabeza',
        safetyCategory: 'EPI',
        complianceRequired: true,
        specifications: {
          normativas: ['EN 397'],
          materiales: '', // Empty materials
          tallas: ['Universal'],
          niveles_proteccion: {}
        }
      };

      const validation = validator.validateIndustrialProduct(productWithoutMaterials);
      
      expect(validation.warnings.length).toBeGreaterThan(0);
      expect(validation.friendlyWarnings.some(warning => 
        warning.includes('material')
      )).toBe(true);
    });
  });

  // Batch validation tests
  describe('Batch Validation', () => {
    test('Batch validation provides comprehensive report', () => {
      const products: IndustrialProductSource[] = [
        {
          sku: 'BATCH-001',
          name: 'Valid Product',
          price: 20.00,
          stock: 100,
          category: 'Protección Manos',
          safetyCategory: 'EPI',
          complianceRequired: true,
          specifications: {
            normativas: ['EN 388'],
            materiales: 'Nitrilo',
            tallas: ['8', '9'],
            niveles_proteccion: {
              abrasion: 3,
              corte: 2,
              desgarro: 1,
              puncion: 2
            }
          }
        },
        {
          sku: 'BATCH-002',
          name: 'Invalid Product',
          price: 25.00,
          stock: 50,
          category: 'Protección Manos',
          safetyCategory: 'EPI',
          complianceRequired: true,
          specifications: {
            normativas: ['EN 388'],
            materiales: 'Cuero',
            tallas: ['9'],
            niveles_proteccion: {} // Missing levels
          }
        }
      ];

      const batchResult = validator.validateProductBatch(products);
      
      expect(batchResult.totalProducts).toBe(2);
      expect(batchResult.validProducts).toBe(1);
      expect(batchResult.productsWithErrors).toBe(1);
      expect(batchResult.allErrors.length).toBeGreaterThan(0);
      expect(batchResult.detailedResults.length).toBe(2);
      
      // Check that SKUs are included in error messages
      expect(batchResult.allErrors.some(error => error.includes('BATCH-002'))).toBe(true);
    });
  });

  // Friendly error message tests
  describe('Friendly Error Messages', () => {
    test('Error messages include SKU and are in Spanish', () => {
      const product: IndustrialProductSource = {
        sku: 'ERROR-TEST-001',
        name: 'Error Test Product',
        price: 30.00,
        stock: 25,
        category: 'Protección Manos',
        safetyCategory: 'EPI',
        complianceRequired: true,
        specifications: {
          normativas: [], // Empty standards
          materiales: 'Test Material',
          tallas: ['M'],
          niveles_proteccion: {}
        }
      };

      const validation = validator.validateIndustrialProduct(product);
      
      expect(validation.isValid).toBe(false);
      expect(validation.friendlyErrors.length).toBeGreaterThan(0);
      
      // Check that error messages include SKU
      validation.friendlyErrors.forEach(error => {
        expect(error).toContain('ERROR-TEST-001');
        expect(error).toContain('Error en SKU');
      });
    });

    test('Warning messages are helpful and include suggestions', () => {
      const product: IndustrialProductSource = {
        sku: 'WARNING-TEST-001',
        name: 'Warning Test Product',
        price: 35.00,
        stock: 40,
        category: 'Protección Manos',
        safetyCategory: 'EPI',
        complianceRequired: true,
        specifications: {
          normativas: ['EN 388'], // Missing EN 420
          materiales: 'Test Material',
          tallas: ['L'],
          niveles_proteccion: {
            abrasion: 2,
            corte: 1,
            desgarro: 1,
            puncion: 1
          }
        }
      };

      const validation = validator.validateIndustrialProduct(product);
      
      expect(validation.warnings.length).toBeGreaterThan(0);
      expect(validation.friendlyWarnings.length).toBeGreaterThan(0);
      
      // Check that warning messages include SKU and suggestions
      validation.friendlyWarnings.forEach(warning => {
        expect(warning).toContain('WARNING-TEST-001');
        expect(warning).toContain('Advertencia en SKU');
      });
    });
  });
});

// Generators for property-based testing

function generateValidIndustrialProduct(): fc.Arbitrary<IndustrialProductSource> {
  return fc.record({
    sku: fc.string({ minLength: 5, maxLength: 20 }),
    name: fc.string({ minLength: 10, maxLength: 50 }),
    price: fc.float({ min: 1, max: 1000 }),
    stock: fc.integer({ min: 0, max: 1000 }),
    category: fc.oneof(
      fc.constant('Protección Manos'),
      fc.constant('Calzado Seguridad'),
      fc.constant('Alta Visibilidad'),
      fc.constant('Protección Cabeza')
    ),
    safetyCategory: fc.constant('EPI' as const),
    complianceRequired: fc.constant(true),
    specifications: generateValidSpecifications()
  });
}

function generateValidSpecifications(): fc.Arbitrary<IndustrialSpecifications> {
  return fc.record({
    normativas: fc.array(fc.oneof(
      fc.constant('EN 388'),
      fc.constant('EN 420'),
      fc.constant('EN ISO 20345'),
      fc.constant('S3'),
      fc.constant('EN ISO 20471'),
      fc.constant('CE')
    ), { minLength: 1, maxLength: 3 }),
    
    materiales: fc.oneof(
      fc.string({ minLength: 5, maxLength: 30 }),
      fc.array(fc.string({ minLength: 3, maxLength: 15 }), { minLength: 1, maxLength: 3 })
    ),
    
    tallas: fc.array(fc.oneof(
      fc.integer({ min: 6, max: 12 }).map(n => n.toString()),
      fc.oneof(fc.constant('S'), fc.constant('M'), fc.constant('L'), fc.constant('XL')),
      fc.integer({ min: 35, max: 47 }).map(n => n.toString())
    ), { minLength: 1, maxLength: 8 }),
    
    niveles_proteccion: generateValidProtectionLevels()
  });
}

function generateValidProtectionLevels(): fc.Arbitrary<ProtectionLevels> {
  return fc.record({
    abrasion: fc.option(fc.integer({ min: 1, max: 4 })),
    corte: fc.option(fc.integer({ min: 1, max: 5 })),
    desgarro: fc.option(fc.integer({ min: 1, max: 4 })),
    puncion: fc.option(fc.integer({ min: 1, max: 4 })),
    categoria_calzado: fc.option(fc.oneof(
      fc.constant('S1' as const),
      fc.constant('S2' as const),
      fc.constant('S3' as const)
    )),
    energia_impacto: fc.option(fc.integer({ min: 100, max: 200 })),
    resistencia_perforacion: fc.option(fc.integer({ min: 800, max: 1500 })),
    clase_visibilidad: fc.option(fc.oneof(
      fc.constant('1' as const),
      fc.constant('2' as const),
      fc.constant('3' as const)
    )),
    ancho_banda_reflectante: fc.option(fc.integer({ min: 25, max: 75 }))
  });
}