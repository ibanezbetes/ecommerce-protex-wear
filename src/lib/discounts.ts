/* ============================================================================
 * discounts.ts — Definiciones de Descuentos (Server-Only)
 * ============================================================================
 *
 * Módulo centralizado con los códigos de descuento válidos y la lógica
 * de validación. SOLO debe importarse desde API Routes (server-side).
 *
 * ⚠️  NUNCA importar desde componentes de cliente ni desde /store.
 *     Los códigos NO deben aparecer en el bundle del navegador.
 *
 * Consumido por:
 *   - /api/validate-discount/route.ts  → validación al introducir el código
 *   - /api/checkout/route.ts           → re-validación al crear la sesión de Stripe
 * ========================================================================= */

export interface DiscountDefinition {
  /** Tipo de descuento */
  type: 'percentage' | 'fixed';
  /** Valor del descuento (porcentaje 0-100, o importe fijo en €) */
  value: number;
  /** Descripción interna (no se envía al cliente) */
  description: string;
  /** Si el código está activo o ha sido desactivado */
  active: boolean;
  /** Importe mínimo del carrito para aplicar el descuento (sin IVA) */
  minSubtotal?: number;
}

/**
 * Mapa de códigos de descuento válidos.
 *
 * Para añadir/modificar/desactivar descuentos, editar esta estructura.
 * En el futuro esto debería migrarse a DynamoDB.
 */
export const DISCOUNT_CODES: Record<string, DiscountDefinition> = {
  VERANO20: {
    type: 'percentage',
    value: 20,
    description: 'Campaña de verano — 20% en todo',
    active: true,
  },
  PROTEX10: {
    type: 'fixed',
    value: 10,
    description: 'Descuento fijo de 10€',
    active: true,
  },
  PROTEX20: {
    type: 'percentage',
    value: 20,
    description: 'Descuento partners 20%',
    active: true,
  },
};

// ---------------------------------------------------------------------------
// Tipos de resultado
// ---------------------------------------------------------------------------

export interface DiscountValidResult {
  valid: true;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
}

export interface DiscountInvalidResult {
  valid: false;
  error: string;
}

export type DiscountResult = DiscountValidResult | DiscountInvalidResult;

// ---------------------------------------------------------------------------
// Validación
// ---------------------------------------------------------------------------

/**
 * Valida un código de descuento contra el mapa del servidor.
 *
 * @param code     - Código introducido por el usuario (se normaliza a mayúsculas)
 * @param subtotal - Subtotal actual del carrito (sin IVA, sin descuento)
 * @returns        - Resultado con los datos del descuento o un mensaje de error
 */
export function validateDiscount(code: string, subtotal: number): DiscountResult {
  const cleanCode = code.trim().toUpperCase();

  if (!cleanCode) {
    return { valid: false, error: 'Introduce un código de descuento.' };
  }

  const promo = DISCOUNT_CODES[cleanCode];

  if (!promo) {
    return { valid: false, error: 'Código de descuento no válido.' };
  }

  if (!promo.active) {
    return { valid: false, error: 'Este código de descuento ha expirado.' };
  }

  if (promo.minSubtotal && subtotal < promo.minSubtotal) {
    return {
      valid: false,
      error: `Este código requiere un pedido mínimo de ${promo.minSubtotal.toFixed(2)}€.`,
    };
  }

  // Calcular importe del descuento
  let discountAmount: number;
  if (promo.type === 'percentage') {
    discountAmount = parseFloat((subtotal * (promo.value / 100)).toFixed(2));
  } else {
    discountAmount = Math.min(promo.value, subtotal);
  }

  return {
    valid: true,
    code: cleanCode,
    discountType: promo.type,
    discountValue: promo.value,
    discountAmount,
  };
}
