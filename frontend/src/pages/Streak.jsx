import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { streakAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { Card, CardHeader, CardTitle, Button, Avatar, EmptyState } from '../components/ui';
import {
  Flame, Trophy, Snowflake, TrendingUp, Calendar, Award, Crown, Medal,
} from 'lucide-react';
import toast from 'react-hot-toast';

const MEDAL_STYLES = [
  { bg: 'bg-[#f39c12]/10', border: 'border-[#f39c12]/30', text: 'text-[#f39c12]', ring: 'ring-[#f39c12]/30' },
  { bg: 'bg-[#c0c0c0]/10', border: 'border-[#c0c0c0]/30', text: 'text-[#c0c0c0]', ring: 'ring-[#c0c0c0]/30' },
  { bg: 'bg-[#cd7f32]/10', border: 'border-[#cd7f32]/30', text: 'text-[#cd7f32]', ring: 'ring-[#cd7f32]/30' },
];

function StatBox({ label, value, sub, color = '#5b5f97' }) {
  return (
    <div className="rounded-xl border border-[#2a2a4a] bg-[#1a1a2e] p-4 text-center">
      <p className="text-xs text-[#a0a0b8]">{label}</p>
      <p className="mt-1 text-2xl font-black" style={{ color }}>{value}</p>
      {sub && <p className="text-xs text-[#5b5f97]">{sub}</p>}
    </div>
  );
}

export default function Streak() {
  const { user } = useAuth();
  const [streak, setStreak] = useState(null);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFreeze, setUsingFreeze] = useState(false);

  const fetchData = async () => {
    try {
      const [streakRes, lbRes] = await Promise.all([
        streakAPI.get(),
        streakAPI.getLeaderboard(),
      ]);
      setStreak(streakRes.data.data);
      setLeaders(lbRes.data.data || []);
    } catch {
      toast.error('Failed to load streak data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleUseFreeze = async () => {
    setUsingFreeze(true);
    try {
      await streakAPI.useFreeze();
      toast.success('Streak freeze used!');
      const { data } = await streakAPI.get();
      setStreak(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to use freeze');
    } finally {
      setUsingFreeze(false);
    }
  };

  if (loading) return <LoadingScreen main="Loading streak" secondary="Counting your days" />;

  const myRank = leaders.findIndex((l) => l.userId === user?.id || l.username === user?.username);
  const top3 = leaders.slice(0, 3);
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;
  const podiumHeights = ['h-20', 'h-28', 'h-16'];
  const podiumRanks = [2, 1, 3];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Page header */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-[#b8b8d1]">
          <Flame size={24} className="text-[#f39c12]" />
          My Streak
        </h1>
        <p className="mt-1 text-sm text-[#a0a0b8]">Track your daily learning consistency</p>
      </div>

      {/* Streak stats */}
      {streak ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatBox
              label="Current Streak"
              value={streak.currentStreak}
              sub="days"
              color="#f39c12"
            />
            <StatBox
              label="Longest Streak"
              value={streak.longestStreak}
              sub="days"
              color="#b8b8d1"
            />
            <StatBox
              label="Total Active"
              value={streak.totalActiveDays}
              sub="days"
              color="#5b5f97"
            />
            <StatBox
              label="Freezes Left"
              value={streak.streakFreezes}
              sub="available"
              color="#3498db"
            />
          </div>

          {/* Last activity */}
          {streak.lastActivityDate && (
            <Card className="flex items-center gap-3" padding="p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#5b5f97]/15">
                <Calendar size={18} className="text-[#5b5f97]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#b8b8d1]">Last Activity</p>
                <p className="text-xs text-[#a0a0b8]">
                  {new Date(streak.lastActivityDate).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              </div>
            </Card>
          )}

          {/* Freeze action */}
          {streak.streakFreezes > 0 && (
            <Card highlight className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" padding="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3498db]/15">
                  <Snowflake size={20} className="text-[#3498db]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#b8b8d1]">Streak Freeze</p>
                  <p className="text-xs text-[#a0a0b8]">
                    Use a freeze to protect your streak for one day you missed.
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                icon={Snowflake}
                loading={usingFreeze}
                onClick={handleUseFreeze}
                size="sm"
              >
                Use Freeze
              </Button>
            </Card>
          )}

          {/* My leaderboard rank */}
          {myRank >= 0 && (
            <Card highlight className="flex items-center gap-3" padding="p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5b5f97]/20">
                <TrendingUp size={16} className="text-[#5b5f97]" />
              </div>
              <p className="text-sm text-[#b8b8d1]">
                Your leaderboard rank:{' '}
                <span className="font-bold text-[#5b5f97]">#{myRank + 1}</span> of {leaders.length}
              </p>
            </Card>
          )}
        </>
      ) : (
        <Card padding="p-6">
          <p className="text-center text-sm text-[#a0a0b8]">
            No streak data yet.{' '}
            <Link to="/courses" className="text-[#5b5f97] hover:underline">Start learning</Link>{' '}
            to build your streak!
          </p>
        </Card>
      )}

      {/* Leaderboard section */}
      <Card padding="p-0" className="overflow-hidden">
        <CardHeader className="px-5 pt-5 pb-0">
          <CardTitle icon={Trophy} iconColor="text-[#f39c12]">Streak Leaderboard</CardTitle>
          <Link to="/leaderboard" className="text-xs text-[#5b5f97] hover:text-[#b8b8d1]">
            Full view
          </Link>
        </CardHeader>

        {leaders.length === 0 ? (
          <EmptyState
            icon={Award}
            title="No leaderboard data yet"
            description="Start a streak to appear on the leaderboard!"
          />
        ) : (
          <>
            {/* Podium */}
            {top3.length >= 3 && (
              <div className="bg-gradient-to-b from-[#5b5f97]/10 to-transparent px-4 pb-2 pt-6">
                <div className="flex items-end justify-center gap-4">
                  {podiumOrder.map((u, idx) => {
                    const rank = podiumRanks[idx];
                    const style = MEDAL_STYLES[rank - 1];
                    return (
                      <div key={u.id || idx} className="flex flex-col items-center">
                        <div className="relative mb-2">
                          {rank === 1 && (
                            <Crown size={18} className="absolute -top-5 left-1/2 -translate-x-1/2 text-[#f39c12]" />
                          )}
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${style.border} ${style.bg} text-sm font-bold ${style.text}`}>
                            {(u.avatar || u.username || '?').slice(0, 1).toUpperCase()}
                          </div>
                        </div>
                        <p className="mb-1 max-w-[72px] truncate text-center text-xs text-[#a0a0b8]">{u.username}</p>
                        <div className="flex items-center gap-1 text-sm">
                          <Flame size={12} className="text-[#f39c12]" />
                          <span className="font-bold text-[#f39c12]">{u.currentStreak}</span>
                        </div>
                        <div
                          className={`mt-1 flex w-16 items-center justify-center rounded-t-lg border ${podiumHeights[idx]} ${style.bg} ${style.border}`}
                        >
                          <span className={`text-lg font-black ${style.text}`}>{rank}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Top 10 list */}
            <div className="divide-y divide-[#2a2a4a] px-4 pb-4">
              {leaders.slice(0, 10).map((u, i) => {
                const isMe = u.userId === user?.id || u.username === user?.username;
                const isTop3 = i < 3;
                return (
                  <div
                    key={u.id || i}
                    className={`flex items-center gap-3 py-3 ${isMe ? 'font-medium' : ''}`}
                  >
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      isTop3
                        ? `${MEDAL_STYLES[i].bg} ${MEDAL_STYLES[i].text}`
                        : 'bg-[#1a1a2e] text-[#5b5f97]'
                    }`}>
                      {isTop3 ? <Medal size={14} /> : i + 1}
                    </span>
                    <Avatar src={u.avatar} username={u.username} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm ${isMe ? 'text-[#5b5f97]' : 'text-[#b8b8d1]'}`}>
                        {u.username}{isMe && <span className="ml-1 text-xs">(you)</span>}
                      </p>
                      <p className="text-xs text-[#a0a0b8]">Longest: {u.longestStreak}d</p>
                    </div>
                    <div className="flex items-center gap-1 rounded-lg bg-[#f39c12]/10 px-2 py-1 text-sm font-bold text-[#f39c12]">
                      <Flame size={12} />
                      {u.currentStreak}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
