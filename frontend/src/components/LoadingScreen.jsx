import { useEffect, useState } from 'react';

export default function LoadingScreen({ main = 'Loading', secondary = '' }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1a1a2e]">
      {/* Animated radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(91,95,151,0.12) 0%, transparent 65%)',
          animation: 'pulse-glow 5s ease-in-out infinite',
        }}
      />

      <div className={`relative flex flex-col items-center transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        {/* Brand */}
        <span className="mb-8 text-sm font-bold tracking-[0.3em] text-gradient">
          EDIFIX
        </span>

        {/* Orbital ring spinner */}
        <div className="relative mb-8 flex h-16 w-16 items-center justify-center">
          {/* Outer ring */}
          <span
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: '#5b5f97',
              borderRightColor: '#5b5f97',
              animation: 'spin-slow 2s linear infinite',
            }}
          />
          {/* Inner ring */}
          <span
            className="absolute inset-2 rounded-full border-2 border-transparent"
            style={{
              borderBottomColor: '#7c3aed',
              borderLeftColor: '#7c3aed',
              animation: 'spin-slow 1.3s linear infinite reverse',
            }}
          />
          {/* Center dot */}
          <span className="h-2 w-2 rounded-full bg-[#5b5f97]" />
        </div>

        {/* Heading */}
        <h1 className="mb-1 text-xl font-semibold text-[#b8b8d1]">{main}</h1>
        {secondary && (
          <h2 className="text-sm text-[#5b5f97]">{secondary}</h2>
        )}
      </div>
    </div>
  );
}
