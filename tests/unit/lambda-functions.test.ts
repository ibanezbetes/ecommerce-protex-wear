/**
 * Unit tests for Lambda Functions
 * Feature: amplify-serverless-architecture
 */

import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Mock Stripe SDK
const mockStripe = {
  webhooks: {
    constructEvent: jest.fn(),
  },
  charges: {
    retrieve: jest.fn(),
  },
  paymentIntents: {
    retrieve: jest.fn(),
  },
};

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => mockStripe);
});

// Import handlers after mocking
import { handler as stripeWebhookHandler } from '../../amplify/functions/stripe-webhook/handler';
import { handler as shippingCalculatorHandler } from '../../amplify/functions/shipping-calculator/handler';

describe('Lambda Functions Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStripe.webhooks.constructEvent.mockReset();
    mockStripe.charges.retrieve.mockReset();
    mockStripe.paymentIntents.retrieve.mockReset();
  });

  describe('Stripe Webhook Handler', () => {
    test('should process payment_intent.succeeded event successfully', async () => {
      const mockEvent = {
        id: 'evt_test_webhook',
        type: 'payment_intent.succeeded',
        created: 1234567890,
        data: {
          object: {
            id: 'pi_test_payment_intent',
            amount: 5000,
            currency: 'eur',
            status: 'succeeded',
            metadata: {
              orderId: 'order_123',
            },
          },
        },
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

      const apiEvent: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/stripe-webhook',
        headers: {
          'stripe-signature': 'valid_signature',
          'content-type': 'application/json',
        },
        body: JSON.stringify(mockEvent),
        isBase64Encoded: false,
        pathParameters: null,
        queryStringParameters: null,
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
      };

      const result = await stripeWebhookHandler(apiEvent, {} as any, {} as any) as APIGatewayProxyResult;

      expect(result.statusCode).toBe(200);
      const responseBody = JSON.parse(result.body);
      expect(responseBody.received).toBe(true);
      expect(responseBody.eventId).toBe('evt_test_webhook');
      expect(responseBody.eventType).toBe('payment_intent.succeeded');
    });

    test('should process payment_intent.payment_failed event successfully', async () => {
      const mockEvent = {
        id: 'evt_test_failed',
        type: 'payment_intent.payment_failed',
        created: 1234567890,
        data: {
          object: {
            id: 'pi_test_failed',
            amount: 3000,
            currency: 'eur',
            status: 'requires_payment_method',
            metadata: {
              orderId: 'order_456',
            },
            last_payment_error: {
              message: 'Your card was declined.',
              type: 'card_error',
            },
          },
        },
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

      const apiEvent: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/stripe-webhook',
        headers: {
          'stripe-signature': 'valid_signature',
        },
        body: JSON.stringify(mockEvent),
        isBase64Encoded: false,
        pathParameters: null,
        queryStringParameters: null,
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
      };

      const result = await stripeWebhookHandler(apiEvent, {} as any, {} as any) as APIGatewayProxyResult;

      expect(result.statusCode).toBe(200);
      const responseBody = JSON.parse(result.body);
      expect(responseBody.received).toBe(true);
      expect(responseBody.eventType).toBe('payment_intent.payment_failed');
    });

    test('should handle charge.dispute.created event', async () => {
      const mockEvent = {
        id: 'evt_test_dispute',
        type: 'charge.dispute.created',
        created: 1234567890,
        data: {
          object: {
            id: 'dp_test_dispute',
            amount: 2500,
            currency: 'eur',
            reason: 'fraudulent',
            status: 'warning_needs_response',
            charge: 'ch_test_charge',
          },
        },
      };

      // Mock charge retrieval
      mockStripe.charges.retrieve.mockResolvedValue({
        id: 'ch_test_charge',
        payment_intent: 'pi_test_intent',
      });

      // Mock payment intent retrieval
      mockStripe.paymentIntents.retrieve.mockResolvedValue({
        id: 'pi_test_intent',
        metadata: {
          orderId: 'order_789',
        },
      });

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

      const apiEvent: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/stripe-webhook',
        headers: {
          'stripe-signature': 'valid_signature',
        },
        body: JSON.stringify(mockEvent),
        isBase64Encoded: false,
        pathParameters: null,
        queryStringParameters: null,
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
      };

      const result = await stripeWebhookHandler(apiEvent, {} as any, {} as any) as APIGatewayProxyResult;

      expect(result.statusCode).toBe(200);
      expect(mockStripe.charges.retrieve).toHaveBeenCalledWith('ch_test_charge');
      expect(mockStripe.paymentIntents.retrieve).toHaveBeenCalledWith('pi_test_intent');
    });

    test('should reject webhook with missing signature', async () => {
      const apiEvent: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/stripe-webhook',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ test: 'data' }),
        isBase64Encoded: false,
        pathParameters: null,
        queryStringParameters: null,
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
      };

      const result = await stripeWebhookHandler(apiEvent, {} as any, {} as any) as APIGatewayProxyResult;

      expect(result.statusCode).toBe(400);
      const responseBody = JSON.parse(result.body);
      expect(responseBody.error).toContain('Missing Stripe signature');
    });

    test('should reject webhook with missing body', async () => {
      const apiEvent: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/stripe-webhook',
        headers: {
          'stripe-signature': 'valid_signature',
        },
        body: null,
        isBase64Encoded: false,
        pathParameters: null,
        queryStringParameters: null,
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
      };

      const result = await stripeWebhookHandler(apiEvent, {} as any, {} as any) as APIGatewayProxyResult;

      expect(result.statusCode).toBe(400);
      const responseBody = JSON.parse(result.body);
      expect(responseBody.error).toContain('Missing request body');
    });

    test('should handle invalid webhook signature', async () => {
      mockStripe.webhooks.constructEvent.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      const apiEvent: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/stripe-webhook',
        headers: {
          'stripe-signature': 'invalid_signature',
        },
        body: JSON.stringify({ test: 'data' }),
        isBase64Encoded: false,
        pathParameters: null,
        queryStringParameters: null,
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
      };

      const result = await stripeWebhookHandler(apiEvent, {} as any, {} as any) as APIGatewayProxyResult;

      expect(result.statusCode).toBe(400);
      const responseBody = JSON.parse(result.body);
      expect(responseBody.error).toContain('Invalid signature');
    });

    test('should handle unhandled event types gracefully', async () => {
      const mockEvent = {
        id: 'evt_unhandled',
        type: 'customer.created',
        created: 1234567890,
        data: {
          object: {
            id: 'cus_test_customer',
          },
        },
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);

      const apiEvent: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/stripe-webhook',
        headers: {
          'stripe-signature': 'valid_signature',
        },
        body: JSON.stringify(mockEvent),
        isBase64Encoded: false,
        pathParameters: null,
        queryStringParameters: null,
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
      };

      const result = await stripeWebhookHandler(apiEvent, {} as any, {} as any) as APIGatewayProxyResult;

      expect(result.statusCode).toBe(200);
      const responseBody = JSON.parse(result.body);
      expect(responseBody.result.message).toContain('not handled');
    });
  });

  describe('Shipping Calculator Handler', () => {
    test('should calculate domestic shipping correctly', async () => {
      const shippingRequest = {
        destination: {
          country: 'ES',
          postalCode: '28001',
        },
        package: {
          weight: 1.5,
          value: 75.00,
        },
        orderValue: 75.00,
        customerType: 'retail',
      };

      const apiEvent: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/shipping-calculator',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(shippingRequest),
        isBase64Encoded: false,
        pathParameters: null,
        queryStringParameters: null,
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
      };

      const result = await shippingCalculatorHandler(apiEvent, {} as any, {} as any) as APIGatewayProxyResult;

      expect(result.statusCode).toBe(200);
      const responseBody = JSON.parse(result.body);
      expect(responseBody.success).toBe(true);
      expect(responseBody.shippingOptions).toHaveLength(3); // standard, express, overnight
      
      const standardOption = responseBody.shippingOptions.find((opt: any) => opt.method === 'standard');
      expect(standardOption).toBeDefined();
      expect(standardOption.carrier).toBe('Correos España');
      expect(standardOption.cost).toBeGreaterThan(0);
      expect(standardOption.currency).toBe('EUR');
    });

    test('should apply free shipping for orders above threshold', async () => {
      const shippingRequest = {
        destination: {
          country: 'ES',
        },
        package: {
          weight: 2.0,
          value: 150.00,
        },
        orderValue: 150.00, // Above €100 threshold for retail
        customerType: 'retail',
      };

      const apiEvent: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/shipping-calculator',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(shippingRequest),
        isBase64Encoded: false,
        pathParameters: null,
        queryStringParameters: null,
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
      };

      const result = await shippingCalculatorHandler(apiEvent, {} as any, {} as any) as APIGatewayProxyResult;

      expect(result.statusCode).toBe(200);
      const responseBody = JSON.parse(result.body);
      
      const standardOption = responseBody.shippingOptions.find((opt: any) => opt.method === 'standard');
      expect(standardOption.cost).toBe(0);
      expect(standardOption.description).toContain('gratuito');
    });

    test('should calculate EU shipping with location multiplier', async () => {
      const shippingRequest = {
        destination: {
          country: 'FR',
        },
        package: {
          weight: 1.0,
          value: 50.00,
        },
        orderValue: 50.00,
        customerType: 'retail',
      };

      const apiEvent: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/shipping-calculator',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(shippingRequest),
        isBase64Encoded: false,
        pathParameters: null,
        queryStringParameters: null,
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
      };

      const result = await shippingCalculatorHandler(apiEvent, {} as any, {} as any) as APIGatewayProxyResult;

      expect(result.statusCode).toBe(200);
      const responseBody = JSON.parse(result.body);
      
      const standardOption = responseBody.shippingOptions.find((opt: any) => opt.method === 'standard');
      expect(standardOption.cost).toBeGreaterThan(9.99); // Should be higher than base rate due to EU multiplier
      expect(standardOption.estimatedDays).toBeGreaterThan(3); // Should take longer for EU
    });

    test('should apply wholesale customer discount', async () => {
      const shippingRequest = {
        destination: {
          country: 'ES',
        },
        package: {
          weight: 1.0,
          value: 200.00,
        },
        orderValue: 200.00,
        customerType: 'wholesale',
      };

      const apiEvent: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/shipping-calculator',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(shippingRequest),
        isBase64Encoded: false,
        pathParameters: null,
        queryStringParameters: null,
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
      };

      const result = await shippingCalculatorHandler(apiEvent, {} as any, {} as any) as APIGatewayProxyResult;

      expect(result.statusCode).toBe(200);
      const responseBody = JSON.parse(result.body);
      expect(responseBody.calculationDetails.discounts).toBe(15); // 15% wholesale discount
    });

    test('should handle weight surcharge correctly', async () => {
      const shippingRequest = {
        destination: {
          country: 'ES',
        },
        package: {
          weight: 5.0, // Above 2kg threshold
          value: 50.00,
        },
        orderValue: 50.00,
        customerType: 'retail',
      };

      const apiEvent: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/shipping-calculator',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(shippingRequest),
        isBase64Encoded: false,
        pathParameters: null,
        queryStringParameters: null,
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
      };

      const result = await shippingCalculatorHandler(apiEvent, {} as any, {} as any) as APIGatewayProxyResult;

      expect(result.statusCode).toBe(200);
      const responseBody = JSON.parse(result.body);
      expect(responseBody.calculationDetails.weightSurcharge).toBeGreaterThan(0);
    });

    test('should handle volumetric weight calculation', async () => {
      const shippingRequest = {
        destination: {
          country: 'ES',
        },
        package: {
          weight: 1.0,
          dimensions: {
            length: 100,
            width: 100,
            height: 100, // Large package
          },
          value: 50.00,
        },
        orderValue: 50.00,
        customerType: 'retail',
      };

      const apiEvent: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/shipping-calculator',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(shippingRequest),
        isBase64Encoded: false,
        pathParameters: null,
        queryStringParameters: null,
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
      };

      const result = await shippingCalculatorHandler(apiEvent, {} as any, {} as any) as APIGatewayProxyResult;

      expect(result.statusCode).toBe(200);
      const responseBody = JSON.parse(result.body);
      expect(responseBody.calculationDetails.dimensionSurcharge).toBeGreaterThan(0);
    });

    test('should return error for missing destination country', async () => {
      const shippingRequest = {
        destination: {},
        package: {
          weight: 1.0,
          value: 50.00,
        },
        orderValue: 50.00,
      };

      const apiEvent: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/shipping-calculator',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(shippingRequest),
        isBase64Encoded: false,
        pathParameters: null,
        queryStringParameters: null,
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
      };

      const result = await shippingCalculatorHandler(apiEvent, {} as any, {} as any) as APIGatewayProxyResult;

      expect(result.statusCode).toBe(400);
      const responseBody = JSON.parse(result.body);
      expect(responseBody.success).toBe(false);
      expect(responseBody.error).toContain('Missing destination country');
    });

    test('should return error for invalid weight', async () => {
      const shippingRequest = {
        destination: {
          country: 'ES',
        },
        package: {
          weight: -1.0, // Invalid negative weight
          value: 50.00,
        },
        orderValue: 50.00,
      };

      const apiEvent: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/shipping-calculator',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(shippingRequest),
        isBase64Encoded: false,
        pathParameters: null,
        queryStringParameters: null,
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
      };

      const result = await shippingCalculatorHandler(apiEvent, {} as any, {} as any) as APIGatewayProxyResult;

      expect(result.statusCode).toBe(400);
      const responseBody = JSON.parse(result.body);
      expect(responseBody.error).toContain('Invalid package weight');
    });

    test('should return error for malformed JSON', async () => {
      const apiEvent: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/shipping-calculator',
        headers: {
          'content-type': 'application/json',
        },
        body: '{ invalid json }',
        isBase64Encoded: false,
        pathParameters: null,
        queryStringParameters: null,
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
      };

      const result = await shippingCalculatorHandler(apiEvent, {} as any, {} as any) as APIGatewayProxyResult;

      expect(result.statusCode).toBe(400);
      const responseBody = JSON.parse(result.body);
      expect(responseBody.error).toContain('Invalid JSON');
    });

    test('should include CORS headers in response', async () => {
      const shippingRequest = {
        destination: { country: 'ES' },
        package: { weight: 1.0, value: 50.00 },
        orderValue: 50.00,
      };

      const apiEvent: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/shipping-calculator',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(shippingRequest),
        isBase64Encoded: false,
        pathParameters: null,
        queryStringParameters: null,
        multiValueHeaders: {},
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
      };

      const result = await shippingCalculatorHandler(apiEvent, {} as any, {} as any) as APIGatewayProxyResult;

      expect(result.headers).toBeDefined();
      expect(result.headers!['Access-Control-Allow-Origin']).toBe('*');
      expect(result.headers!['Access-Control-Allow-Headers']).toBe('Content-Type');
      expect(result.headers!['Access-Control-Allow-Methods']).toBe('POST, OPTIONS');
    });
  });
});