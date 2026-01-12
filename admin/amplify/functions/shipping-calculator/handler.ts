import type { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

/**
 * Shipping Calculator Handler
 * Calculates shipping costs based on location, weight, dimensions, and shipping method
 * 
 * Supported Features:
 * - Location-based shipping rates (domestic/international)
 * - Weight-based calculations
 * - Dimension-based calculations (volumetric weight)
 * - Free shipping thresholds
 * - Express/standard shipping options
 * - Bulk order discounts
 */

interface ShippingCalculationRequest {
  // Shipping destination
  destination: {
    country: string;
    state?: string;
    city?: string;
    postalCode?: string;
  };
  
  // Package details
  package: {
    weight: number; // in kg
    dimensions?: {
      length: number; // in cm
      width: number;  // in cm
      height: number; // in cm
    };
    value: number; // order value for insurance
  };
  
  // Shipping preferences
  shippingMethod?: 'standard' | 'express' | 'overnight';
  insuranceRequired?: boolean;
  signatureRequired?: boolean;
  
  // Order context
  orderValue: number;
  customerType?: 'retail' | 'wholesale' | 'vip';
}

interface ShippingCalculationResponse {
  success: boolean;
  shippingOptions: ShippingOption[];
  error?: string;
  calculationDetails?: {
    baseRate: number;
    weightSurcharge: number;
    dimensionSurcharge: number;
    locationSurcharge: number;
    discounts: number;
    taxes: number;
  };
}

interface ShippingOption {
  method: string;
  carrier: string;
  cost: number;
  currency: string;
  estimatedDays: number;
  description: string;
  trackingIncluded: boolean;
  insuranceIncluded: boolean;
}

// Configuration constants
const SHIPPING_CONFIG = {
  // Base rates by shipping method (EUR)
  BASE_RATES: {
    standard: 9.99,
    express: 19.99,
    overnight: 39.99,
  },
  
  // Weight thresholds and surcharges (per kg over threshold)
  WEIGHT_THRESHOLDS: {
    standard: { threshold: 2, surcharge: 2.50 },
    express: { threshold: 2, surcharge: 3.50 },
    overnight: { threshold: 1, surcharge: 5.00 },
  },
  
  // Location multipliers
  LOCATION_MULTIPLIERS: {
    domestic: 1.0,      // Spain
    eu: 1.5,           // European Union
    international: 2.5, // Rest of world
  },
  
  // Free shipping thresholds by customer type
  FREE_SHIPPING_THRESHOLDS: {
    retail: 100.00,
    wholesale: 250.00,
    vip: 50.00,
  },
  
  // Customer type discounts
  CUSTOMER_DISCOUNTS: {
    retail: 0,
    wholesale: 0.15,    // 15% discount
    vip: 0.20,         // 20% discount
  },
  
  // Volumetric weight divisor (cm³/kg)
  VOLUMETRIC_DIVISOR: 5000,
  
  // Tax rates
  VAT_RATE: 0.21, // 21% Spanish VAT
};

/**
 * Main Lambda handler for shipping calculations
 */
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Shipping calculation request received:', {
    httpMethod: event.httpMethod,
    path: event.path,
    body: event.body ? 'Present' : 'Missing',
  });

  try {
    // Parse request body
    if (!event.body) {
      return createErrorResponse(400, 'Missing request body');
    }

    let request: ShippingCalculationRequest;
    try {
      request = JSON.parse(event.body);
    } catch (error) {
      return createErrorResponse(400, 'Invalid JSON in request body');
    }

    // Validate request
    const validationError = validateShippingRequest(request);
    if (validationError) {
      return createErrorResponse(400, validationError);
    }

    // Calculate shipping options
    const response = await calculateShippingOptions(request);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify(response),
    };

  } catch (error) {
    console.error('Error calculating shipping:', error);
    
    return createErrorResponse(500, 'Internal server error');
  }
};

/**
 * Calculate shipping options based on request parameters
 */
