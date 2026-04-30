import { Link } from 'react-router-dom';
<<<<<<< HEAD
import { BookOpen, Code2, MessageSquare, FileText, ShieldCheck, Terminal } from 'lucide-react';
=======
import { BookOpen, Code2, MessageSquare, FileText } from 'lucide-react';
>>>>>>> f59cf19163d739540301b6513cea6b7dd25341c1

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
<<<<<<< HEAD
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
=======
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
>>>>>>> f59cf19163d739540301b6513cea6b7dd25341c1
          </div>
        </div>
      </div>
    </footer>
  );
}
