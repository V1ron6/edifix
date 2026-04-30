export default function PageHeader({
  title,
  description,
  badge,
  actions,
  backLink,
  className = '',
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Decorative gradient line */}
      <div className="absolute -left-4 top-0 h-full w-1 rounded-full bg-linear-to-b from-[#9fef00] via-[#00d1ff]/40 to-transparent" />
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="pl-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#dbe6f2] sm:text-3xl">{title}</h1>
            {badge}
          </div>
          {description && (
            <p className="mt-1 text-sm text-[#8ba0b3] sm:text-base">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2 pl-2 sm:pl-0">{actions}</div>
        )}
      </div>
    </div>
  );
}