async function calculateShippingOptions(
  request: ShippingCalculationRequest
): Promise<ShippingCalculationResponse> {
  console.log('Calculating shipping for:', {
    destination: request.destination,
    weight: request.package.weight,
    value: request.orderValue,
    customerType: request.customerType,
  });

  try {
    const shippingOptions: ShippingOption[] = [];
    const locationMultiplier = getLocationMultiplier(request.destination.country);
    const customerType = request.customerType || 'retail';
    
    // Check for free shipping eligibility
    const freeShippingThreshold = SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLDS[customerType];
    const isFreeShippingEligible = request.orderValue >= freeShippingThreshold;

    // Calculate options for each shipping method
    const methods = request.shippingMethod 
      ? [request.shippingMethod] 
      : ['standard', 'express', 'overnight'] as const;

    for (const method of methods) {
      const option = calculateShippingOption(
        method,
        request,
        locationMultiplier,
        customerType,
        isFreeShippingEligible
      );
      
      if (option) {
        shippingOptions.push(option);
      }
    }

    // Sort by cost (cheapest first)
    shippingOptions.sort((a, b) => a.cost - b.cost);

    return {
      success: true,
      shippingOptions,
      calculationDetails: {
        baseRate: SHIPPING_CONFIG.BASE_RATES.standard,
        weightSurcharge: calculateWeightSurcharge(request.package.weight, 'standard'),
        dimensionSurcharge: calculateDimensionSurcharge(request.package.dimensions),
        locationSurcharge: (locationMultiplier - 1) * SHIPPING_CONFIG.BASE_RATES.standard,
        discounts: SHIPPING_CONFIG.CUSTOMER_DISCOUNTS[customerType] * 100,
        taxes: SHIPPING_CONFIG.VAT_RATE * 100,
      },
    };

  } catch (error) {
    console.error('Error in shipping calculation:', error);
    
    return {
      success: false,
      shippingOptions: [],
      error: error instanceof Error ? error.message : 'Unknown calculation error',
    };
  }
}

/**
 * Calculate shipping option for a specific method
 */
function calculateShippingOption(
  method: 'standard' | 'express' | 'overnight',
  request: ShippingCalculationRequest,
  locationMultiplier: number,
  customerType: 'retail' | 'wholesale' | 'vip',
  isFreeShippingEligible: boolean
): ShippingOption | null {
  try {
    // Base rate
    let cost = SHIPPING_CONFIG.BASE_RATES[method];
    
    // Apply location multiplier
    cost *= locationMultiplier;
    
    // Add weight surcharge
    const weightSurcharge = calculateWeightSurcharge(request.package.weight, method);
    cost += weightSurcharge;
    
    // Add dimension surcharge (volumetric weight)
    const dimensionSurcharge = calculateDimensionSurcharge(request.package.dimensions);
    cost += dimensionSurcharge;
    
    // Apply customer discount
    const discount = SHIPPING_CONFIG.CUSTOMER_DISCOUNTS[customerType];
    cost *= (1 - discount);
    
    // Apply free shipping if eligible and method is standard
    if (isFreeShippingEligible && method === 'standard') {
      cost = 0;
    }
    
    // Add VAT
    const costWithVAT = cost * (1 + SHIPPING_CONFIG.VAT_RATE);
    
    // Round to 2 decimal places
    const finalCost = Math.round(costWithVAT * 100) / 100;

    return {
      method,
      carrier: getCarrierForMethod(method),
      cost: finalCost,
      currency: 'EUR',
      estimatedDays: getEstimatedDays(method, locationMultiplier),
      description: getShippingDescription(method, isFreeShippingEligible && method === 'standard'),
      trackingIncluded: true,
      insuranceIncluded: method !== 'standard' || request.package.value > 100,
    };

  } catch (error) {
    console.error(`Error calculating ${method} shipping:`, error);
    return null;
  }
}

/**
 * Calculate weight surcharge based on shipping method
 */
