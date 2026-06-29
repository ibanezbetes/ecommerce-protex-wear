'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastInput {
  title?: string;
  message: string;
  duration?: number;
}

interface Toast extends Required<ToastInput> {
  id: string;
  type: ToastType;
}

interface ToastContextValue {
  show: (type: ToastType, input: ToastInput | string) => string;
  success: (input: ToastInput | string) => string;
  error: (input: ToastInput | string) => string;
  warning: (input: ToastInput | string) => string;
  info: (input: ToastInput | string) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_TITLES: Record<ToastType, string> = {
  success: 'Correcto',
  error: 'Error',
  warning: 'Aviso',
  info: 'Información',
};

const ICONS: Record<ToastType, React.ReactNode> = {
  success: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 17v-6" />
      <path d="M12 7h.01" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
};

const TYPE_STYLES: Record<ToastType, string> = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-indigo-50 border-indigo-200 text-indigo-800',
};

const ICON_STYLES: Record<ToastType, string> = {
  success: 'text-emerald-500 bg-emerald-100',
  error: 'text-red-500 bg-red-100',
  warning: 'text-amber-500 bg-amber-100',
  info: 'text-indigo-500 bg-indigo-100',
};

function normalizeInput(type: ToastType, input: ToastInput | string): Omit<Toast, 'id' | 'type'> {
  if (typeof input === 'string') {
    return {
      title: DEFAULT_TITLES[type],
      message: input,
      duration: 4200,
    };
  }

  return {
    title: input.title || DEFAULT_TITLES[type],
    message: input.message,
    duration: input.duration ?? 4200,
  };
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback((type: ToastType, input: ToastInput | string) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const toast: Toast = {
      id,
      type,
      ...normalizeInput(type, input),
    };

    setToasts((current) => [toast, ...current].slice(0, 4));

    window.setTimeout(() => {
      dismiss(id);
    }, toast.duration);

    return id;
  }, [dismiss]);

  const value = useMemo<ToastContextValue>(() => ({
    show,
    success: (input) => show('success', input),
    error: (input) => show('error', input),
    warning: (input) => show('warning', input),
    info: (input) => show('info', input),
    dismiss,
  }), [dismiss, show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-[360px] pointer-events-none" aria-live="polite" aria-relevant="additions">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 30, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg ${TYPE_STYLES[toast.type]}`}
              role={toast.type === 'error' ? 'alert' : 'status'}
            >
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${ICON_STYLES[toast.type]}`} aria-hidden="true">
                {ICONS[toast.type]}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="font-bold text-sm leading-tight mb-1">{toast.title}</p>
                <p className="text-sm opacity-90 leading-snug">{toast.message}</p>
              </div>
              <button 
                className="shrink-0 p-1 opacity-50 hover:opacity-100 transition-opacity rounded focus:outline-none focus:ring-2 focus:ring-current" 
                onClick={() => dismiss(toast.id)} 
                aria-label="Cerrar notificacion"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return context;
}
