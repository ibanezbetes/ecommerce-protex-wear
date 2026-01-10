import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { Schema } from '../amplify/data/resource';

import { 
  ProductSource, 
  IndustrialProductSource, 
  IndustrialSpecifications,
  MigrationStats,
  ValidationError,
  isIndustrialProduct 
} from './types';
import { SpecificationParser } from './specification-parser';
import { SafetyValidator } from './safety-validator';

// Import Amplify configuration
import amplifyOutputs from '../amplify_outputs.json';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Protex Wear - Data Migration Script
 * 
 * This script reads product data from migration/products_source.json
 * and bulk inserts it into the Amplify GraphQL API.
 * 
 * Usage:
 *   npm run seed
 * 
 * Requirements:
 *   - amplify_outputs.json must exist (run sandbox first)
 *   - products_source.json must exist in migration/ directory
 */

// Configure Amplify
Amplify.configure(amplifyOutputs);

// Generate GraphQL client with API Key authentication
const client = generateClient<Schema>({
  authMode: 'apiKey'
});

// Initialize specification parser and safety validator
const specificationParser = new SpecificationParser();
const safetyValidator = new SafetyValidator();

// Note: ProductSource and MigrationStats interfaces are now imported from types.ts

/**
 * Read products data from JSON file
 */
function readProductsData(): ProductSource[] {
  try {
    const filePath = join(__dirname, 'products_source.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    if (!Array.isArray(data)) {
      throw new Error('Products data must be an array');
    }
    
    console.log(`📖 Loaded ${data.length} products from products_source.json`);
    return data;
  } catch (error) {
    console.error('❌ Error reading products data:', error);
    throw error;
  }
}

/**
 * Enhanced product validation with industrial specifications support and safety validation
 */
function validateProduct(product: ProductSource): string[] {
  const errors: string[] = [];
  
  if (!product.sku || typeof product.sku !== 'string') {
    errors.push('SKU is required and must be a string');
  }
  
  if (!product.name || typeof product.name !== 'string') {
    errors.push('Name is required and must be a string');
  }
  
  if (typeof product.price !== 'number' || product.price < 0) {
    errors.push('Price is required and must be a positive number');
  }
  
  if (typeof product.stock !== 'number' || product.stock < 0) {
    errors.push('Stock is required and must be a non-negative number');
  }

  // Enhanced validation for industrial products with safety validation
  if (isIndustrialProduct(product)) {
    if (!product.safetyCategory) {
      errors.push('Safety category is required for industrial products');
    }
    
    if (product.complianceRequired && product.specifications) {
      // Parse specifications first
      const parsedSpecs = specificationParser.parseSpecifications(product.specifications);
      if (!parsedSpecs.isValid) {
        const criticalErrors = parsedSpecs.errors.filter(e => e.severity === 'critical' || e.severity === 'error');
        errors.push(...criticalErrors.map(e => e.message));
      }
      
      // Perform comprehensive safety validation
      const safetyValidation = safetyValidator.validateIndustrialProduct(product);
      if (!safetyValidation.isValid) {
        // Add friendly error messages for better user experience
        errors.push(...safetyValidation.friendlyErrors);
      }
      
      // Log warnings for user awareness (but don't fail validation)
      if (safetyValidation.friendlyWarnings.length > 0) {
        console.warn(`⚠️  Safety warnings for ${product.sku}:`);
        safetyValidation.friendlyWarnings.forEach(warning => {
          console.warn(`   ${warning}`);
        });
      }
    }
  }
  
  return errors;
}

/**
 * Enhanced product insertion with specification parsing
 */
