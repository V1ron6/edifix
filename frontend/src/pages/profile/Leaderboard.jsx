import { useEffect, useState } from 'react';
import Avatar from '../../components/shared/Avatar';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { unwrap } from '../../utils/response';
import { notifyError } from '../../components/shared/Toast';

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const response = await api.get('/api/streak/leaderboard', { auth: false });
        setLeaders(unwrap(response, []));
      } catch (error) {
        notifyError(error.message);
      }
    }

    loadLeaderboard();
  }, []);

  return (
    <main className="page-main">
      <table className="leaderboard">
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Current Streak</th>
            <th>Longest Streak</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((item) => (
            <tr key={item.userId} className={user?.id === item.userId ? 'me' : ''}>
              <td>{item.rank}</td>
              <td><Avatar username={item.username} src={item.avatar} size={28} /> {item.username}</td>
              <td>{item.currentStreak}</td>
              <td>{item.longestStreak}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
