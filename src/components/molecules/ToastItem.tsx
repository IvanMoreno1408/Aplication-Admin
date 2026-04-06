import type { Toast } from '../../context/UIContext';

interface ToastItemProps extends Toast {
  onDismiss: (id: string) => void;
}

const styles: Record<Toast['type'], { container: string; icon: string }> = {
  success: {
    container: 'bg-green-100 text-green-800 border border-green-300',
    icon: '✓',
  },
  error: {
    container: 'bg-red-100 text-red-800 border border-red-300',
    icon: '✕',
  },
  info: {
    container: 'bg-blue-100 text-blue-800 border border-blue-300',
    icon: 'ℹ',
  },
};

export function ToastItem({ id, type, message, onDismiss }: ToastItemProps) {
  const { container, icon } = styles[type];

  return (
    <div
      role="alert"
      className={`flex items-start gap-2 rounded px-4 py-3 shadow ${container}`}
    >
      <span aria-hidden="true" className="mt-0.5 text-base font-bold">
        {icon}
      </span>
      <span className="flex-1 text-sm">{message}</span>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(id)}
        className="ml-2 text-lg leading-none opacity-60 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}