function calculateWeightSurcharge(weight: number, method: 'standard' | 'express' | 'overnight'): number {
  const config = SHIPPING_CONFIG.WEIGHT_THRESHOLDS[method];
  
  if (weight <= config.threshold) {
    return 0;
  }
  
  const excessWeight = weight - config.threshold;
  return excessWeight * config.surcharge;
}

/**
 * Calculate dimension surcharge based on volumetric weight
 */
function calculateDimensionSurcharge(dimensions?: { length: number; width: number; height: number }): number {
  if (!dimensions) {
    return 0;
  }
  
  // Calculate volumetric weight
  const volumetricWeight = (dimensions.length * dimensions.width * dimensions.height) / SHIPPING_CONFIG.VOLUMETRIC_DIVISOR;
  
  // If volumetric weight is significantly higher than actual weight, add surcharge
  if (volumetricWeight > 5) { // 5kg threshold
    return (volumetricWeight - 5) * 1.50; // €1.50 per kg over threshold
  }
  
  return 0;
}

/**
 * Get location multiplier based on destination country
 */
function getLocationMultiplier(country: string): number {
  const countryCode = country.toUpperCase();
  
  // Spain (domestic)
  if (countryCode === 'ES' || countryCode === 'SPAIN') {
    return SHIPPING_CONFIG.LOCATION_MULTIPLIERS.domestic;
  }
  
  // European Union countries
  const euCountries = [
    'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
    'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
    'PL', 'PT', 'RO', 'SK', 'SI', 'SE',
  ];
  
  if (euCountries.includes(countryCode)) {
    return SHIPPING_CONFIG.LOCATION_MULTIPLIERS.eu;
  }
  
  // International
  return SHIPPING_CONFIG.LOCATION_MULTIPLIERS.international;
}

/**
 * Get carrier name for shipping method
 */
function getCarrierForMethod(method: string): string {
  switch (method) {
    case 'standard':
      return 'Correos España';
    case 'express':
      return 'SEUR';
    case 'overnight':
      return 'DHL Express';
    default:
      return 'Correos España';
  }
}

/**
 * Get estimated delivery days
 */
function getEstimatedDays(method: string, locationMultiplier: number): number {
  const baseDays = {
    standard: 3,
    express: 1,
    overnight: 1,
  };
  
  const methodDays = baseDays[method as keyof typeof baseDays] || 3;
  
  // Add extra days for international shipping
  if (locationMultiplier > 2) {
    return methodDays + 5; // International
  } else if (locationMultiplier > 1) {
    return methodDays + 2; // EU
  }
  
  return methodDays; // Domestic
}

/**
 * Get shipping description
 */
function getShippingDescription(method: string, isFree: boolean): string {
  if (isFree) {
    return 'Envío gratuito - Entrega estándar';
  }
  
  switch (method) {
    case 'standard':
      return 'Envío estándar - 3-5 días laborables';
    case 'express':
      return 'Envío express - 1-2 días laborables';
    case 'overnight':
      return 'Envío urgente - Entrega al día siguiente';
    default:
      return 'Envío estándar';
  }
}

/**
 * Validate shipping calculation request
 */
function validateShippingRequest(request: ShippingCalculationRequest): string | null {
  if (!request.destination || !request.destination.country) {
    return 'Missing destination country';
  }
  
  if (!request.package || typeof request.package.weight !== 'number' || request.package.weight <= 0) {
    return 'Invalid package weight';
  }
  
  if (typeof request.orderValue !== 'number' || request.orderValue < 0) {
    return 'Invalid order value';
  }
  
  if (request.shippingMethod && !['standard', 'express', 'overnight'].includes(request.shippingMethod)) {
    return 'Invalid shipping method';
  }
  
  if (request.customerType && !['retail', 'wholesale', 'vip'].includes(request.customerType)) {
    return 'Invalid customer type';
  }
  
  return null;
}

/**
 * Create error response
 */
function createErrorResponse(statusCode: number, message: string): APIGatewayProxyResult {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      success: false,
      error: message,
    }),
  };
}