import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { Schema } from '../amplify/data/resource';

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

interface ProductSource {
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

interface MigrationStats {
  totalProducts: number;
  successfulInserts: number;
  failedInserts: number;
  errors: Array<{
    sku: string;
    error: string;
  }>;
}

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
 * Validate product data
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
  
  return errors;
}

/**
 * Insert a single product into the database
 */
async function insertProduct(product: ProductSource): Promise<boolean> {
  try {
    // Validate product data
    const validationErrors = validateProduct(product);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
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
      specifications: product.specifications ? JSON.stringify(product.specifications) : undefined,
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
    
    console.log(`✅ Successfully inserted product: ${product.sku} - ${product.name}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to insert product ${product.sku}:`, error);
    return false;
  }
}

/**
 * Bulk insert products with error handling and progress reporting
 */
async function bulkInsertProducts(products: ProductSource[]): Promise<MigrationStats> {
  const stats: MigrationStats = {
    totalProducts: products.length,
    successfulInserts: 0,
    failedInserts: 0,
    errors: []
  };
  
  console.log(`🚀 Starting bulk insert of ${products.length} products...`);
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
          error: 'Insert operation failed'
        });
      }
    } catch (error) {
      stats.failedInserts++;
      stats.errors.push({
        sku: product.sku,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    // Progress reporting
    const progress = Math.round(((i + 1) / products.length) * 100);
    if ((i + 1) % 10 === 0 || i === products.length - 1) {
      console.log(`   ${progress}% complete (${i + 1}/${products.length})`);
    }
    
    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return stats;
}

/**
 * Print migration statistics
 */
function printStats(stats: MigrationStats): void {
  console.log('\n📈 Migration Statistics:');
  console.log(`   Total products: ${stats.totalProducts}`);
  console.log(`   ✅ Successful inserts: ${stats.successfulInserts}`);
  console.log(`   ❌ Failed inserts: ${stats.failedInserts}`);
  console.log(`   📊 Success rate: ${Math.round((stats.successfulInserts / stats.totalProducts) * 100)}%`);
  
  if (stats.errors.length > 0) {
    console.log('\n❌ Errors:');
    stats.errors.forEach(error => {
      console.log(`   ${error.sku}: ${error.error}`);
    });
  }
}

/**
 * Main migration function
 */
async function main(): Promise<void> {
  try {
    console.log('🌟 Protex Wear - Data Migration Script');
    console.log('=====================================\n');
    
    // Read products data
    const products = readProductsData();
    
    if (products.length === 0) {
      console.log('⚠️  No products found in source file. Exiting.');
      return;
    }
    
    // Perform bulk insert
    const stats = await bulkInsertProducts(products);
    
    // Print results
    printStats(stats);
    
    if (stats.failedInserts === 0) {
      console.log('\n🎉 Migration completed successfully!');
      process.exit(0);
    } else {
      console.log('\n⚠️  Migration completed with errors. Please review the error log above.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
main();

export { main, insertProduct, validateProduct, readProductsData };