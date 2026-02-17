import { useEffect, useState } from 'react';

const BAR_COLORS = ['#b8b8d1', '#5b5f97', '#ffffff', '#b8b8d1'];

export default function LoadingScreen({ main = 'Loading', secondary = '' }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => (prev + 1) % 4);
    }, 350);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1a1a2e]">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(91,95,151,0.08)_0%,transparent_70%)]" />

      <div className="relative flex flex-col items-center">
        {/* Brand */}
        <span className="mb-6 text-sm font-bold tracking-[0.3em] text-[#5b5f97]/50">
          EDIFIX
        </span>

        {/* Heading */}
        <h1 className="mb-1.5 text-xl font-semibold text-[#b8b8d1]">{main}</h1>
        {secondary && (
          <h2 className="mb-10 text-sm text-[#5b5f97]">{secondary}</h2>
        )}

        {/* Animated bars */}
        <div className="flex items-end gap-1.5" style={{ height: '3rem' }}>
          {BAR_COLORS.map((color, i) => {
            const isActive = i === tick;
            const isNext = i === (tick + 1) % 4;
            return (
              <span
                key={i}
                className="block w-2.5 rounded-full"
                style={{
                  backgroundColor: color,
                  height: isActive ? '2.5rem' : isNext ? '1.6rem' : '0.8rem',
                  opacity: isActive ? 1 : isNext ? 0.7 : 0.35,
                  transition: 'height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
