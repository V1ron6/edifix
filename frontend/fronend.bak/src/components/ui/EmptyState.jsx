export default function EmptyState({
  icon: Icon,
  title = 'Nothing here yet',
  description = '',
  action,
  className = '',
  size = 'md',
}) {
  const sizes = {
    sm: { padding: 'py-10', icon: 20, iconBox: 'h-12 w-12 rounded-xl', title: 'text-base', desc: 'text-xs' },
    md: { padding: 'py-16', icon: 28, iconBox: 'h-16 w-16 rounded-2xl', title: 'text-lg', desc: 'text-sm' },
    lg: { padding: 'py-24', icon: 36, iconBox: 'h-20 w-20 rounded-2xl', title: 'text-xl', desc: 'text-base' },
  };
  const s = sizes[size];

  return (
    <div className={`flex flex-col items-center justify-center ${s.padding} ${className}`}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(91,95,151,0.03)_0%,transparent_50%)] pointer-events-none" />
      
      {Icon && (
        <div className={`relative mb-5 flex items-center justify-center ${s.iconBox} bg-gradient-to-br from-[#5b5f97]/15 to-[#5b5f97]/5 shadow-[0_8px_30px_rgba(91,95,151,0.1)]`}>
          <Icon size={s.icon} className="text-[#5b5f97]" />
          {/* Decorative ring */}
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#5b5f97]/10" />
        </div>
      )}
      <h3 className={`mb-1.5 font-semibold text-[#b8b8d1] ${s.title}`}>{title}</h3>
      {description && (
        <p className={`mb-5 max-w-sm text-center text-[#a0a0b8] ${s.desc}`}>{description}</p>
      )}
      {action}
    </div>
  );
}
