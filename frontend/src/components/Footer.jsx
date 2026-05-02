import { Link } from 'react-router-dom';
import { BookOpen, Code2, MessageSquare, FileText } from 'lucide-react';

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
    <footer className="mt-auto">
      {/* Gradient accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#5b5f97] to-transparent" />

      <div className="bg-[#16213e]/60 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <Link to="/" className="text-2xl font-bold tracking-wider text-gradient">
                EDIFIX
              </Link>
              <p className="mt-2 text-sm font-medium text-[#5b5f97]">
                Empowering the next generation of web developers
              </p>
              <p className="mt-3 text-sm text-[#a0a0b8] leading-relaxed">
                A structured learning platform for web development. From HTML to full-stack deployment.
              </p>
            </div>

            {/* Link columns */}
            {FOOTER_LINKS.map((col) => (
              <div key={col.title}>
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#5b5f97]">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
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
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[#2a2a4a] pt-6 sm:flex-row">
            <p className="text-xs text-[#5b5f97]/70">
              © {new Date().getFullYear()} Edifix · Learn web development step by step
            </p>
            <div className="flex items-center gap-4 text-[#5b5f97]/60">
              <BookOpen size={15} className="transition-colors hover:text-[#5b5f97]" />
              <Code2 size={15} className="transition-colors hover:text-[#5b5f97]" />
              <FileText size={15} className="transition-colors hover:text-[#5b5f97]" />
              <MessageSquare size={15} className="transition-colors hover:text-[#5b5f97]" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
