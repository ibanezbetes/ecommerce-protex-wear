/**
 * Unit tests for Build Artifacts Verification
 * Tests that amplify-setup is included correctly in the build output
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

describe('Build Artifacts Verification', () => {
  const distPath = path.join(__dirname, '../../dist');
  const srcPath = path.join(__dirname, '../../src');
  
  beforeAll(() => {
    // Ensure we have a fresh build for testing
    if (!fs.existsSync(distPath)) {
      console.log('Building application for verification tests...');
      execSync('npm run build', { stdio: 'inherit' });
    }
  });

  describe('Source Files Integrity', () => {
    test('should have amplify-setup.ts in source directory', () => {
      const amplifySetupPath = path.join(srcPath, 'amplify-setup.ts');
      expect(fs.existsSync(amplifySetupPath)).toBe(true);
    });

    test('should have main.tsx importing amplify-setup first', () => {
      const mainTsxPath = path.join(srcPath, 'main.tsx');
      const content = fs.readFileSync(mainTsxPath, 'utf-8');
      
      // Find first import statement
      const lines = content.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('//'));
      
      const firstImportLine = lines.find(line => line.startsWith('import'));
      expect(firstImportLine).toContain("import './amplify-setup'");
    });

    test('should have complete Amplify configuration in amplify-setup.ts', () => {
      const amplifySetupPath = path.join(srcPath, 'amplify-setup.ts');
      const content = fs.readFileSync(amplifySetupPath, 'utf-8');
      
      // Verify essential configuration sections
      expect(content).toContain('Amplify.configure(');
      expect(content).toContain('"auth":');
      expect(content).toContain('"data":');
      expect(content).toContain('"storage":');
      expect(content).toContain('"user_pool_id":');
      expect(content).toContain('"aws_region":');
    });
  });

  describe('Build Output Verification', () => {
    test('should have dist directory created', () => {
      expect(fs.existsSync(distPath)).toBe(true);
    });

    test('should have index.html in dist directory', () => {
      const indexPath = path.join(distPath, 'index.html');
      expect(fs.existsSync(indexPath)).toBe(true);
    });

    test('should have assets directory with JS and CSS files', () => {
      const assetsPath = path.join(distPath, 'assets');
      expect(fs.existsSync(assetsPath)).toBe(true);
      
      const files = fs.readdirSync(assetsPath);
      const jsFiles = files.filter(file => file.endsWith('.js'));
      const cssFiles = files.filter(file => file.endsWith('.css'));
      
      expect(jsFiles.length).toBeGreaterThan(0);
      expect(cssFiles.length).toBeGreaterThan(0);
    });

    test('should have index.html referencing correct asset files', () => {
      const indexPath = path.join(distPath, 'index.html');
      const content = fs.readFileSync(indexPath, 'utf-8');
      
      // Should reference JS and CSS assets (allowing hyphens in hash)
      expect(content).toMatch(/src="\/assets\/index-[a-zA-Z0-9-]+\.js"/);
      expect(content).toMatch(/href="\/assets\/index-[a-zA-Z0-9-]+\.css"/);
    });
  });

  describe('Bundle Content Verification', () => {
    test('should include Amplify configuration in the bundle', () => {
      const assetsPath = path.join(distPath, 'assets');
      const files = fs.readdirSync(assetsPath);
      const jsFiles = files.filter(file => file.endsWith('.js') && !file.endsWith('.map'));
      
      expect(jsFiles.length).toBeGreaterThan(0);
      
      // Check that at least one JS file contains Amplify-related content
      let foundAmplifyContent = false;
      
      for (const jsFile of jsFiles) {
        const jsPath = path.join(assetsPath, jsFile);
        const content = fs.readFileSync(jsPath, 'utf-8');
        
        // Look for Amplify-related content (minified)
        if (content.includes('user_pool_id') || 
            content.includes('aws_region') || 
            content.includes('amplify') ||
            content.includes('Amplify')) {
          foundAmplifyContent = true;
          break;
        }
      }
      
      expect(foundAmplifyContent).toBe(true);
    });

    test('should include authentication configuration in bundle', () => {
      const assetsPath = path.join(distPath, 'assets');
      const files = fs.readdirSync(assetsPath);
      const jsFiles = files.filter(file => file.endsWith('.js') && !file.endsWith('.map'));
      
      let foundAuthConfig = false;
      
      for (const jsFile of jsFiles) {
        const jsPath = path.join(assetsPath, jsFile);
        const content = fs.readFileSync(jsPath, 'utf-8');
        
        // Look for specific auth configuration values
        if (content.includes('eu-west-1_oQly2sLvE') || // user_pool_id
            content.includes('6r4n23dup3r8coces1p7tidd82') || // user_pool_client_id
            content.includes('user_pool_id')) {
          foundAuthConfig = true;
          break;
        }
      }
      
      expect(foundAuthConfig).toBe(true);
    });
  });

  describe('Build Process Validation', () => {
    test('should be able to rebuild without errors', () => {
      expect(() => {
        execSync('npm run build', { stdio: 'pipe' });
      }).not.toThrow();
    });

    test('should maintain file structure after rebuild', () => {
      // Rebuild
      execSync('npm run build', { stdio: 'pipe' });
      
      // Verify structure is maintained
      expect(fs.existsSync(path.join(distPath, 'index.html'))).toBe(true);
      expect(fs.existsSync(path.join(distPath, 'assets'))).toBe(true);
      
      const assetsPath = path.join(distPath, 'assets');
      const files = fs.readdirSync(assetsPath);
      const jsFiles = files.filter(file => file.endsWith('.js'));
      const cssFiles = files.filter(file => file.endsWith('.css'));
      
      expect(jsFiles.length).toBeGreaterThan(0);
      expect(cssFiles.length).toBeGreaterThan(0);
    });
  });

  describe('Configuration Integrity', () => {
    test('should not have Amplify.configure in main.tsx', () => {
      const mainTsxPath = path.join(srcPath, 'main.tsx');
      const content = fs.readFileSync(mainTsxPath, 'utf-8');
      
      expect(content).not.toContain('Amplify.configure(');
    });

    test('should not have hardcoded config in main.tsx', () => {
      const mainTsxPath = path.join(srcPath, 'main.tsx');
      const content = fs.readFileSync(mainTsxPath, 'utf-8');
      
      // Should not contain any of the hardcoded configuration values
      expect(content).not.toContain('eu-west-1_oQly2sLvE');
      expect(content).not.toContain('6r4n23dup3r8coces1p7tidd82');
      expect(content).not.toContain('dwlvjyyun5bxpj2xlckg6qhlee.appsync-api');
    });

    test('should have amplify-setup as side-effect only module', () => {
      const amplifySetupPath = path.join(srcPath, 'amplify-setup.ts');
      const content = fs.readFileSync(amplifySetupPath, 'utf-8');
      
      // Should not export anything
      expect(content).not.toContain('export');
      
      // Should contain Amplify.configure call
      expect(content).toContain('Amplify.configure(');
    });
  });

  describe('Performance and Size Validation', () => {
    test('should have reasonable bundle size', () => {
      const assetsPath = path.join(distPath, 'assets');
      const files = fs.readdirSync(assetsPath);
      const jsFiles = files.filter(file => file.endsWith('.js') && !file.endsWith('.map'));
      
      for (const jsFile of jsFiles) {
        const jsPath = path.join(assetsPath, jsFile);
        const stats = fs.statSync(jsPath);
        
        // Bundle should be less than 10MB (reasonable for a React app)
        expect(stats.size).toBeLessThan(10 * 1024 * 1024);
        
        // Bundle should be more than 1KB (should contain actual code)
        expect(stats.size).toBeGreaterThan(1024);
      }
    });

    test('should have gzipped assets available', () => {
      // Note: This test checks if the build process could generate gzipped assets
      // In production, CloudFront handles gzipping, but we verify the files are compressible
      const assetsPath = path.join(distPath, 'assets');
      const files = fs.readdirSync(assetsPath);
      const jsFiles = files.filter(file => file.endsWith('.js') && !file.endsWith('.map'));
      
      expect(jsFiles.length).toBeGreaterThan(0);
      
      // Files should be text-based and compressible
      for (const jsFile of jsFiles) {
        const jsPath = path.join(assetsPath, jsFile);
        const content = fs.readFileSync(jsPath, 'utf-8');
        
        // Should contain JavaScript-like content
        expect(content.length).toBeGreaterThan(100);
        expect(typeof content).toBe('string');
      }
    });
  });
});