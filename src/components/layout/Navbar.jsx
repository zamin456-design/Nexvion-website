import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-3.5 bg-[#060714]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-content mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo - Vibrant Pink/Coral Rounded Squircle with 'N' + 'NexVion' */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ec4899] via-[#f43f5e] to-[#fb7185] flex items-center justify-center text-white font-bold text-base shadow-md shadow-pink-900/40 group-hover:scale-105 transition-transform">
            N
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-sans">
            NexVion
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-muted">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `transition-colors hover:text-white ${
                  isActive ? 'text-white font-semibold' : 'text-muted'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Button - Cyan to Golden Yellow Pill Gradient */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {isAdmin ? (
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-full text-xs font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-all"
                >
                  Bookings (Admin)
                </Link>
              ) : (
                <Link
                  to="/portal"
                  className="px-4 py-2 rounded-full text-xs font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
                >
                  My bookings
                </Link>
              )}

              <button
                onClick={logout}
                className="text-xs text-muted hover:text-white transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              to="/contact"
              className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-[#08060d] bg-gradient-to-r from-[#22d3ee] via-[#67e8f9] to-[#fde047] hover:opacity-95 transition-all shadow-md shadow-cyan-950/20 hover:scale-[1.02]"
            >
              Contact Us
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-muted hover:text-white focus:outline-none"
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/70 backdrop-blur-sm"
          />
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className={`absolute inset-x-0 bottom-0 overflow-y-auto border-t border-white/10 bg-[#070815] px-6 py-6 shadow-2xl ${
              scrolled ? 'top-[60px]' : 'top-[72px]'
            }`}
          >
            <div className="mx-auto flex max-w-content flex-col gap-5 text-sm font-medium">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `transition-colors ${isActive ? 'text-white font-bold' : 'text-muted'}`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                {user ? (
                  <>
                  <Link
                    to={isAdmin ? '/admin' : '/portal'}
                    onClick={() => setIsOpen(false)}
                    className="text-center py-2.5 rounded-full text-xs font-bold text-[#08060d] bg-gradient-to-r from-[#22d3ee] to-[#fde047]"
                  >
                    Open {isAdmin ? 'Admin Console' : 'My bookings'}
                  </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="text-xs text-muted text-center py-1"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="text-center py-2.5 rounded-full text-xs font-medium text-white bg-white/5 border border-white/10"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/contact"
                      onClick={() => setIsOpen(false)}
                      className="text-center py-2.5 rounded-full text-xs font-bold text-[#08060d] bg-gradient-to-r from-[#22d3ee] to-[#fde047]"
                    >
                      Contact Us
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
