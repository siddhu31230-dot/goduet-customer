'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type?: ToastType;
  title?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', title?: string, duration = 4000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newToast: Toast = { id, message, type, title, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, title: string = 'Success') => {
      showToast(message, 'success', title);
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, title: string = 'Error') => {
      showToast(message, 'error', title);
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, title: string = 'Notice') => {
      showToast(message, 'info', title);
    },
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, success, error, info, removeToast }}>
      {children}
      {/* Toast floating container */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          return (
            <div
              key={toast.id}
              role="alert"
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
                isSuccess
                  ? 'bg-white/95 dark:bg-[#141e1d]/95 border-[#197F83]/30 text-gray-900 dark:text-gray-100 shadow-[#197F83]/10'
                  : isError
                  ? 'bg-white/95 dark:bg-[#141e1d]/95 border-red-500/30 text-gray-900 dark:text-gray-100 shadow-red-500/10'
                  : isWarning
                  ? 'bg-white/95 dark:bg-[#141e1d]/95 border-amber-500/30 text-gray-900 dark:text-gray-100 shadow-amber-500/10'
                  : 'bg-white/95 dark:bg-[#141e1d]/95 border-cyan-500/30 text-gray-900 dark:text-gray-100 shadow-cyan-500/10'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#197F83]" />}
                {isError && <XCircle className="w-5 h-5 text-red-500" />}
                {isWarning && <AlertCircle className="w-5 h-5 text-amber-500" />}
                {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-sky-500" />}
              </div>

              <div className="flex-1 min-w-0">
                {toast.title && (
                  <p className="text-xs font-bold uppercase tracking-wider text-[#555653] dark:text-[#a8b2b0] mb-0.5">
                    {toast.title}
                  </p>
                )}
                <p className="text-sm font-medium leading-snug">{toast.message}</p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
