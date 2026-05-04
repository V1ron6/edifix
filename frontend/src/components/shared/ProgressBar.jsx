export default function ProgressBar({ value = 0 }) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className="progress-root" aria-label="Progress bar">
      <div className="progress-fill" style={{ width: `${safeValue}%` }} />
      <span className="progress-label">{safeValue}%</span>
    </div>
  );
}
