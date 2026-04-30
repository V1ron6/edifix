import { Link } from 'react-router-dom';
import { BookOpen, Code2, MessageSquare, FileText, ShieldCheck, Terminal } from 'lucide-react';

const FOOTER_LINKS = [
  {
    title: 'Learn',
    links: [
      { label: 'Courses', to: '/courses' },
      { label: 'Articles', to: '/articles' },
      { label: 'Playground', to: '/playground' },
      { label: 'Exams', to: '/exams' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Forum', to: '/forum' },
      { label: 'Leaderboard', to: '/leaderboard' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Profile', to: '/profile' },
      { label: 'Notifications', to: '/notifications' },
      { label: 'Reminders', to: '/reminders' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#1f2b37] bg-[#0d141d]/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-lg font-bold tracking-[0.2em] text-[#dbe6f2]">
              <Terminal size={16} className="text-[#9fef00]" />
              EDIFIX
            </Link>
            <p className="mt-2 text-sm leading-relaxed text-[#8ba0b3]">
              Offensive and defensive web learning, gamified labs, and community-driven progress tracking.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#9fef00]/30 bg-[#9fef00]/10 px-3 py-1 text-[11px] font-medium text-[#c8ff63]">
              <ShieldCheck size={12} />
              Training mode enabled
            </div>
          </div>

          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-sm font-semibold text-[#dbe6f2]">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-[#8ba0b3] transition-colors hover:text-[#9fef00]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[#1f2b37] pt-6 sm:flex-row">
          <p className="text-xs text-[#6f879c]">
            Edifix security academy for modern web builders
          </p>
          <div className="flex items-center gap-4 text-[#6f879c]">
            <BookOpen size={14} />
            <Code2 size={14} />
            <FileText size={14} />
            <MessageSquare size={14} />
          </div>
        </div>
      </div>
    </footer>
  );
}
