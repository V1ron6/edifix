export default function EmptyState({
  icon: Icon,
  title = 'Nothing here yet',
  description = '',
  action,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      {Icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5b5f97]/10">
          <Icon size={28} className="text-[#5b5f97]" />
        </div>
      )}
      <h3 className="mb-1 text-lg font-semibold text-[#b8b8d1]">{title}</h3>
      {description && (
        <p className="mb-4 max-w-sm text-center text-sm text-[#a0a0b8]">{description}</p>
      )}
      {action}
    </div>
  );
}
