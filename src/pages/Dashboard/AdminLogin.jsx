// src/pages/Dashboard/AdminLogin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { checkRateLimit } from '@/services/authSecurity';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { user, isAdminVerified, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user && user.role === 'admin' && isAdminVerified) {
      navigate('/admin', { replace: true });
    }
  }, [user, isAdminVerified, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Pre-flight rate limiting check
    const rl = checkRateLimit('admin_portal_login', 5, 60000);
    if (!rl.allowed) {
      setErrorMsg(rl.error);
      return;
    }

    setLoading(true);

    try {
      const loggedUser = await signIn(email, password);
      if (loggedUser && loggedUser.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        setErrorMsg('Access denied. This account does not possess Administrative privileges.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Admin authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 text-white">
        <div className="text-center space-y-3">
          <img
            src="/logo-white.png"
            alt="Vedika Brokers Logo"
            className="h-20 w-auto object-contain mx-auto drop-shadow-md"
          />
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authorized Operations Portal</span>
          </div>
          <p className="text-xs text-slate-400">
            Internal Administrative Console for Vedika Brokers Operations
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-950/80 border border-red-800 text-red-300 rounded-2xl text-xs font-semibold flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Admin Email
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-sm focus-within:border-amber-400 transition">
              <Mail className="w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="Enter administrative email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent w-full focus:outline-none text-xs text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
              Security Key / Password
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-sm focus-within:border-amber-400 transition">
              <Lock className="w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent w-full focus:outline-none text-xs text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Strict Security Notice:</span>
            </p>
            <p className="leading-relaxed">
              All access attempts are logged with timestamp and cryptographically signed session tokens. Unauthorized attempts are automatically rate-limited.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 rounded-xl shadow-lg transition text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying Cryptographic Credentials...</span>
              </div>
            ) : (
              <>
                <span>Authenticate to Admin Desk</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <a
            href="/"
            className="text-xs text-slate-500 hover:text-slate-300 transition"
          >
            &larr; Return to Public Website
          </a>
        </div>
      </div>
    </div>
  );
}
