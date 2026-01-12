import React from 'react';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

interface OrderStatusTimelineProps {
    status: OrderStatus | string;
    trackingNumber?: string;
    dates?: {
        createdAt?: string;
        shippedAt?: string;
        deliveredAt?: string;
    };
}

const STEPS = [
    { id: 'confirmed', label: 'Confirmado', icon: '📝', statuses: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
    { id: 'processing', label: 'Preparando', icon: '📦', statuses: ['PROCESSING', 'SHIPPED', 'DELIVERED'] },
    { id: 'shipped', label: 'Enviado', icon: '🚚', statuses: ['SHIPPED', 'DELIVERED'] },
    { id: 'delivered', label: 'Entregado', icon: '🏠', statuses: ['DELIVERED'] },
];

export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({ status, trackingNumber, dates }) => {
    const currentStatus = status as OrderStatus;

    // Handle Cancelled/Refunded
    if (currentStatus === 'CANCELLED' || currentStatus === 'REFUNDED') {
        return (
            <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-center text-red-700 font-medium">
                <span className="mr-2">❌</span>
                Pedido {currentStatus === 'CANCELLED' ? 'Cancelado' : 'Reembolsado'}
            </div>
        );
    }

    const getStepStatus = (stepStatuses: string[]) => {
        return stepStatuses.includes(currentStatus) ? 'completed' : 'pending';
    };

    // Logic to determine active step index for progress bar width
    const activeStepIndex = STEPS.findIndex(step => !step.statuses.includes(currentStatus));
    // If all valid, it means it's the last step (or not found in "pending" logic), so full width
    const progressPercentage = activeStepIndex === -1
        ? 100
        : (activeStepIndex - 1) / (STEPS.length - 1) * 100;

    // Refined Logic:
    // We want to know which steps are "done".
    // CONFIRMED is done if status is CONFIRMED, PROCESSING, SHIPPED, DELIVERED.
    // PROCESSING is done if status is PROCESSING, SHIPPED, DELIVERED.

    // Helper to check if a step is active or completed
    const isStepActiveOrCompleted = (stepStatuses: string[]) => stepStatuses.includes(currentStatus);

    return (
        <div className="w-full py-6">
            <div className="relative">
                {/* Progress Bar Background */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0 rounded-full"></div>

                {/* Active Progress Bar - We need to calculate width based on current status */}
                {/* This simple approach connects the dots that are active */}
                <div className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 z-0 rounded-full transition-all duration-1000 ease-out"
                    style={{
                        width: `${currentStatus === 'DELIVERED' ? 100 :
                                currentStatus === 'SHIPPED' ? 66 :
                                    currentStatus === 'PROCESSING' ? 33 :
                                        0
                            }%`
                    }}
                ></div>

                <div className="relative z-10 flex justify-between w-full">
                    {STEPS.map((step, index) => {
                        const isActive = isStepActiveOrCompleted(step.statuses);

                        return (
                            <div key={step.id} className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500 bg-white
                    ${isActive ? 'border-green-500 text-green-600 shadow-sm scale-110' : 'border-gray-300 text-gray-400'}
                  `}
                                >
                                    <span className="text-lg">{step.icon}</span>
                                </div>
                                <p className={`mt-2 text-xs sm:text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {step.label}
                                </p>
                                {/* Optional: Show dates if available */}
                                {step.id === 'confirmed' && dates?.createdAt && (
                                    <p className="text-[10px] text-gray-500 mt-1 hidden sm:block">
                                        {new Date(dates.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                    </p>
                                )}
                                {step.id === 'delivered' && currentStatus === 'DELIVERED' && (
                                    <p className="text-[10px] text-green-600 mt-1 font-bold">
                                        ¡Completado!
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
