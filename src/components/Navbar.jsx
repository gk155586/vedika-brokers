// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getAssetUrl } from '@/utils/assets';
import { 
  Building2, 
  Home, 
  Key, 
  ShoppingBag, 
  HelpCircle, 
  Phone, 
  User, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X,
  Heart,
  Scale,
  Compass,
  LogIn,
  UserPlus,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef(null);

  const isVideoHeroPage = location.pathname === '/' || location.pathname === '/account' || location.pathname === '/favorites';

  // Track scroll position to update header styling smoothly
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav
      className={`transition-all duration-300 z-50 border-none ${
        isVideoHeroPage
          ? isScrolled
            ? 'fixed top-0 left-0 right-0 bg-slate-950/85 backdrop-blur-md shadow-lg shadow-black/30'
            : 'fixed top-0 left-0 right-0 bg-transparent'
          : 'sticky top-0 bg-gradient-to-r from-blue-950 via-[#0C1A30] to-slate-900 text-white shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 transition-all duration-300">
          {/* Brand Logo floating directly on the hero background */}
          <Link
            to="/"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 group"
          >
            <img
              src={getAssetUrl('/logo-white.png')}
              alt="Vedika Brokers"
              className="h-10 sm:h-12 w-auto object-contain transition-all duration-300 group-hover:scale-105 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
            />
          </Link>

          {/* Desktop Nav Links - Pure Text & Icons Merged Directly with Background (NO White Boxes) */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
            <NavLink
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 bg-transparent ${
                  isActive
                    ? 'text-amber-400 font-extrabold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]'
                    : 'text-white/90 hover:text-amber-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]'
                }`
              }
            >
              <Home className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              <span>Home</span>
            </NavLink>

            <NavLink
              to="/rent"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 bg-transparent ${
                  isActive
                    ? 'text-amber-400 font-extrabold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]'
                    : 'text-white/90 hover:text-amber-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]'
                }`
              }
            >
              <Key className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              <span>Rent</span>
            </NavLink>

            <NavLink
              to="/buy"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 bg-transparent ${
                  isActive
                    ? 'text-amber-400 font-extrabold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]'
                    : 'text-white/90 hover:text-amber-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]'
                }`
              }
            >
              <ShoppingBag className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              <span>Buy</span>
            </NavLink>

            <NavLink
              to="/compare"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 bg-transparent ${
                  isActive
                    ? 'text-amber-400 font-extrabold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]'
                    : 'text-white/90 hover:text-amber-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]'
                }`
              }
            >
              <Scale className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              <span>Compare</span>
            </NavLink>

            <NavLink
              to="/how-it-works"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 bg-transparent ${
                  isActive
                    ? 'text-amber-400 font-extrabold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]'
                    : 'text-white/90 hover:text-amber-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]'
                }`
              }
            >
              <HelpCircle className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              <span>How It Works</span>
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 bg-transparent ${
                  isActive
                    ? 'text-amber-400 font-extrabold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]'
                    : 'text-white/90 hover:text-amber-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]'
                }`
              }
            >
              <Phone className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              <span>Contact</span>
            </NavLink>
          </div>

          {/* Right Controls: User Account Menu & Mobile Menu Toggle */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setMobileMenuOpen(false);
                }}
                className="relative group flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded-full transition-all duration-200 focus:outline-none bg-transparent hover:text-amber-300"
                title={user ? `Signed in as ${user.name || user.email}` : "User Account (Login / Register)"}
                aria-label="User Account"
              >
                <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-200 font-bold overflow-hidden transition-transform group-hover:scale-105">
                  {user ? (
                    <span className="text-xs text-amber-300 font-black">
                      {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <User className="w-4 h-4 text-amber-300" />
                  )}
                </div>
                <span className="text-xs font-bold text-white hidden sm:block drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
                  {user ? (user.name ? user.name.split(' ')[0] : 'Account') : 'Sign In'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-white/70 transition-transform duration-200 ${
                  userDropdownOpen ? 'rotate-180 text-amber-300' : 'group-hover:translate-y-0.5'
                }`} />
              </button>

              {/* Mobile Backdrop Overlay (Closes dropdown when tapping anywhere on phone screen) */}
              {userDropdownOpen && (
                <div
                  className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 sm:hidden"
                  onClick={() => setUserDropdownOpen(false)}
                />
              )}

              {/* Dropdown Menu Housing Login & Register Pages */}
              {userDropdownOpen && (
                <div className="fixed left-3 right-3 top-16 max-w-sm mx-auto sm:left-auto sm:right-0 sm:top-full sm:mt-3 sm:w-72 sm:max-w-none bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 py-2 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden text-white">
                  {user ? (
                    <div>
                      <div className="px-4 py-3 bg-white/5 border-b border-white/10">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Signed In As</div>
                        <div className="text-sm font-black text-white truncate">{user.name || 'User'}</div>
                        <div className="text-xs text-slate-300 truncate font-mono">{user.email || user.phone}</div>
                      </div>

                      <div className="p-2 space-y-1 text-xs font-semibold">
                        <Link
                          to="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-slate-200 hover:text-white transition group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30 group-hover:scale-105 transition-transform">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-white">My Account</div>
                            <div className="text-[10px] text-slate-400 font-normal">Profile, saved properties & visits</div>
                          </div>
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            handleSignOut();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/20 text-red-400 hover:text-red-300 transition text-left group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30 group-hover:scale-105 transition-transform">
                            <LogOut className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-red-400">Sign Out</div>
                            <div className="text-[10px] text-red-400/80 font-normal">End your current session</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="px-4 py-3 bg-white/5 border-b border-white/10">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Vedika Account</div>
                        <div className="text-sm font-black text-white">Sign In or Register</div>
                        <div className="text-[11px] text-slate-300">Access verified listings & direct unlock desk</div>
                      </div>

                      <div className="p-2 space-y-1.5 text-xs">
                        <Link
                          to="/login"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-white transition font-bold border border-white/10 group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-blue-600/40 border border-blue-400/30 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <LogIn className="w-4 h-4 text-amber-300" />
                          </div>
                          <div className="flex-1">
                            <div className="font-extrabold text-white group-hover:text-amber-300 transition-colors">Login</div>
                            <div className="text-[10px] text-slate-400 font-normal">Existing user account login</div>
                          </div>
                        </Link>

                        <Link
                          to="/register"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-400/20 to-amber-500/20 hover:from-amber-400/30 hover:to-amber-500/30 text-white transition font-bold border border-amber-400/30 group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                            <UserPlus className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="font-extrabold text-amber-300">Register / Sign Up</div>
                            <div className="text-[10px] text-amber-200/80 font-normal">Create a new genuine account</div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => {
                  setMobileMenuOpen(!mobileMenuOpen);
                  setUserDropdownOpen(false);
                }}
                className="p-2 rounded-xl text-white bg-transparent hover:text-amber-300 transition-all duration-200 focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200">
          <NavLink
            to="/"
            onClick={() => {
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all bg-transparent ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-200 hover:text-white'
              }`
            }
          >
            <Home className="w-5 h-5 text-amber-400" /> Home
          </NavLink>
          <NavLink
            to="/rent"
            onClick={() => {
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all bg-transparent ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-200 hover:text-white'
              }`
            }
          >
            <Key className="w-5 h-5 text-amber-400" /> Rent Properties
          </NavLink>
          <NavLink
            to="/buy"
            onClick={() => {
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all bg-transparent ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-200 hover:text-white'
              }`
            }
          >
            <ShoppingBag className="w-5 h-5 text-amber-400" /> Buy Properties
          </NavLink>
          <NavLink
            to="/compare"
            onClick={() => {
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all bg-transparent ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-200 hover:text-white'
              }`
            }
          >
            <Scale className="w-5 h-5 text-amber-400" /> Compare Flats
          </NavLink>
          <NavLink
            to="/how-it-works"
            onClick={() => {
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all bg-transparent ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-200 hover:text-white'
              }`
            }
          >
            <HelpCircle className="w-5 h-5 text-amber-400" /> How It Works
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => {
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all bg-transparent ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-200 hover:text-white'
              }`
            }
          >
            <Phone className="w-5 h-5 text-amber-400" /> Contact Broker
          </NavLink>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-amber-300 font-bold bg-amber-400/10 border border-amber-400/20"
                >
                  <User className="w-5 h-5" /> My Account ({user.name || user.email})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 font-semibold hover:bg-red-500/10 text-left transition"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl border border-white/20 text-white font-bold text-xs bg-white/10 hover:bg-white/20 transition backdrop-blur-md"
                >
                  <LogIn className="w-4 h-4 text-amber-400" /> Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 shadow-md transition hover:scale-105"
                >
                  <UserPlus className="w-4 h-4" /> Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
