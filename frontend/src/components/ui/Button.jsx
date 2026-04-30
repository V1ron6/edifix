import { forwardRef } from 'react';

const VARIANTS = {
  primary: 'border border-[#9fef00]/60 bg-[#9fef00] text-[#081207] hover:bg-[#b6ff35] focus:ring-[#9fef00]/45 shadow-[0_10px_26px_rgba(159,239,0,0.22)]',
  secondary: 'border border-[#1f2b37] bg-[#15222f] text-[#c7d7e8] hover:border-[#2f4458] hover:text-[#e7f2ff] focus:ring-[#00d1ff]/20',
  ghost: 'text-[#8ba0b3] hover:bg-[#15222f] hover:text-[#dbe6f2] focus:ring-[#00d1ff]/20',
  danger: 'bg-[#ff5d73]/12 text-[#ff93a2] hover:bg-[#ff5d73]/20 focus:ring-[#ff5d73]/22',
  success: 'bg-[#24d997] text-[#06170f] hover:bg-[#2ef1a8] focus:ring-[#24d997]/40',
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
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[#0b1116] disabled:pointer-events-none disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
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
