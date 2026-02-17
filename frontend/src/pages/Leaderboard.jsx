import { useState, useEffect } from 'react';
import { streakAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { PageHeader, Card, Avatar, EmptyState } from '../components/ui';
import { Trophy, Flame, Medal, Crown, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const MEDAL_STYLES = [
  { bg: 'bg-[#f39c12]/10', border: 'border-[#f39c12]/30', text: 'text-[#f39c12]', ring: 'ring-[#f39c12]/30' },
  { bg: 'bg-[#c0c0c0]/10', border: 'border-[#c0c0c0]/30', text: 'text-[#c0c0c0]', ring: 'ring-[#c0c0c0]/30' },
  { bg: 'bg-[#cd7f32]/10', border: 'border-[#cd7f32]/30', text: 'text-[#cd7f32]', ring: 'ring-[#cd7f32]/30' },
];

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await streakAPI.getLeaderboard();
        setLeaders(data.data || []);
      } catch {
        toast.error('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <LoadingScreen main="Loading leaderboard" secondary="Ranking users" />;

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);
  // Reorder for podium display: 2nd, 1st, 3rd
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;
  const podiumHeights = ['h-24', 'h-32', 'h-20'];
  const podiumRanks = [2, 1, 3];

  // Find current user rank
  const myRank = leaders.findIndex((l) => l.userId === user?.id || l.username === user?.username);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Streak Leaderboard"
        description="Top learners ranked by daily streaks"
      />

      {leaders.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No leaderboard data yet"
          description="Start a streak to appear on the leaderboard!"
        />
      ) : (
        <>
          {/* Podium */}
          {top3.length >= 3 && (
            <Card className="overflow-hidden" padding="p-0">
              <div className="bg-gradient-to-b from-[#5b5f97]/10 to-transparent px-4 pb-2 pt-6">
                <div className="flex items-end justify-center gap-3">
                  {podiumOrder.map((u, idx) => {
                    const rank = podiumRanks[idx];
                    const style = MEDAL_STYLES[rank - 1];
                    return (
                      <div key={u.id || idx} className="flex flex-col items-center">
                        <div className="relative mb-2">
                          {rank === 1 && (
                            <Crown size={20} className="absolute -top-5 left-1/2 -translate-x-1/2 text-[#f39c12]" />
                          )}
                          <Avatar
                            src={u.avatar}
                            username={u.username}
                            size={rank === 1 ? 'lg' : 'md'}
                            className={`ring-2 ${style.ring}`}
                          />
                        </div>
                        <p className={`text-sm font-semibold ${rank === 1 ? 'text-[#b8b8d1]' : 'text-[#a0a0b8]'}`}>
                          {u.username}
                        </p>
                        <div className="flex items-center gap-1 text-sm">
                          <Flame size={14} className="text-[#f39c12]" />
                          <span className="font-bold text-[#f39c12]">{u.currentStreak}</span>
                        </div>
                        <div
                          className={`mt-2 flex w-20 items-center justify-center rounded-t-xl border ${podiumHeights[idx]} ${style.bg} ${style.border}`}
                        >
                          <span className={`text-xl font-black ${style.text}`}>
                            {rank}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}

          {/* Current user rank badge */}
          {myRank >= 0 && (
            <Card highlight className="flex items-center gap-3" padding="p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5b5f97]/20">
                <TrendingUp size={16} className="text-[#5b5f97]" />
              </div>
              <p className="text-sm text-[#b8b8d1]">
                Your rank: <span className="font-bold text-[#5b5f97]">#{myRank + 1}</span> of {leaders.length}
              </p>
            </Card>
          )}

          {/* Full List */}
          <div className="space-y-1.5">
            {leaders.map((u, i) => {
              const isMe = u.userId === user?.id || u.username === user?.username;
              const isTop3 = i < 3;
              return (
                <Card
                  key={u.id || i}
                  hover
                  highlight={isMe}
                  className={`flex items-center gap-4 ${isMe ? '!border-[#5b5f97]/40' : ''}`}
                  padding="p-3"
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                    isTop3
                      ? `${MEDAL_STYLES[i].bg} ${MEDAL_STYLES[i].text}`
                      : 'bg-[#1a1a2e] text-[#5b5f97]'
                  }`}>
                    {isTop3 ? <Medal size={16} /> : i + 1}
                  </span>
                  <Avatar src={u.avatar} username={u.username} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${isMe ? 'text-[#5b5f97]' : 'text-[#b8b8d1]'}`}>
                      {u.username} {isMe && <span className="text-xs text-[#5b5f97]">(you)</span>}
                    </p>
                    <p className="text-xs text-[#a0a0b8]">
                      Longest: {u.longestStreak}d &middot; Active: {u.totalActiveDays}d
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-[#f39c12]/10 px-2.5 py-1 text-sm font-bold text-[#f39c12]">
                    <Flame size={14} />
                    {u.currentStreak}
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
