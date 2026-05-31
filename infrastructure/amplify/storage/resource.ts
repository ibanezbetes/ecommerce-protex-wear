import { defineStorage } from '@aws-amplify/backend';

/**
 * Protex Wear - S3 Storage Configuration
 * Storage for product images and other assets
 * 
 * Access Policies:
 * - Public read access for product images (catalog browsing)
 * - Authenticated write access for image uploads
 * - Admin full access for management
 */
export const storage = defineStorage({
  name: 'protexWearStorage',
  access: (allow) => ({
    // Product images - public read, authenticated write
    'product-images/*': [
      allow.guest.to(['read']), // Public can view product images
      allow.authenticated.to(['read', 'write']), // Authenticated users can upload
      allow.groups(['ADMIN']).to(['read', 'write', 'delete']), // Admins can manage
    ],

    // User profile images - owner access
    'profile-images/*': [
      allow.authenticated.to(['read', 'write']),
      allow.groups(['ADMIN']).to(['read', 'write', 'delete']),
    ],

    // Order documents and receipts - owner and admin access
    'order-documents/*': [
      allow.authenticated.to(['read', 'write']),
      allow.groups(['ADMIN']).to(['read', 'write', 'delete']),
    ],

    // Company logos and branding - authenticated read, admin write
    'company-assets/*': [
      allow.authenticated.to(['read']),
      allow.groups(['ADMIN']).to(['read', 'write', 'delete']),
    ],

    // Temporary uploads - authenticated users only
    'temp-uploads/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
  }),
});