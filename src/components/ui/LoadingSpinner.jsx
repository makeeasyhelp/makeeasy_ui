import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...', color = 'default', rounded = true }) => {
  const sizeClasses = {
    small: 'h-5 w-5 border-[2.5px]',
    medium: 'h-8 w-8 border-[3px]',
    large: 'h-12 w-12 border-[4px]',
    xl: 'h-16 w-16 border-[5px]'
  };

  const colorClasses = {
    default: 'border-t-indigo-500 border-b-purple-500',
    white: 'border-t-white border-b-gray-300',
    brand: 'border-t-blue-600 border-b-teal-400'
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.medium;
  const spinnerColor = colorClasses[color] || colorClasses.default;

  return (
    <div className="flex flex-col items-center justify-center gap-3 animate-fade-in">
      <div
        className={`animate-spin ${rounded ? 'rounded-full' : 'rounded-md'} ${spinnerSize} ${spinnerColor} border-l-transparent border-r-transparent shadow-md`}
      ></div>
      {text && (
        <p className={`text-sm font-medium tracking-wide ${color === 'white' ? 'text-white' : 'text-gray-700'}`}>
          {text}
        </p>
      )}
    </div>
  );
};

export const FullPageSpinner = ({ text = 'Please wait...' }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/50">
    <div className="p-6 rounded-2xl bg-white/10 border border-white/20 shadow-xl">
      <LoadingSpinner size="xl" text={text} color="white" />
    </div>
  </div>
);

export const SectionSpinner = ({ text = 'Loading...', className = '' }) => (
  <div className={`flex items-center justify-center p-10 bg-gray-50 rounded-xl ${className}`}>
    <LoadingSpinner size="large" text={text} color="brand" />
  </div>
);

export const InlineSpinner = ({ text = null, className = '' }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <LoadingSpinner size="small" text={null} color="brand" />
    {text && <span className="text-sm text-gray-600 font-medium">{text}</span>}
  </div>
);

export default LoadingSpinner;
