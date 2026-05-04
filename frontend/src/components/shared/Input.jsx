export default function Input({
  id,
  label,
  error,
  className = '',
  ...props
}) {
  return (
    <label htmlFor={id} className="field">
      {label ? <span className="field-label">{label}</span> : null}
      <input id={id} className={`field-input ${error ? 'has-error' : ''} ${className}`.trim()} {...props} />
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}
