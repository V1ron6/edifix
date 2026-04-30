export default function StatCard({ icon: Icon, label, value, color, trend, className = '', animated = true }) {
  return (
    <div className={`group relative overflow-hidden rounded-xl border border-[#1f2b37] bg-[#101923] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2f4458] hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)] ${className}`}>
      <div 
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle at top right, ${color}08 0%, transparent 70%)` }}
      />
      
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon size={20} style={{ color }} />
          </div>
          {trend !== undefined && (
            <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              trend >= 0 
                ? 'bg-[#24d997]/10 text-[#24d997]' 
                : 'bg-[#ff5d73]/10 text-[#ff7f92]'
            }`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
        <p className={`text-2xl font-bold text-[#dbe6f2] ${animated ? 'transition-all duration-500' : ''}`}>{value}</p>
        <p className="mt-1 text-sm text-[#8ba0b3]">{label}</p>
      </div>
    </div>
  );
}
