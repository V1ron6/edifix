export default function Card({
  children,
  className = '',
  hover = false,
  highlight = false,
  padding = 'p-5',
  ...props
}) {
  return (
    <div
      className={`rounded-xl border bg-[#16213e] ${
        highlight
          ? 'border-[#5b5f97]/30 shadow-[0_0_15px_rgba(91,95,151,0.06)]'
          : 'border-[#2a2a4a]'
      } ${
        hover
          ? 'transition-all duration-200 hover:border-[#5b5f97]/50 hover:shadow-[0_4px_20px_rgba(91,95,151,0.08)]'
          : ''
      } ${padding} ${className}`}
      {...props}
    >
      {children}
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

export function CardTitle({ children, icon: Icon, iconColor = 'text-[#5b5f97]', className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {Icon && <Icon size={18} className={iconColor} />}
      <h2 className="font-semibold text-[#b8b8d1]">{children}</h2>
    </div>
  );
}
