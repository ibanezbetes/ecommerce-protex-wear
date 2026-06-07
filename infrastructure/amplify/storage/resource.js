"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
const backend_1 = require("@aws-amplify/backend");
/**
 * Protex Wear - S3 Storage Configuration
 * Storage for product images and other assets
 *
 * Access Policies:
 * - Public read access for product images (catalog browsing)
 * - Authenticated write access for image uploads
 * - Admin full access for management
 */
exports.storage = (0, backend_1.defineStorage)({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxrREFBcUQ7QUFFckQ7Ozs7Ozs7O0dBUUc7QUFDVSxRQUFBLE9BQU8sR0FBRyxJQUFBLHVCQUFhLEVBQUM7SUFDbkMsSUFBSSxFQUFFLG1CQUFtQjtJQUN6QixNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbEIsb0RBQW9EO1FBQ3BELGtCQUFrQixFQUFFO1lBQ2xCLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxpQ0FBaUM7WUFDM0QsS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRSxpQ0FBaUM7WUFDNUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLG9CQUFvQjtTQUM5RTtRQUVELHFDQUFxQztRQUNyQyxrQkFBa0IsRUFBRTtZQUNsQixLQUFLLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN6QyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ3hEO1FBRUQsd0RBQXdEO1FBQ3hELG1CQUFtQixFQUFFO1lBQ25CLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3pDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDeEQ7UUFFRCwrREFBK0Q7UUFDL0Qsa0JBQWtCLEVBQUU7WUFDbEIsS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNoQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ3hEO1FBRUQsK0NBQStDO1FBQy9DLGdCQUFnQixFQUFFO1lBQ2hCLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztTQUNwRDtLQUNGLENBQUM7Q0FDSCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkZWZpbmVTdG9yYWdlIH0gZnJvbSAnQGF3cy1hbXBsaWZ5L2JhY2tlbmQnO1xyXG5cclxuLyoqXHJcbiAqIFByb3RleCBXZWFyIC0gUzMgU3RvcmFnZSBDb25maWd1cmF0aW9uXHJcbiAqIFN0b3JhZ2UgZm9yIHByb2R1Y3QgaW1hZ2VzIGFuZCBvdGhlciBhc3NldHNcclxuICogXHJcbiAqIEFjY2VzcyBQb2xpY2llczpcclxuICogLSBQdWJsaWMgcmVhZCBhY2Nlc3MgZm9yIHByb2R1Y3QgaW1hZ2VzIChjYXRhbG9nIGJyb3dzaW5nKVxyXG4gKiAtIEF1dGhlbnRpY2F0ZWQgd3JpdGUgYWNjZXNzIGZvciBpbWFnZSB1cGxvYWRzXHJcbiAqIC0gQWRtaW4gZnVsbCBhY2Nlc3MgZm9yIG1hbmFnZW1lbnRcclxuICovXHJcbmV4cG9ydCBjb25zdCBzdG9yYWdlID0gZGVmaW5lU3RvcmFnZSh7XHJcbiAgbmFtZTogJ3Byb3RleFdlYXJTdG9yYWdlJyxcclxuICBhY2Nlc3M6IChhbGxvdykgPT4gKHtcclxuICAgIC8vIFByb2R1Y3QgaW1hZ2VzIC0gcHVibGljIHJlYWQsIGF1dGhlbnRpY2F0ZWQgd3JpdGVcclxuICAgICdwcm9kdWN0LWltYWdlcy8qJzogW1xyXG4gICAgICBhbGxvdy5ndWVzdC50byhbJ3JlYWQnXSksIC8vIFB1YmxpYyBjYW4gdmlldyBwcm9kdWN0IGltYWdlc1xyXG4gICAgICBhbGxvdy5hdXRoZW50aWNhdGVkLnRvKFsncmVhZCcsICd3cml0ZSddKSwgLy8gQXV0aGVudGljYXRlZCB1c2VycyBjYW4gdXBsb2FkXHJcbiAgICAgIGFsbG93Lmdyb3VwcyhbJ0FETUlOJ10pLnRvKFsncmVhZCcsICd3cml0ZScsICdkZWxldGUnXSksIC8vIEFkbWlucyBjYW4gbWFuYWdlXHJcbiAgICBdLFxyXG5cclxuICAgIC8vIFVzZXIgcHJvZmlsZSBpbWFnZXMgLSBvd25lciBhY2Nlc3NcclxuICAgICdwcm9maWxlLWltYWdlcy8qJzogW1xyXG4gICAgICBhbGxvdy5hdXRoZW50aWNhdGVkLnRvKFsncmVhZCcsICd3cml0ZSddKSxcclxuICAgICAgYWxsb3cuZ3JvdXBzKFsnQURNSU4nXSkudG8oWydyZWFkJywgJ3dyaXRlJywgJ2RlbGV0ZSddKSxcclxuICAgIF0sXHJcblxyXG4gICAgLy8gT3JkZXIgZG9jdW1lbnRzIGFuZCByZWNlaXB0cyAtIG93bmVyIGFuZCBhZG1pbiBhY2Nlc3NcclxuICAgICdvcmRlci1kb2N1bWVudHMvKic6IFtcclxuICAgICAgYWxsb3cuYXV0aGVudGljYXRlZC50byhbJ3JlYWQnLCAnd3JpdGUnXSksXHJcbiAgICAgIGFsbG93Lmdyb3VwcyhbJ0FETUlOJ10pLnRvKFsncmVhZCcsICd3cml0ZScsICdkZWxldGUnXSksXHJcbiAgICBdLFxyXG5cclxuICAgIC8vIENvbXBhbnkgbG9nb3MgYW5kIGJyYW5kaW5nIC0gYXV0aGVudGljYXRlZCByZWFkLCBhZG1pbiB3cml0ZVxyXG4gICAgJ2NvbXBhbnktYXNzZXRzLyonOiBbXHJcbiAgICAgIGFsbG93LmF1dGhlbnRpY2F0ZWQudG8oWydyZWFkJ10pLFxyXG4gICAgICBhbGxvdy5ncm91cHMoWydBRE1JTiddKS50byhbJ3JlYWQnLCAnd3JpdGUnLCAnZGVsZXRlJ10pLFxyXG4gICAgXSxcclxuXHJcbiAgICAvLyBUZW1wb3JhcnkgdXBsb2FkcyAtIGF1dGhlbnRpY2F0ZWQgdXNlcnMgb25seVxyXG4gICAgJ3RlbXAtdXBsb2Fkcy8qJzogW1xyXG4gICAgICBhbGxvdy5hdXRoZW50aWNhdGVkLnRvKFsncmVhZCcsICd3cml0ZScsICdkZWxldGUnXSksXHJcbiAgICBdLFxyXG4gIH0pLFxyXG59KTsiXX0=