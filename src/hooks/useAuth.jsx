// src/hooks/useAuth.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import {
  verifyAdminCredentials,
  generateAdminSessionToken,
  verifyAdminSessionToken,
  invalidateAdminSession,
  registerLocalUser,
  authenticateLocalUser,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  isAuthorizedAdminEmail,
} from '@/services/authSecurity';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vb_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  });
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  // Validate session integrity upon startup and state changes
  useEffect(() => {
    let mounted = true;

    const validateSession = async () => {
      try {
        const saved = localStorage.getItem('vb_current_user');
        if (!saved) {
          if (mounted) {
            setUser(null);
            setIsAdminVerified(false);
            setLoading(false);
          }
          return;
        }

        const parsed = JSON.parse(saved);

        // If user account was suspended, terminate session immediately
        if (parsed.status === 'suspended' || parsed.isSuspended === true) {
          localStorage.removeItem('vb_current_user');
          if (mounted) {
            setUser(null);
            setIsAdminVerified(false);
            setLoading(false);
          }
          return;
        }

        // If user claims to be admin, cryptographically verify their session signature and email authorization!
        if (parsed.role === 'admin') {
          const isValidAdmin = await verifyAdminSessionToken();
          if (!isValidAdmin || !isAuthorizedAdminEmail(parsed.email)) {
            // Role tampering detected or expired session! Evict invalid admin session immediately.
            localStorage.removeItem('vb_current_user');
            invalidateAdminSession();
            if (mounted) {
              setUser(null);
              setIsAdminVerified(false);
              setLoading(false);
            }
            return;
          }

          // Sync full identity name from registered users directory if available
          try {
            const rawReg = localStorage.getItem('vb_registered_users');
            if (rawReg) {
              const regList = JSON.parse(rawReg);
              const m = regList.find(u => u.email && u.email.toLowerCase() === (parsed.email || '').toLowerCase());
              if (m) {
                if (m.name) parsed.name = m.name;
                if (m.phone) parsed.phone = m.phone;
                if (m.id && parsed.id && parsed.id.startsWith('admin-')) parsed.id = m.id;
              } else if (parsed.email && parsed.email.toLowerCase().includes('ganesh')) {
                parsed.name = 'Ganesh Sadashiv Kalapad';
              }
              localStorage.setItem('vb_current_user', JSON.stringify(parsed));
            }
          } catch (_) {}

          if (mounted) setIsAdminVerified(true);
        } else {
          // If this user is an authorized admin, verify if they have an active admin token
          if (isAuthorizedAdminEmail(parsed.email)) {
            const isValidAdmin = await verifyAdminSessionToken();
            if (isValidAdmin) {
              parsed.role = 'admin';
              localStorage.setItem('vb_current_user', JSON.stringify(parsed));
              if (mounted) setIsAdminVerified(true);
            } else {
              if (mounted) setIsAdminVerified(false);
            }
          } else {
            if (mounted) setIsAdminVerified(false);
          }
        }

        if (mounted) {
          setUser(parsed);
          setLoading(false);
        }
      } catch (_) {
        if (mounted) {
          setUser(null);
          setIsAdminVerified(false);
          setLoading(false);
        }
      }
    };

    validateSession();

    // Supabase Auth listener if configured
    if (supabase && supabase.auth && typeof supabase.auth.getSession === 'function') {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user && mounted) {
          const isUserAdmin = isAuthorizedAdminEmail(session.user.email);
          const u = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || (isUserAdmin ? 'Ganesh Kalapad (Admin)' : session.user.email.split('@')[0]),
            role: isUserAdmin ? 'admin' : 'user',
          };
          if (isUserAdmin) {
            generateAdminSessionToken(u).then(() => {
              if (mounted) setIsAdminVerified(true);
            });
          }
          setUser(u);
          localStorage.setItem('vb_current_user', JSON.stringify(u));
        }
      }).catch(() => {});

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user && mounted) {
          const isUserAdmin = isAuthorizedAdminEmail(session.user.email);
          const u = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || (isUserAdmin ? 'Ganesh Kalapad (Admin)' : session.user.email.split('@')[0]),
            role: isUserAdmin ? 'admin' : 'user',
          };
          if (isUserAdmin) {
            await generateAdminSessionToken(u);
            if (mounted) setIsAdminVerified(true);
          } else {
            if (mounted) setIsAdminVerified(false);
          }
          setUser(u);
          localStorage.setItem('vb_current_user', JSON.stringify(u));
        } else if (_event === 'SIGNED_OUT' && mounted) {
          setUser(null);
          setIsAdminVerified(false);
          localStorage.removeItem('vb_current_user');
          invalidateAdminSession();
        }
      });

      return () => {
        mounted = false;
        subscription?.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    const normalizedEmail = (email || '').trim().toLowerCase();
    const normalizedPassword = (password || '').trim();

    // 1. Rate Limiting Check
    const rlKey = `login_${normalizedEmail}`;
    const rl = checkRateLimit(rlKey, 5, 60000);
    if (!rl.allowed) {
      setLoading(false);
      throw new Error(rl.error);
    }

    try {
      // 2. Cryptographic Admin Authentication (Salted Hash Verification)
      const isAdminMatch = await verifyAdminCredentials(normalizedEmail, normalizedPassword);
      if (isAdminMatch) {
        resetRateLimit(rlKey);
        let adminName = normalizedEmail.includes('ganesh') ? 'Ganesh Sadashiv Kalapad' : 'Vedika Operations Admin';
        let adminPhone = '+91 97633 29442';
        let adminId = `admin-${normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;

        try {
          const reg = JSON.parse(localStorage.getItem('vb_registered_users') || '[]');
          const match = reg.find(u => u.email && u.email.toLowerCase() === normalizedEmail);
          if (match) {
            if (match.name) adminName = match.name;
            if (match.phone) adminPhone = match.phone;
            if (match.id) adminId = match.id;
          }
        } catch (_) {}

        const adminUser = {
          id: adminId,
          name: adminName,
          email: normalizedEmail,
          role: 'admin',
          phone: adminPhone,
        };

        // Generate signed HMAC session token
        await generateAdminSessionToken(adminUser);
        setUser(adminUser);
        setIsAdminVerified(true);
        localStorage.setItem('vb_current_user', JSON.stringify(adminUser));
        return adminUser;
      }

      // 3. Try Supabase Auth if configured
      if (supabase && supabase.auth) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password: normalizedPassword,
          });
          if (!error && data?.user) {
            resetRateLimit(rlKey);
            const isUserAdmin = isAuthorizedAdminEmail(data.user.email);
            const u = {
              id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.name || (isUserAdmin ? (normalizedEmail.includes('ganesh') ? 'Ganesh Sadashiv Kalapad' : 'Vedika Operations Admin') : normalizedEmail.split('@')[0]),
              role: isUserAdmin ? 'admin' : 'user',
            };
            if (isUserAdmin) {
              await generateAdminSessionToken(u);
              setIsAdminVerified(true);
            } else {
              setIsAdminVerified(false);
            }
            setUser(u);
            localStorage.setItem('vb_current_user', JSON.stringify(u));
            return u;
          }
        } catch (_) {}
      }

      // 4. Local User Authentication (Salted Hash Verification)
      const localUser = await authenticateLocalUser(normalizedEmail, normalizedPassword);
      if (localUser) {
        resetRateLimit(rlKey);
        const isUserAdmin = isAuthorizedAdminEmail(localUser.email);
        if (isUserAdmin) {
          localUser.role = 'admin';
          localUser.name = localUser.name || (normalizedEmail.includes('ganesh') ? 'Ganesh Sadashiv Kalapad' : 'Vedika Operations Admin');
          await generateAdminSessionToken(localUser);
          setIsAdminVerified(true);
        } else {
          setIsAdminVerified(false);
        }
        setUser(localUser);
        localStorage.setItem('vb_current_user', JSON.stringify(localUser));
        return localUser;
      }

      // 5. Authentication Failure: record attempt and return generic safe error
      recordFailedAttempt(rlKey, 5, 60000);
      throw new Error('Invalid email or password. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name, email, password, phone = '') => {
    setLoading(true);
    try {
      const normalizedEmail = (email || '').trim().toLowerCase();

      // If Supabase is connected, register securely through Supabase Auth
      if (supabase && supabase.auth) {
        try {
          const { data, error } = await supabase.auth.signUp({
            email: normalizedEmail,
            password,
            options: {
              data: {
                name: (name || '').trim(),
                phone: (phone || '').trim(),
                role: 'user', // NEVER allow client to pass 'admin'!
              },
            },
          });
          if (!error && data?.user) {
            const u = {
              id: data.user.id,
              name: (name || '').trim() || normalizedEmail.split('@')[0],
              email: normalizedEmail,
              phone: (phone || '').trim(),
              role: 'user',
            };
            setUser(u);
            setIsAdminVerified(false);
            localStorage.setItem('vb_current_user', JSON.stringify(u));
            return u;
          }
        } catch (_) {}
      }

      // Local Registration (Stores salted password hash, strips privileged role)
      const newUser = await registerLocalUser(name, email, password, phone);
      setUser(newUser);
      setIsAdminVerified(false);
      localStorage.setItem('vb_current_user', JSON.stringify(newUser));
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      if (supabase?.auth) await supabase.auth.signOut();
    } catch (_) {}
    invalidateAdminSession();
    setUser(null);
    setIsAdminVerified(false);
    localStorage.removeItem('vb_current_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdminVerified,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    const saved = localStorage.getItem('vb_current_user');
    const u = saved ? JSON.parse(saved) : null;
    return {
      user: u,
      loading: false,
      isAdminVerified: false,
      signIn: async () => {},
      signUp: async () => {},
      signOut: async () => {},
    };
  }
  return context;
}

export default useAuth;