async function insertProduct(product: ProductSource): Promise<boolean> {
  try {
    // Validate product data
    const validationErrors = validateProduct(product);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    
    // Parse and enhance specifications for industrial products
    let processedSpecifications = product.specifications;
    
    if (isIndustrialProduct(product) && product.specifications) {
      const parsedSpecs = specificationParser.parseSpecifications(product.specifications);
      
      // Log warnings but continue processing
      if (parsedSpecs.errors.length > 0) {
        const warnings = parsedSpecs.errors.filter(e => e.severity === 'warning');
        if (warnings.length > 0) {
          console.warn(`⚠️  Warnings for product ${product.sku}:`, warnings.map(w => w.message).join(', '));
        }
      }
      
      // Enhance specifications with parsed data
      processedSpecifications = {
        ...product.specifications,
        _parsed: {
          safetyStandards: parsedSpecs.safetyStandards,
          sizeInformation: parsedSpecs.sizeInformation,
          protectionLevels: parsedSpecs.protectionLevels,
          technicalDetails: parsedSpecs.technicalDetails
        }
      };
    }
    
    // Create product in database
    const result = await client.models.Product.create({
      sku: product.sku,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      subcategory: product.subcategory,
      brand: product.brand,
      imageUrl: product.imageUrl,
      imageUrls: product.imageUrls,
      specifications: processedSpecifications ? JSON.stringify(processedSpecifications) : undefined,
      isActive: product.isActive ?? true,
      weight: product.weight,
      dimensions: product.dimensions ? JSON.stringify(product.dimensions) : undefined,
      tags: product.tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    if (result.errors && result.errors.length > 0) {
      throw new Error(`GraphQL errors: ${result.errors.map(e => e.message).join(', ')}`);
    }
    
    // Enhanced logging for industrial products
    if (isIndustrialProduct(product)) {
      console.log(`✅ Successfully inserted EPI product: ${product.sku} - ${product.name} (${product.safetyCategory})`);
    } else {
      console.log(`✅ Successfully inserted product: ${product.sku} - ${product.name}`);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to insert product ${product.sku}:`, error);
    return false;
  }
}

/**
 * Enhanced bulk insert with improved error handling and progress reporting
 */
async function bulkInsertProducts(products: ProductSource[]): Promise<MigrationStats> {
  const startTime = Date.now();
  const stats: MigrationStats = {
    totalProducts: products.length,
    successfulInserts: 0,
    failedInserts: 0,
    errors: [],
    warnings: [],
    processingTime: 0
  };
  
  console.log(`🚀 Starting bulk insert of ${products.length} products...`);
  
  // Count industrial vs standard products
  const industrialCount = products.filter(p => isIndustrialProduct(p)).length;
  const standardCount = products.length - industrialCount;
  
  if (industrialCount > 0) {
    console.log(`📋 Product breakdown: ${industrialCount} EPI products, ${standardCount} standard products`);
  }
  
  console.log('📊 Progress:');
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    
    try {
      const success = await insertProduct(product);
      
      if (success) {
        stats.successfulInserts++;
      } else {
        stats.failedInserts++;
        stats.errors.push({
          sku: product.sku,
          error: 'Insert operation failed',
          category: isIndustrialProduct(product) ? product.safetyCategory : undefined
        });
      }
    } catch (error) {
      stats.failedInserts++;
      stats.errors.push({
        sku: product.sku,
        error: error instanceof Error ? error.message : 'Unknown error',
        category: isIndustrialProduct(product) ? product.safetyCategory : undefined
      });
    }
    
    // Enhanced progress reporting
    const progress = Math.round(((i + 1) / products.length) * 100);
    if ((i + 1) % 10 === 0 || i === products.length - 1) {
      const elapsed = Date.now() - startTime;
      const rate = (i + 1) / (elapsed / 1000);
      console.log(`   ${progress}% complete (${i + 1}/${products.length}) - ${rate.toFixed(1)} products/sec`);
    }
    
    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  stats.processingTime = Date.now() - startTime;
  return stats;
}

/**
 * Enhanced statistics printing with industrial product details
 */
function printStats(stats: MigrationStats): void {
  console.log('\n📈 Migration Statistics:');
  console.log(`   Total products: ${stats.totalProducts}`);
  console.log(`   ✅ Successful inserts: ${stats.successfulInserts}`);
  console.log(`   ❌ Failed inserts: ${stats.failedInserts}`);
  console.log(`   📊 Success rate: ${Math.round((stats.successfulInserts / stats.totalProducts) * 100)}%`);
  
  if (stats.processingTime) {
    console.log(`   ⏱️  Processing time: ${stats.processingTime}ms`);
  }
  
  if (stats.errors.length > 0) {
    console.log('\n❌ Errors:');
    stats.errors.forEach(error => {
      const categoryInfo = error.category ? ` (${error.category})` : '';
      console.log(`   ${error.sku}${categoryInfo}: ${error.error}`);
    });
  }
  
  if (stats.warnings && stats.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    stats.warnings.forEach(warning => {
      console.log(`   ${warning.sku}: ${warning.warning}`);
    });
  }
}

/**
 * Enhanced main migration function with comprehensive safety validation
 */
async function main(): Promise<void> {
  try {
    console.log('🌟 Protex Wear - Enhanced Data Migration Script');
    console.log('===============================================');
    console.log('🔧 Industrial EPIs & Safety Equipment Support');
    console.log('🛡️  Quality Guardian: Cross-Validation Active');
    console.log('===============================================\n');
    
    // Read products data
    const products = readProductsData();
    
    if (products.length === 0) {
      console.log('⚠️  No products found in source file. Exiting.');
      return;
    }
    
    // Analyze product types and perform batch safety validation
    const industrialProducts = products.filter(p => isIndustrialProduct(p)) as IndustrialProductSource[];
    
    if (industrialProducts.length > 0) {
      console.log(`🛡️  Detected ${industrialProducts.length} industrial safety products (EPIs)`);
      
      // Perform comprehensive batch validation
      console.log('🔍 Running Quality Guardian validation...\n');
      const batchValidation = safetyValidator.validateProductBatch(industrialProducts);
      
      // Report validation results
      console.log('📊 Quality Guardian Report:');
      console.log(`   Total products analyzed: ${batchValidation.totalProducts}`);
      console.log(`   ✅ Valid products: ${batchValidation.validProducts}`);
      console.log(`   ❌ Products with errors: ${batchValidation.productsWithErrors}`);
      console.log(`   ⚠️  Products with warnings: ${batchValidation.productsWithWarnings}`);
      
      // Show detailed errors if any
      if (batchValidation.allErrors.length > 0) {
        console.log('\n❌ Quality Guardian - Errors Found:');
        batchValidation.allErrors.forEach(error => {
          console.log(`   ${error}`);
        });
      }
      
      // Show warnings if any
      if (batchValidation.allWarnings.length > 0) {
        console.log('\n⚠️  Quality Guardian - Warnings:');
        batchValidation.allWarnings.forEach(warning => {
          console.log(`   ${warning}`);
        });
      }
      
      // Show safety categories breakdown
      const categoryBreakdown = industrialProducts.reduce((acc, p) => {
        const category = p.safetyCategory;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('\n📋 Safety categories breakdown:');
      Object.entries(categoryBreakdown).forEach(([category, count]) => {
        console.log(`   ${category}: ${count} products`);
      });
      
      // Stop migration if there are critical errors
      if (batchValidation.productsWithErrors > 0) {
        console.log('\n🚫 Migration stopped due to validation errors.');
        console.log('💡 Please fix the errors above and try again.');
        console.log('🔧 The Quality Guardian ensures data integrity for your industrial catalog.');
        process.exit(1);
      }
      
      console.log('\n✅ Quality Guardian validation passed! Proceeding with migration...\n');
    }
    
    // Perform bulk insert
    const stats = await bulkInsertProducts(products);
    
    // Print results
    printStats(stats);
    
    if (stats.failedInserts === 0) {
      console.log('\n🎉 Migration completed successfully!');
      console.log('✅ All products have been migrated to the database.');
      console.log('🛡️  Quality Guardian ensured data integrity throughout the process.');
      process.exit(0);
    } else {
      console.log('\n⚠️  Migration completed with errors. Please review the error log above.');
      console.log('💡 Consider fixing the errors and re-running the migration for failed products.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n💥 Migration failed:', error);
    console.error('🔍 Please check your configuration and try again.');
    process.exit(1);
  }
}

// Run the migration
main();

export { 
  main, 
  insertProduct, 
  validateProduct, 
  readProductsData, 
  bulkInsertProducts,
  printStats,
  specificationParser,
  safetyValidator 
};