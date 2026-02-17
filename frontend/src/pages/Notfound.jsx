import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function Notfound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      {/* Animated 404 */}
      <div className="relative mb-8">
        <span className="text-[120px] font-black leading-none text-[#5b5f97]/10 sm:text-[160px]">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl border border-[#5b5f97]/30 bg-[#5b5f97]/10 p-5 backdrop-blur-sm">
            <Search size={40} className="text-[#5b5f97]" />
          </div>
        </div>
      </div>

      <h1 className="mb-2 text-2xl font-bold text-[#b8b8d1] sm:text-3xl">
        Page not found
      </h1>
      <p className="mb-8 max-w-md text-[#a0a0b8]">
        The page you're looking for doesn't exist or has been moved.
        Let's get you back on track.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link to="/">
          <Button icon={Home} size="lg">
            Go Home
          </Button>
        </Link>
        <Button
          variant="secondary"
          icon={ArrowLeft}
          size="lg"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}