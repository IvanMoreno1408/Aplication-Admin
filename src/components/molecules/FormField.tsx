import React from 'react';
import Input from '../atoms/Input';

interface InputProps {
  id?: string;
  name?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

interface FormFieldProps extends InputProps {
  label: string;
  id: string;
  error?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, id, error, ...inputProps }) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <Input id={id} aria-describedby={error ? `${id}-error` : undefined} {...inputProps} />
      {error && (
        <span id={`${id}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default FormField;
