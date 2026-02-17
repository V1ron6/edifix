import { forwardRef } from 'react';

const VARIANTS = {
  primary: 'bg-[#5b5f97] text-white hover:bg-[#5b5f97]/80 focus:ring-[#5b5f97]/40',
  secondary: 'border border-[#2a2a4a] text-[#a0a0b8] hover:border-[#5b5f97] hover:text-[#b8b8d1] focus:ring-[#5b5f97]/20',
  ghost: 'text-[#a0a0b8] hover:bg-[#5b5f97]/10 hover:text-[#b8b8d1] focus:ring-[#5b5f97]/20',
  danger: 'bg-[#e74c3c]/10 text-[#e74c3c] hover:bg-[#e74c3c]/20 focus:ring-[#e74c3c]/20',
  success: 'bg-[#2ecc71] text-[#1a1a2e] hover:bg-[#2ecc71]/80 focus:ring-[#2ecc71]/40',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-2.5 text-sm gap-2',
};

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[#1a1a2e] disabled:opacity-50 disabled:pointer-events-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 12 : 14} />
      ) : null}
      {children}
      {IconRight && !loading && <IconRight size={size === 'sm' ? 12 : 14} />}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
