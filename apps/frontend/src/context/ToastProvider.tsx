"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { ToastOptions, ToastStatus } from "@/types/toast";

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: React.PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastOptions[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const generateId = () => {
    try {
      return crypto.randomUUID();
    } catch {
      // Safari fallback
      return Math.random().toString(36).slice(2);
    }
  };

  const showToast = useCallback(
    (options: ToastOptions) => {
      const id = options.id || generateId();

      const toast: ToastOptions = {
        id,
        status: options.status ?? ToastStatus.info,
        message: options.message,
        duration: options.duration ?? 3000,
      };

      setToasts((prev) => [...prev, toast]);

      // Auto remove toast
      setTimeout(() => removeToast(id), toast.duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ status = ToastStatus.info, message }: ToastOptions) {
  const base =
    "px-4 py-2 rounded-lg shadow-lg text-white text-sm animate-slideIn pointer-events-auto";

  const styles: Record<ToastStatus, string> = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
    warning: "bg-yellow-500"
  };

  return (
    <div className={`${base} ${styles[status]}`}>
      {message}
    </div>
  );
}

const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used inside <ToastProvider>");
  }
  return context;
};

export { useToastContext };
