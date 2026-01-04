import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource for Protex Wear
 * Multi-role authentication with ADMIN and CUSTOMER groups
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
    },
    'given_name': {
      dataType: 'String',
      mutable: true,
    },
    'family_name': {
      dataType: 'String',
      mutable: true,
    },
    'custom:company': {
      dataType: 'String',
      mutable: true,
    },
  },
  groups: ['ADMIN', 'CUSTOMER'],
  access: (allow) => [
    allow.resource(auth).to(['manageUsers']).groupsInUserPool(['ADMIN']),
  ],
});
