export function unwrap(payload, fallback = null) {
  if (!payload) return fallback;
  if (Object.prototype.hasOwnProperty.call(payload, 'data')) return payload.data;
  return payload;
}
