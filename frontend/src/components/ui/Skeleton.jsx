export default function Skeleton({ className = '', variant = 'rect', animate = true }) {
  const baseClasses = 'bg-[#2a2a4a]';
  const animateClasses = animate ? 'animate-pulse' : '';
  
  const variantClasses = {
    rect: 'rounded-lg',
    circle: 'rounded-full',
    text: 'h-4 rounded',
  };

  return (
    <div className={`${baseClasses} ${animateClasses} ${variantClasses[variant]} ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-[#2a2a4a] bg-[#16213e] p-5">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton variant="circle" className="h-10 w-10" />
        <div className="flex-1">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg border border-[#2a2a4a] bg-[#16213e] p-4">
          <Skeleton variant="circle" className="h-8 w-8" />
          <div className="flex-1">
            <Skeleton className="h-4 w-2/3 mb-1" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
