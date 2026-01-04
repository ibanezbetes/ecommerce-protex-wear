import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * Protex Wear - Data Models and GraphQL Schema
 * E-commerce platform for work clothing and PPE distribution
 * 
 * Models:
 * - Product: Catalog items (SKU, name, price, stock, images)
 * - Order: Customer orders with products and status tracking
 * - User: Extended user profiles with company information
 */
const schema = a.schema({
  // Product Model - Catalog items for work clothing and PPE
  Product: a
    .model({
      sku: a.string().required(),
      name: a.string().required(),
      description: a.string(),
      price: a.float().required(),
      stock: a.integer().required().default(0),
      category: a.string(),
      subcategory: a.string(),
      brand: a.string(),
      imageUrl: a.string(),
      imageUrls: a.string().array(), // Multiple product images
      specifications: a.json(), // Technical specifications as JSON
      isActive: a.boolean().default(true),
      weight: a.float(), // For shipping calculations
      dimensions: a.json(), // Length, width, height for shipping
      tags: a.string().array(), // Search tags
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      // Public can read products (for catalog browsing)
      allow.publicApiKey().to(['read']),
      // Authenticated users can read products
      allow.authenticated().to(['read']),
      // Only ADMIN group can manage products
      allow.group('ADMIN').to(['create', 'read', 'update', 'delete']),
    ])
    .secondaryIndexes((index) => [
      // GSI for efficient queries by SKU
      index('sku').queryField('productBySku'),
      // GSI for category-based queries
      index('category').queryField('productsByCategory'),
      // GSI for brand-based queries  
      index('brand').queryField('productsByBrand'),
      // GSI for active products
      index('isActive').queryField('productsByStatus'),
    ]),

  // Order Model - Customer orders with products and tracking
  Order: a
    .model({
      userId: a.string().required(),
      customerEmail: a.string().required(),
      customerName: a.string().required(),
      customerCompany: a.string(),
      
      // Order items as JSON array
      items: a.json().required(), // Array of {productId, sku, name, quantity, price}
      
      // Order totals
      subtotal: a.float().required(),
      taxAmount: a.float().default(0),
      shippingAmount: a.float().default(0),
      discountAmount: a.float().default(0),
      totalAmount: a.float().required(),
      
      // Order status and tracking
      status: a.enum([
        'PENDING',
        'CONFIRMED', 
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
        'REFUNDED'
      ]).default('PENDING'),
      
      // Shipping information
      shippingAddress: a.json().required(), // Address object
      billingAddress: a.json(), // Optional separate billing address
      shippingMethod: a.string(),
      trackingNumber: a.string(),
      estimatedDelivery: a.date(),
      
      // Payment information
      paymentMethod: a.string(),
      paymentStatus: a.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).default('PENDING'),
      stripePaymentIntentId: a.string(),
      
      // Order notes and metadata
      customerNotes: a.string(),
      adminNotes: a.string(),
      
      // Timestamps
      orderDate: a.datetime().required(),
      confirmedAt: a.datetime(),
      shippedAt: a.datetime(),
      deliveredAt: a.datetime(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      // Users can create orders
      allow.authenticated().to(['create']),
      // Users can read their own orders
      allow.owner().to(['read']),
      // ADMIN can manage all orders
      allow.group('ADMIN').to(['create', 'read', 'update', 'delete']),
      // CUSTOMER group can read their own orders
      allow.group('CUSTOMER').to(['read']).where((order) => order.userId.eq(a.ref('auth.sub'))),
    ])
    .secondaryIndexes((index) => [
      // GSI for user's orders
      index('userId').queryField('ordersByUser'),
      // GSI for orders by status
      index('status').queryField('ordersByStatus'),
      // GSI for orders by date
      index('orderDate').queryField('ordersByDate'),
      // GSI for orders by customer email
      index('customerEmail').queryField('ordersByCustomer'),
    ]),

  // User Model - Extended user profiles with business information
  User: a
    .model({
      userId: a.string().required(), // Cognito user ID
      email: a.string().required(),
      firstName: a.string().required(),
      lastName: a.string().required(),
      
      // Business information
      company: a.string(),
      jobTitle: a.string(),
      department: a.string(),
      
      // Contact information
      phone: a.string(),
      alternativeEmail: a.string(),
      
      // Address information
      defaultShippingAddress: a.json(),
      defaultBillingAddress: a.json(),
      
      // User preferences
      preferredLanguage: a.string().default('es'),
      emailNotifications: a.boolean().default(true),
      smsNotifications: a.boolean().default(false),
      
      // Business settings
      taxId: a.string(), // For B2B customers
      creditLimit: a.float().default(0),
      paymentTerms: a.string().default('immediate'),
      
      // User role and status
      role: a.enum(['ADMIN', 'CUSTOMER']).default('CUSTOMER'),
      isActive: a.boolean().default(true),
      
      // Timestamps
      lastLoginAt: a.datetime(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      // Users can read and update their own profile
      allow.owner().to(['read', 'update']),
      // ADMIN can manage all user profiles
      allow.group('ADMIN').to(['create', 'read', 'update', 'delete']),
      // Users can create their own profile during registration
      allow.authenticated().to(['create']).where((user) => user.userId.eq(a.ref('auth.sub'))),
    ])
    .secondaryIndexes((index) => [
      // GSI for user lookup by email
      index('email').queryField('userByEmail'),
      // GSI for users by company
      index('company').queryField('usersByCompany'),
      // GSI for users by role
      index('role').queryField('usersByRole'),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool', // Use Cognito User Pool as default
    apiKeyAuthorizationMode: {
      expiresInDays: 30, // API key for public product access
    },
  },
});
