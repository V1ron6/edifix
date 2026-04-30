import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Badge, Button, Card } from '../components/ui';
import {
<<<<<<< HEAD
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
=======
  BookOpen, Code2, FileText, MessageSquare, ArrowRight, Flame,
  Trophy, Target, Layers, ChevronRight, Zap,
>>>>>>> f59cf19163d739540301b6513cea6b7dd25341c1
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

const TECH_BADGES = ['HTML', 'CSS', 'JavaScript', 'Node.js', 'React', 'Git'];

export default function Home() {
  const { user } = useAuth();

  return (
<<<<<<< HEAD
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
=======
    <div className="space-y-28 pb-16">
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative flex flex-col items-center pt-20 text-center">
        {/* Animated radial blob */}
        <div
          className="pointer-events-none absolute top-0 -translate-y-1/4 h-[600px] w-[600px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(91,95,151,0.6) 0%, rgba(124,58,237,0.2) 50%, transparent 75%)',
            animation: 'pulse-glow 6s ease-in-out infinite',
          }}
        />

        <div className="relative z-10">
          {/* "NEW" badge with shimmer */}
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#5b5f97]/40 bg-[#5b5f97]/10 px-4 py-1.5 text-xs font-semibold text-[#a78bfa]">
            <Zap size={11} className="text-[#a78bfa]" />
            Learn web development the right way
          </span>

          <h1 className="text-5xl font-extrabold leading-tight text-[#b8b8d1] sm:text-6xl lg:text-7xl">
            Master Web Dev
            <br />
            <span className="text-gradient-vivid">Step by Step</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base text-[#a0a0b8] leading-relaxed sm:text-lg">
            A structured learning platform that takes you from zero to full-stack.
            Courses, exams, a code playground, community forum, and progress tracking
            — everything you need in one place.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5b5f97] to-[#7c3aed] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(91,95,151,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-[0_8px_30px_rgba(91,95,151,0.5)]"
              >
                Go to Dashboard
                <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5b5f97] to-[#7c3aed] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(91,95,151,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-[0_8px_30px_rgba(91,95,151,0.5)]"
                >
                  Get Started Free
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/courses"
                  className="flex items-center gap-2 rounded-xl border border-[#2a2a4a] px-8 py-3.5 text-sm text-[#a0a0b8] transition-all duration-200 hover:border-[#5b5f97]/60 hover:text-[#b8b8d1] hover:-translate-y-0.5"
                >
                  Browse Courses
                </Link>
              </>
            )}
          </div>

          {/* Floating tech badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {TECH_BADGES.map((badge, i) => (
              <span
                key={badge}
                className="rounded-full border border-[#2a2a4a] bg-[#16213e] px-4 py-1.5 text-xs font-medium text-[#a0a0b8]"
                style={{
                  animation: `float ${3 + i * 0.4}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────── */}
      <section className="mx-auto max-w-3xl">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div
              key={label}
              className="group relative flex flex-col items-center rounded-2xl border border-[#2a2a4a] bg-[#16213e] p-5 transition-all duration-200 hover:border-[#5b5f97]/40 hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(91,95,151,0.12)]"
            >
              {/* Subtle gradient border top */}
              <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-[#5b5f97]/40 to-transparent" />
              <Icon size={20} className="mb-3 text-[#5b5f97]" />
              <span className="text-2xl font-extrabold text-[#b8b8d1]">{value}</span>
              <span className="mt-1 text-xs text-[#a0a0b8]">{label}</span>
            </div>
>>>>>>> f59cf19163d739540301b6513cea6b7dd25341c1
          ))}
        </div>
      </section>

