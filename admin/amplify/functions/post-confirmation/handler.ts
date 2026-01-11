import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import { CognitoIdentityProviderClient, AdminAddUserToGroupCommand, AdminUpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';

const cognitoClient = new CognitoIdentityProviderClient({});

/**
 * Post Confirmation Lambda Trigger for Protex Wear
 * Adds newly confirmed users to the appropriate group based on their role
 * Sets default CUSTOMER role if no role is specified
 */
export const handler: PostConfirmationTriggerHandler = async (event) => {
  console.log('Post Confirmation trigger executed for user:', event.userName);

  try {
    // Get user role from attributes, default to CUSTOMER if not set
    let userRole = event.request.userAttributes['custom:role'];
    
    // If no role is set, assign CUSTOMER role
    if (!userRole) {
      userRole = 'CUSTOMER';
      
      // Update user attributes to include the default role
      const updateAttributesCommand = new AdminUpdateUserAttributesCommand({
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
    const addToGroupCommand = new AdminAddUserToGroupCommand({
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

  } catch (error) {
    console.error('Error in post-confirmation trigger:', error);
    // Don't throw error to avoid blocking user confirmation
    // The user will still be confirmed but might not be in a group or have role set
  }

  return event;
};