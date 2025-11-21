
import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'جارٍ التحميل...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 border-4 border-teal-600 border-solid rounded-full border-t-transparent animate-spin"></div>
      <p className="mt-4 text-lg text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
