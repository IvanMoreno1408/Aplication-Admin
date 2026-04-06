import { useEffect } from 'react';
import { useUIContext } from '../../context/UIContext';
import { ToastItem } from '../molecules/ToastItem';

const AUTO_DISMISS_MS = 4000;

function AutoDismissToast({
  id,
  dismissToast,
  children,
}: {
  id: string;
  dismissToast: (id: string) => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const timer = setTimeout(() => dismissToast(id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [id, dismissToast]);

  return <>{children}</>;
}

export function ToastNotification() {
  const { toasts, dismissToast } = useUIContext();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    >
      {toasts.map((toast) => (
        <AutoDismissToast key={toast.id} id={toast.id} dismissToast={dismissToast}>
          <ToastItem {...toast} onDismiss={dismissToast} />
        </AutoDismissToast>
      ))}
    </div>
  );
}
