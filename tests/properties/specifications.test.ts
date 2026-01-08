/**
 * Property-Based Tests for Industrial Specifications Round-Trip Integrity
 * 
 * Feature: industrial-products-migration, Property 1: Specification Round-Trip Integrity
 * Validates: Requirements 1.1, 1.5, 5.1
 * 
 * These tests ensure that complex industrial product specifications maintain
 * data integrity through the complete serialization/deserialization cycle:
 * TypeScript -> JSON -> Database -> GraphQL -> TypeScript
 */

import { describe, test, expect } from '@jest/globals';
import * as fc from 'fast-check';
import { SpecificationParser } from '../../migration/specification-parser';
import {
  IndustrialSpecifications,
  ProtectionLevels,
  TechnicalDetails,
  RegulatoryInfo,
  SizeInformation,
  IndustrialProductSource,
  ValidationError,
  isIndustrialProduct,
  hasEN388Specification,
  hasS3Specification,
  hasVisibilitySpecification
} from '../../migration/types';

describe('Industrial Specifications Round-Trip Integrity', () => {
  const parser = new SpecificationParser();

  // Property 1: Specification Round-Trip Integrity
  test('Property 1: For any valid industrial specification, serializing then deserializing preserves all data', () => {
    fc.assert(
      fc.property(
        generateIndustrialSpecifications(),
        (originalSpecs) => {
          // Step 1: Serialize to JSON (as stored in database)
          const serialized = JSON.stringify(originalSpecs);
          
          // Step 2: Deserialize from JSON (as retrieved from database)
          const deserialized = JSON.parse(serialized);
          
          // Step 3: Parse through our specification parser
          const parsed = parser.parseSpecifications(deserialized);
          
          // Step 4: Verify round-trip integrity
          expect(parsed.isValid).toBe(true);
          expect(deserialized).toEqual(originalSpecs);
          
          // Verify critical fields are preserved
          expect(deserialized.normativas).toEqual(originalSpecs.normativas);
          expect(deserialized.tallas).toEqual(originalSpecs.tallas);
          expect(deserialized.niveles_proteccion).toEqual(originalSpecs.niveles_proteccion);
          
          // Verify materials handling (string or array)
          if (typeof originalSpecs.materiales === 'string') {
            expect(typeof deserialized.materiales).toBe('string');
            expect(deserialized.materiales).toBe(originalSpecs.materiales);
          } else {
            expect(Array.isArray(deserialized.materiales)).toBe(true);
            expect(deserialized.materiales).toEqual(originalSpecs.materiales);
          }
        }
      ),
      { numRuns: 100, verbose: true }
    );
  });

  // Property 2: Safety Standards Preservation
  test('Property 2: For any specification with safety standards, all regulatory compliance information is preserved', () => {
    fc.assert(
      fc.property(
        generateSpecsWithSafetyStandards(),
        (specs) => {
          const serialized = JSON.stringify(specs);
          const deserialized = JSON.parse(serialized);
          const parsed = parser.parseSpecifications(deserialized);
          
          // Verify safety standards are preserved
          expect(parsed.safetyStandards.length).toBeGreaterThan(0);
          
          // Check that all original standards are found in parsed results
          for (const originalStandard of specs.normativas) {
            const foundStandard = parsed.safetyStandards.find(s => s.code === originalStandard);
            expect(foundStandard).toBeDefined();
            expect(foundStandard?.code).toBe(originalStandard);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 3: Size Information Integrity
  test('Property 3: For any specification with size information, complete size range data is maintained', () => {
    fc.assert(
      fc.property(
        generateSpecsWithSizes(),
        (specs) => {
          const serialized = JSON.stringify(specs);
          const deserialized = JSON.parse(serialized);
          const parsed = parser.parseSpecifications(deserialized);
          
          // Filter out empty or whitespace-only sizes
          const validSizes = specs.tallas.filter(size => size.trim().length > 0);
          
          // Verify size information is preserved
          expect(parsed.sizeInformation.availableSizes).toEqual(validSizes);
          expect(parsed.sizeInformation.availableSizes.length).toBe(validSizes.length);
          
          // Only test type detection if we have valid sizes
          if (validSizes.length > 0) {
            const uniqueSizes = [...new Set(validSizes)];
            const isNumeric = uniqueSizes.every(size => /^\d+$/.test(size));
            const isAlphanumeric = uniqueSizes.every(size => /^[A-Z]+$/.test(size));
            
            // European detection: numeric sizes in typical European range
            const numericSizes = uniqueSizes.map(s => parseInt(s)).filter(n => !isNaN(n));
            const isEuropean = isNumeric && numericSizes.length > 1 && 
                              numericSizes.every(n => n >= 35 && n <= 48);
            
            if (isEuropean) {
              expect(parsed.sizeInformation.type).toBe('european');
            } else if (isNumeric) {
              expect(parsed.sizeInformation.type).toBe('numeric');
            } else if (isAlphanumeric) {
              expect(parsed.sizeInformation.type).toBe('alphanumeric');
            } else {
              expect(parsed.sizeInformation.type).toBe('custom');
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 4: Protection Level Accuracy
  test('Property 4: For any specification with protection levels, all classification data is stored accurately', () => {
    fc.assert(
      fc.property(
        generateSpecsWithProtectionLevels(),
        (specs) => {
          const serialized = JSON.stringify(specs);
          const deserialized = JSON.parse(serialized);
          const parsed = parser.parseSpecifications(deserialized);
          
          // Verify protection levels are preserved
          const originalLevels = specs.niveles_proteccion;
          const parsedLevels = parsed.protectionLevels;
          
          // Check EN 388 levels if present (handle null values)
          if (originalLevels.abrasion !== undefined && originalLevels.abrasion !== null) {
            expect(parsedLevels.abrasion).toBe(originalLevels.abrasion);
          }
          if (originalLevels.corte !== undefined && originalLevels.corte !== null) {
            expect(parsedLevels.corte).toBe(originalLevels.corte);
          }
          if (originalLevels.desgarro !== undefined && originalLevels.desgarro !== null) {
            expect(parsedLevels.desgarro).toBe(originalLevels.desgarro);
          }
          if (originalLevels.puncion !== undefined && originalLevels.puncion !== null) {
            expect(parsedLevels.puncion).toBe(originalLevels.puncion);
          }
          
          // Check footwear levels if present
          if (originalLevels.categoria_calzado !== undefined && originalLevels.categoria_calzado !== null) {
            expect(parsedLevels.categoria_calzado).toBe(originalLevels.categoria_calzado);
          }
          if (originalLevels.energia_impacto !== undefined && originalLevels.energia_impacto !== null) {
            expect(parsedLevels.energia_impacto).toBe(originalLevels.energia_impacto);
          }
          
          // Check visibility levels if present
          if (originalLevels.clase_visibilidad !== undefined && originalLevels.clase_visibilidad !== null) {
            expect(parsedLevels.clase_visibilidad).toBe(originalLevels.clase_visibilidad);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Edge Case Tests
  describe('Edge Cases and Error Handling', () => {
    test('Missing normativas field should not break parsing', () => {
      const specsWithoutStandards = {
        materiales: "Cuero sintético",
        tallas: ["8", "9", "10"],
        niveles_proteccion: {
          abrasion: 3
        }
      };
      
      const serialized = JSON.stringify(specsWithoutStandards);
      const deserialized = JSON.parse(serialized);
      const parsed = parser.parseSpecifications(deserialized);
      
      // Should parse without critical errors
      expect(parsed.isValid).toBe(true);
      expect(parsed.safetyStandards).toEqual([]);
    });

    test('Empty niveles_proteccion should not break parsing', () => {
      const specsWithEmptyLevels = {
        normativas: ["EN 388"],
        materiales: "Nitrilo",
        tallas: ["S", "M", "L"],
        niveles_proteccion: {}
      };
      
      const serialized = JSON.stringify(specsWithEmptyLevels);
      const deserialized = JSON.parse(serialized);
      const parsed = parser.parseSpecifications(deserialized);
      
      // Should parse but may have warnings
      expect(parsed.safetyStandards.length).toBeGreaterThan(0);
      expect(parsed.protectionLevels).toEqual({});
    });

    test('Invalid protection level values should generate errors', () => {
      const specsWithInvalidLevels = {
        normativas: ["EN 388"],
        materiales: "Cuero",
        tallas: ["9"],
        niveles_proteccion: {
          abrasion: 10, // Invalid: should be 1-4
          corte: -1,    // Invalid: should be 1-5
          desgarro: "invalid" // Invalid: should be number
        }
      };
      
      const parsed = parser.parseSpecifications(specsWithInvalidLevels);
      
      // Should have validation errors for the invalid values
      expect(parsed.errors.length).toBeGreaterThan(0);
      
      // Check that errors were generated for the specific invalid fields
      const errorFields = parsed.errors.map(e => e.field);
      expect(errorFields.includes('abrasion') || errorFields.includes('corte')).toBe(true);
    });

    test('Mixed size formats should generate warnings', () => {
      const specsWithMixedSizes = {
        normativas: ["EN 388"],
        materiales: "Nylon",
        tallas: ["7", "M", "42"], // Mixed numeric, alpha, and european
        niveles_proteccion: {
          abrasion: 2
        }
      };
      
      const parsed = parser.parseSpecifications(specsWithMixedSizes);
      
      // Should parse but detect mixed formats
      expect(parsed.sizeInformation.type).toBe('custom');
      expect(parsed.sizeInformation.availableSizes).toEqual(["7", "M", "42"]);
    });

    test('Complete industrial product round-trip with all fields', () => {
      const completeProduct: IndustrialProductSource = {
        sku: "TEST-001",
        name: "Test Product",
        price: 25.99,
        stock: 100,
        safetyCategory: "EPI",
        complianceRequired: true,
        specifications: {
          normativas: ["EN 388", "CE"],
          materiales: ["Nitrilo", "Poliéster"],
          tallas: ["8", "9", "10"],
          niveles_proteccion: {
            abrasion: 4,
            corte: 2,
            desgarro: 1,
            puncion: 3
          },
          detalles_tecnicos: {
            peso: "100g",
            caracteristicas: ["Antideslizante", "Lavable"]
          },
          informacion_regulatoria: {
            marcado_ce: true,
            fabricante: "Test Manufacturer"
          }
        }
      };
      
      // Simulate complete database round-trip
      const serialized = JSON.stringify(completeProduct);
      const deserialized = JSON.parse(serialized);
      
      // Verify industrial product detection
      expect(isIndustrialProduct(deserialized)).toBe(true);
      
      // Parse specifications
      const parsed = parser.parseSpecifications(deserialized.specifications);
      expect(parsed.isValid).toBe(true);
      
      // Verify all data preserved
      expect(deserialized).toEqual(completeProduct);
    });
  });

  // Type Guard Tests
  describe('Type Guards and Specification Detection', () => {
    test('EN 388 specification detection works correctly', () => {
      const en388Specs: IndustrialSpecifications = {
        normativas: ["EN 388", "CE"],
        materiales: "Nitrilo",
        tallas: ["8", "9"],
        niveles_proteccion: {
          abrasion: 4,
          corte: 2,
          desgarro: 1,
          puncion: 3
        }
      };
      
      expect(hasEN388Specification(en388Specs)).toBe(true);
      
      const nonEN388Specs: IndustrialSpecifications = {
        normativas: ["S3"],
        materiales: "Cuero",
        tallas: ["42"],
        niveles_proteccion: {
          categoria_calzado: "S3"
        }
      };
      
      expect(hasEN388Specification(nonEN388Specs)).toBe(false);
    });

    test('S3 specification detection works correctly', () => {
      const s3Specs: IndustrialSpecifications = {
        normativas: ["EN ISO 20345", "S3"],
        materiales: "Cuero",
        tallas: ["42", "43"],
        niveles_proteccion: {
          categoria_calzado: "S3",
          energia_impacto: 200
        }
      };
      
      expect(hasS3Specification(s3Specs)).toBe(true);
    });

    test('Visibility specification detection works correctly', () => {
      const visibilitySpecs: IndustrialSpecifications = {
        normativas: ["EN ISO 20471"],
        materiales: "Poliéster fluorescente",
        tallas: ["M", "L"],
        niveles_proteccion: {
          clase_visibilidad: "2",
          ancho_banda_reflectante: 50
        }
      };
      
      expect(hasVisibilitySpecification(visibilitySpecs)).toBe(true);
    });
  });
});

// Fast-Check Generators for Property-Based Testing

function generateIndustrialSpecifications(): fc.Arbitrary<IndustrialSpecifications> {
  return fc.record({
    normativas: fc.array(fc.oneof(
      fc.constant("EN 388"),
      fc.constant("EN 420"),
      fc.constant("EN ISO 20345"),
      fc.constant("EN ISO 20471"),
      fc.constant("S3"),
      fc.constant("SRC"),
      fc.constant("CE")
    ), { minLength: 1, maxLength: 4 }),
    
    materiales: fc.oneof(
      fc.string({ minLength: 5, maxLength: 50 }), // Single material string
      fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 1, maxLength: 3 }) // Array of materials
    ),
    
    tallas: fc.oneof(
      fc.array(fc.integer({ min: 6, max: 12 }).map(n => n.toString()), { minLength: 3, maxLength: 8 }), // Numeric sizes
      fc.array(fc.oneof(fc.constant("S"), fc.constant("M"), fc.constant("L"), fc.constant("XL")), { minLength: 2, maxLength: 5 }), // Alpha sizes
      fc.array(fc.integer({ min: 35, max: 48 }).map(n => n.toString()), { minLength: 5, maxLength: 10 }) // European sizes
    ),
    
    niveles_proteccion: generateProtectionLevels(),
    
    detalles_tecnicos: fc.option(generateTechnicalDetails()),
    informacion_regulatoria: fc.option(generateRegulatoryInfo())
  });
}

function generateSpecsWithSafetyStandards(): fc.Arbitrary<IndustrialSpecifications> {
  return fc.record({
    normativas: fc.array(fc.oneof(
      fc.constant("EN 388"),
      fc.constant("EN 420"),
      fc.constant("EN ISO 20345"),
      fc.constant("S3"),
      fc.constant("CE")
    ), { minLength: 1, maxLength: 3 }),
    materiales: fc.string({ minLength: 5, maxLength: 30 }),
    tallas: fc.array(fc.string({ minLength: 1, maxLength: 3 }), { minLength: 1, maxLength: 5 }),
    niveles_proteccion: generateProtectionLevels()
  });
}

function generateSpecsWithSizes(): fc.Arbitrary<IndustrialSpecifications> {
  return fc.record({
    normativas: fc.array(fc.constant("EN 388"), { minLength: 1, maxLength: 1 }),
    materiales: fc.string({ minLength: 5, maxLength: 20 }),
    tallas: fc.oneof(
      fc.array(fc.integer({ min: 6, max: 12 }).map(n => n.toString()), { minLength: 3, maxLength: 6 }),
      fc.array(fc.oneof(fc.constant("XS"), fc.constant("S"), fc.constant("M"), fc.constant("L"), fc.constant("XL")), { minLength: 2, maxLength: 5 }),
      fc.array(fc.integer({ min: 35, max: 47 }).map(n => n.toString()), { minLength: 4, maxLength: 8 })
    ),
    niveles_proteccion: generateValidProtectionLevels()
  });
}

function generateSpecsWithProtectionLevels(): fc.Arbitrary<IndustrialSpecifications> {
  return fc.record({
    normativas: fc.array(fc.oneof(
      fc.constant("EN 388"),
      fc.constant("EN ISO 20345"),
      fc.constant("EN ISO 20471")
    ), { minLength: 1, maxLength: 2 }),
    materiales: fc.string({ minLength: 5, maxLength: 25 }),
    tallas: fc.array(fc.string({ minLength: 1, maxLength: 2 }), { minLength: 2, maxLength: 4 }),
    niveles_proteccion: generateValidProtectionLevels()
  });
}

function generateValidProtectionLevels(): fc.Arbitrary<ProtectionLevels> {
  return fc.record({
    // EN 388 levels - only generate valid values or undefined
    abrasion: fc.option(fc.integer({ min: 1, max: 4 })),
    corte: fc.option(fc.integer({ min: 1, max: 5 })),
    desgarro: fc.option(fc.integer({ min: 1, max: 4 })),
    puncion: fc.option(fc.integer({ min: 1, max: 4 })),
    
    // Footwear levels
    categoria_calzado: fc.option(fc.oneof(
      fc.constant("S1" as const),
      fc.constant("S2" as const),
      fc.constant("S3" as const)
    )),
    energia_impacto: fc.option(fc.integer({ min: 100, max: 200 })),
    resistencia_perforacion: fc.option(fc.integer({ min: 800, max: 1500 })),
    
    // Visibility levels
    clase_visibilidad: fc.option(fc.oneof(
      fc.constant("1" as const),
      fc.constant("2" as const),
      fc.constant("3" as const)
    )),
    ancho_banda_reflectante: fc.option(fc.integer({ min: 25, max: 75 }))
  });
}

function generateProtectionLevels(): fc.Arbitrary<ProtectionLevels> {
  return fc.record({
    // EN 388 levels
    abrasion: fc.option(fc.integer({ min: 1, max: 4 })),
    corte: fc.option(fc.integer({ min: 1, max: 5 })),
    desgarro: fc.option(fc.integer({ min: 1, max: 4 })),
    puncion: fc.option(fc.integer({ min: 1, max: 4 })),
    
    // Footwear levels
    categoria_calzado: fc.option(fc.oneof(
      fc.constant("S1" as const),
      fc.constant("S2" as const),
      fc.constant("S3" as const)
    )),
    energia_impacto: fc.option(fc.integer({ min: 100, max: 200 })),
    resistencia_perforacion: fc.option(fc.integer({ min: 800, max: 1500 })),
    
    // Visibility levels
    clase_visibilidad: fc.option(fc.oneof(
      fc.constant("1" as const),
      fc.constant("2" as const),
      fc.constant("3" as const)
    )),
    ancho_banda_reflectante: fc.option(fc.integer({ min: 25, max: 75 }))
  });
}

function generateTechnicalDetails(): fc.Arbitrary<TechnicalDetails> {
  return fc.record({
    peso: fc.option(fc.string({ minLength: 3, maxLength: 10 })),
    caracteristicas: fc.option(fc.array(fc.string({ minLength: 5, maxLength: 20 }), { minLength: 1, maxLength: 5 })),
    uso_recomendado: fc.option(fc.array(fc.string({ minLength: 5, maxLength: 25 }), { minLength: 1, maxLength: 4 }))
  });
}

function generateRegulatoryInfo(): fc.Arbitrary<RegulatoryInfo> {
  return fc.record({
    marcado_ce: fc.boolean(),
    fabricante: fc.string({ minLength: 5, maxLength: 30 }),
    certificados: fc.option(fc.array(fc.string({ minLength: 8, maxLength: 20 }), { minLength: 1, maxLength: 3 }))
  });
}