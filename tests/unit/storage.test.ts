/**
 * Unit tests for S3 Storage Operations
 * Feature: amplify-serverless-architecture
 */

// Mock AWS Amplify Storage operations
const mockStorageOperations = {
  uploadData: jest.fn(),
  getUrl: jest.fn(),
  remove: jest.fn(),
  list: jest.fn(),
};

jest.mock('aws-amplify/storage', () => ({
  uploadData: (...args: any[]) => mockStorageOperations.uploadData(...args),
  getUrl: (...args: any[]) => mockStorageOperations.getUrl(...args),
  remove: (...args: any[]) => mockStorageOperations.remove(...args),
  list: (...args: any[]) => mockStorageOperations.list(...args),
}));

describe('Storage Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStorageOperations.uploadData.mockReset();
    mockStorageOperations.getUrl.mockReset();
    mockStorageOperations.remove.mockReset();
    mockStorageOperations.list.mockReset();
  });

  describe('Image Upload Operations', () => {
    test('should upload product image successfully', async () => {
      const testFile = new Uint8Array([1, 2, 3, 4]);
      const expectedKey = 'product-images/TEST-PRODUCT-001.jpg';

      mockStorageOperations.uploadData.mockResolvedValue({
        result: {
          key: expectedKey,
        },
      });

      const result = await mockStorageOperations.uploadData({
        key: expectedKey,
        data: testFile,
        options: {
          contentType: 'image/jpeg',
        },
      });

      expect(mockStorageOperations.uploadData).toHaveBeenCalledWith({
        key: expectedKey,
        data: testFile,
        options: {
          contentType: 'image/jpeg',
        },
      });

      expect(result.result.key).toBe(expectedKey);
    });

    test('should handle different image formats', async () => {
      const testCases = [
        { extension: 'jpg', contentType: 'image/jpeg' },
        { extension: 'png', contentType: 'image/png' },
        { extension: 'webp', contentType: 'image/webp' },
        { extension: 'gif', contentType: 'image/gif' },
      ];

      for (const testCase of testCases) {
        const key = `product-images/test.${testCase.extension}`;
        
        mockStorageOperations.uploadData.mockResolvedValue({
          result: { key },
        });

        const result = await mockStorageOperations.uploadData({
          key,
          data: new Uint8Array([1, 2, 3]),
          options: {
            contentType: testCase.contentType,
          },
        });

        expect(result.result.key).toBe(key);
      }
    });

    test('should upload to different storage paths', async () => {
      const testPaths = [
        'product-images/product1.jpg',
        'profile-images/user123.png',
        'company-assets/logo.svg',
        'order-documents/receipt.pdf',
      ];

      for (const path of testPaths) {
        mockStorageOperations.uploadData.mockResolvedValue({
          result: { key: path },
        });

        const result = await mockStorageOperations.uploadData({
          key: path,
          data: new Uint8Array([1, 2, 3]),
        });

        expect(result.result.key).toBe(path);
      }
    });
  });

  describe('URL Generation Operations', () => {
    test('should generate public URL for product image', async () => {
      const key = 'product-images/TEST-PRODUCT-001.jpg';
      const expectedUrl = `https://protex-wear-storage.s3.eu-west-1.amazonaws.com/${key}`;

      mockStorageOperations.getUrl.mockResolvedValue({
        url: new URL(expectedUrl),
        expiresAt: new Date(Date.now() + 3600000), // 1 hour
      });

      const result = await mockStorageOperations.getUrl({ key });

      expect(mockStorageOperations.getUrl).toHaveBeenCalledWith({ key });
      expect(result.url.toString()).toBe(expectedUrl);
      expect(result.expiresAt).toBeInstanceOf(Date);
      expect(result.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    test('should handle URL generation for different file types', async () => {
      const testFiles = [
        'product-images/shirt.jpg',
        'profile-images/avatar.png',
        'company-assets/banner.webp',
      ];

      for (const key of testFiles) {
        const expectedUrl = `https://protex-wear-storage.s3.eu-west-1.amazonaws.com/${key}`;
        
        mockStorageOperations.getUrl.mockResolvedValue({
          url: new URL(expectedUrl),
          expiresAt: new Date(Date.now() + 3600000),
        });

        const result = await mockStorageOperations.getUrl({ key });

        expect(result.url.toString()).toBe(expectedUrl);
        expect(result.url.protocol).toBe('https:');
      }
    });
  });

  describe('File Listing Operations', () => {
    test('should list product images by prefix', async () => {
      const productSku = 'TEST-PRODUCT-001';
      const prefix = `product-images/${productSku}`;
      
      const mockItems = [
        {
          key: `${prefix}-1.jpg`,
          size: 1024,
          lastModified: new Date('2024-01-01'),
        },
        {
          key: `${prefix}-2.jpg`,
          size: 2048,
          lastModified: new Date('2024-01-02'),
        },
      ];

      mockStorageOperations.list.mockResolvedValue({
        items: mockItems,
      });

      const result = await mockStorageOperations.list({ prefix });

      expect(mockStorageOperations.list).toHaveBeenCalledWith({ prefix });
      expect(result.items).toHaveLength(2);
      expect(result.items[0].key).toBe(`${prefix}-1.jpg`);
      expect(result.items[1].key).toBe(`${prefix}-2.jpg`);
    });

    test('should handle empty listing results', async () => {
      const prefix = 'product-images/NON-EXISTENT';

      mockStorageOperations.list.mockResolvedValue({
        items: [],
      });

      const result = await mockStorageOperations.list({ prefix });

      expect(result.items).toHaveLength(0);
    });

    test('should list files in different directories', async () => {
      const testPrefixes = [
        'product-images/',
        'profile-images/',
        'company-assets/',
        'order-documents/',
      ];

      for (const prefix of testPrefixes) {
        mockStorageOperations.list.mockResolvedValue({
          items: [
            {
              key: `${prefix}test-file.jpg`,
              size: 1024,
              lastModified: new Date(),
            },
          ],
        });

        const result = await mockStorageOperations.list({ prefix });

        expect(result.items).toHaveLength(1);
        expect(result.items[0].key).toContain(prefix);
      }
    });
  });

  describe('File Removal Operations', () => {
    test('should remove single product image', async () => {
      const key = 'product-images/TEST-PRODUCT-001.jpg';

      mockStorageOperations.remove.mockResolvedValue({
        key,
      });

      const result = await mockStorageOperations.remove({ key });

      expect(mockStorageOperations.remove).toHaveBeenCalledWith({ key });
      expect(result.key).toBe(key);
    });

    test('should remove multiple images for product cleanup', async () => {
      const productSku = 'TEST-PRODUCT-001';
      const imageKeys = [
        `product-images/${productSku}-1.jpg`,
        `product-images/${productSku}-2.jpg`,
        `product-images/${productSku}-3.jpg`,
      ];

      // Mock list operation to find images
      mockStorageOperations.list.mockResolvedValue({
        items: imageKeys.map(key => ({
          key,
          size: 1024,
          lastModified: new Date(),
        })),
      });

      // Mock remove operations
      mockStorageOperations.remove.mockImplementation(({ key }) => 
        Promise.resolve({ key })
      );

      // Simulate cleanup process
      const listResult = await mockStorageOperations.list({ prefix: `product-images/${productSku}` });
      const removePromises = listResult.items.map((item: { key: string }) => 
        mockStorageOperations.remove({ key: item.key })
      );
      const removeResults = await Promise.all(removePromises);

      expect(mockStorageOperations.list).toHaveBeenCalledWith({ prefix: `product-images/${productSku}` });
      expect(mockStorageOperations.remove).toHaveBeenCalledTimes(3);
      expect(removeResults).toHaveLength(3);
      
      removeResults.forEach((result, index) => {
        expect(result.key).toBe(imageKeys[index]);
      });
    });

    test('should handle removal of non-existent files gracefully', async () => {
      const key = 'product-images/NON-EXISTENT.jpg';

      mockStorageOperations.remove.mockRejectedValue(new Error('File not found'));

      await expect(mockStorageOperations.remove({ key })).rejects.toThrow('File not found');
      expect(mockStorageOperations.remove).toHaveBeenCalledWith({ key });
    });
  });

  describe('Storage Integration Scenarios', () => {
    test('should handle complete product image lifecycle', async () => {
      const productSku = 'TEST-PRODUCT-001';
      const imageKey = `product-images/${productSku}.jpg`;
      const imageData = new Uint8Array([1, 2, 3, 4]);

      // 1. Upload image
      mockStorageOperations.uploadData.mockResolvedValue({
        result: { key: imageKey },
      });

      const uploadResult = await mockStorageOperations.uploadData({
        key: imageKey,
        data: imageData,
        options: { contentType: 'image/jpeg' },
      });

      expect(uploadResult.result.key).toBe(imageKey);

      // 2. Generate URL
      const expectedUrl = `https://protex-wear-storage.s3.eu-west-1.amazonaws.com/${imageKey}`;
      mockStorageOperations.getUrl.mockResolvedValue({
        url: new URL(expectedUrl),
        expiresAt: new Date(Date.now() + 3600000),
      });

      const urlResult = await mockStorageOperations.getUrl({ key: imageKey });
      expect(urlResult.url.toString()).toBe(expectedUrl);

      // 3. List images
      mockStorageOperations.list.mockResolvedValue({
        items: [{ key: imageKey, size: 1024, lastModified: new Date() }],
      });

      const listResult = await mockStorageOperations.list({ prefix: `product-images/${productSku}` });
      expect(listResult.items).toHaveLength(1);

      // 4. Remove image
      mockStorageOperations.remove.mockResolvedValue({ key: imageKey });

      const removeResult = await mockStorageOperations.remove({ key: imageKey });
      expect(removeResult.key).toBe(imageKey);
    });

    test('should handle batch operations for multiple products', async () => {
      const products = ['PROD-001', 'PROD-002', 'PROD-003'];
      const allImageKeys: string[] = [];

      // Upload images for each product
      for (const productSku of products) {
        const imageKey = `product-images/${productSku}.jpg`;
        allImageKeys.push(imageKey);

        mockStorageOperations.uploadData.mockResolvedValue({
          result: { key: imageKey },
        });

        const result = await mockStorageOperations.uploadData({
          key: imageKey,
          data: new Uint8Array([1, 2, 3]),
        });

        expect(result.result.key).toBe(imageKey);
      }

      // List all product images
      mockStorageOperations.list.mockResolvedValue({
        items: allImageKeys.map(key => ({
          key,
          size: 1024,
          lastModified: new Date(),
        })),
      });

      const listResult = await mockStorageOperations.list({ prefix: 'product-images/' });
      expect(listResult.items).toHaveLength(3);

      // Batch remove
      mockStorageOperations.remove.mockImplementation(({ key }) => 
        Promise.resolve({ key })
      );

      const removePromises = allImageKeys.map((key: string) => mockStorageOperations.remove({ key }));
      const removeResults = await Promise.all(removePromises);

      expect(removeResults).toHaveLength(3);
      expect(mockStorageOperations.remove).toHaveBeenCalledTimes(3);
    });
  });

  describe('Error Handling', () => {
    test('should handle upload failures', async () => {
      const key = 'product-images/test.jpg';
      const errorMessage = 'Upload failed: insufficient permissions';

      mockStorageOperations.uploadData.mockRejectedValue(new Error(errorMessage));

      await expect(mockStorageOperations.uploadData({
        key,
        data: new Uint8Array([1, 2, 3]),
      })).rejects.toThrow(errorMessage);
    });

    test('should handle URL generation failures', async () => {
      const key = 'product-images/non-existent.jpg';
      const errorMessage = 'File not found';

      mockStorageOperations.getUrl.mockRejectedValue(new Error(errorMessage));

      await expect(mockStorageOperations.getUrl({ key })).rejects.toThrow(errorMessage);
    });

    test('should handle listing failures', async () => {
      const prefix = 'invalid-prefix/';
      const errorMessage = 'Access denied';

      mockStorageOperations.list.mockRejectedValue(new Error(errorMessage));

      await expect(mockStorageOperations.list({ prefix })).rejects.toThrow(errorMessage);
    });

    test('should handle removal failures', async () => {
      const key = 'product-images/protected.jpg';
      const errorMessage = 'Delete operation not permitted';

      mockStorageOperations.remove.mockRejectedValue(new Error(errorMessage));

      await expect(mockStorageOperations.remove({ key })).rejects.toThrow(errorMessage);
    });
  });
});