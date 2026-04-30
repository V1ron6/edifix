import { useState, useEffect } from 'react';
import { streakAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { Card, Avatar, EmptyState } from '../components/ui';
import { Trophy, Flame, Medal, Crown, TrendingUp, Target, Calendar, Zap, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const MEDAL_STYLES = [
  { bg: 'bg-[#f39c12]/10', border: 'border-[#f39c12]/30', text: 'text-[#f39c12]', ring: 'ring-[#f39c12]/30', glow: 'shadow-[0_0_20px_rgba(243,156,18,0.3)]' },
  { bg: 'bg-[#c0c0c0]/10', border: 'border-[#c0c0c0]/30', text: 'text-[#c0c0c0]', ring: 'ring-[#c0c0c0]/30', glow: 'shadow-[0_0_15px_rgba(192,192,192,0.2)]' },
  { bg: 'bg-[#cd7f32]/10', border: 'border-[#cd7f32]/30', text: 'text-[#cd7f32]', ring: 'ring-[#cd7f32]/30', glow: 'shadow-[0_0_15px_rgba(205,127,50,0.2)]' },
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
  // Reorder for podium display: 2nd, 1st, 3rd
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;
  const podiumHeights = ['h-28', 'h-36', 'h-24'];
  const podiumRanks = [2, 1, 3];

  // Find current user rank
  const myRank = leaders.findIndex((l) => l.userId === user?.id || l.username === user?.username);

  // Calculate total stats
  const totalStreakDays = leaders.reduce((sum, l) => sum + (l.currentStreak || 0), 0);
  const avgStreak = leaders.length > 0 ? Math.round(totalStreakDays / leaders.length) : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] p-8 border border-[#2a2a4a]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f39c12]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#5b5f97]/10 rounded-full blur-2xl"></div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-[#f39c12]/20 rounded-xl">
              <Trophy className="text-[#f39c12]" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Streak Leaderboard</h1>
              <p className="text-[#a0a0b8]">Top learners ranked by daily consistency</p>
            </div>
          </div>
          
          {/* Stats Row */}
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-[#5b5f97]" />
              <span className="text-[#b8b8d1] font-medium">{leaders.length}</span>
              <span className="text-[#a0a0b8] text-sm">Competitors</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-[#f39c12]" />
              <span className="text-[#b8b8d1] font-medium">{totalStreakDays}</span>
              <span className="text-[#a0a0b8] text-sm">Total Streak Days</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[#2ecc71]" />
              <span className="text-[#b8b8d1] font-medium">{avgStreak}</span>
              <span className="text-[#a0a0b8] text-sm">Avg Streak</span>
            </div>
          </div>
        </div>
      </div>

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
              <div className="bg-gradient-to-b from-[#5b5f97]/10 to-transparent px-6 pb-4 pt-8">
                <div className="flex items-end justify-center gap-4">
                  {podiumOrder.map((u, idx) => {
                    const rank = podiumRanks[idx];
                    const style = MEDAL_STYLES[rank - 1];
                    return (
                      <div key={u.id || idx} className="flex flex-col items-center group">
                        <div className={`relative mb-3 transition-transform group-hover:scale-110 ${style.glow}`}>
                          {rank === 1 && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                              <Crown size={24} className="text-[#f39c12] animate-bounce" />
                            </div>
                          )}
                          <Avatar
                            src={u.avatar}
                            username={u.username}
                            size={rank === 1 ? 'lg' : 'md'}
                            className={`ring-4 ${style.ring}`}
                          />
                          <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${style.bg} ${style.border} border rounded-full flex items-center justify-center`}>
                            <span className={`text-xs font-bold ${style.text}`}>{rank}</span>
                          </div>
                        </div>
                        <p className={`text-sm font-semibold ${rank === 1 ? 'text-[#b8b8d1]' : 'text-[#a0a0b8]'} max-w-[80px] truncate`}>
                          {u.username}
                        </p>
                        <div className="flex items-center gap-1 text-sm mt-1">
                          <Flame size={14} className="text-[#f39c12]" />
                          <span className="font-bold text-[#f39c12]">{u.currentStreak}</span>
                        </div>
                        <div
                          className={`mt-3 flex w-24 items-center justify-center rounded-t-2xl border-t border-l border-r ${podiumHeights[idx]} ${style.bg} ${style.border} transition-all duration-300 group-hover:${style.glow}`}
                        >
                          <div className="text-center">
                            <span className={`text-3xl font-black ${style.text}`}>{rank}</span>
                            {rank === 1 && <Star size={14} className="mx-auto text-[#f39c12] mt-1" />}
                          </div>
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
            <Card highlight className="flex items-center gap-4 border-[#5b5f97]/30" padding="p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#5b5f97]/30 to-[#5b5f97]/10">
                <Zap size={24} className="text-[#5b5f97]" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-[#b8b8d1]">
                  Your Rank: <span className="text-[#5b5f97]">#{myRank + 1}</span>
                </p>
                <p className="text-sm text-[#a0a0b8]">
                  {myRank === 0 ? "You're in the lead!" : `${myRank} ${myRank === 1 ? 'person' : 'people'} ahead of you`}
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-[#f39c12]/10 rounded-xl">
                <Flame size={18} className="text-[#f39c12]" />
                <span className="font-bold text-[#f39c12]">{leaders[myRank]?.currentStreak || 0} day streak</span>
              </div>
            </Card>
          )}

          {/* Full List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2 mb-3">
              <h3 className="text-sm font-medium text-[#a0a0b8]">All Rankings</h3>
              <span className="text-xs text-[#5b5f97]">{leaders.length} learners</span>
            </div>
            {leaders.map((u, i) => {
              const isMe = u.userId === user?.id || u.username === user?.username;
              const isTop3 = i < 3;
              return (
                <Card
                  key={u.id || i}
                  hover
                  highlight={isMe}
                  className={`flex items-center gap-4 transition-all duration-200 ${isMe ? '!border-[#5b5f97]/40 !bg-[#5b5f97]/5' : ''}`}
                  padding="p-4"
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                    isTop3
                      ? `${MEDAL_STYLES[i].bg} ${MEDAL_STYLES[i].text} ${MEDAL_STYLES[i].border} border`
                      : 'bg-[#1a1a2e] text-[#5b5f97]'
                  }`}>
                    {isTop3 ? <Medal size={18} /> : i + 1}
                  </span>
                  <Avatar src={u.avatar} username={u.username} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className={`font-medium ${isMe ? 'text-[#5b5f97]' : 'text-[#b8b8d1]'}`}>
                      {u.username} {isMe && <span className="text-xs text-[#5b5f97] bg-[#5b5f97]/20 px-2 py-0.5 rounded-full ml-2">(you)</span>}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-[#a0a0b8] mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        Longest: {u.longestStreak}d
                      </span>
                      <span className="flex items-center gap-1">
                        <Target size={12} />
                        Active: {u.totalActiveDays}d
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-[#f39c12]/10 px-3 py-2">
                    <Flame size={16} className="text-[#f39c12]" />
                    <span className="font-bold text-[#f39c12]">{u.currentStreak}</span>
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
