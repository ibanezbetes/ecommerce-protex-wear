import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { preSignUp } from './functions/pre-sign-up/resource';
import { postConfirmation } from './functions/post-confirmation/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
defineBackend({
  auth,
  data,
  preSignUp,
  postConfirmation,
});
