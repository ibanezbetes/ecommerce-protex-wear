/**
 * Unit tests for Amplify Setup Configuration
 * Tests that amplify-setup.ts exists and contains valid configuration
 */

import { Amplify } from 'aws-amplify';
import * as fs from 'fs';
import * as path from 'path';

// Mock Amplify to capture configuration calls
jest.mock('aws-amplify', () => ({
  Amplify: {
    configure: jest.fn(),
  },
}));

describe('Amplify Setup Configuration', () => {
  const amplifySetupPath = path.join(__dirname, '../../src/amplify-setup.ts');
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('File Existence and Structure', () => {
    test('should have amplify-setup.ts file in src directory', () => {
      expect(fs.existsSync(amplifySetupPath)).toBe(true);
    });

    test('should contain Amplify import statement', () => {
      const fileContent = fs.readFileSync(amplifySetupPath, 'utf-8');
      expect(fileContent).toContain("import { Amplify } from 'aws-amplify'");
    });

    test('should contain Amplify.configure call', () => {
      const fileContent = fs.readFileSync(amplifySetupPath, 'utf-8');
      expect(fileContent).toContain('Amplify.configure(');
    });

    test('should not export anything (side-effect only)', () => {
      const fileContent = fs.readFileSync(amplifySetupPath, 'utf-8');
      expect(fileContent).not.toContain('export');
    });
  });

  describe('Configuration Content Validation', () => {
    test('should contain required auth configuration', () => {
      const fileContent = fs.readFileSync(amplifySetupPath, 'utf-8');
      
      // Check for auth section
      expect(fileContent).toContain('"auth"');
      expect(fileContent).toContain('"user_pool_id"');
      expect(fileContent).toContain('"aws_region"');
      expect(fileContent).toContain('"user_pool_client_id"');
      expect(fileContent).toContain('"identity_pool_id"');
    });

    test('should contain required data configuration', () => {
      const fileContent = fs.readFileSync(amplifySetupPath, 'utf-8');
      
      // Check for data section
      expect(fileContent).toContain('"data"');
      expect(fileContent).toContain('"url"');
      expect(fileContent).toContain('"api_key"');
      expect(fileContent).toContain('"default_authorization_type"');
    });

    test('should contain required storage configuration', () => {
      const fileContent = fs.readFileSync(amplifySetupPath, 'utf-8');
      
      // Check for storage section
      expect(fileContent).toContain('"storage"');
      expect(fileContent).toContain('"bucket_name"');
      expect(fileContent).toContain('"buckets"');
    });

    test('should contain specific production values', () => {
      const fileContent = fs.readFileSync(amplifySetupPath, 'utf-8');
      
      // Check for specific production configuration values
      expect(fileContent).toContain('eu-west-1_oQly2sLvE'); // user_pool_id
      expect(fileContent).toContain('6r4n23dup3r8coces1p7tidd82'); // user_pool_client_id
      expect(fileContent).toContain('eu-west-1:930a6777-448f-49d3-a450-5217c63c7508'); // identity_pool_id
      expect(fileContent).toContain('dwlvjyyun5bxpj2xlckg6qhlee.appsync-api.eu-west-1.amazonaws.com'); // GraphQL URL
    });
  });

  describe('Configuration Execution', () => {
    test('should call Amplify.configure when imported', () => {
      // Clear any previous calls
      (Amplify.configure as jest.Mock).mockClear();
      
      // Import the module to trigger side effects
      require('../../src/amplify-setup');
      
      // Verify Amplify.configure was called
      expect(Amplify.configure).toHaveBeenCalled();
    });

    test('should contain valid configuration structure in file', () => {
      const fileContent = fs.readFileSync(amplifySetupPath, 'utf-8');
      
      // Verify the configuration object structure exists in the file
      expect(fileContent).toContain('"auth":');
      expect(fileContent).toContain('"data":');
      expect(fileContent).toContain('"storage":');
      
      // Verify required auth fields
      expect(fileContent).toContain('"user_pool_id":');
      expect(fileContent).toContain('"aws_region":');
      expect(fileContent).toContain('"user_pool_client_id":');
      
      // Verify required data fields
      expect(fileContent).toContain('"url":');
      expect(fileContent).toContain('"api_key":');
      
      // Verify required storage fields
      expect(fileContent).toContain('"bucket_name":');
      expect(fileContent).toContain('"buckets":');
    });
  });

  describe('Error Handling', () => {
    test('should handle missing configuration gracefully', () => {
      // This test ensures the file doesn't throw errors during import
      expect(() => {
        require('../../src/amplify-setup');
      }).not.toThrow();
    });
  });
});