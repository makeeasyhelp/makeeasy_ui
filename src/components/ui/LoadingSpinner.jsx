import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  // Define size classes
  const sizeClasses = {
    small: 'h-5 w-5 border-2',
    medium: 'h-8 w-8 border-2',
    large: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4'
  };
  
  const spinnerSize = sizeClasses[size] || sizeClasses.medium;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin rounded-full ${spinnerSize} border-t-brand-indigo border-r-transparent border-b-brand-purple border-l-transparent`}></div>
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

// Component to show a full page loader
export const FullPageSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <LoadingSpinner size="large" text={text} />
    </div>
  );
};

// Component to show a section loader
export const SectionSpinner = ({ text = 'Loading...', className = '' }) => {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <LoadingSpinner size="medium" text={text} />
    </div>
  );
};

// Component to show a small inline loader
export const InlineSpinner = ({ text = null, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LoadingSpinner size="small" text={null} />
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
