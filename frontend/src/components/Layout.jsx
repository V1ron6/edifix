import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#1a1a2e] text-[#e0e0e0]">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 animate-page">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
