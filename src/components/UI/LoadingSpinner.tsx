import React from 'react';
import { LoadingProps } from '../../types';

/**
 * Loading Spinner Component
 * Reusable loading indicator with different sizes
 */
function LoadingSpinner({ size = 'md', text, className = '' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`loading ${sizeClasses[size]}`}></div>
      {text && (
        <p className="mt-2 text-gray-600 text-sm">{text}</p>
      )}
    </div>
  );
}

export default LoadingSpinner;