import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen, Code2, FileText, MessageSquare, ArrowRight, Flame,
  Trophy, Target, Layers, ChevronRight,
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

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="space-y-24 pb-16">
      {/* Hero */}
      <section className="relative flex flex-col items-center pt-16 text-center">
        {/* Background glow */}
        <div className="absolute top-0 h-[500px] w-full bg-[radial-gradient(ellipse_at_top,rgba(91,95,151,0.12)_0%,transparent_60%)]" />

        <div className="relative">
          <span className="mb-4 inline-block rounded-full border border-[#5b5f97]/30 bg-[#5b5f97]/10 px-4 py-1.5 text-xs font-medium text-[#5b5f97]">
            Learn web development the right way
          </span>
          <h1 className="text-4xl font-bold leading-tight text-[#b8b8d1] sm:text-5xl lg:text-6xl">
            Master Web Development
            <br />
            <span className="text-gradient">Step by Step</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-[#a0a0b8] leading-relaxed">
            A structured learning platform that takes you from zero to full-stack.
            Courses, exams, a code playground, community forum, and progress tracking
            -- everything you need in one place.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-lg bg-[#5b5f97] px-7 py-3 text-sm font-medium text-white shadow-[0_4px_16px_rgba(91,95,151,0.3)] transition-all hover:bg-[#5b5f97]/80 hover:shadow-[0_6px_24px_rgba(91,95,151,0.4)]"
              >
                Go to Dashboard
                <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="flex items-center gap-2 rounded-lg bg-[#5b5f97] px-7 py-3 text-sm font-medium text-white shadow-[0_4px_16px_rgba(91,95,151,0.3)] transition-all hover:bg-[#5b5f97]/80 hover:shadow-[0_6px_24px_rgba(91,95,151,0.4)]"
                >
                  Get Started Free
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/courses"
                  className="flex items-center gap-2 rounded-lg border border-[#2a2a4a] px-7 py-3 text-sm text-[#a0a0b8] transition-all hover:border-[#5b5f97] hover:text-[#b8b8d1]"
                >
                  Browse Courses
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="mx-auto max-w-3xl">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center rounded-xl border border-[#2a2a4a] bg-[#16213e] p-4 transition hover:border-[#5b5f97]/30"
            >
              <Icon size={18} className="mb-2 text-[#5b5f97]" />
              <span className="text-xl font-bold text-[#b8b8d1]">{value}</span>
              <span className="text-xs text-[#a0a0b8]">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Path */}
      <section className="mx-auto max-w-4xl">
        <h2 className="mb-2 text-center text-2xl font-bold text-[#b8b8d1]">The Learning Path</h2>
        <p className="mb-8 text-center text-sm text-[#a0a0b8]">
          Follow the structured curriculum from frontend fundamentals to backend mastery
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Frontend */}
          <div className="rounded-xl border border-[#2a2a4a] bg-[#16213e] p-5">
            <h3 className="mb-4 text-sm font-semibold text-[#5b5f97]">Frontend</h3>
            <div className="space-y-2">
              {PATH_STEPS.filter((s) => s.category === 'frontend').map((step, i) => (
                <div key={step.name} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5b5f97]/15 text-xs font-semibold text-[#5b5f97]">
                    {i + 1}
                  </span>
                  <span className="text-sm text-[#b8b8d1]">{step.name}</span>
                  {i < 4 && (
                    <ChevronRight size={12} className="ml-auto text-[#2a2a4a]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Backend */}
          <div className="rounded-xl border border-[#2a2a4a] bg-[#16213e] p-5">
            <h3 className="mb-4 text-sm font-semibold text-[#5b5f97]">Backend</h3>
            <div className="space-y-2">
              {PATH_STEPS.filter((s) => s.category === 'backend').map((step, i) => (
                <div key={step.name} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5b5f97]/15 text-xs font-semibold text-[#5b5f97]">
                    {i + 6}
                  </span>
                  <span className="text-sm text-[#b8b8d1]">{step.name}</span>
                  {i < 4 && (
                    <ChevronRight size={12} className="ml-auto text-[#2a2a4a]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="mb-2 text-center text-2xl font-bold text-[#b8b8d1]">Everything You Need</h2>
        <p className="mb-8 text-center text-sm text-[#a0a0b8]">
          All the tools and resources to become a proficient web developer
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="group rounded-xl border border-[#2a2a4a] bg-[#16213e] p-6 transition-all duration-200 hover:border-[#5b5f97]/40 hover:shadow-[0_4px_20px_rgba(91,95,151,0.06)]"
            >
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <h3 className="mb-1.5 font-semibold text-[#b8b8d1]">{title}</h3>
              <p className="text-sm leading-relaxed text-[#a0a0b8]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="mx-auto max-w-2xl text-center">
          <div className="rounded-2xl border border-[#5b5f97]/20 bg-gradient-to-b from-[#5b5f97]/10 to-transparent p-10">
            <h2 className="text-2xl font-bold text-[#b8b8d1]">Start Your Journey Today</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#a0a0b8]">
              Join Edifix and get access to structured courses, practice exams,
              a code playground, and a supportive community.
            </p>
            <Link
              to="/register"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#5b5f97] px-8 py-3 text-sm font-medium text-white shadow-[0_4px_16px_rgba(91,95,151,0.3)] transition-all hover:shadow-[0_6px_24px_rgba(91,95,151,0.4)]"
            >
              Create Free Account
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
