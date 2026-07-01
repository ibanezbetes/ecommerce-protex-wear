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

  // --- Datos fiscales para la factura ---
  /** CIF de la empresa */
  cif: 'B72983661',
  /** Dirección legal de la empresa */
  address: 'CALLE L (POLÍGONO INDUSTRIAL MALPICA II), NAV 1, 50016 Zaragoza, España',

  /** Email de contacto para pedidos */
  email: 'info@protexwear.es',

  /** Teléfono principal de contacto */
  phone: '+34 876 44 12 75',

  // --- Datos bancarios reales (Santander — Certificado de Titularidad) ---
  /** IBAN de la cuenta bancaria */
  bankIBAN: 'ES86 0049 5484 0020 1660 2077',
  /** Código BIC/SWIFT del banco */
  bankBIC: 'BSCHESMM',
  /** Nombre del banco */
  bankName: 'Banco Santander',
  /** Titular de la cuenta bancaria */
  bankAccountHolder: 'PROTEX WEAR SL',

  // --- Bizum ---
  /** Teléfono asociado a Bizum */
  bizumPhone: '+34 876 44 12 75',
};
