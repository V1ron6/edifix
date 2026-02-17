import { Link } from 'react-router-dom';
import { BookOpen, Code2, MessageSquare, FileText, Github } from 'lucide-react';

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
    <footer className="mt-auto border-t border-[#2a2a4a] bg-[#16213e]/50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="text-lg font-bold tracking-wider text-[#b8b8d1]">
              EDIFIX
            </Link>
            <p className="mt-2 text-sm text-[#a0a0b8] leading-relaxed">
              A structured learning platform for web development. From HTML to full-stack deployment.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-sm font-semibold text-[#b8b8d1]">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-[#a0a0b8] transition-colors hover:text-[#b8b8d1]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[#2a2a4a] pt-6 sm:flex-row">
          <p className="text-xs text-[#5b5f97]">
            Edifix - Learn web development step by step
          </p>
          <div className="flex items-center gap-4 text-[#5b5f97]">
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
