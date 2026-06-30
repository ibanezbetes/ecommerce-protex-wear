#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EcommerceStack } from '../lib/ecommerce-stack';

const app = new cdk.App();

cdk.Tags.of(app).add('project', 'protexwear');

new EcommerceStack(app, 'EcommerceProtexWearStack', {
  /* Si necesitas especificar la cuenta o la región, hazlo aquí:
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  */
});
