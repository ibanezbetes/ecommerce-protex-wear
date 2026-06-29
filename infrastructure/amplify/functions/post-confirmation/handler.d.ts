import type { PostConfirmationTriggerHandler } from 'aws-lambda';
/**
 * Post Confirmation Lambda Trigger for Protex Wear
 * Adds newly confirmed users to the appropriate group based on their role
 * Sets default CUSTOMER role if no role is specified
 */
export declare const handler: PostConfirmationTriggerHandler;
