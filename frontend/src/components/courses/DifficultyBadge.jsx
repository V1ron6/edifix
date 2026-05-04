import Badge from '../shared/Badge';

const map = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'danger',
};

export default function DifficultyBadge({ level = 'beginner' }) {
  const normalized = level.toLowerCase();
  return <Badge kind={map[normalized] || 'neutral'}>{level}</Badge>;
}
