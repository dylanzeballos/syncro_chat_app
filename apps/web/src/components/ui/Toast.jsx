import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from './useToast';

const Toast = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  isVisible = true
}) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = 'px-4 py-3 rounded-lg shadow-lg border transition-all duration-300 transform';

    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-900 border-green-600 text-green-100`;
      case 'error':
        return `${baseStyles} bg-red-900 border-red-600 text-red-100`;
      case 'warning':
        return `${baseStyles} bg-yellow-900 border-yellow-600 text-yellow-100`;
      default:
        return `${baseStyles} bg-surface border-700 text-text`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        );
    }
  };

  if (!show) return null;

  return createPortal(
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`${getToastStyles()} ${show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
        <div className="flex items-center space-x-3">
          {getIcon()}
          <span className="text-sm font-medium">{message}</span>
          <button
            onClick={() => {
              setShow(false);
              setTimeout(onClose, 300);
            }}
            className="ml-2 text-current opacity-60 hover:opacity-100 transition-opacity"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
};

export default Toast;
