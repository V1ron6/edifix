import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Badge, Button, Card } from '../components/ui';
import {
  ArrowRight,
  BookOpen,
  Code2,
  FileCode2,
  FileText,
  Flame,
  MessageSquare,
  Radar,
  Shield,
  Target,
  Terminal,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';

const STATS = [
  { value: '72', label: 'Hands-on labs', icon: Radar, color: '#00d1ff' },
  { value: '14', label: 'Career tracks', icon: BookOpen, color: '#9fef00' },
  { value: '250+', label: 'Challenges solved daily', icon: Target, color: '#ffc857' },
  { value: '99.9%', label: 'Platform uptime', icon: Shield, color: '#24d997' },
];

const TRACKS = [
  {
    title: 'Web Offensive',
    level: 'Beginner to Advanced',
    desc: 'Learn recon, injection chains, and secure exploit methodology in guided labs.',
    points: ['Recon Fundamentals', 'OWASP attack labs', 'Bug bounty workflows'],
    color: '#9fef00',
  },
  {
    title: 'Defensive Engineering',
    level: 'Intermediate',
    desc: 'Harden modern applications and monitor suspicious behavior with practical blue-team drills.',
    points: ['Threat modeling', 'Secure auth patterns', 'Log and alert pipelines'],
    color: '#00d1ff',
  },
  {
    title: 'Full Stack Builder',
    level: 'All levels',
    desc: 'Ship production-ready apps with CI, secure APIs, and scalable deployment pipelines.',
    points: ['Frontend mastery', 'API and data design', 'Deploy and observe'],
    color: '#ffc857',
  },
];

const FEATURE_GRID = [
  {
    icon: Terminal,
    title: 'Interactive Labs',
    desc: 'Browser-based terminals and guided steps for zero-setup practical training.',
    link: '/playground',
  },
  {
    icon: FileText,
    title: 'Tactical Writeups',
    desc: 'Field notes and walkthroughs that explain not just what works, but why.',
    link: '/articles',
  },
  {
    icon: MessageSquare,
    title: 'Operator Forum',
    desc: 'Collaborate with learners, ask questions, and review challenge strategies.',
    link: '/forum',
  },
  {
    icon: Trophy,
    title: 'Live Leaderboard',
    desc: 'Compete on streaks, solved rooms, and exam precision in weekly seasons.',
    link: '/leaderboard',
  },
  {
    icon: FileCode2,
    title: 'Exam Arena',
    desc: 'Timed assessments with adaptive difficulty and detailed result insights.',
    link: '/exams',
  },
  {
    icon: Code2,
    title: 'Project Missions',
    desc: 'Build full projects to prove your skills beyond multiple-choice questions.',
    link: '/courses',
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="space-y-16 pb-14 lg:space-y-20">
      <section className="relative overflow-hidden rounded-3xl border border-[#1f2b37] bg-[#0f1822]/95 px-6 py-10 md:px-10 md:py-14">
        <div className="pointer-events-none absolute inset-0 cyber-grid opacity-35" />
        <div className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-[#9fef00]/14 blur-[100px]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#00d1ff]/12 blur-[100px]" />

        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="cyber-kicker">Mission Control</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl">
              Train like a real security team, not a passive course watcher.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-[#9ab0c4] sm:text-lg">
              Edifix blends hands-on labs, structured web tracks, and daily competitive missions to make your learning practical and measurable.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" icon={Zap} iconRight={ArrowRight}>Go To Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" icon={Shield} iconRight={ArrowRight}>Start Free Training</Button>
                  </Link>
                  <Link to="/courses">
                    <Button size="lg" variant="secondary" icon={BookOpen}>Explore Tracks</Button>
                  </Link>
                </>
              )}
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              <Badge variant="default" dot>Daily challenges</Badge>
              <Badge variant="info" dot>Real-world labs</Badge>
              <Badge variant="warning" dot>Career pathways</Badge>
            </div>
          </div>

          <Card className="cyber-panel" padding="p-6" gradient>
            <p className="cyber-kicker">Live Feed</p>
            <h3 className="mt-2 text-xl font-semibold text-[#dbe6f2]">Today in the arena</h3>
            <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-[#1f2b37] bg-[#15222f]/75 p-3">
                <p className="text-sm font-medium text-[#dbe6f2]">Injection Breakout</p>
                <p className="mt-1 text-xs text-[#8ba0b3]">Web Offensive room updated 2h ago</p>
              </div>
              <div className="rounded-xl border border-[#1f2b37] bg-[#15222f]/75 p-3">
                <p className="text-sm font-medium text-[#dbe6f2]">Blue Shield Sprint</p>
                <p className="mt-1 text-xs text-[#8ba0b3]">Defensive challenge starts in 45 min</p>
              </div>
              <div className="rounded-xl border border-[#1f2b37] bg-[#15222f]/75 p-3">
                <p className="text-sm font-medium text-[#dbe6f2]">Community Drill</p>
                <p className="mt-1 text-xs text-[#8ba0b3]">43 learners currently online in forum</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((item) => {
            const IconComponent = item.icon;
            return (
              <Card key={item.label} hover className="cyber-panel" padding="p-5">
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: `${item.color}22` }}>
                  <IconComponent size={20} style={{ color: item.color }} />
                </div>
                <p className="text-3xl font-bold text-[#eaf2ff]">{item.value}</p>
                <p className="mt-1 text-sm text-[#8ba0b3]">{item.label}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="cyber-kicker">Training Paths</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Choose your operation track</h2>
          </div>
          <Link to="/courses">
            <Button variant="secondary" iconRight={ArrowRight}>View curriculum</Button>
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {TRACKS.map((track) => (
            <Card key={track.title} hover className="cyber-panel" padding="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-[#dbe6f2]">{track.title}</h3>
                <span className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ backgroundColor: `${track.color}22`, color: track.color }}>
                  {track.level}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#8ba0b3]">{track.desc}</p>
              <ul className="mt-4 space-y-2">
                {track.points.map((point) => (
                  <li key={point} className="flex items-center gap-2 text-sm text-[#c6d6e8]">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: track.color }} />
                    {point}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="cyber-kicker">Platform Toolkit</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Everything to level up faster</h2>
          </div>
          <Badge variant="outline" icon={Users}>Built for solo learners and teams</Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURE_GRID.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Link key={feature.title} to={feature.link}>
                <Card hover className="h-full cyber-panel" padding="p-5" gradient>
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#1f2b37] bg-[#15222f]">
                    <IconComponent size={18} className="text-[#9fef00]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#dbe6f2]">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#8ba0b3]">{feature.desc}</p>
                  <p className="mt-4 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-[#9fef00]">
                    Enter <ArrowRight size={12} />
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {!user && (
        <section className="rounded-3xl border border-[#1f2b37] bg-linear-to-r from-[#101923] via-[#0f1822] to-[#101923] p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-10">
          <p className="cyber-kicker">Ready For Deployment</p>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Start your first mission in under 2 minutes</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#8ba0b3]">
            Create an account, pick a track, and begin solving practical web security and development challenges immediately.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register">
              <Button size="lg" icon={Flame}>Create Free Account</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="secondary">I already have access</Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
