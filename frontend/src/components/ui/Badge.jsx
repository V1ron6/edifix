const VARIANT_STYLES = {
  default: 'bg-[#5b5f97]/15 text-[#5b5f97]',
  success: 'bg-[#2ecc71]/15 text-[#2ecc71]',
  warning: 'bg-[#f39c12]/15 text-[#f39c12]',
  danger: 'bg-[#e74c3c]/15 text-[#e74c3c]',
  info: 'bg-[#b8b8d1]/15 text-[#b8b8d1]',
  outline: 'border border-[#2a2a4a] text-[#a0a0b8]',
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
