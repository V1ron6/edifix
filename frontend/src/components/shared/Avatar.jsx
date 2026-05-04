export default function Avatar({ src, username = 'U', size = 36 }) {
  if (src) {
    return <img src={src} alt={username} className="avatar" style={{ width: size, height: size }} />;
  }

  const initial = username.charAt(0).toUpperCase();
  return (
    <div className="avatar avatar-fallback" style={{ width: size, height: size }}>
      {initial}
    </div>
  );
}