<<<<<<< HEAD
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
=======
      {/* ── Learning Path ────────────────────────────── */}
      <section className="mx-auto max-w-4xl">
        <h2 className="mb-2 text-center text-3xl font-bold text-[#b8b8d1]">The Learning Path</h2>
        <p className="mb-10 text-center text-sm text-[#a0a0b8]">
          Follow the structured curriculum from frontend fundamentals to backend mastery
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Frontend */}
          <div className="overflow-hidden rounded-2xl border border-[#2a2a4a] bg-[#16213e]">
            <div className="bg-gradient-to-r from-[#5b5f97]/30 to-[#7c3aed]/10 px-5 py-3">
              <h3 className="text-sm font-bold text-[#a78bfa] tracking-wide uppercase">Frontend</h3>
            </div>
            <div className="space-y-1 p-5">
              {PATH_STEPS.filter((s) => s.category === 'frontend').map((step, i) => (
                <div key={step.name} className="flex items-center gap-3 py-1">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5b5f97]/30 to-[#7c3aed]/20 text-xs font-bold text-[#a78bfa]">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm text-[#b8b8d1]">{step.name}</span>
                  {i < 4 && (
                    <ChevronRight size={13} className="text-[#2a2a4a]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Backend */}
          <div className="overflow-hidden rounded-2xl border border-[#2a2a4a] bg-[#16213e]">
            <div className="bg-gradient-to-r from-[#2ecc71]/20 to-[#2ecc71]/5 px-5 py-3">
              <h3 className="text-sm font-bold text-[#2ecc71] tracking-wide uppercase">Backend</h3>
            </div>
            <div className="space-y-1 p-5">
              {PATH_STEPS.filter((s) => s.category === 'backend').map((step, i) => (
                <div key={step.name} className="flex items-center gap-3 py-1">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2ecc71]/20 to-[#2ecc71]/10 text-xs font-bold text-[#2ecc71]">
                    {i + 6}
                  </span>
                  <span className="flex-1 text-sm text-[#b8b8d1]">{step.name}</span>
                  {i < 4 && (
                    <ChevronRight size={13} className="text-[#2a2a4a]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────── */}
      <section>
        <h2 className="mb-2 text-center text-3xl font-bold text-[#b8b8d1]">Everything You Need</h2>
        <p className="mb-10 text-center text-sm text-[#a0a0b8]">
          All the tools and resources to become a proficient web developer
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="group relative rounded-2xl border border-[#2a2a4a] bg-[#16213e] p-6 transition-all duration-300 hover:border-[#5b5f97]/40 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(91,95,151,0.12)]"
            >
              {/* Glow spot on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 20% 20%, ${color}08 0%, transparent 65%)` }}
              />
              <div
                className="relative mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: `${color}18`,
                  boxShadow: `0 0 0 0 ${color}50`,
                }}
              >
                <Icon size={21} style={{ color }} />
              </div>
              <h3 className="mb-2 font-semibold text-[#b8b8d1]">{title}</h3>
              <p className="text-sm leading-relaxed text-[#a0a0b8]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      {!user && (
        <section className="mx-auto max-w-3xl text-center">
          <div className="relative overflow-hidden rounded-3xl border border-[#5b5f97]/25 bg-gradient-to-br from-[#5b5f97]/20 via-[#16213e] to-[#7c3aed]/10 p-14">
            {/* Pattern overlay */}
            <div className="pointer-events-none absolute inset-0 dot-grid opacity-30" />
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold text-[#b8b8d1]">Start Your Journey Today</h2>
              <p className="mx-auto mt-4 max-w-md text-base text-[#a0a0b8]">
                Join Edifix and get access to structured courses, practice exams,
                a code playground, and a supportive community — all for free.
              </p>
              <Link
                to="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5b5f97] to-[#7c3aed] px-10 py-3.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(91,95,151,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-[0_8px_30px_rgba(91,95,151,0.55)]"
              >
                Create Free Account
                <ArrowRight size={16} />
              </Link>
            </div>
>>>>>>> f59cf19163d739540301b6513cea6b7dd25341c1
          </div>
        </section>
      )}
    </div>
  );
}
