import React from 'react';

export function CheckoutButton(props: any) {
  return (
    <button className="checkout-confirm-btn" onClick={() => alert('Mock CheckoutButton clicked')}>
      Proceder al Pago
    </button>
  );
}
