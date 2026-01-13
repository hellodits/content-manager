import { cn } from '../lib/utils';

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  type?: 'text' | 'textarea' | 'select';
  options?: { value: string; label: string }[];
  placeholder?: string;
  rows?: number;
}

export default function FormInput({
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
  options = [],
  placeholder,
  rows = 6,
}: FormInputProps) {
  const baseClasses = cn(
    'w-full px-4 py-2.5 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20',
    error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
  );

  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className={cn(baseClasses, 'resize-none')}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={baseClasses}
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
