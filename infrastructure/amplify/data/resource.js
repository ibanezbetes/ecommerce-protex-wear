"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
const backend_1 = require("@aws-amplify/backend");
/**
 * Protex Wear - Data Models and GraphQL Schema
 * E-commerce platform for work clothing and PPE distribution
 *
 * Models:
 * - Product: Catalog items (SKU, name, price, stock, images)
 * - Order: Customer orders with products and status tracking
 * - User: Extended user profiles with company information
 */
const schema = backend_1.a.schema({
    // Product Model - Catalog items for work clothing and PPE
    Product: backend_1.a
        .model({
        sku: backend_1.a.string().required(),
        name: backend_1.a.string().required(),
        description: backend_1.a.string(),
        price: backend_1.a.float().required(),
        stock: backend_1.a.integer().required().default(0),
        category: backend_1.a.string(),
        subcategory: backend_1.a.string(),
        brand: backend_1.a.string(),
        imageUrl: backend_1.a.string(),
        imageUrls: backend_1.a.string().array(), // Multiple product images
        specifications: backend_1.a.json(), // Technical specifications as JSON
        isActive: backend_1.a.boolean().default(true),
        weight: backend_1.a.float(), // For shipping calculations
        dimensions: backend_1.a.json(), // Length, width, height for shipping
        tags: backend_1.a.string().array(), // Search tags
        createdAt: backend_1.a.datetime(),
        updatedAt: backend_1.a.datetime(),
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
    ]),
    // Order Model - Customer orders with products and tracking
    Order: backend_1.a
        .model({
        userId: backend_1.a.string().required(),
        customerEmail: backend_1.a.string().required(),
        customerName: backend_1.a.string().required(),
        customerCompany: backend_1.a.string(),
        // Order items as JSON array
        items: backend_1.a.json().required(), // Array of {productId, sku, name, quantity, price}
        // Order totals
        subtotal: backend_1.a.float().required(),
        taxAmount: backend_1.a.float().default(0),
        shippingAmount: backend_1.a.float().default(0),
        discountAmount: backend_1.a.float().default(0),
        totalAmount: backend_1.a.float().required(),
        // Order status and tracking
        status: backend_1.a.enum([
            'PENDING',
            'CONFIRMED',
            'PROCESSING',
            'SHIPPED',
            'DELIVERED',
            'CANCELLED',
            'REFUNDED'
        ]),
        // Shipping information
        shippingAddress: backend_1.a.json().required(), // Address object
        billingAddress: backend_1.a.json(), // Optional separate billing address
        shippingMethod: backend_1.a.string(),
        trackingNumber: backend_1.a.string(),
        estimatedDelivery: backend_1.a.date(),
        // Payment information
        paymentMethod: backend_1.a.string(),
        paymentStatus: backend_1.a.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']),
        stripePaymentIntentId: backend_1.a.string(),
        // Order notes and metadata
        customerNotes: backend_1.a.string(),
        adminNotes: backend_1.a.string(),
        // Timestamps
        orderDate: backend_1.a.datetime().required(),
        confirmedAt: backend_1.a.datetime(),
        shippedAt: backend_1.a.datetime(),
        deliveredAt: backend_1.a.datetime(),
        createdAt: backend_1.a.datetime(),
        updatedAt: backend_1.a.datetime(),
    })
        .authorization((allow) => [
        // Users can create orders
        allow.authenticated().to(['create']),
        // Users can read their own orders
        allow.owner().to(['read']),
        // ADMIN can manage all orders
        allow.group('ADMIN').to(['create', 'read', 'update', 'delete']),
        // CUSTOMER group can read their own orders  
        allow.group('CUSTOMER').to(['read']),
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
    User: backend_1.a
        .model({
        userId: backend_1.a.string().required(), // Cognito user ID
        email: backend_1.a.string().required(),
        firstName: backend_1.a.string().required(),
        lastName: backend_1.a.string().required(),
        // Business information
        company: backend_1.a.string(),
        jobTitle: backend_1.a.string(),
        department: backend_1.a.string(),
        // Contact information
        phone: backend_1.a.string(),
        alternativeEmail: backend_1.a.string(),
        // Address information
        defaultShippingAddress: backend_1.a.json(),
        defaultBillingAddress: backend_1.a.json(),
        // User preferences
        preferredLanguage: backend_1.a.string().default('es'),
        emailNotifications: backend_1.a.boolean().default(true),
        smsNotifications: backend_1.a.boolean().default(false),
        // Business settings
        taxId: backend_1.a.string(), // For B2B customers
        creditLimit: backend_1.a.float().default(0),
        paymentTerms: backend_1.a.string().default('immediate'),
        // User role and status
        role: backend_1.a.enum(['ADMIN', 'CUSTOMER']),
        isActive: backend_1.a.boolean().default(true),
        // Timestamps
        lastLoginAt: backend_1.a.datetime(),
        createdAt: backend_1.a.datetime(),
        updatedAt: backend_1.a.datetime(),
    })
        .authorization((allow) => [
        // Users can read and update their own profile
        allow.owner().to(['read', 'update']),
        // ADMIN can manage all user profiles
        allow.group('ADMIN').to(['create', 'read', 'update', 'delete']),
        // Users can create their own profile during registration
        allow.authenticated().to(['create']),
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
exports.data = (0, backend_1.defineData)({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: 'userPool', // Use Cognito User Pool as default
        apiKeyAuthorizationMode: {
            expiresInDays: 30, // API key for public product access
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxrREFBd0U7QUFFeEU7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFNLE1BQU0sR0FBRyxXQUFDLENBQUMsTUFBTSxDQUFDO0lBQ3RCLDBEQUEwRDtJQUMxRCxPQUFPLEVBQUUsV0FBQztTQUNQLEtBQUssQ0FBQztRQUNMLEdBQUcsRUFBRSxXQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO1FBQzFCLElBQUksRUFBRSxXQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO1FBQzNCLFdBQVcsRUFBRSxXQUFDLENBQUMsTUFBTSxFQUFFO1FBQ3ZCLEtBQUssRUFBRSxXQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsUUFBUSxFQUFFO1FBQzNCLEtBQUssRUFBRSxXQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN4QyxRQUFRLEVBQUUsV0FBQyxDQUFDLE1BQU0sRUFBRTtRQUNwQixXQUFXLEVBQUUsV0FBQyxDQUFDLE1BQU0sRUFBRTtRQUN2QixLQUFLLEVBQUUsV0FBQyxDQUFDLE1BQU0sRUFBRTtRQUNqQixRQUFRLEVBQUUsV0FBQyxDQUFDLE1BQU0sRUFBRTtRQUNwQixTQUFTLEVBQUUsV0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLDBCQUEwQjtRQUN6RCxjQUFjLEVBQUUsV0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLG1DQUFtQztRQUM3RCxRQUFRLEVBQUUsV0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDbkMsTUFBTSxFQUFFLFdBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSw0QkFBNEI7UUFDL0MsVUFBVSxFQUFFLFdBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxxQ0FBcUM7UUFD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T0FBTyxDQUFDLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQztRQUN4QywyQkFBMkI7UUFDM0IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztRQUM3Qyx3QkFBd0I7UUFDeEIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7S0FDeEMsQ0FBQztDQUNMLENBQUMsQ0FBQztBQUlVLFFBQUEsSUFBSSxHQUFHLElBQUEsb0JBQVUsRUFBQztJQUM3QixNQUFNO0lBQ04sa0JBQWtCLEVBQUU7UUFDbEIsd0JBQXdCLEVBQUUsVUFBVSxFQUFFLG1DQUFtQztRQUN6RSx1QkFBdUIsRUFBRTtZQUN2QixhQUFhLEVBQUUsRUFBRSxFQUFFLG9DQUFvQztTQUN4RDtLQUNGO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdHlwZSBDbGllbnRTY2hlbWEsIGEsIGRlZmluZURhdGEgfSBmcm9tICdAYXdzLWFtcGxpZnkvYmFja2VuZCc7XHJcblxyXG4vKipcclxuICogUHJvdGV4IFdlYXIgLSBEYXRhIE1vZGVscyBhbmQgR3JhcGhRTCBTY2hlbWFcclxuICogRS1jb21tZXJjZSBwbGF0Zm9ybSBmb3Igd29yayBjbG90aGluZyBhbmQgUFBFIGRpc3RyaWJ1dGlvblxyXG4gKiBcclxuICogTW9kZWxzOlxyXG4gKiAtIFByb2R1Y3Q6IENhdGFsb2cgaXRlbXMgKFNLVSwgbmFtZSwgcHJpY2UsIHN0b2NrLCBpbWFnZXMpXHJcbiAqIC0gT3JkZXI6IEN1c3RvbWVyIG9yZGVycyB3aXRoIHByb2R1Y3RzIGFuZCBzdGF0dXMgdHJhY2tpbmdcclxuICogLSBVc2VyOiBFeHRlbmRlZCB1c2VyIHByb2ZpbGVzIHdpdGggY29tcGFueSBpbmZvcm1hdGlvblxyXG4gKi9cclxuY29uc3Qgc2NoZW1hID0gYS5zY2hlbWEoe1xyXG4gIC8vIFByb2R1Y3QgTW9kZWwgLSBDYXRhbG9nIGl0ZW1zIGZvciB3b3JrIGNsb3RoaW5nIGFuZCBQUEVcclxuICBQcm9kdWN0OiBhXHJcbiAgICAubW9kZWwoe1xyXG4gICAgICBza3U6IGEuc3RyaW5nKCkucmVxdWlyZWQoKSxcclxuICAgICAgbmFtZTogYS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxyXG4gICAgICBkZXNjcmlwdGlvbjogYS5zdHJpbmcoKSxcclxuICAgICAgcHJpY2U6IGEuZmxvYXQoKS5yZXF1aXJlZCgpLFxyXG4gICAgICBzdG9jazogYS5pbnRlZ2VyKCkucmVxdWlyZWQoKS5kZWZhdWx0KDApLFxyXG4gICAgICBjYXRlZ29yeTogYS5zdHJpbmcoKSxcclxuICAgICAgc3ViY2F0ZWdvcnk6IGEuc3RyaW5nKCksXHJcbiAgICAgIGJyYW5kOiBhLnN0cmluZygpLFxyXG4gICAgICBpbWFnZVVybDogYS5zdHJpbmcoKSxcclxuICAgICAgaW1hZ2VVcmxzOiBhLnN0cmluZygpLmFycmF5KCksIC8vIE11bHRpcGxlIHByb2R1Y3QgaW1hZ2VzXHJcbiAgICAgIHNwZWNpZmljYXRpb25zOiBhLmpzb24oKSwgLy8gVGVjaG5pY2FsIHNwZWNpZmljYXRpb25zIGFzIEpTT05cclxuICAgICAgaXNBY3RpdmU6IGEuYm9vbGVhbigpLmRlZmF1bHQodHJ1ZSksXHJcbiAgICAgIHdlaWdodDogYS5mbG9hdCgpLCAvLyBGb3Igc2hpcHBpbmcgY2FsY3VsYXRpb25zXHJcbiAgICAgIGRpbWVuc2lvbnM6IGEuanNvbigpLCAvLyBMZW5ndGgsIHdpZHRoLCBoZWlnaHQgZm9yIHNoaXBwaW5nXHJcbiAgICAgIHRhZ3M6IGEuc3RyaW5nKCkuYXJyYXkoKSwgLy8gU2VhcmNoIHRhZ3NcclxuICAgICAgY3JlYXRlZEF0OiBhLmRhdGV0aW1lKCksXHJcbiAgICAgIHVwZGF0ZWRBdDogYS5kYXRldGltZSgpLFxyXG4gICAgfSlcclxuICAgIC5hdXRob3JpemF0aW9uKChhbGxvdykgPT4gW1xyXG4gICAgICAvLyBQdWJsaWMgY2FuIHJlYWQgcHJvZHVjdHMgKGZvciBjYXRhbG9nIGJyb3dzaW5nKVxyXG4gICAgICBhbGxvdy5wdWJsaWNBcGlLZXkoKS50byhbJ3JlYWQnXSksXHJcbiAgICAgIC8vIEF1dGhlbnRpY2F0ZWQgdXNlcnMgY2FuIHJlYWQgcHJvZHVjdHNcclxuICAgICAgYWxsb3cuYXV0aGVudGljYXRlZCgpLnRvKFsncmVhZCddKSxcclxuICAgICAgLy8gT25seSBBRE1JTiBncm91cCBjYW4gbWFuYWdlIHByb2R1Y3RzXHJcbiAgICAgIGFsbG93Lmdyb3VwKCdBRE1JTicpLnRvKFsnY3JlYXRlJywgJ3JlYWQnLCAndXBkYXRlJywgJ2RlbGV0ZSddKSxcclxuICAgIF0pXHJcbiAgICAuc2Vjb25kYXJ5SW5kZXhlcygoaW5kZXgpID0+IFtcclxuICAgICAgLy8gR1NJIGZvciBlZmZpY2llbnQgcXVlcmllcyBieSBTS1VcclxuICAgICAgaW5kZXgoJ3NrdScpLnF1ZXJ5RmllbGQoJ3Byb2R1Y3RCeVNrdScpLFxyXG4gICAgICAvLyBHU0kgZm9yIGNhdGVnb3J5LWJhc2VkIHF1ZXJpZXNcclxuICAgICAgaW5kZXgoJ2NhdGVnb3J5JykucXVlcnlGaWVsZCgncHJvZHVjdHNCeUNhdGVnb3J5JyksXHJcbiAgICAgIC8vIEdTSSBmb3IgYnJhbmQtYmFzZWQgcXVlcmllcyAgXHJcbiAgICAgIGluZGV4KCdicmFuZCcpLnF1ZXJ5RmllbGQoJ3Byb2R1Y3RzQnlCcmFuZCcpLFxyXG4gICAgXSksXHJcblxyXG4gIC8vIE9yZGVyIE1vZGVsIC0gQ3VzdG9tZXIgb3JkZXJzIHdpdGggcHJvZHVjdHMgYW5kIHRyYWNraW5nXHJcbiAgT3JkZXI6IGFcclxuICAgIC5tb2RlbCh7XHJcbiAgICAgIHVzZXJJZDogYS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxyXG4gICAgICBjdXN0b21lckVtYWlsOiBhLnN0cmluZygpLnJlcXVpcmVkKCksXHJcbiAgICAgIGN1c3RvbWVyTmFtZTogYS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxyXG4gICAgICBjdXN0b21lckNvbXBhbnk6IGEuc3RyaW5nKCksXHJcbiAgICAgIFxyXG4gICAgICAvLyBPcmRlciBpdGVtcyBhcyBKU09OIGFycmF5XHJcbiAgICAgIGl0ZW1zOiBhLmpzb24oKS5yZXF1aXJlZCgpLCAvLyBBcnJheSBvZiB7cHJvZHVjdElkLCBza3UsIG5hbWUsIHF1YW50aXR5LCBwcmljZX1cclxuICAgICAgXHJcbiAgICAgIC8vIE9yZGVyIHRvdGFsc1xyXG4gICAgICBzdWJ0b3RhbDogYS5mbG9hdCgpLnJlcXVpcmVkKCksXHJcbiAgICAgIHRheEFtb3VudDogYS5mbG9hdCgpLmRlZmF1bHQoMCksXHJcbiAgICAgIHNoaXBwaW5nQW1vdW50OiBhLmZsb2F0KCkuZGVmYXVsdCgwKSxcclxuICAgICAgZGlzY291bnRBbW91bnQ6IGEuZmxvYXQoKS5kZWZhdWx0KDApLFxyXG4gICAgICB0b3RhbEFtb3VudDogYS5mbG9hdCgpLnJlcXVpcmVkKCksXHJcbiAgICAgIFxyXG4gICAgICAvLyBPcmRlciBzdGF0dXMgYW5kIHRyYWNraW5nXHJcbiAgICAgIHN0YXR1czogYS5lbnVtKFtcclxuICAgICAgICAnUEVORElORycsXHJcbiAgICAgICAgJ0NPTkZJUk1FRCcsIFxyXG4gICAgICAgICdQUk9DRVNTSU5HJyxcclxuICAgICAgICAnU0hJUFBFRCcsXHJcbiAgICAgICAgJ0RFTElWRVJFRCcsXHJcbiAgICAgICAgJ0NBTkNFTExFRCcsXHJcbiAgICAgICAgJ1JFRlVOREVEJ1xyXG4gICAgICBdKSxcclxuICAgICAgXHJcbiAgICAgIC8vIFNoaXBwaW5nIGluZm9ybWF0aW9uXHJcbiAgICAgIHNoaXBwaW5nQWRkcmVzczogYS5qc29uKCkucmVxdWlyZWQoKSwgLy8gQWRkcmVzcyBvYmplY3RcclxuICAgICAgYmlsbGluZ0FkZHJlc3M6IGEuanNvbigpLCAvLyBPcHRpb25hbCBzZXBhcmF0ZSBiaWxsaW5nIGFkZHJlc3NcclxuICAgICAgc2hpcHBpbmdNZXRob2Q6IGEuc3RyaW5nKCksXHJcbiAgICAgIHRyYWNraW5nTnVtYmVyOiBhLnN0cmluZygpLFxyXG4gICAgICBlc3RpbWF0ZWREZWxpdmVyeTogYS5kYXRlKCksXHJcbiAgICAgIFxyXG4gICAgICAvLyBQYXltZW50IGluZm9ybWF0aW9uXHJcbiAgICAgIHBheW1lbnRNZXRob2Q6IGEuc3RyaW5nKCksXHJcbiAgICAgIHBheW1lbnRTdGF0dXM6IGEuZW51bShbJ1BFTkRJTkcnLCAnUEFJRCcsICdGQUlMRUQnLCAnUkVGVU5ERUQnXSksXHJcbiAgICAgIHN0cmlwZVBheW1lbnRJbnRlbnRJZDogYS5zdHJpbmcoKSxcclxuICAgICAgXHJcbiAgICAgIC8vIE9yZGVyIG5vdGVzIGFuZCBtZXRhZGF0YVxyXG4gICAgICBjdXN0b21lck5vdGVzOiBhLnN0cmluZygpLFxyXG4gICAgICBhZG1pbk5vdGVzOiBhLnN0cmluZygpLFxyXG4gICAgICBcclxuICAgICAgLy8gVGltZXN0YW1wc1xyXG4gICAgICBvcmRlckRhdGU6IGEuZGF0ZXRpbWUoKS5yZXF1aXJlZCgpLFxyXG4gICAgICBjb25maXJtZWRBdDogYS5kYXRldGltZSgpLFxyXG4gICAgICBzaGlwcGVkQXQ6IGEuZGF0ZXRpbWUoKSxcclxuICAgICAgZGVsaXZlcmVkQXQ6IGEuZGF0ZXRpbWUoKSxcclxuICAgICAgY3JlYXRlZEF0OiBhLmRhdGV0aW1lKCksXHJcbiAgICAgIHVwZGF0ZWRBdDogYS5kYXRldGltZSgpLFxyXG4gICAgfSlcclxuICAgIC5hdXRob3JpemF0aW9uKChhbGxvdykgPT4gW1xyXG4gICAgICAvLyBVc2VycyBjYW4gY3JlYXRlIG9yZGVyc1xyXG4gICAgICBhbGxvdy5hdXRoZW50aWNhdGVkKCkudG8oWydjcmVhdGUnXSksXHJcbiAgICAgIC8vIFVzZXJzIGNhbiByZWFkIHRoZWlyIG93biBvcmRlcnNcclxuICAgICAgYWxsb3cub3duZXIoKS50byhbJ3JlYWQnXSksXHJcbiAgICAgIC8vIEFETUlOIGNhbiBtYW5hZ2UgYWxsIG9yZGVyc1xyXG4gICAgICBhbGxvdy5ncm91cCgnQURNSU4nKS50byhbJ2NyZWF0ZScsICdyZWFkJywgJ3VwZGF0ZScsICdkZWxldGUnXSksXHJcbiAgICAgIC8vIENVU1RPTUVSIGdyb3VwIGNhbiByZWFkIHRoZWlyIG93biBvcmRlcnMgIFxyXG4gICAgICBhbGxvdy5ncm91cCgnQ1VTVE9NRVInKS50byhbJ3JlYWQnXSksXHJcbiAgICBdKVxyXG4gICAgLnNlY29uZGFyeUluZGV4ZXMoKGluZGV4KSA9PiBbXHJcbiAgICAgIC8vIEdTSSBmb3IgdXNlcidzIG9yZGVyc1xyXG4gICAgICBpbmRleCgndXNlcklkJykucXVlcnlGaWVsZCgnb3JkZXJzQnlVc2VyJyksXHJcbiAgICAgIC8vIEdTSSBmb3Igb3JkZXJzIGJ5IHN0YXR1c1xyXG4gICAgICBpbmRleCgnc3RhdHVzJykucXVlcnlGaWVsZCgnb3JkZXJzQnlTdGF0dXMnKSxcclxuICAgICAgLy8gR1NJIGZvciBvcmRlcnMgYnkgZGF0ZVxyXG4gICAgICBpbmRleCgnb3JkZXJEYXRlJykucXVlcnlGaWVsZCgnb3JkZXJzQnlEYXRlJyksXHJcbiAgICAgIC8vIEdTSSBmb3Igb3JkZXJzIGJ5IGN1c3RvbWVyIGVtYWlsXHJcbiAgICAgIGluZGV4KCdjdXN0b21lckVtYWlsJykucXVlcnlGaWVsZCgnb3JkZXJzQnlDdXN0b21lcicpLFxyXG4gICAgXSksXHJcblxyXG4gIC8vIFVzZXIgTW9kZWwgLSBFeHRlbmRlZCB1c2VyIHByb2ZpbGVzIHdpdGggYnVzaW5lc3MgaW5mb3JtYXRpb25cclxuICBVc2VyOiBhXHJcbiAgICAubW9kZWwoe1xyXG4gICAgICB1c2VySWQ6IGEuc3RyaW5nKCkucmVxdWlyZWQoKSwgLy8gQ29nbml0byB1c2VyIElEXHJcbiAgICAgIGVtYWlsOiBhLnN0cmluZygpLnJlcXVpcmVkKCksXHJcbiAgICAgIGZpcnN0TmFtZTogYS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxyXG4gICAgICBsYXN0TmFtZTogYS5zdHJpbmcoKS5yZXF1aXJlZCgpLFxyXG4gICAgICBcclxuICAgICAgLy8gQnVzaW5lc3MgaW5mb3JtYXRpb25cclxuICAgICAgY29tcGFueTogYS5zdHJpbmcoKSxcclxuICAgICAgam9iVGl0bGU6IGEuc3RyaW5nKCksXHJcbiAgICAgIGRlcGFydG1lbnQ6IGEuc3RyaW5nKCksXHJcbiAgICAgIFxyXG4gICAgICAvLyBDb250YWN0IGluZm9ybWF0aW9uXHJcbiAgICAgIHBob25lOiBhLnN0cmluZygpLFxyXG4gICAgICBhbHRlcm5hdGl2ZUVtYWlsOiBhLnN0cmluZygpLFxyXG4gICAgICBcclxuICAgICAgLy8gQWRkcmVzcyBpbmZvcm1hdGlvblxyXG4gICAgICBkZWZhdWx0U2hpcHBpbmdBZGRyZXNzOiBhLmpzb24oKSxcclxuICAgICAgZGVmYXVsdEJpbGxpbmdBZGRyZXNzOiBhLmpzb24oKSxcclxuICAgICAgXHJcbiAgICAgIC8vIFVzZXIgcHJlZmVyZW5jZXNcclxuICAgICAgcHJlZmVycmVkTGFuZ3VhZ2U6IGEuc3RyaW5nKCkuZGVmYXVsdCgnZXMnKSxcclxuICAgICAgZW1haWxOb3RpZmljYXRpb25zOiBhLmJvb2xlYW4oKS5kZWZhdWx0KHRydWUpLFxyXG4gICAgICBzbXNOb3RpZmljYXRpb25zOiBhLmJvb2xlYW4oKS5kZWZhdWx0KGZhbHNlKSxcclxuICAgICAgXHJcbiAgICAgIC8vIEJ1c2luZXNzIHNldHRpbmdzXHJcbiAgICAgIHRheElkOiBhLnN0cmluZygpLCAvLyBGb3IgQjJCIGN1c3RvbWVyc1xyXG4gICAgICBjcmVkaXRMaW1pdDogYS5mbG9hdCgpLmRlZmF1bHQoMCksXHJcbiAgICAgIHBheW1lbnRUZXJtczogYS5zdHJpbmcoKS5kZWZhdWx0KCdpbW1lZGlhdGUnKSxcclxuICAgICAgXHJcbiAgICAgIC8vIFVzZXIgcm9sZSBhbmQgc3RhdHVzXHJcbiAgICAgIHJvbGU6IGEuZW51bShbJ0FETUlOJywgJ0NVU1RPTUVSJ10pLFxyXG4gICAgICBpc0FjdGl2ZTogYS5ib29sZWFuKCkuZGVmYXVsdCh0cnVlKSxcclxuICAgICAgXHJcbiAgICAgIC8vIFRpbWVzdGFtcHNcclxuICAgICAgbGFzdExvZ2luQXQ6IGEuZGF0ZXRpbWUoKSxcclxuICAgICAgY3JlYXRlZEF0OiBhLmRhdGV0aW1lKCksXHJcbiAgICAgIHVwZGF0ZWRBdDogYS5kYXRldGltZSgpLFxyXG4gICAgfSlcclxuICAgIC5hdXRob3JpemF0aW9uKChhbGxvdykgPT4gW1xyXG4gICAgICAvLyBVc2VycyBjYW4gcmVhZCBhbmQgdXBkYXRlIHRoZWlyIG93biBwcm9maWxlXHJcbiAgICAgIGFsbG93Lm93bmVyKCkudG8oWydyZWFkJywgJ3VwZGF0ZSddKSxcclxuICAgICAgLy8gQURNSU4gY2FuIG1hbmFnZSBhbGwgdXNlciBwcm9maWxlc1xyXG4gICAgICBhbGxvdy5ncm91cCgnQURNSU4nKS50byhbJ2NyZWF0ZScsICdyZWFkJywgJ3VwZGF0ZScsICdkZWxldGUnXSksXHJcbiAgICAgIC8vIFVzZXJzIGNhbiBjcmVhdGUgdGhlaXIgb3duIHByb2ZpbGUgZHVyaW5nIHJlZ2lzdHJhdGlvblxyXG4gICAgICBhbGxvdy5hdXRoZW50aWNhdGVkKCkudG8oWydjcmVhdGUnXSksXHJcbiAgICBdKVxyXG4gICAgLnNlY29uZGFyeUluZGV4ZXMoKGluZGV4KSA9PiBbXHJcbiAgICAgIC8vIEdTSSBmb3IgdXNlciBsb29rdXAgYnkgZW1haWxcclxuICAgICAgaW5kZXgoJ2VtYWlsJykucXVlcnlGaWVsZCgndXNlckJ5RW1haWwnKSxcclxuICAgICAgLy8gR1NJIGZvciB1c2VycyBieSBjb21wYW55XHJcbiAgICAgIGluZGV4KCdjb21wYW55JykucXVlcnlGaWVsZCgndXNlcnNCeUNvbXBhbnknKSxcclxuICAgICAgLy8gR1NJIGZvciB1c2VycyBieSByb2xlXHJcbiAgICAgIGluZGV4KCdyb2xlJykucXVlcnlGaWVsZCgndXNlcnNCeVJvbGUnKSxcclxuICAgIF0pLFxyXG59KTtcclxuXHJcbmV4cG9ydCB0eXBlIFNjaGVtYSA9IENsaWVudFNjaGVtYTx0eXBlb2Ygc2NoZW1hPjtcclxuXHJcbmV4cG9ydCBjb25zdCBkYXRhID0gZGVmaW5lRGF0YSh7XHJcbiAgc2NoZW1hLFxyXG4gIGF1dGhvcml6YXRpb25Nb2Rlczoge1xyXG4gICAgZGVmYXVsdEF1dGhvcml6YXRpb25Nb2RlOiAndXNlclBvb2wnLCAvLyBVc2UgQ29nbml0byBVc2VyIFBvb2wgYXMgZGVmYXVsdFxyXG4gICAgYXBpS2V5QXV0aG9yaXphdGlvbk1vZGU6IHtcclxuICAgICAgZXhwaXJlc0luRGF5czogMzAsIC8vIEFQSSBrZXkgZm9yIHB1YmxpYyBwcm9kdWN0IGFjY2Vzc1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIl19