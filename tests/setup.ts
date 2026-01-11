// Test setup for Protex Wear Serverless Platform
// Global test configuration and mocks

// Mock AWS SDK calls for testing
jest.mock('@aws-sdk/client-cognito-identity-provider');

// Set test timeout for property-based tests
jest.setTimeout(30000);

// Global test utilities
global.console = {
  ...console,
  // Suppress console.log in tests unless explicitly needed
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: console.warn,
  error: console.error,
};