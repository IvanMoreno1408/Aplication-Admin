import type { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  className?: string;
  accent?: 'green' | 'yellow' | 'default';
}

const accentColor = { green: '#2d7a2d', yellow: '#f5c518', default: '#e5e7eb' };

export function MetricCard({ title, value, icon, description, className = '', accent = 'green' }: MetricCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow p-6 flex items-start gap-4 ${className}`}
      style={{ borderLeft: `4px solid ${accentColor[accent]}` }}
    >
      {icon && <div className="text-3xl flex-shrink-0" style={{ color: '#2d7a2d' }}>{icon}</div>}
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold mt-1" style={{ color: '#1e5c1e' }}>{value}</p>
        {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      </div>
    </div>
  );
}

export default MetricCard;
