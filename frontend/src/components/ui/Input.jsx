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
        <label className="mb-1.5 block text-sm font-medium text-[#9ab0c4]">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00d1ff]" />
        )}
        <input
          ref={ref}
          className={`w-full rounded-lg border border-[#1f2b37] bg-[#101923] px-8 py-2.5 text-sm text-[#dbe6f2] placeholder-[#6f879c]/60 outline-none transition-colors duration-200 focus:border-[#9fef00] focus:shadow-[0_0_0_3px_rgba(159,239,0,0.12)] ${
            Icon ? 'pl-9' : ''
          } ${error ? 'border-[#ff5d73] focus:border-[#ff5d73]' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-[#ff5d73]">{error}</p>}
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
        <label className="mb-1.5 block text-sm font-medium text-[#9ab0c4]">{label}</label>
      )}
      <textarea
        ref={ref}
        className={`w-full resize-y rounded-lg border border-[#1f2b37] bg-[#101923] p-3 text-sm text-[#dbe6f2] placeholder-[#6f879c]/60 outline-none transition-colors duration-200 focus:border-[#9fef00] focus:shadow-[0_0_0_3px_rgba(159,239,0,0.12)] ${
          error ? 'border-[#ff5d73] focus:border-[#ff5d73]' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-[#ff5d73]">{error}</p>}
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
        <label className="mb-1.5 block text-sm font-medium text-[#9ab0c4]">{label}</label>
      )}
      <select
        ref={ref}
        className={`rounded-lg border border-[#1f2b37] bg-[#101923] px-3 py-2.5 text-sm text-[#dbe6f2] outline-none transition-colors duration-200 focus:border-[#9fef00] ${className}`}
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
