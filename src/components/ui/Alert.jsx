import React from 'react';
import { XCircle, AlertTriangle, Info } from 'lucide-react';

const AlertType = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  SUCCESS: 'success'
};

const Alert = ({ 
  type = AlertType.INFO, 
  message, 
  details = null, 
  onClose = null,
  className = ''
}) => {
  // Early return if no message
  if (!message) return null;

  // Determine styles based on alert type
  const getTypeStyles = () => {
    switch (type) {
      case AlertType.ERROR:
        return {
          container: 'bg-red-50 border-red-500 text-red-700',
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          title: 'Error'
        };
      case AlertType.WARNING:
        return {
          container: 'bg-yellow-50 border-yellow-500 text-yellow-700',
          icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
          title: 'Warning'
        };
      case AlertType.SUCCESS:
        return {
          container: 'bg-green-50 border-green-500 text-green-700',
          icon: <Info className="h-5 w-5 text-green-500" />,
          title: 'Success'
        };
      case AlertType.INFO:
      default:
        return {
          container: 'bg-blue-50 border-blue-500 text-blue-700',
          icon: <Info className="h-5 w-5 text-blue-500" />,
          title: 'Information'
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div className={`rounded-lg border-l-4 p-4 ${typeStyles.container} ${className}`} role="alert">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {typeStyles.icon}
        </div>
        <div className="ml-3 flex-grow">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{message}</p>
            {onClose && (
              <button 
                type="button" 
                className="ml-auto -mx-1.5 -my-1.5 inline-flex h-6 w-6 items-center justify-center rounded-md p-1 hover:bg-opacity-10 hover:bg-gray-900 focus:outline-none"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>
          {details && <p className="mt-1 text-xs">{details}</p>}
        </div>
      </div>
    </div>
  );
};

Alert.Type = AlertType;

export default Alert;
