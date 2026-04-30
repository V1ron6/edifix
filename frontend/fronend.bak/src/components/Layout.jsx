import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
<<<<<<< HEAD
    <div className="relative flex min-h-screen flex-col overflow-hidden text-[#dbe6f2]">
      <div className="pointer-events-none absolute inset-0 cyber-grid opacity-50" />
      <div className="pointer-events-none absolute -left-32 top-16 h-96 w-96 rounded-full bg-[#9fef00]/10 blur-[110px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#00d1ff]/10 blur-[120px]" />
      <Navbar />
      <main className="relative mx-auto w-full max-w-7xl flex-1 px-4 py-8 animate-page md:px-6">
=======
    <div className="flex min-h-screen flex-col bg-[#1a1a2e] text-[#e0e0e0]">
      {/* Subtle dot-grid overlay for depth */}
      <div className="pointer-events-none fixed inset-0 dot-grid opacity-40" />
      <Navbar />
      <main className="relative mx-auto w-full max-w-7xl flex-1 px-4 py-6 animate-page">
>>>>>>> f59cf19163d739540301b6513cea6b7dd25341c1
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
