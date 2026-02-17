export default function StatCard({ icon: Icon, label, value, color, trend, className = '' }) {
  return (
    <div className={`rounded-xl border border-[#2a2a4a] bg-[#16213e] p-4 transition-all duration-200 hover:border-[#5b5f97]/30 ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium ${trend >= 0 ? 'text-[#2ecc71]' : 'text-[#e74c3c]'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-lg font-bold text-[#b8b8d1]">{value}</p>
      <p className="mt-0.5 text-xs text-[#a0a0b8]">{label}</p>
    </div>
  );
}
