import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden text-[#dbe6f2]">
      <div className="pointer-events-none absolute inset-0 cyber-grid opacity-50" />
      <div className="pointer-events-none absolute -left-32 top-16 h-96 w-96 rounded-full bg-[#9fef00]/10 blur-[110px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#00d1ff]/10 blur-[120px]" />
      <Navbar />
      <main className="relative mx-auto w-full max-w-7xl flex-1 px-4 py-8 animate-page md:px-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
