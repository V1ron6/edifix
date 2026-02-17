export default function PageHeader({
  title,
  description,
  actions,
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <div>
        <h1 className="text-2xl font-bold text-[#b8b8d1]">{title}</h1>
        {description && <p className="mt-0.5 text-sm text-[#a0a0b8]">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
