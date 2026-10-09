// src/pages/Auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getAssetUrl } from '@/utils/assets';
import { 
  Building2, 
  Mail, 
  Lock, 
  Phone, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Key,
  Check,
  RefreshCw,
  Heart
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Login({ initialRegister = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp } = useAuth();

  const [isRegister, setIsRegister] = useState(() => initialRegister || location.pathname === '/register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const redirectPath = location.state?.from || '/';

  useEffect(() => {
    if (location.pathname === '/register') {
      setIsRegister(true);
    } else if (location.pathname === '/login') {
      setIsRegister(false);
    }
    setErrorMsg('');
    setSuccessMsg('');
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Client-side validations
    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (isRegister) {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (phone && phone.replace(/\D/g, '').length < 10) {
        setErrorMsg('Please enter a valid 10-digit mobile number.');
        return;
      }
      if (confirmPassword && password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please verify.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isRegister) {
        await signUp(name.trim(), email.trim(), password, phone.trim());
        setSuccessMsg('Account created successfully! Welcome to Vedika Brokers.');
      } else {
        await signIn(email.trim(), password);
      }
      navigate(redirectPath);
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] py-6 sm:py-12 px-3 sm:px-6 lg:px-8 max-w-6xl mx-auto flex items-center justify-center">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 w-full">
        
        {/* LEFT COLUMN: LUXURY HOUSE IMAGE & VERIFIED BRANDING */}
        <div className="lg:col-span-5 xl:col-span-6 relative bg-slate-950 text-white p-7 sm:p-10 lg:p-12 flex flex-col justify-between overflow-hidden min-h-[380px] sm:min-h-[540px]">
          {/* Background House Image with High Quality Architecture */}
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"
            alt="Modern luxury house in Nanded"
            className="absolute inset-0 w-full h-full object-cover select-none scale-105"
          />
          {/* Premium Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/45 pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <img
                src={getAssetUrl('/logo-white.png')}
                alt="Vedika Brokers"
                className="h-14 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-amber-300 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Direct Broker Desk &bull; Verified Properties</span>
            </div>
          </div>

          {/* Middle Headline & Trust Highlights */}
          <div className="relative z-10 space-y-4 my-8">
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight leading-snug">
              Verified Homes in Nanded.<br />
              <span className="text-amber-400">Zero Broker Spam.</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
              Connect directly with our authorized local operations desk. Inspect verified photos, carpet areas, and lock exact addresses with full visit refund protection.
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span><strong>100% Genuine Listings</strong>: No phantom or expired flats</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span><strong>Direct Broker Contact</strong>: Swapnil Navghare (+91 93701 48697)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-200">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span><strong>₹500 Visit Refund Guarantee</strong>: Hassle-free inspection</span>
              </div>
            </div>
          </div>

          {/* Bottom Card / Assurance */}
          <div className="relative z-10 bg-slate-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-[11px] text-slate-300">
            <p className="font-semibold text-white">Serving all prime localities across Nanded:</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Shivaji Nagar &bull; Anand Nagar &bull; Chhatrapati Chowk &bull; Taroda Naka &bull; Vazirabad &bull; Zenda Chowk
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: GENUINE LOGIN & REGISTER FORM */}
        <div className="lg:col-span-7 xl:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            
            {/* Top Switcher Tabs (Sign In vs Create Account) */}
            <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
                  !isRegister
                    ? 'bg-blue-950 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
                  isRegister
                    ? 'bg-blue-950 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Header Titles */}
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-serif text-slate-900">
                {isRegister ? 'Join Vedika Brokers' : 'Welcome Back'}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {isRegister
                  ? 'Create your genuine account to unlock addresses & book visits'
                  : 'Enter your credentials to access your unlocked addresses'}
              </p>
            </div>

            {/* Alert Message Banners */}
            {location.state?.message && !errorMsg && !successMsg && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs font-semibold animate-in fade-in flex items-center gap-2.5 shadow-sm">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
                <span>{location.state.message}</span>
              </div>
            )}
            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold animate-in fade-in">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold animate-in fade-in flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name (Only on Register) */}
              {isRegister && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Full Name</label>
                  <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl border border-slate-300 bg-slate-50/70 focus-within:bg-white focus-within:border-blue-950 focus-within:ring-2 focus-within:ring-blue-950/10 transition">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-transparent w-full focus:outline-none placeholder:text-slate-400 font-medium text-xs sm:text-sm text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* Mobile Phone (Only on Register) */}
              {isRegister && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-slate-700">Mobile Phone</label>
                    <span className="text-[11px] text-slate-400 font-medium">WhatsApp updates</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl border border-slate-300 bg-slate-50/70 focus-within:bg-white focus-within:border-blue-950 focus-within:ring-2 focus-within:ring-blue-950/10 transition">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="tel"
                      required
                      placeholder="Enter your 10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-transparent w-full focus:outline-none placeholder:text-slate-400 font-medium text-xs sm:text-sm text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Email Address</label>
                <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl border border-slate-300 bg-slate-50/70 focus-within:bg-white focus-within:border-blue-950 focus-within:ring-2 focus-within:ring-blue-950/10 transition">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent w-full focus:outline-none placeholder:text-slate-400 font-medium text-xs sm:text-sm text-slate-900"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  {!isRegister && (
                    <button
                      type="button"
                      onClick={() => alert('To reset your password, please contact the Vedika Brokers helpdesk at +91 93701 48697.')}
                      className="text-[11px] font-semibold text-blue-900 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl border border-slate-300 bg-slate-50/70 focus-within:bg-white focus-within:border-blue-950 focus-within:ring-2 focus-within:ring-blue-950/10 transition">
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent w-full focus:outline-none placeholder:text-slate-400 font-medium text-xs sm:text-sm text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-slate-700 transition"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Only on Register) */}
              {isRegister && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Confirm Password</label>
                  <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl border border-slate-300 bg-slate-50/70 focus-within:bg-white focus-within:border-blue-950 focus-within:ring-2 focus-within:ring-blue-950/10 transition">
                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-transparent w-full focus:outline-none placeholder:text-slate-400 font-medium text-xs sm:text-sm text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* Remember Me Checkbox (on Login) */}
              {!isRegister && (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded accent-blue-950 w-4 h-4"
                    />
                    Keep me signed in
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-950 to-slate-900 hover:from-blue-900 hover:to-slate-800 text-amber-400 font-black py-3.5 rounded-xl shadow-lg transition text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-xl active:scale-[0.99] mt-2"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </div>
                ) : (
                  <>
                    <span>{isRegister ? 'Create Verified Account' : 'Sign In to Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Bottom Toggle Note */}
              <div className="text-center pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-xs text-slate-600 font-semibold hover:text-blue-950 transition"
                >
                  {isRegister ? (
                    <span>Already registered with us? <strong className="text-blue-950 underline ml-1">Sign In here</strong></span>
                  ) : (
                    <span>Don't have an account yet? <strong className="text-blue-950 underline ml-1">Create one free</strong></span>
                  )}
                </button>
              </div>

              {/* Broker Contact Support Line */}
              <div className="text-center pt-2">
                <p className="text-[11px] text-slate-400">
                  Need immediate help? Call Nanded Operations:{' '}
                  <a href="tel:+919370148697" className="font-bold text-slate-700 hover:text-blue-950">
                    +91 93701 48697
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
