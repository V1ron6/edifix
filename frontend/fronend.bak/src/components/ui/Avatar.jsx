import { User } from 'lucide-react';

export default function Avatar({ src, username, name, size = 'md', className = '' }) {
  // Accept both `name` and `username` props
  const displayName = username || name;
  const sizes = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={displayName || 'Avatar'}
        className={`rounded-full object-cover ring-2 ring-[#2a2a4a] ${sizes[size]} ${className}`}
      />
    );
  }

  const initials = displayName
    ? displayName.slice(0, 2).toUpperCase()
    : '';

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-[#5b5f97]/20 font-semibold text-[#5b5f97] ring-2 ring-[#2a2a4a] ${sizes[size]} ${className}`}
    >
      {initials || <User size={size === 'sm' ? 12 : size === 'lg' ? 20 : size === 'xl' ? 24 : 16} />}
    </div>
  );
}
