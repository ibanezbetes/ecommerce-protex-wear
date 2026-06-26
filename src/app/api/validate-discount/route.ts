import { NextResponse } from 'next/server';
import { validateDiscount } from '@/lib/discounts';

/* ============================================================================
 * /api/validate-discount — Validación Server-Side de Códigos de Descuento
 * ============================================================================
 *
 * Endpoint POST que valida un código de descuento contra el mapa del servidor.
 * El cliente NUNCA tiene acceso al mapa completo de códigos — solo puede
 * preguntar si un código específico es válido.
 *
 * Request:  { code: string, subtotal: number }
 * Response: { valid: true,  discountType, discountValue, discountAmount }
 *        o  { valid: false, error: string }
 * ========================================================================= */

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json();

    if (typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Código de descuento requerido.' },
        { status: 400 }
      );
    }

    if (typeof subtotal !== 'number' || subtotal < 0) {
      return NextResponse.json(
        { valid: false, error: 'Subtotal inválido.' },
        { status: 400 }
      );
    }

    const result = validateDiscount(code, subtotal);

    if (result.valid) {
      return NextResponse.json({
        valid: true,
        discountType: result.discountType,
        discountValue: result.discountValue,
        discountAmount: result.discountAmount,
      });
    } else {
      return NextResponse.json({ valid: false, error: result.error });
    }
  } catch (error: any) {
    console.error('[validate-discount] Error:', error);
    return NextResponse.json(
      { valid: false, error: 'Error al validar el código de descuento.' },
      { status: 500 }
    );
  }
}
