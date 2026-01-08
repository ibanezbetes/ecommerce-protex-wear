/**
 * Unit tests for Main.tsx Import Order
 * Tests that main.tsx imports amplify-setup first and doesn't contain Amplify.configure
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Main.tsx Import Order', () => {
  const mainTsxPath = path.join(__dirname, '../../src/main.tsx');
  
  describe('Import Order Validation', () => {
    test('should have main.tsx file in src directory', () => {
      expect(fs.existsSync(mainTsxPath)).toBe(true);
    });

    test('should import amplify-setup as first import statement', () => {
      const fileContent = fs.readFileSync(mainTsxPath, 'utf-8');
      
      // Remove comments and empty lines to find first import
      const lines = fileContent.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('//'));
      
      // Find first import statement
      const firstImportLine = lines.find(line => line.startsWith('import'));
      
      expect(firstImportLine).toBeDefined();
      expect(firstImportLine).toContain("import './amplify-setup'");
    });

    test('should contain amplify-setup import statement', () => {
      const fileContent = fs.readFileSync(mainTsxPath, 'utf-8');
      expect(fileContent).toContain("import './amplify-setup'");
    });

    test('should not contain Amplify import from aws-amplify', () => {
      const fileContent = fs.readFileSync(mainTsxPath, 'utf-8');
      expect(fileContent).not.toContain("import { Amplify } from 'aws-amplify'");
    });

    test('should not contain Amplify.configure call', () => {
      const fileContent = fs.readFileSync(mainTsxPath, 'utf-8');
      expect(fileContent).not.toContain('Amplify.configure(');
    });
  });

  describe('File Structure Validation', () => {
    test('should contain React imports', () => {
      const fileContent = fs.readFileSync(mainTsxPath, 'utf-8');
      expect(fileContent).toContain("import React from 'react'");
      expect(fileContent).toContain("import ReactDOM from 'react-dom/client'");
    });

    test('should contain BrowserRouter import', () => {
      const fileContent = fs.readFileSync(mainTsxPath, 'utf-8');
      expect(fileContent).toContain("import { BrowserRouter } from 'react-router-dom'");
    });

    test('should contain App import', () => {
      const fileContent = fs.readFileSync(mainTsxPath, 'utf-8');
      expect(fileContent).toContain("import App from './App'");
    });

    test('should contain ReactDOM.createRoot call', () => {
      const fileContent = fs.readFileSync(mainTsxPath, 'utf-8');
      expect(fileContent).toContain('ReactDOM.createRoot(');
      expect(fileContent).toContain('<App />');
    });
  });

  describe('Configuration Separation', () => {
    test('should not contain hardcoded auth configuration', () => {
      const fileContent = fs.readFileSync(mainTsxPath, 'utf-8');
      
      // Verify no hardcoded configuration values
      expect(fileContent).not.toContain('eu-west-1_oQly2sLvE');
      expect(fileContent).not.toContain('6r4n23dup3r8coces1p7tidd82');
      expect(fileContent).not.toContain('dwlvjyyun5bxpj2xlckg6qhlee.appsync-api');
    });

    test('should not contain storage configuration', () => {
      const fileContent = fs.readFileSync(mainTsxPath, 'utf-8');
      
      // Verify no storage configuration
      expect(fileContent).not.toContain('protexWearStorage');
      expect(fileContent).not.toContain('bucket_name');
      expect(fileContent).not.toContain('product-images');
    });

    test('should be focused only on rendering logic', () => {
      const fileContent = fs.readFileSync(mainTsxPath, 'utf-8');
      
      // Should contain only essential rendering imports and logic
      const importCount = (fileContent.match(/^import /gm) || []).length;
      
      // Should have exactly 5 imports: amplify-setup, React, ReactDOM, BrowserRouter, App, CSS
      expect(importCount).toBeLessThanOrEqual(6);
      
      // Should contain render logic
      expect(fileContent).toContain('ReactDOM.createRoot');
      expect(fileContent).toContain('<React.StrictMode>');
      expect(fileContent).toContain('<BrowserRouter>');
    });
  });

  describe('Import Order Correctness', () => {
    test('should have amplify-setup import before any React imports', () => {
      const fileContent = fs.readFileSync(mainTsxPath, 'utf-8');
      
      const amplifySetupIndex = fileContent.indexOf("import './amplify-setup'");
      const reactIndex = fileContent.indexOf("import React from 'react'");
      
      expect(amplifySetupIndex).toBeGreaterThan(-1);
      expect(reactIndex).toBeGreaterThan(-1);
      expect(amplifySetupIndex).toBeLessThan(reactIndex);
    });

    test('should have amplify-setup import before App import', () => {
      const fileContent = fs.readFileSync(mainTsxPath, 'utf-8');
      
      const amplifySetupIndex = fileContent.indexOf("import './amplify-setup'");
      const appIndex = fileContent.indexOf("import App from './App'");
      
      expect(amplifySetupIndex).toBeGreaterThan(-1);
      expect(appIndex).toBeGreaterThan(-1);
      expect(amplifySetupIndex).toBeLessThan(appIndex);
    });
  });
});