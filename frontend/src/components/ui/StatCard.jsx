export default function StatCard({ icon: Icon, label, value, color, trend, className = '' }) {
  return (
    <div className={`group relative rounded-xl border border-[#2a2a4a] bg-[#16213e] p-4 transition-all duration-200 hover:border-[#5b5f97]/30 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(91,95,151,0.1)] ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: `linear-gradient(135deg, ${color}25, ${color}10)` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium ${trend >= 0 ? 'text-[#2ecc71]' : 'text-[#e74c3c]'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-[#b8b8d1]">{value}</p>
      {/* Gradient accent line below value */}
      <div className="my-1.5 h-px w-8 rounded-full bg-gradient-to-r from-[#5b5f97]/60 to-transparent" />
      <p className="text-xs text-[#a0a0b8]">{label}</p>
    </div>
  );
}
