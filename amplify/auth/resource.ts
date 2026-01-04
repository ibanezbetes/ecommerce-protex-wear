import { defineAuth } from '@aws-amplify/backend';
import { preSignUp } from '../functions/pre-sign-up/resource';
import { postConfirmation } from '../functions/post-confirmation/resource';

/**
 * Define and configure your auth resource for Protex Wear
 * Multi-role authentication with ADMIN and CUSTOMER groups
 * Supports both login and user registration with automatic role assignment
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    'custom:role': {
      dataType: 'String',
      mutable: true,
      required: false, // Will be set to CUSTOMER by default via trigger
    },
    'given_name': {
      dataType: 'String',
      mutable: true,
      required: true,
    },
    'family_name': {
      dataType: 'String',
      mutable: true,
      required: true,
    },
    'custom:company': {
      dataType: 'String',
      mutable: true,
      required: false,
    },
  },
  groups: ['ADMIN', 'CUSTOMER'],
  access: (allow) => [
    allow.resource(auth).to(['manageUsers']).groupsInUserPool(['ADMIN']),
  ],
  // Configure Lambda triggers for user registration
  triggers: {
    preSignUp,
    postConfirmation,
  },
  // Configure user registration settings
  userInvitation: {
    emailSubject: 'Bienvenido a Protex Wear - Confirma tu cuenta',
    emailBody: 'Hola {username}, bienvenido a Protex Wear. Tu código de verificación temporal es {####}',
  },
  userVerification: {
    emailSubject: 'Protex Wear - Código de verificación',
    emailBody: 'Tu código de verificación para Protex Wear es {####}',
  },
  // Configure password policy
  passwordPolicy: {
    minLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
  },
});
