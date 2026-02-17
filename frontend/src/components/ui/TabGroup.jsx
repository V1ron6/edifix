export default function TabGroup({ tabs, active, onChange, className = '' }) {
  return (
    <div className={`flex gap-1 rounded-lg bg-[#1a1a2e] p-1 ${className}`}>
      {tabs.map((tab) => {
        const key = typeof tab === 'string' ? tab : tab.value;
        const label = typeof tab === 'string' ? tab : tab.label;
        const isActive = active === key;

        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-[#5b5f97]/20 text-[#b8b8d1] shadow-sm'
                : 'text-[#a0a0b8] hover:text-[#b8b8d1]'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
