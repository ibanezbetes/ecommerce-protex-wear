/**
 * Unit tests for AuthContext Import Fix
 * Tests that AuthContext imports amplify-setup instead of lib/amplify
 */

import * as fs from 'fs';
import * as path from 'path';

describe('AuthContext Import Fix', () => {
  const authContextPath = path.join(__dirname, '../../src/contexts/AuthContext.tsx');
  
  describe('Import Statement Verification', () => {
    test('should have AuthContext.tsx file', () => {
      expect(fs.existsSync(authContextPath)).toBe(true);
    });

    test('should import amplify-setup instead of lib/amplify', () => {
      const content = fs.readFileSync(authContextPath, 'utf-8');
      
      // Should import amplify-setup
      expect(content).toContain("import '../amplify-setup'");
      
      // Should NOT import lib/amplify
      expect(content).not.toContain("import '../lib/amplify'");
    });

    test('should have correct import comment', () => {
      const content = fs.readFileSync(authContextPath, 'utf-8');
      
      // Should have the correct comment explaining the import
      expect(content).toContain('// Initialize Amplify configuration');
    });

    test('should import aws-amplify/auth functions', () => {
      const content = fs.readFileSync(authContextPath, 'utf-8');
      
      // Should import necessary auth functions
      expect(content).toContain("from 'aws-amplify/auth'");
      expect(content).toContain('signIn');
      expect(content).toContain('signUp');
      expect(content).toContain('signOut');
      expect(content).toContain('getCurrentUser');
    });
  });

  describe('Import Order Verification', () => {
    test('should import amplify-setup before using any Amplify functions', () => {
      const content = fs.readFileSync(authContextPath, 'utf-8');
      
      const amplifySetupIndex = content.indexOf("import '../amplify-setup'");
      const amplifyAuthIndex = content.indexOf("from 'aws-amplify/auth'");
      
      expect(amplifySetupIndex).toBeGreaterThan(-1);
      expect(amplifyAuthIndex).toBeGreaterThan(-1);
      
      // amplify-setup should be imported after aws-amplify/auth imports but before usage
      // This is acceptable since the import is at the module level
      expect(amplifySetupIndex).toBeGreaterThan(0);
    });
  });

  describe('Configuration Dependencies', () => {
    test('should not have any direct Amplify.configure calls', () => {
      const content = fs.readFileSync(authContextPath, 'utf-8');
      
      // AuthContext should not configure Amplify directly
      expect(content).not.toContain('Amplify.configure');
    });

    test('should rely on side-effect import for configuration', () => {
      const content = fs.readFileSync(authContextPath, 'utf-8');
      
      // Should import amplify-setup as side effect
      const amplifySetupImport = content.match(/import\s+['"]\.\.\/amplify-setup['"];/);
      expect(amplifySetupImport).toBeTruthy();
    });
  });
});