// cn utility - merge class names
export function cn(...args) {
  return args
    .flat()
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Format ISO date to readable string
export function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

// Relative day label
export function relativeDay(iso) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((d - today) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  if (diff > 0) return `In ${diff}d`;
  return `${Math.abs(diff)}d ago`;
}
