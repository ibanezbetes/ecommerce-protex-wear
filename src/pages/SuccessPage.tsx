
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const SuccessPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        // Here we could clear the cart context if implemented
        // const clearCart = useCart().clearCart;
        // clearCart();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h1>
                <p className="text-gray-600 mb-6">
                    Gracias por tu compra. Tu pedido ha sido procesado correctamente.
                </p>

                {sessionId && (
                    <div className="bg-gray-100 p-3 rounded mb-6 text-sm">
                        <span className="text-gray-500">ID de Sesión:</span>
                        <br />
                        <code className="text-gray-800 break-all">{sessionId}</code>
                    </div>
                )}

                <button
                    onClick={() => navigate('/')}
                    className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                    Volver a la Tienda
                </button>
            </div>
        </div>
    );
};

export default SuccessPage;
