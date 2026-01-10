import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { createCheckoutSession } from './functions/create-checkout-session/resource';
import { stripeWebhook } from './functions/stripe-webhook/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage,
  createCheckoutSession, // Register the function
  stripeWebhook,
});

// Expose the function URL in the outputs
// This allows the frontend to know the URL (though we can also use the SDK)
const createCheckoutSessionLambda = backend.createCheckoutSession.resources.lambda;
const createCheckoutSessionUrl = createCheckoutSessionLambda.addFunctionUrl({
  authType: 'NONE' as any,
  cors: {
    allowedOrigins: ['*'],
    allowedMethods: ['POST'] as any,
    allowedHeaders: ['*'],
  },
});

const stripeWebhookLambda = backend.stripeWebhook.resources.lambda;
const stripeWebhookUrl = stripeWebhookLambda.addFunctionUrl({
  authType: 'NONE' as any,
  cors: { allowedOrigins: ['*'], allowedMethods: ['POST'] as any, allowedHeaders: ['*'] }
});

// 1. Grant access to the Order table for the Checkout Session Lambda
backend.createCheckoutSession.resources.lambda.addToRolePolicy({
  Effect: 'Allow',
  Action: ['dynamodb:PutItem'],
  Resource: [backend.data.resources.tables['Order'].tableArn],
} as any);

// 2. Pass the Table Name as an environment variable
backend.createCheckoutSession.resources.lambda.addEnvironment(
  'ORDER_TABLE_NAME',
  backend.data.resources.tables['Order'].tableName
);

// 3. Grant access to the Order table for the Webhook Lambda (to update status)
backend.stripeWebhook.resources.lambda.addToRolePolicy({
  Effect: 'Allow',
  Action: ['dynamodb:UpdateItem', 'dynamodb:Query', 'dynamodb:GetItem'],
  Resource: [
    backend.data.resources.tables['Order'].tableArn,
    `${backend.data.resources.tables['Order'].tableArn}/index/*` // Allow access to indexes
  ],
} as any);

backend.stripeWebhook.resources.lambda.addEnvironment(
  'ORDER_TABLE_NAME',
  backend.data.resources.tables['Order'].tableName
);

backend.addOutput({
  custom: {
    createCheckoutSessionUrl: createCheckoutSessionUrl.url,
    stripeWebhookUrl: stripeWebhookUrl.url,
  },
} as any);
