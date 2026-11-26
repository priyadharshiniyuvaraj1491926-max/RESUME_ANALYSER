import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const ToastContext = createContext(null);
let toastId = 0;

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

const ICONS = {
  success: <CheckCircle size={18} style={{ color: 'var(--color-success)', flexShrink: 0 }} />,
  error:   <AlertCircle  size={18} style={{ color: 'var(--color-error)',   flexShrink: 0 }} />,
  warning: <AlertTriangle size={18} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />,
  info:    <Info          size={18} style={{ color: 'var(--color-info)',    flexShrink: 0 }} />,
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = 'info', duration = 4000 }) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (message, opts = {}) => addToast({ message, type: 'success', ...opts }),
    error:   (message, opts = {}) => addToast({ message, type: 'error',   ...opts }),
    warning: (message, opts = {}) => addToast({ message, type: 'warning', ...opts }),
    info:    (message, opts = {}) => addToast({ message, type: 'info',    ...opts }),
  };

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`} role="alert">
            {ICONS[t.type]}
            <span style={{ flex: 1, fontSize: 'var(--text-sm)' }}>{t.message}</span>
            <button className="toast-close" onClick={() => removeToast(t.id)} aria-label="Dismiss">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
