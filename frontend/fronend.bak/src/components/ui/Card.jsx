export default function Card({
  children,
  className = '',
  hover = false,
  highlight = false,
<<<<<<< HEAD
  gradient = false,
=======
>>>>>>> f59cf19163d739540301b6513cea6b7dd25341c1
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
<<<<<<< HEAD
      className={`${baseClasses} ${borderClasses} ${hoverClasses} ${glowClasses} ${padding} ${className}`}
=======
      className={`rounded-xl border bg-[#16213e] ${
        glow
          ? 'border-[#5b5f97]/20 shadow-[0_0_30px_rgba(91,95,151,0.12)]'
          : highlight
          ? 'border-[#5b5f97]/30 shadow-[0_0_15px_rgba(91,95,151,0.06)]'
          : 'border-[#2a2a4a]'
      } ${
        hover
          ? 'transition-all duration-200 hover:border-[#5b5f97]/50 hover:shadow-[0_8px_30px_rgba(91,95,151,0.1)]'
          : ''
      } ${padding} ${className}`}
>>>>>>> f59cf19163d739540301b6513cea6b7dd25341c1
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
