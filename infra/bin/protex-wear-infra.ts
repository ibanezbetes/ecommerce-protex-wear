#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProtexWearInfraStack } from '../lib/protex-wear-infra-stack';

const app = new cdk.App();

new ProtexWearInfraStack(app, 'ProtexWearInfraStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'eu-west-1',
  },
  description: 'AWS CDK Infrastructure for Protex Wear E-commerce Platform',
});

app.synth();