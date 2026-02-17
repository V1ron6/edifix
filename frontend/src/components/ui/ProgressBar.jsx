export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  showPercent = true,
  size = 'md',
  color = '#5b5f97',
  className = '',
}) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' };

  return (
    <div className={className}>
      {(label || showPercent) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && <span className="text-sm font-medium text-[#b8b8d1]">{label}</span>}
          {showPercent && <span className="text-sm text-[#5b5f97]">{percent}%</span>}
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-[#1a1a2e] ${heights[size]}`}>
        <div
          className={`${heights[size]} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
