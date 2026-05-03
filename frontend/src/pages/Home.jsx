import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen, Code2, FileText, MessageSquare, ArrowRight, Flame,
  Trophy, Target, Layers, ChevronRight, Zap,
} from 'lucide-react';

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Structured Courses',
    desc: 'Follow a clear learning path from HTML to full-stack deployment.',
    color: '#5b5f97',
  },
  {
    icon: Code2,
    title: 'Code Playground',
    desc: 'Write and test code directly in the browser with instant output.',
    color: '#2ecc71',
  },
  {
    icon: FileText,
    title: 'Articles & Guides',
    desc: 'In-depth articles covering best practices and modern techniques.',
    color: '#b8b8d1',
  },
  {
    icon: MessageSquare,
    title: 'Community Forum',
    desc: 'Ask questions, share knowledge, help fellow learners.',
    color: '#f39c12',
  },
  {
    icon: Flame,
    title: 'Daily Streaks',
    desc: 'Build consistency with streak tracking and leaderboards.',
    color: '#e74c3c',
  },
  {
    icon: Target,
    title: 'Exams & Quizzes',
    desc: 'Test your knowledge with auto-generated exams and track scores.',
    color: '#6c63ff',
  },
];

const PATH_STEPS = [
  { name: 'HTML', category: 'frontend' },
  { name: 'CSS', category: 'frontend' },
  { name: 'JavaScript', category: 'frontend' },
  { name: 'Git', category: 'frontend' },
  { name: 'Deployment', category: 'frontend' },
  { name: 'Node.js', category: 'backend' },
  { name: 'Databases', category: 'backend' },
  { name: 'Express.js', category: 'backend' },
  { name: 'Middlewares', category: 'backend' },
  { name: 'Full Deploy', category: 'backend' },
];

const STATS = [
  { value: '10+', label: 'Courses', icon: BookOpen },
  { value: '100+', label: 'Lessons', icon: Layers },
  { value: '500+', label: 'Questions', icon: Target },
  { value: '24/7', label: 'Access', icon: Trophy },
];

const TECH_BADGES = ['HTML', 'CSS', 'JavaScript', 'Node.js', 'React', 'Git'];

export default function Home() {
  const { user } = useAuth();

  return (
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
          ))}
        </div>
      </section>

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
          </div>
        </section>
      )}
    </div>
  );
}
