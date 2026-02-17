import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  icon: Icon,
  error,
  className = '',
  wrapperClass = '',
  ...props
}, ref) => {
  return (
    <div className={wrapperClass}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-[#a0a0b8]">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5b5f97]" />
        )}
        <input
          ref={ref}
          className={`w-full rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] px-4 py-2.5 text-sm text-[#e0e0e0] placeholder-[#5b5f97]/60 outline-none transition-colors duration-200 focus:border-[#5b5f97] focus:shadow-[0_0_0_3px_rgba(91,95,151,0.1)] ${
            Icon ? 'pl-9' : ''
          } ${error ? 'border-[#e74c3c] focus:border-[#e74c3c]' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-[#e74c3c]">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

export const TextArea = forwardRef(({
  label,
  error,
  className = '',
  wrapperClass = '',
  ...props
}, ref) => {
  return (
    <div className={wrapperClass}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-[#a0a0b8]">{label}</label>
      )}
      <textarea
        ref={ref}
        className={`w-full resize-y rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] p-3 text-sm text-[#e0e0e0] placeholder-[#5b5f97]/60 outline-none transition-colors duration-200 focus:border-[#5b5f97] focus:shadow-[0_0_0_3px_rgba(91,95,151,0.1)] ${
          error ? 'border-[#e74c3c] focus:border-[#e74c3c]' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-[#e74c3c]">{error}</p>}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export const Select = forwardRef(({
  label,
  options = [],
  className = '',
  wrapperClass = '',
  ...props
}, ref) => {
  return (
    <div className={wrapperClass}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-[#a0a0b8]">{label}</label>
      )}
      <select
        ref={ref}
        className={`rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] px-3 py-2.5 text-sm text-[#e0e0e0] outline-none transition-colors duration-200 focus:border-[#5b5f97] ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option
            key={typeof opt === 'string' ? opt : opt.value}
            value={typeof opt === 'string' ? opt : opt.value}
          >
            {typeof opt === 'string' ? opt : opt.label}
          </option>
        ))}
      </select>
    </div>
  );
});

Select.displayName = 'Select';
