import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-primary-900/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="Clear AM" className="h-9 w-auto brightness-0 invert" />
          <span className="hidden text-lg font-bold tracking-tight text-white sm:block">
            Clear <span className="text-accent-400">AM</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <img src="/assets/logo.png" alt="JCI Sidi Mansour" className="h-8 w-auto opacity-80 grayscale hover:opacity-100 hover:grayscale-0 transition-all" />
          <span className="h-6 w-px bg-white/20" />
          <div className="flex items-center gap-1 text-xs font-medium text-primary-200">
            <Leaf size={14} className="text-accent-400" />
            <span className="hidden sm:inline">Digital Sustainability</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
