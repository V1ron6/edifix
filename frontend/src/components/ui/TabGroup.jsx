export default function TabGroup({ tabs, active, onChange, className = '', size = 'md' }) {
  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  };

  return (
    <div className={`inline-flex gap-1 rounded-xl bg-[#1a1a2e] p-1 border border-[#2a2a4a] ${className}`}>
      {tabs.map((tab) => {
        const key = typeof tab === 'string' ? tab : tab.value;
        const label = typeof tab === 'string' ? tab : tab.label;
        const isActive = active === key;

        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`relative rounded-lg font-medium transition-all duration-300 ${sizes[size]} ${
              isActive
                ? 'bg-[#5b5f97] text-white shadow-[0_4px_12px_rgba(91,95,151,0.3)]'
                : 'text-[#a0a0b8] hover:text-[#b8b8d1] hover:bg-[#5b5f97]/10'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
