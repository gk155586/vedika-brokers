// src/pages/Account/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  User, 
  Key, 
  Calendar, 
  RefreshCw, 
  Heart, 
  MapPin, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  LogOut,
  Building2,
  ExternalLink,
  XCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import dataStore from '@/services/dataStore';
import PropertyCard from '@/components/PropertyCard';
import RefundRequestModal from '@/components/RefundRequestModal';
import FizzyPaymentSuccess from '@/components/FizzyPaymentSuccess';
import { getAssetUrl } from '@/utils/assets';

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialTab = () => {
    if (location.pathname === '/favorites' || location.search.includes('favorites')) {
      return 'favorites';
    }
    return 'unlocks';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [unlocks, setUnlocks] = useState([]);
  const [visits, setVisits] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [refundModalProperty, setRefundModalProperty] = useState(null);
  const [selectedPaymentSuccess, setSelectedPaymentSuccess] = useState(null);

  useEffect(() => {
    if (location.pathname === '/favorites') {
      setActiveTab('favorites');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadUserData();
    const unsub = dataStore.subscribe(loadUserData);
    return unsub;
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    const u = await dataStore.getUserUnlocks(user.id);
    setUnlocks(u || []);
    const v = await dataStore.getVisits(user.id);
    setVisits(v || []);
    const r = await dataStore.getRefunds(user.id);
    setRefunds(r || []);
    const f = await dataStore.getFavorites(user.id);
    setFavorites(f || []);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="relative min-h-screen">
      {/* 1. Full-screen Background Video (Playing flats & apartments tour in background) */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
          src={getAssetUrl('/tour/full-tour-merged.mp4')}
          poster={getAssetUrl('/tour/1.jpg')}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center scale-105 brightness-90 contrast-[1.05]"
        />
        {/* Dark luminous overlay for high contrast and crystal clear glass readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/70 to-slate-950/80 backdrop-blur-[2px]" />
      </div>

      {/* 2. Overall Transparent User Account Content Layered on Top of the Video */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-16 space-y-8 text-white">
        {/* Header Profile Banner - Transparent Frosted Glass */}
        <div className="bg-white/10 hover:bg-white/15 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-400/25">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">{user?.name || 'Customer'}</h1>
                <span className="bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {user?.role || 'Verified User'}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-white bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 transition backdrop-blur-md shadow-sm"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Transparent Tabs */}
        <div className="flex border-b border-white/15 overflow-x-auto scrollbar-none gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('unlocks')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'unlocks'
                ? 'border-amber-400 text-amber-300 bg-white/10 rounded-t-xl font-black shadow-inner'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-white/5 rounded-t-xl'
            }`}
          >
            <Key className="w-4 h-4 text-amber-400" /> Unlocked Addresses ({unlocks.length})
          </button>

          <button
            onClick={() => setActiveTab('visits')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'visits'
                ? 'border-amber-400 text-amber-300 bg-white/10 rounded-t-xl font-black shadow-inner'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-white/5 rounded-t-xl'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-400" /> Scheduled Visits ({visits.length})
          </button>

          <button
            onClick={() => setActiveTab('refunds')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'refunds'
                ? 'border-amber-400 text-amber-300 bg-white/10 rounded-t-xl font-black shadow-inner'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-white/5 rounded-t-xl'
            }`}
          >
            <RefreshCw className="w-4 h-4 text-amber-400" /> ₹500 Refund Requests ({refunds.length})
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'favorites'
                ? 'border-amber-400 text-amber-300 bg-white/10 rounded-t-xl font-black shadow-inner'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-white/5 rounded-t-xl'
            }`}
          >
            <Heart className="w-4 h-4 text-amber-400" /> Saved Properties ({favorites.length})
          </button>
        </div>

        {/* Tab Content Panels */}
        <div>
          {/* 1. Unlocked Addresses */}
          {activeTab === 'unlocks' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Your Unlocked Property Addresses</span>
              </h2>

              {unlocks.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/20 space-y-3 shadow-2xl">
                  <Key className="w-12 h-12 text-amber-400 mx-auto" />
                  <h3 className="text-base font-bold text-white">No properties unlocked yet</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Unlocked property addresses, direct contact info, and Google Maps directions appear here.
                  </p>
                  <Link
                    to="/rent"
                    className="inline-block bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-5 py-2.5 rounded-xl shadow-lg transition hover:scale-105"
                  >
                    Browse Properties
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {unlocks.map((item) => {
                    const existingRefund = refunds.find((r) => r.property_id === item.property_id);
                    const isPaid = existingRefund && ['processed', 'paid', 'approved', 'refunded'].includes(existingRefund.status);
                    const isRejected = existingRefund && existingRefund.status === 'rejected';
                    const isPending = existingRefund && existingRefund.status === 'pending';

                    return (
                      <div
                        key={item.id}
                        className="bg-white/10 hover:bg-white/15 backdrop-blur-xl p-5 rounded-2xl border border-white/20 shadow-xl space-y-3 transition-all"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="text-[10px] font-mono bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-400/30">
                              {item.property?.property_code || 'VB-PUN'}
                            </span>
                            <h3 className="text-sm font-bold text-white mt-1">{item.property?.title}</h3>
                            <p className="text-xs text-slate-300">{item.property?.locality}, {item.property?.area}</p>
                          </div>
                          <Link
                            to={`/property/${item.property_id}`}
                            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
                          >
                            <span>View Flat</span> <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>

                        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs space-y-1">
                          <p className="font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verified Address:
                          </p>
                          <p className="text-slate-100 font-medium leading-relaxed">{item.property?.address}</p>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-white/10">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.property?.address || '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow"
                          >
                            <Navigation className="w-3.5 h-3.5" /> Directions
                          </a>

                          {!existingRefund && (
                            <button
                              onClick={() => setRefundModalProperty(item.property)}
                              className="flex-1 bg-white/10 hover:bg-red-500/20 border border-white/20 hover:border-red-400/40 text-red-300 hover:text-red-200 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                            >
                              <RefreshCw className="w-3.5 h-3.5" /> Request ₹500 Refund
                            </button>
                          )}

                          {isPending && (
                            <div
                              title={`Refund request #${existingRefund.id} is under review`}
                              className="flex-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-default select-none"
                            >
                              <Clock className="w-3.5 h-3.5 animate-pulse text-amber-400" /> Refund Under Review
                            </div>
                          )}

                          {isPaid && (
                            <div
                              title={`₹500 refund paid to ${existingRefund.user_upi_id}`}
                              className="flex-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-default select-none"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ₹500 Refunded
                            </div>
                          )}

                          {isRejected && (
                            <div
                              title={existingRefund.admin_notes || 'Refund request rejected by admin. Re-requests closed.'}
                              className="flex-1 bg-red-500/20 border border-red-500/40 text-red-300 py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-default select-none"
                            >
                              <XCircle className="w-3.5 h-3.5 text-red-400" /> Refund Rejected
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => setSelectedPaymentSuccess({
                            property: item.property,
                            paymentDetails: { razorpay_payment_id: item.transaction_id || `PAY_UNL_${item.id}` }
                          })}
                          className="w-full text-center text-[11px] font-bold text-cyan-300 hover:text-white pt-1 flex items-center justify-center gap-1 transition"
                        >
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" /> View Payment Successful Receipt
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 2. Scheduled Visits */}
          {activeTab === 'visits' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Your Property Visits</span>
              </h2>

              {visits.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/20 space-y-3 shadow-2xl">
                  <Calendar className="w-12 h-12 text-amber-400 mx-auto" />
                  <h3 className="text-base font-bold text-white">No visits scheduled</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Schedule on-site accompanied inspections directly from verified listings.
                  </p>
                  <Link
                    to="/rent"
                    className="inline-block bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-5 py-2.5 rounded-xl shadow-lg transition hover:scale-105"
                  >
                    Explore Properties
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {visits.map((v) => (
                    <div
                      key={v.id}
                      className="bg-white/10 hover:bg-white/15 backdrop-blur-xl p-5 rounded-2xl border border-white/20 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-white">{v.property?.title || 'Property Visit'}</h4>
                        <p className="text-xs text-slate-300 mt-1">
                          Date: <strong className="text-white">{v.requested_date}</strong> • Slot: <strong className="text-white">{v.requested_time}</strong>
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">Contact: {v.phone}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                          v.status === 'confirmed'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : v.status === 'completed'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}>
                          {v.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Refund Requests */}
          {activeTab === 'refunds' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span>Your Post-Visit Refund Status</span>
              </h2>

              {refunds.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/20 space-y-3 shadow-2xl">
                  <RefreshCw className="w-12 h-12 text-amber-400 mx-auto" />
                  <h3 className="text-base font-bold text-white">No refund requests</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    If you inspect an unlocked flat and choose not to rent or purchase it, your ₹500 refund requests will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {refunds.map((r) => {
                    const isPaid = ['processed', 'paid', 'approved', 'refunded'].includes(r.status);
                    const isRejected = r.status === 'rejected';

                    return (
                      <div
                        key={r.id}
                        className="bg-white/10 hover:bg-white/15 backdrop-blur-xl p-5 rounded-2xl border border-white/20 shadow-xl space-y-3 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-mono font-bold text-amber-400/90">REF ID: #{r.id}</span>
                            <h4 className="text-sm font-bold text-white mt-0.5">{r.property?.title}</h4>
                            <p className="text-[10px] text-slate-300 font-mono mt-0.5">
                              Txn Reference: <span className="text-amber-200">{r.transaction_id || r.payment_id || 'VERIFIED'}</span>
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                            isPaid
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : isRejected
                              ? 'bg-red-500/20 text-red-300 border-red-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}>
                            {isPaid ? 'Paid' : isRejected ? 'Rejected' : 'Under Review'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-black/40 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                          <div>
                            <p className="text-slate-400 font-bold uppercase text-[10px]">Refund Amount</p>
                            <p className="font-black text-amber-400 text-sm">₹{r.amount}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 font-bold uppercase text-[10px]">Receiving UPI</p>
                            <p className="font-mono text-slate-200">{r.user_upi_id}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 font-bold uppercase text-[10px]">Reason</p>
                            <p className="text-slate-300 truncate">{r.reason}</p>
                          </div>
                        </div>

                        {r.admin_notes && (
                          <div className={`p-2.5 rounded-xl text-xs border ${
                            isRejected
                              ? 'bg-red-950/40 border-red-500/30 text-red-200'
                              : 'bg-slate-900/60 border-white/10 text-slate-300'
                          }`}>
                            <span className="font-bold text-[10px] uppercase block tracking-wider text-slate-400 mb-0.5">Admin Remark:</span>
                            <span>{r.admin_notes}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 4. Saved Favorites */}
          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-amber-400" />
                <span>Saved Properties</span>
              </h2>

              {favorites.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/20 space-y-3 shadow-2xl">
                  <Heart className="w-12 h-12 text-amber-400 mx-auto" />
                  <h3 className="text-base font-bold text-white">No saved favorites yet</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Tap the heart icon on any flat or apartment card to save it to your personal shortlist.
                  </p>
                  <Link
                    to="/rent"
                    className="inline-block bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-5 py-2.5 rounded-xl shadow-lg transition hover:scale-105"
                  >
                    Browse Listings
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((prop) => (
                    <PropertyCard key={prop.id} property={prop} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {refundModalProperty && (
        <RefundRequestModal
          property={refundModalProperty}
          isOpen={!!refundModalProperty}
          onClose={() => setRefundModalProperty(null)}
          onRequested={loadUserData}
        />
      )}

      {selectedPaymentSuccess && (
        <div 
          className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto overscroll-contain"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedPaymentSuccess(null);
          }}
        >
          <div className="w-full max-w-lg my-auto max-h-[92dvh] overflow-y-auto">
            <FizzyPaymentSuccess
              property={selectedPaymentSuccess.property}
              paymentDetails={selectedPaymentSuccess.paymentDetails}
              onClose={() => setSelectedPaymentSuccess(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
