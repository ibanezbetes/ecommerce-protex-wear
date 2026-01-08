/**
 * Property-Based Tests for CloudFront Rewrite Pattern
 * **Feature: amplify-configuration-fix, Property 1: Rewrite Rule Pattern Validation**
 * **Validates: Requirements 2.3**
 */

import * as fc from 'fast-check';

describe('CloudFront Rewrite Pattern Properties', () => {
  // The regex pattern used in CloudFront rewrite rules
  const rewritePattern = /^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|map|json)$)([^.]+$)/;
  
  // Static file extensions that should NOT be rewritten
  const staticExtensions = ['css', 'gif', 'ico', 'jpg', 'js', 'png', 'txt', 'svg', 'woff', 'ttf', 'map', 'json'];
  
  describe('Property 1: Rewrite Rule Pattern Validation', () => {
    test('**Feature: amplify-configuration-fix, Property 1: For any file path, the CloudFront rewrite regex should correctly identify static files and exclude them from SPA routing**', () => {
      fc.assert(
        fc.property(
          // Generate various file paths
          fc.oneof(
            // SPA routes (no extension)
            fc.tuple(
              fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9-_]*$/),
              fc.constantFrom('', '/sub', '/deep/nested')
            ).map(([route, prefix]) => `${prefix}/${route}`),
            
            // Static files with known extensions
            fc.tuple(
              fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9-_]*$/),
              fc.constantFrom(...staticExtensions)
            ).map(([name, ext]) => `${name}.${ext}`),
            
            // Static files with paths
            fc.tuple(
              fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9-_]*$/),
              fc.constantFrom(...staticExtensions),
              fc.constantFrom('assets/', 'static/', 'images/', '')
            ).map(([name, ext, path]) => `${path}${name}.${ext}`),
            
            // Non-static files with other extensions
            fc.tuple(
              fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9-_]*$/),
              fc.stringMatching(/^[a-z]{2,4}$/).filter(ext => !staticExtensions.includes(ext))
            ).map(([name, ext]) => `${name}.${ext}`)
          ),
          (filePath) => {
            const shouldRewrite = rewritePattern.test(filePath);
            const isStaticFile = staticExtensions.some(ext => filePath.endsWith(`.${ext}`));
            
            if (isStaticFile) {
              // Static files should NOT be rewritten (should serve the actual file)
              expect(shouldRewrite).toBe(false);
            } else {
              // Non-static files should be rewritten to index.html for SPA routing
              expect(shouldRewrite).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    test('should correctly handle SPA routes without extensions', () => {
      fc.assert(
        fc.property(
          fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9-_/]*[a-zA-Z0-9]$/),
          (route) => {
            // Routes without dots should be rewritten
            if (!route.includes('.')) {
              expect(rewritePattern.test(route)).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    test('should correctly exclude all static file extensions', () => {
      fc.assert(
        fc.property(
          fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9-_]*$/),
          fc.constantFrom(...staticExtensions),
          (filename, extension) => {
            const filePath = `${filename}.${extension}`;
            // Static files should NOT match the rewrite pattern
            expect(rewritePattern.test(filePath)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('should handle nested paths correctly', () => {
      fc.assert(
        fc.property(
          fc.array(fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9-_]*$/), { minLength: 1, maxLength: 4 }),
          fc.option(fc.constantFrom(...staticExtensions)),
          (pathSegments, extension) => {
            const path = pathSegments.join('/');
            const fullPath = extension ? `${path}.${extension}` : path;
            
            const shouldRewrite = rewritePattern.test(fullPath);
            const isStaticFile = extension !== null;
            
            if (isStaticFile) {
              expect(shouldRewrite).toBe(false);
            } else {
              expect(shouldRewrite).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Specific Test Cases', () => {
    test('should rewrite SPA routes', () => {
      const spaRoutes = [
        '/login',
        '/dashboard',
        '/products',
        '/users/123',
        '/admin/settings',
        'profile',
        'orders/pending'
      ];

      spaRoutes.forEach(route => {
        expect(rewritePattern.test(route)).toBe(true);
      });
    });

    test('should NOT rewrite static files', () => {
      const staticFiles = [
        'style.css',
        'app.js',
        'logo.png',
        'favicon.ico',
        'data.json',
        'font.woff',
        'assets/main.css',
        'images/hero.jpg',
        'static/bundle.js',
        'docs/api.json'
      ];

      staticFiles.forEach(file => {
        expect(rewritePattern.test(file)).toBe(false);
      });
    });

    test('should rewrite files with non-static extensions', () => {
      const nonStaticFiles = [
        'document.pdf',
        'archive.zip',
        'config.yaml',
        'readme.md',
        'data.xml'
      ];

      nonStaticFiles.forEach(file => {
        expect(rewritePattern.test(file)).toBe(true);
      });
    });

    test('should handle edge cases correctly', () => {
      // Edge cases that should be rewritten
      const shouldRewrite = [
        'a', // Single character
        'file.unknown', // Unknown extension
        'path/to/file.pdf', // Non-static extension
        'api/v1/users', // API routes
        'admin', // Admin routes
      ];

      shouldRewrite.forEach(path => {
        expect(rewritePattern.test(path)).toBe(true);
      });

      // Test empty string separately as it's a special case
      expect(rewritePattern.test('')).toBe(false); // Empty string doesn't match our pattern

      // Edge cases that should NOT be rewritten
      const shouldNotRewrite = [
        '.css', // Extension only
        'a.js', // Minimal static file
        'very-long-filename-with-dashes.png', // Long filename
      ];

      shouldNotRewrite.forEach(path => {
        expect(rewritePattern.test(path)).toBe(false);
      });

      // Case-sensitive test - .CSS (uppercase) should be rewritten since regex is case-sensitive
      expect(rewritePattern.test('file.CSS')).toBe(true);
    });
  });

  describe('Performance and Edge Cases', () => {
    test('should handle very long paths efficiently', () => {
      const longPath = 'a'.repeat(1000);
      const longStaticFile = `${'a'.repeat(1000)}.js`;
      
      expect(rewritePattern.test(longPath)).toBe(true);
      expect(rewritePattern.test(longStaticFile)).toBe(false);
    });

    test('should handle special characters in paths', () => {
      // These should be rewritten (SPA routes)
      expect(rewritePattern.test('user-profile')).toBe(true);
      expect(rewritePattern.test('api_v1')).toBe(true);
      
      // These should NOT be rewritten (static files)
      expect(rewritePattern.test('main-bundle.js')).toBe(false);
      expect(rewritePattern.test('user_avatar.png')).toBe(false);
    });
  });
});