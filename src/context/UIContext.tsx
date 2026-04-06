import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface UIState {
  toasts: Toast[];
}

interface UIContextValue extends UIState {
  showToast: (type: Toast['type'], message: string) => void;
  dismissToast: (id: string) => void;
}

const UIContext = createContext<UIContextValue | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function showToast(type: Toast['type'], message: string) {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);
  }

  function dismissToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <UIContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUIContext(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUIContext must be used within a UIProvider');
  return ctx;
}

export { UIContext };
