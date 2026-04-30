const VARIANT_STYLES = {
  default: 'bg-[#9fef00]/15 text-[#9fef00]',
  success: 'bg-[#24d997]/15 text-[#24d997]',
  warning: 'bg-[#ffc857]/15 text-[#ffc857]',
  danger: 'bg-[#ff5d73]/15 text-[#ff7f92]',
  info: 'bg-[#00d1ff]/15 text-[#00d1ff]',
  outline: 'border border-[#1f2b37] text-[#9ab0c4]',
};

export default function Badge({
  children,
  variant = 'default',
  icon: Icon,
  dot = false,
  color,
  className = '',
}) {
  const customStyle = color
    ? { backgroundColor: `${color}20`, color }
    : {};

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
        color ? '' : VARIANT_STYLES[variant]
      } ${className}`}
      style={customStyle}
    >
      {dot && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: color || 'currentColor' }}
        />
      )}
      {Icon && <Icon size={10} />}
      {children}
    </span>
  );
}
