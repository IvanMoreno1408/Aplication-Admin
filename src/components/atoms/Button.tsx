import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonType = 'button' | 'submit' | 'reset';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: ButtonType;
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
}

const GREEN = '#2d7a2d';
const GREEN_DARK = '#1e5c1e';

const Button: React.FC<ButtonProps> = ({
  children, onClick, type = 'button', variant = 'primary', disabled = false, className = '',
}) => {
  const getStyle = () => {
    if (variant === 'primary') return { backgroundColor: GREEN, color: 'white', border: 'none' };
    if (variant === 'secondary') return { backgroundColor: 'white', color: GREEN, border: `1px solid ${GREEN}` };
    return { backgroundColor: '#dc2626', color: 'white', border: 'none' };
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={getStyle()}
      className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium
        focus:outline-none transition-colors duration-150
        disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onMouseEnter={(e) => {
        if (disabled) return;
        if (variant === 'primary') e.currentTarget.style.backgroundColor = GREEN_DARK;
        if (variant === 'secondary') e.currentTarget.style.backgroundColor = '#f0fdf4';
        if (variant === 'danger') e.currentTarget.style.backgroundColor = '#b91c1c';
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        const s = getStyle();
        e.currentTarget.style.backgroundColor = s.backgroundColor;
      }}
    >
      {children}
    </button>
  );
};

export default Button;
