// Protex Wear - Serverless E-commerce Platform
// Main entry point for the frontend application

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

// This will be generated after first deployment
// import outputs from '../amplify_outputs.json';

// Configure Amplify (will be uncommented after first deployment)
// Amplify.configure(outputs);

// Generate the data client
export const client = generateClient<Schema>();

console.log('Protex Wear Serverless Platform - Frontend initialized');
console.log('Run "npm run dev" to start the Amplify sandbox');