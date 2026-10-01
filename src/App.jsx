// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QRWelcomeBanner from '@/components/QRWelcomeBanner';
import Home from '@/pages/Home';
import Rent from '@/pages/Rent';
import Buy from '@/pages/Buy';
import PropertyDetails from '@/pages/PropertyDetails';
import Compare from '@/pages/Compare';
import Login from '@/pages/Auth/Login';
import Profile from '@/pages/Account/Profile';
import AdminLogin from '@/pages/Dashboard/AdminLogin';
import AdminDashboard from '@/pages/Dashboard/AdminDashboard';
import HowItWorks from '@/pages/Static/HowItWorks';
import Contact from '@/pages/Static/Contact';
import RefundPolicy from '@/pages/Static/RefundPolicy';
import Terms from '@/pages/Static/Terms';
import Privacy from '@/pages/Static/Privacy';
import MobileBottomNav from '@/components/MobileBottomNav';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import dataStore from '@/services/dataStore';

function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  React.useEffect(() => {
    if (hash) {
      const timer = setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, search, hash]);

  return null;
}

function LayoutWrapper({ children }) {
  const location = useLocation();
  const { user } = useAuth();
  const isAdminRoute = location.pathname.startsWith('/admin');

  React.useEffect(() => {
    dataStore.recordPresence(user, location.pathname);
    const interval = setInterval(() => {
      dataStore.recordPresence(user, location.pathname);
    }, 25000);
    return () => clearInterval(interval);
  }, [user, location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans pb-16 md:pb-0">
      {!isAdminRoute && (
        <>
          <QRWelcomeBanner />
          <Navbar />
        </>
      )}
      <main className="flex-1">{children}</main>
      {!isAdminRoute && (
        <>
          <Footer />
          <MobileBottomNav />
        </>
      )}
    </div>
  );
}

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-900 border-t-amber-400 rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-600">Verifying session integrity...</p>
      </div>
    );
  }

  return user && user.id ? children : <Navigate to="/login" replace />;
}

function RequireAdmin({ children }) {
  const { user, loading, isAdminVerified } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-3 text-white">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-amber-300">Verifying cryptographic admin privilege...</p>
      </div>
    );
  }

  // Strictly require valid admin role AND verified cryptographic session signature!
  if (!user || user.role !== 'admin' || !isAdminVerified) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-xl space-y-4">
            <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
              ⚠️
            </div>
            <h2 className="text-xl font-bold font-serif">Something went wrong</h2>
            <p className="text-xs text-slate-400">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition"
              >
                Reload Page
              </button>
              <a
                href="/"
                className="px-4 py-2 bg-slate-700 text-white font-bold text-xs rounded-xl hover:bg-slate-600 transition"
              >
                Return Home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <LayoutWrapper>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/rent" element={<Rent />} />
            <Route path="/buy" element={<Buy />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login initialRegister={true} />} />

            {/* User Account & Favorites */}
            <Route
              path="/account"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
            <Route
              path="/favorites"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />

            {/* Completely Isolated Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminDashboard />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/*"
              element={
                <RequireAdmin>
                  <AdminDashboard />
                </RequireAdmin>
              }
            />

            {/* 404 Fallback */}
            <Route
              path="*"
              element={
                <div className="max-w-md mx-auto p-12 text-center space-y-4">
                  <h1 className="text-4xl font-extrabold text-blue-950">404</h1>
                  <p className="text-sm text-slate-600">The requested property or page could not be found.</p>
                  <a
                    href="/"
                    className="inline-block bg-blue-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow"
                  >
                    Return to Home
                  </a>
                </div>
              }
            />
          </Routes>
        </LayoutWrapper>
      </Router>
    </AuthProvider>
    </ErrorBoundary>
  );
}
