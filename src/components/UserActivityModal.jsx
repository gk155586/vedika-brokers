// src/components/UserActivityModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  Key, 
  Calendar, 
  MessageSquare, 
  ExternalLink, 
  Phone, 
  Mail, 
  ShieldCheck, 
  MapPin, 
  Clock,
  UserCheck
} from 'lucide-react';

export default function UserActivityModal({ user, onClose }) {
  const [activeTab, setActiveTab] = useState('likes');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!user) return null;

  const formatPrice = (val, type) => {
    const num = Number(val) || 0;
    if (type === 'rent') return `₹${num.toLocaleString('en-IN')}/mo`;
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    return `₹${(num / 100000).toFixed(2)} Lakhs`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="bg-white w-full max-w-3xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with User Info */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pr-8">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 font-black text-xl sm:text-2xl flex items-center justify-center shadow-lg shadow-amber-400/20">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                {user.isOnline && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" title="Online Now" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold font-serif text-white">{user.name}</h2>
                  <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                    <ShieldCheck className="w-3 h-3" /> Member
                  </span>
                  {user.isOnline ? (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Online Now
                    </span>
                  ) : (
                    <span className="bg-white/10 text-slate-300 text-[10px] px-2 py-0.5 rounded-full">
                      Last active: {user.lastActive}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 mt-1">
                  {user.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-amber-400" /> {user.email}
                    </span>
                  )}
                  {user.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-amber-400" /> {user.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            {user.phone && (
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`tel:${user.phone.replace(/\s+/g, '')}`}
                  className="px-3 py-1.5 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
                >
                  <Phone className="w-3.5 h-3.5" /> Call
                </a>
                <a
                  href={`https://wa.me/${user.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${user.name}, this is Vedika Brokers Desk. How can we assist you with your property requirements in Nanded?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
                >
                  WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 gap-2 sm:gap-4 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('likes')}
            className={`py-3 px-2 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'likes'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${activeTab === 'likes' ? 'fill-rose-600' : ''}`} />
            <span>Liked Properties</span>
            <span className="bg-rose-100 text-rose-700 text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {user.likesCount || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('unlocks')}
            className={`py-3 px-2 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'unlocks'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Unlocked Addresses</span>
            <span className="bg-blue-100 text-blue-900 text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {user.unlocksCount || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('visits')}
            className={`py-3 px-2 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'visits'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Site Visits</span>
            <span className="bg-slate-200 text-slate-800 text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {user.visitsCount || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`py-3 px-2 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'enquiries'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Enquiries</span>
            <span className="bg-slate-200 text-slate-800 text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {user.enquiriesCount || 0}
            </span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* 1. LIKED PROPERTIES TAB */}
          {activeTab === 'likes' && (
            <div>
              {user.likedProperties && user.likedProperties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {user.likedProperties.map((prop) => (
                    <div 
                      key={prop.id}
                      className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl p-3 flex gap-3 transition group"
                    >
                      <img
                        src={prop.main_image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80'}
                        alt={prop.title}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-black uppercase text-blue-900 bg-blue-100 px-1.5 py-0.5 rounded">
                              {prop.listing_type}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 font-bold">
                              {prop.property_code}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 truncate mt-1" title={prop.title}>
                            {prop.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-amber-600 shrink-0" /> {prop.area}, Nanded
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-extrabold text-blue-950 font-serif">
                            {formatPrice(prop.price, prop.listing_type)}
                          </span>
                          <a
                            href={`/property/${prop.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold text-blue-900 hover:text-blue-950 flex items-center gap-0.5"
                          >
                            View <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 space-y-2">
                  <Heart className="w-10 h-10 text-slate-300 mx-auto stroke-1" />
                  <p className="text-xs font-bold text-slate-600">No properties saved to favorites yet</p>
                  <p className="text-[11px] text-slate-400">When this user clicks the heart icon on any property, it will appear here in real time.</p>
                </div>
              )}
            </div>
          )}

          {/* 2. UNLOCKED ADDRESSES TAB */}
          {activeTab === 'unlocks' && (
            <div>
              {user.unlockedProperties && user.unlockedProperties.length > 0 ? (
                <div className="space-y-3">
                  {user.unlockedProperties.map((prop) => (
                    <div 
                      key={prop.id}
                      className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                            Unlocked
                          </span>
                          <span className="text-xs font-bold text-slate-900">{prop.title}</span>
                          <span className="text-xs text-slate-400 font-mono">({prop.property_code})</span>
                        </div>
                        <p className="text-xs font-semibold text-emerald-950 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span><strong>Exact Address:</strong> {prop.address || `${prop.locality || prop.area}, Nanded - 431601`}</span>
                        </p>
                      </div>

                      <a
                        href={`/property/${prop.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 self-start sm:self-auto shadow-sm"
                      >
                        Listing <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 space-y-2">
                  <Key className="w-10 h-10 text-slate-300 mx-auto stroke-1" />
                  <p className="text-xs font-bold text-slate-600">No addresses unlocked by this user yet</p>
                  <p className="text-[11px] text-slate-400">Unlock transactions will display verified addresses and inspection passes here.</p>
                </div>
              )}
            </div>
          )}

          {/* 3. SITE VISITS TAB */}
          {activeTab === 'visits' && (
            <div>
              {user.visits && user.visits.length > 0 ? (
                <div className="space-y-2.5">
                  {user.visits.map((vis) => (
                    <div key={vis.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-slate-900">
                          Visit for Property {vis.property_id}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Requested Slot: {vis.preferred_date || 'Flexible'} • {vis.preferred_time || 'Anytime'}
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        vis.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : vis.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-amber-100 text-amber-900'
                      }`}>
                        {vis.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 space-y-2">
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto stroke-1" />
                  <p className="text-xs font-bold text-slate-600">No physical visits requested yet</p>
                </div>
              )}
            </div>
          )}

          {/* 4. ENQUIRIES TAB */}
          {activeTab === 'enquiries' && (
            <div>
              {user.enquiries && user.enquiries.length > 0 ? (
                <div className="space-y-3">
                  {user.enquiries.map((enq) => (
                    <div key={enq.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-800">{enq.type} • {enq.source}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          enq.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : enq.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-amber-100 text-amber-900'
                        }`}>
                          {enq.status}
                        </span>
                      </div>
                      <p className="text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100 italic">
                        "{enq.message}"
                      </p>
                      {enq.admin_notes && enq.admin_notes.length > 0 && (
                        <div className="text-[11px] text-blue-950 bg-blue-50/60 p-2 rounded-lg border border-blue-100">
                          <strong>Admin Note:</strong> {enq.admin_notes[0].note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 space-y-2">
                  <MessageSquare className="w-10 h-10 text-slate-300 mx-auto stroke-1" />
                  <p className="text-xs font-bold text-slate-600">No customer enquiries from this member</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Member ID: <code className="bg-slate-200 px-1.5 py-0.5 rounded text-[11px] text-slate-700">{user.id}</code></span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition shadow"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
