/* ============================================================================
 * config.ts — Configuración de Negocio de Protex Wear
 * ============================================================================
 *
 * Datos de la empresa usados en el checkout (transferencia, Bizum),
 * en el footer, y en las páginas de contacto.
 *
 * IMPORTANTE: Estos datos se muestran al cliente final en la interfaz.
 * Actualizar aquí cuando cambien los datos bancarios o de contacto.
 * ========================================================================= */

export const BUSINESS_CONFIG = {
  /** Nombre legal de la empresa */
  name: 'Protex Wear',

  /** Email de contacto para pedidos */
  email: 'pedidos@protexwear.com',

  /** Teléfono principal de contacto */
  phone: '+34 600 000 000',

  // --- Datos bancarios (para transferencias) ---
  /** IBAN de la cuenta bancaria */
  bankIBAN: 'ES91 2100 0418 4502 0005 1332',
  /** Código BIC/SWIFT del banco */
  bankBIC: 'CAIXESBBXXX',
  /** Nombre del banco */
  bankName: 'CaixaBank',
  /** Titular de la cuenta bancaria */
  bankAccountHolder: 'Protex Wear S.L.',

  // --- Bizum ---
  /** Teléfono asociado a Bizum */
  bizumPhone: '+34 600 000 000',
};
