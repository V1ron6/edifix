import Button from '../shared/Button';

export default function StreakWidget({ streakData, onUseFreeze }) {
  return (
    <section className="card">
      <h3>Streak</h3>
      <p>Current: {streakData?.currentStreak || 0}</p>
      <p>Longest: {streakData?.longestStreak || 0}</p>
      <p>Active days: {streakData?.activeDays || 0}</p>
      <p>Freezes: {streakData?.freezesAvailable || 0}</p>
      <Button variant="secondary" onClick={onUseFreeze}>Use Freeze</Button>
    </section>
  );
}
