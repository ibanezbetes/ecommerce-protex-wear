import type { PreSignUpTriggerHandler } from 'aws-lambda';

/**
 * Pre Sign Up Lambda Trigger for Protex Wear
 * Automatically assigns CUSTOMER role to new user registrations
 * and auto-confirms users
 */
export const handler: PreSignUpTriggerHandler = async (event) => {
  console.log('Pre Sign Up trigger executed for user:', event.userName);

  // Auto-confirm user (skip email verification for self-registration)
  event.response.autoConfirmUser = true;
  event.response.autoVerifyEmail = true;

  // For new registrations without a role, we'll handle role assignment in post-confirmation
  // The pre-sign-up trigger is mainly for auto-confirmation

  // Log the user registration for monitoring
  console.log('User registered with attributes:', {
    email: event.request.userAttributes.email,
    given_name: event.request.userAttributes.given_name,
    family_name: event.request.userAttributes.family_name,
    company: event.request.userAttributes['custom:company'],
    role: event.request.userAttributes['custom:role'] || 'CUSTOMER (will be set in post-confirmation)',
  });

  return event;
};