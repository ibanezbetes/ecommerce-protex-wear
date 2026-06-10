"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const cognitoClient = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({});
/**
 * Post Confirmation Lambda Trigger for Protex Wear
 * Adds newly confirmed users to the appropriate group based on their role
 * Sets default CUSTOMER role if no role is specified
 */
const handler = async (event) => {
    console.log('Post Confirmation trigger executed for user:', event.userName);
    try {
        // Get user role from attributes, default to CUSTOMER if not set
        let userRole = event.request.userAttributes['custom:role'];
        // If no role is set, assign CUSTOMER role
        if (!userRole) {
            userRole = 'CUSTOMER';
            // Update user attributes to include the default role
            const updateAttributesCommand = new client_cognito_identity_provider_1.AdminUpdateUserAttributesCommand({
                UserPoolId: event.userPoolId,
                Username: event.userName,
                UserAttributes: [
                    {
                        Name: 'custom:role',
                        Value: 'CUSTOMER',
                    },
                ],
            });
            await cognitoClient.send(updateAttributesCommand);
            console.log(`Default CUSTOMER role assigned to user: ${event.userName}`);
        }
        // Add user to the appropriate group
        const addToGroupCommand = new client_cognito_identity_provider_1.AdminAddUserToGroupCommand({
            UserPoolId: event.userPoolId,
            Username: event.userName,
            GroupName: userRole,
        });
        await cognitoClient.send(addToGroupCommand);
        console.log(`User ${event.userName} successfully added to group: ${userRole}`);
        // Log user confirmation for monitoring
        console.log('User confirmed with details:', {
            username: event.userName,
            email: event.request.userAttributes.email,
            given_name: event.request.userAttributes.given_name,
            family_name: event.request.userAttributes.family_name,
            company: event.request.userAttributes['custom:company'],
            role: userRole,
            userPoolId: event.userPoolId,
        });
    }
    catch (error) {
        console.error('Error in post-confirmation trigger:', error);
        // Don't throw error to avoid blocking user confirmation
        // The user will still be confirmed but might not be in a group or have role set
    }
    return event;
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsZ0dBQXdKO0FBRXhKLE1BQU0sYUFBYSxHQUFHLElBQUksZ0VBQTZCLENBQUMsRUFBRSxDQUFDLENBQUM7QUFFNUQ7Ozs7R0FJRztBQUNJLE1BQU0sT0FBTyxHQUFtQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7SUFDckUsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4Q0FBOEMsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFNUUsSUFBSSxDQUFDO1FBQ0gsZ0VBQWdFO1FBQ2hFLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRTNELDBDQUEwQztRQUMxQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDZCxRQUFRLEdBQUcsVUFBVSxDQUFDO1lBRXRCLHFEQUFxRDtZQUNyRCxNQUFNLHVCQUF1QixHQUFHLElBQUksbUVBQWdDLENBQUM7Z0JBQ25FLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtnQkFDNUIsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO2dCQUN4QixjQUFjLEVBQUU7b0JBQ2Q7d0JBQ0UsSUFBSSxFQUFFLGFBQWE7d0JBQ25CLEtBQUssRUFBRSxVQUFVO3FCQUNsQjtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUVILE1BQU0sYUFBYSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1lBQ2xELE9BQU8sQ0FBQyxHQUFHLENBQUMsMkNBQTJDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQzNFLENBQUM7UUFFRCxvQ0FBb0M7UUFDcEMsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLDZEQUEwQixDQUFDO1lBQ3ZELFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtZQUM1QixRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7WUFDeEIsU0FBUyxFQUFFLFFBQVE7U0FDcEIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxhQUFhLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFFNUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssQ0FBQyxRQUFRLGlDQUFpQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBRS9FLHVDQUF1QztRQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFO1lBQzFDLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtZQUN4QixLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsS0FBSztZQUN6QyxVQUFVLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsVUFBVTtZQUNuRCxXQUFXLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsV0FBVztZQUNyRCxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUM7WUFDdkQsSUFBSSxFQUFFLFFBQVE7WUFDZCxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7U0FDN0IsQ0FBQyxDQUFDO0lBRUwsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPLENBQUMsS0FBSyxDQUFDLHFDQUFxQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzVELHdEQUF3RDtRQUN4RCxnRkFBZ0Y7SUFDbEYsQ0FBQztJQUVELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBeERXLFFBQUEsT0FBTyxXQXdEbEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFBvc3RDb25maXJtYXRpb25UcmlnZ2VySGFuZGxlciB9IGZyb20gJ2F3cy1sYW1iZGEnO1xyXG5pbXBvcnQgeyBDb2duaXRvSWRlbnRpdHlQcm92aWRlckNsaWVudCwgQWRtaW5BZGRVc2VyVG9Hcm91cENvbW1hbmQsIEFkbWluVXBkYXRlVXNlckF0dHJpYnV0ZXNDb21tYW5kIH0gZnJvbSAnQGF3cy1zZGsvY2xpZW50LWNvZ25pdG8taWRlbnRpdHktcHJvdmlkZXInO1xyXG5cclxuY29uc3QgY29nbml0b0NsaWVudCA9IG5ldyBDb2duaXRvSWRlbnRpdHlQcm92aWRlckNsaWVudCh7fSk7XHJcblxyXG4vKipcclxuICogUG9zdCBDb25maXJtYXRpb24gTGFtYmRhIFRyaWdnZXIgZm9yIFByb3RleCBXZWFyXHJcbiAqIEFkZHMgbmV3bHkgY29uZmlybWVkIHVzZXJzIHRvIHRoZSBhcHByb3ByaWF0ZSBncm91cCBiYXNlZCBvbiB0aGVpciByb2xlXHJcbiAqIFNldHMgZGVmYXVsdCBDVVNUT01FUiByb2xlIGlmIG5vIHJvbGUgaXMgc3BlY2lmaWVkXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgaGFuZGxlcjogUG9zdENvbmZpcm1hdGlvblRyaWdnZXJIYW5kbGVyID0gYXN5bmMgKGV2ZW50KSA9PiB7XHJcbiAgY29uc29sZS5sb2coJ1Bvc3QgQ29uZmlybWF0aW9uIHRyaWdnZXIgZXhlY3V0ZWQgZm9yIHVzZXI6JywgZXZlbnQudXNlck5hbWUpO1xyXG5cclxuICB0cnkge1xyXG4gICAgLy8gR2V0IHVzZXIgcm9sZSBmcm9tIGF0dHJpYnV0ZXMsIGRlZmF1bHQgdG8gQ1VTVE9NRVIgaWYgbm90IHNldFxyXG4gICAgbGV0IHVzZXJSb2xlID0gZXZlbnQucmVxdWVzdC51c2VyQXR0cmlidXRlc1snY3VzdG9tOnJvbGUnXTtcclxuICAgIFxyXG4gICAgLy8gSWYgbm8gcm9sZSBpcyBzZXQsIGFzc2lnbiBDVVNUT01FUiByb2xlXHJcbiAgICBpZiAoIXVzZXJSb2xlKSB7XHJcbiAgICAgIHVzZXJSb2xlID0gJ0NVU1RPTUVSJztcclxuICAgICAgXHJcbiAgICAgIC8vIFVwZGF0ZSB1c2VyIGF0dHJpYnV0ZXMgdG8gaW5jbHVkZSB0aGUgZGVmYXVsdCByb2xlXHJcbiAgICAgIGNvbnN0IHVwZGF0ZUF0dHJpYnV0ZXNDb21tYW5kID0gbmV3IEFkbWluVXBkYXRlVXNlckF0dHJpYnV0ZXNDb21tYW5kKHtcclxuICAgICAgICBVc2VyUG9vbElkOiBldmVudC51c2VyUG9vbElkLFxyXG4gICAgICAgIFVzZXJuYW1lOiBldmVudC51c2VyTmFtZSxcclxuICAgICAgICBVc2VyQXR0cmlidXRlczogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBOYW1lOiAnY3VzdG9tOnJvbGUnLFxyXG4gICAgICAgICAgICBWYWx1ZTogJ0NVU1RPTUVSJyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBhd2FpdCBjb2duaXRvQ2xpZW50LnNlbmQodXBkYXRlQXR0cmlidXRlc0NvbW1hbmQpO1xyXG4gICAgICBjb25zb2xlLmxvZyhgRGVmYXVsdCBDVVNUT01FUiByb2xlIGFzc2lnbmVkIHRvIHVzZXI6ICR7ZXZlbnQudXNlck5hbWV9YCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIEFkZCB1c2VyIHRvIHRoZSBhcHByb3ByaWF0ZSBncm91cFxyXG4gICAgY29uc3QgYWRkVG9Hcm91cENvbW1hbmQgPSBuZXcgQWRtaW5BZGRVc2VyVG9Hcm91cENvbW1hbmQoe1xyXG4gICAgICBVc2VyUG9vbElkOiBldmVudC51c2VyUG9vbElkLFxyXG4gICAgICBVc2VybmFtZTogZXZlbnQudXNlck5hbWUsXHJcbiAgICAgIEdyb3VwTmFtZTogdXNlclJvbGUsXHJcbiAgICB9KTtcclxuXHJcbiAgICBhd2FpdCBjb2duaXRvQ2xpZW50LnNlbmQoYWRkVG9Hcm91cENvbW1hbmQpO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKGBVc2VyICR7ZXZlbnQudXNlck5hbWV9IHN1Y2Nlc3NmdWxseSBhZGRlZCB0byBncm91cDogJHt1c2VyUm9sZX1gKTtcclxuXHJcbiAgICAvLyBMb2cgdXNlciBjb25maXJtYXRpb24gZm9yIG1vbml0b3JpbmdcclxuICAgIGNvbnNvbGUubG9nKCdVc2VyIGNvbmZpcm1lZCB3aXRoIGRldGFpbHM6Jywge1xyXG4gICAgICB1c2VybmFtZTogZXZlbnQudXNlck5hbWUsXHJcbiAgICAgIGVtYWlsOiBldmVudC5yZXF1ZXN0LnVzZXJBdHRyaWJ1dGVzLmVtYWlsLFxyXG4gICAgICBnaXZlbl9uYW1lOiBldmVudC5yZXF1ZXN0LnVzZXJBdHRyaWJ1dGVzLmdpdmVuX25hbWUsXHJcbiAgICAgIGZhbWlseV9uYW1lOiBldmVudC5yZXF1ZXN0LnVzZXJBdHRyaWJ1dGVzLmZhbWlseV9uYW1lLFxyXG4gICAgICBjb21wYW55OiBldmVudC5yZXF1ZXN0LnVzZXJBdHRyaWJ1dGVzWydjdXN0b206Y29tcGFueSddLFxyXG4gICAgICByb2xlOiB1c2VyUm9sZSxcclxuICAgICAgdXNlclBvb2xJZDogZXZlbnQudXNlclBvb2xJZCxcclxuICAgIH0pO1xyXG5cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgaW4gcG9zdC1jb25maXJtYXRpb24gdHJpZ2dlcjonLCBlcnJvcik7XHJcbiAgICAvLyBEb24ndCB0aHJvdyBlcnJvciB0byBhdm9pZCBibG9ja2luZyB1c2VyIGNvbmZpcm1hdGlvblxyXG4gICAgLy8gVGhlIHVzZXIgd2lsbCBzdGlsbCBiZSBjb25maXJtZWQgYnV0IG1pZ2h0IG5vdCBiZSBpbiBhIGdyb3VwIG9yIGhhdmUgcm9sZSBzZXRcclxuICB9XHJcblxyXG4gIHJldHVybiBldmVudDtcclxufTsiXX0=