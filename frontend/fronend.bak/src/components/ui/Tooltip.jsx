import { useState } from 'react';

export default function Tooltip({ children, content, position = 'top', delay = 200 }) {
  const [visible, setVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const show = () => {
    const id = setTimeout(() => setVisible(true), delay);
    setTimeoutId(id);
  };

  const hide = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[#2a2a4a] border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[#2a2a4a] border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[#2a2a4a] border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[#2a2a4a] border-y-transparent border-l-transparent',
  };

  return (
    <div className="relative inline-block" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {visible && content && (
        <div
          className={`absolute z-50 whitespace-nowrap rounded-lg border border-[#2a2a4a] bg-[#1a1a2e] px-3 py-1.5 text-xs text-[#b8b8d1] shadow-lg ${positionClasses[position]} animate-in fade-in zoom-in-95 duration-150`}
        >
          {content}
          <span className={`absolute border-4 ${arrowClasses[position]}`} />
        </div>
      )}
    </div>
  );
}
