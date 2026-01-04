import { Amplify } from 'aws-amplify';
import type { ResourcesConfig } from 'aws-amplify';

/**
 * Amplify Configuration for Frontend
 * This will be automatically generated when running `npx ampx sandbox`
 * For now, we'll use a placeholder configuration
 */

// This configuration will be replaced by the actual Amplify configuration
// when the sandbox is running. For development without sandbox, we use mock values.
const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.VITE_USER_POOL_ID || 'us-east-1_XXXXXXXXX',
      userPoolClientId: process.env.VITE_USER_POOL_CLIENT_ID || 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
      identityPoolId: process.env.VITE_IDENTITY_POOL_ID || 'us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: 'code',
      userAttributes: {
        email: {
          required: true,
        },
        given_name: {
          required: true,
        },
        family_name: {
          required: true,
        },
        'custom:role': {
          required: false,
        },
        'custom:company': {
          required: false,
        },
      },
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSymbols: true,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: process.env.VITE_GRAPHQL_ENDPOINT || 'https://xxxxxxxxxxxxxxxxxxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql',
      region: process.env.VITE_AWS_REGION || 'us-east-1',
      defaultAuthMode: 'userPool',
    },
  },
  Storage: {
    S3: {
      bucket: process.env.VITE_S3_BUCKET || 'amplify-xxxxxxxxxxxxxxxxxxxxxxxxxx',
      region: process.env.VITE_AWS_REGION || 'us-east-1',
    },
  },
};

// Configure Amplify
Amplify.configure(amplifyConfig);

export default amplifyConfig;