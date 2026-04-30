export default function Card({
  children,
  className = '',
  hover = false,
  highlight = false,
  gradient = false,
  glow = false,
  padding = 'p-5',
  ...props
}) {
  const baseClasses = 'relative overflow-hidden rounded-xl border bg-[#101923]';
  
  const borderClasses = highlight
    ? 'border-[#9fef00]/40 shadow-[0_0_24px_rgba(159,239,0,0.12)]'
    : 'border-[#1f2b37]';
  
  const hoverClasses = hover
    ? 'transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2f4458] hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)]'
    : '';
  
  const glowClasses = glow
    ? 'shadow-[0_0_36px_rgba(159,239,0,0.12)]'
    : '';

  return (
    <div
      className={`${baseClasses} ${borderClasses} ${hoverClasses} ${glowClasses} ${padding} ${className}`}
      {...props}
    >
      {gradient && (
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-[#9fef00]/10 via-transparent to-[#00d1ff]/10" />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, icon: Icon, iconColor = 'text-[#9fef00]', className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {Icon && <Icon size={18} className={iconColor} />}
      <h2 className="font-semibold text-[#dbe6f2]">{children}</h2>
    </div>
  );
}
