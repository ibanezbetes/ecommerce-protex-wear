import type { PreSignUpTriggerHandler } from 'aws-lambda';
/**
 * Pre Sign Up Lambda Trigger for Protex Wear
 * Automatically assigns CUSTOMER role to new user registrations
 * and auto-confirms users
 */
export declare const handler: PreSignUpTriggerHandler;
