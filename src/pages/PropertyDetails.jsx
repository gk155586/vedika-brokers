// src/pages/PropertyDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Bed, 
  Maximize2, 
  Phone, 
  MessageSquare, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Calendar, 
  RefreshCw, 
  Share2, 
  Heart, 
  Compass, 
  Check, 
  AlertCircle,
  Images,
  ArrowLeft,
  Navigation,
  ChevronLeft,
  ChevronRight,
  X,
  Film,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import dataStore from '@/services/dataStore';
import { useAuth } from '@/hooks/useAuth';
import UnlockModal from '@/components/UnlockModal';
import ScheduleVisitModal from '@/components/ScheduleVisitModal';
import RefundRequestModal from '@/components/RefundRequestModal';
import PropertyCard from '@/components/PropertyCard';
import PropertyEnquiryModal from '@/components/PropertyEnquiryModal';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Modals
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [propertyRefund, setPropertyRefund] = useState(null);

  const loadData = async () => {
    try {
      const prop = await dataStore.getPropertyById(id);
      if (prop) {
        setProperty(prop);
        const unlocked = await dataStore.isPropertyUnlocked(user?.id || 'guest', prop.id);
        setIsUnlocked(unlocked);

        if (user && user.id && user.id !== 'guest') {
          const fav = await dataStore.isFavorite(user.id, prop.id);
          setIsFav(fav);
          const ref = await dataStore.getRefundForProperty(user.id, prop.id);
          setPropertyRefund(ref || null);
        } else {
          setIsFav(false);
          setPropertyRefund(null);
        }

        const all = await dataStore.getProperties();
        const similar = (all || [])
          .filter((p) => p.id !== prop.id && (p.area === prop.area || p.bhk === prop.bhk))
          .slice(0, 4);
        setSimilarProperties(similar);
      } else {
        setProperty(null);
        setPropertyRefund(null);
      }
    } catch (err) {
      console.error('Error loading property:', err);
      setProperty(null);
      setPropertyRefund(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user || !user.id || user.id === 'guest') {
      navigate('/login', {
        state: {
          from: window.location.pathname,
          message: 'Please sign in or create an account to save this property to your favorites.'
        }
      });
      return;
    }
    try {
      const updated = await dataStore.toggleFavorite(user.id, property.id);
      setIsFav(updated);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
    const unsub = dataStore.subscribe(loadData);
    return unsub;
  }, [id, user]);

  const galleryImages = Array.isArray(property?.images) && property.images.length > 0
    ? property.images
    : [property?.main_image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'];

  const amenitiesList = Array.isArray(property?.amenities)
    ? property.amenities
    : typeof property?.amenities === 'string'
      ? property.amenities.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

  const handlePrevImage = (e) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
  };

  const handleNextImage = (e) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation for Lightbox (always called unconditionally at top level)
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
      }
      if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, galleryImages.length]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: `Check out this verified property in ${property?.locality || property?.area}, ${property?.city || 'Nanded'} on Vedika Brokers`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Property link copied to clipboard!');
    }
  };

  const formatPrice = (val, type) => {
    const num = Number(val) || 0;
    if (type === 'rent') return `₹${num.toLocaleString('en-IN')}/month`;
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Crore`;
    return `₹${(num / 100000).toFixed(2)} Lakhs`;
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-amber-400 rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-700">Loading verified property details...</p>
      </div>
    );
  }

  // 2. Not Found State
  if (!property) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center space-y-4">
        <Building2 className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Property Not Found</h2>
        <p className="text-xs text-slate-500">The listing may have been rented, sold, or moved.</p>
        <Link to="/rent" className="inline-block bg-blue-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow">
          Return to Browse
        </Link>
      </div>
    );
  }

  const cleanBrokerPhone = String(property.broker_phone || '+919370148697').replace(/\s+/g, '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Back button & Breadcrumbs */}
      <div className="flex justify-between items-center text-xs text-slate-500">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 font-semibold text-slate-700 hover:text-blue-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Listings
        </button>

        <div className="flex items-center gap-2">
          <span className="bg-slate-100 px-2.5 py-1 rounded font-mono font-bold text-slate-700">
            ID: {property.property_code}
          </span>
          <button
            onClick={handleFavoriteToggle}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition font-semibold text-xs border ${
              isFav
                ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-transparent'
            }`}
            title={isFav ? 'Saved in your favorites' : 'Save to favorites'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-600 text-rose-600' : 'text-slate-600'}`} />
            <span>{isFav ? 'Saved' : 'Save'}</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition font-semibold"
          >
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery & Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Media & Detailed Specs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Media Showcase */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="relative h-80 sm:h-[460px] lg:h-[500px] bg-slate-950 flex items-center justify-center group overflow-hidden select-none">
              <div 
                className="w-full h-full cursor-pointer relative flex items-center justify-center bg-slate-950"
                onClick={() => setLightboxOpen(true)}
                title="Click to view full screen photos"
              >
                <img
                  src={galleryImages[activeImageIndex] || galleryImages[0]}
                  alt={property.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-black/20 pointer-events-none" />
              </div>

              {/* Navigation Arrows on Big Image */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    title="Previous photo"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition hover:scale-110 shadow-lg border border-white/20 z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    title="Next photo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition hover:scale-110 shadow-lg border border-white/20 z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Badges on main image */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10 pointer-events-none">
                <span className="bg-blue-900 text-white font-black text-xs px-3 py-1 rounded-lg uppercase shadow">
                  {property.listing_type === 'rent' ? 'FOR RENT' : 'FOR SALE'}
                </span>
                {property.is_verified && (
                  <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1 shadow">
                    <ShieldCheck className="w-4 h-4" /> Verified
                  </span>
                )}
              </div>

              {/* Top Right Controls (Favorites & Fullscreen) */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <button
                  type="button"
                  onClick={handleFavoriteToggle}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center backdrop-blur-md transition shadow hover:scale-105 border ${
                    isFav
                      ? 'bg-rose-600 text-white border-rose-500 shadow-rose-600/30'
                      : 'bg-black/60 hover:bg-black/90 text-white border-white/20'
                  }`}
                  title={isFav ? 'Saved in your favorites' : 'Save to favorites'}
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="bg-black/60 hover:bg-black/90 text-white px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md flex items-center gap-1.5 transition shadow border border-white/20"
                  title="View Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full View ({activeImageIndex + 1}/{galleryImages.length})</span>
                </button>
              </div>

              {/* Bottom Bar on main image */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                <div className="bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-lg border border-white/10 flex items-center gap-1.5">
                  <Images className="w-3.5 h-3.5 text-amber-400" />
                  <span>Photo {activeImageIndex + 1} of {galleryImages.length}</span>
                </div>
              </div>
            </div>

            {/* Photo Gallery Strip: ONLY displayed when property has more than 1 photo */}
            {galleryImages.length > 1 && (
              <div className="p-3.5 bg-slate-50 border-t border-slate-100">
                <div className="flex items-center justify-between pb-2 text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Images className="w-3.5 h-3.5 text-blue-900" />
                    Property Photos ({galleryImages.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="text-blue-900 hover:text-blue-950 font-bold flex items-center gap-1 transition text-[11px] bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg"
                  >
                    <Maximize2 className="w-3 h-3" /> Full View All ({galleryImages.length})
                  </button>
                </div>
                <div className="flex gap-2.5 overflow-x-auto scrollbar-thin pb-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-24 h-16 sm:w-28 sm:h-18 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        activeImageIndex === idx
                          ? 'border-blue-900 ring-2 ring-blue-900/30 scale-105 shadow-md'
                          : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Photo ${idx + 1}`}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80';
                        }}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[9px] px-1 py-0.5 rounded font-mono font-bold">
                        {idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Title, Locality, and Specs */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 mb-1">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{property.locality || property.area}, {property.area}, {property.city || 'Nanded'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                {property.title}
              </h1>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Configuration</p>
                <p className="text-sm font-black text-slate-900 mt-0.5">{property.bhk}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Carpet Area</p>
                <p className="text-sm font-black text-slate-900 mt-0.5">{property.carpet_area || property.builtup_area || 'N/A'} sq ft</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Floor</p>
                <p className="text-sm font-black text-slate-900 mt-0.5">{property.floor || 1} of {property.total_floors || 4}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Furnishing</p>
                <p className="text-sm font-black text-slate-900 mt-0.5">{property.furnishing || 'Semi-Furnished'}</p>
              </div>
            </div>

            {/* Overview / Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Property Overview</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {property.description || 'Verified property listed on Vedika Brokers.'}
              </p>
            </div>

            {/* Amenities */}
            {amenitiesList.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Society & Flat Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {amenitiesList.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-900 text-xs font-semibold border border-blue-100"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Video Walkthrough Tour (if property has video_url) */}
            {property.video_url && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Film className="w-4 h-4 text-amber-600" /> Property Walkthrough Video Tour
                </h3>
                <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md">
                  <video
                    src={property.video_url}
                    controls
                    playsInline
                    className="w-full max-h-[420px] object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Price, Address Lock Box, and Broker Card */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Expected Amount</p>
              <div className="text-3xl font-black text-blue-950 font-serif mt-1">
                {formatPrice(property.price, property.listing_type)}
              </div>
              {property.deposit > 0 && (
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  Security Deposit: ₹{Number(property.deposit).toLocaleString('en-IN')}
                </p>
              )}
            </div>

            {/* THE CRITICAL ADDRESS UNLOCK / REVEAL BOX */}
            <div className="pt-4 border-t border-slate-100">
              {isUnlocked ? (
                /* UNLOCKED STATE */
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 space-y-4 animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm uppercase tracking-wide">
                    <Unlock className="w-4 h-4 text-emerald-600" /> Exact Address Unlocked
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs text-slate-800 space-y-1">
                    <p className="font-bold text-slate-900">Verified Address:</p>
                    <p className="leading-relaxed font-medium">{property.address || `${property.locality || property.area}, Nanded - 431601`}</p>
                  </div>

                  {/* Direction button */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address || property.locality || 'Nanded')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
                  >
                    <Navigation className="w-4 h-4" /> Open in Google Maps (Directions)
                  </a>

                  {/* Schedule Visit Trigger */}
                  <button
                    onClick={() => setVisitModalOpen(true)}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
                  >
                    <Calendar className="w-4 h-4" /> Schedule Physical Visit
                  </button>

                  {/* ₹500 REFUND BUTTON OR STATUS BADGE */}
                  <div className="pt-2 border-t border-emerald-200">
                    {!propertyRefund ? (
                      <>
                        <p className="text-[11px] text-slate-500 mb-1.5">Did you visit this property?</p>
                        <button
                          onClick={() => setRefundModalOpen(true)}
                          className="w-full bg-white hover:bg-red-50 text-red-600 border border-red-300 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> No — Request ₹500 Refund
                        </button>
                      </>
                    ) : propertyRefund.status === 'pending' ? (
                      <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-900 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" /> ₹500 Refund Under Review
                          </span>
                          <span className="text-[10px] font-mono font-bold bg-amber-200/80 px-2 py-0.5 rounded">
                            #{propertyRefund.id?.slice(-6) || 'ACTIVE'}
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-800 leading-tight">
                          Receiving UPI: <strong className="font-mono">{propertyRefund.user_upi_id}</strong> (Verification within 24h)
                        </p>
                      </div>
                    ) : ['processed', 'paid', 'approved', 'refunded'].includes(propertyRefund.status) ? (
                      <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-xs text-emerald-900 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ₹500 Refund Paid
                          </span>
                          <span className="text-[10px] font-mono font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded uppercase">
                            Settled
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-800 leading-tight font-mono">
                          Transferred to: {propertyRefund.user_upi_id}
                        </p>
                      </div>
                    ) : (
                      /* Rejected */
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-900 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold flex items-center gap-1.5">
                            <XCircle className="w-3.5 h-3.5 text-red-600" /> Refund Request Closed
                          </span>
                          <span className="text-[10px] font-mono font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded uppercase">
                            Rejected
                          </span>
                        </div>
                        <p className="text-[11px] text-red-700 leading-tight">
                          {propertyRefund.admin_notes || 'Eligibility criteria not met. Further refund requests are closed.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* LOCKED STATE */
                <div className="bg-amber-50/70 border-2 border-amber-300/80 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm uppercase tracking-wide">
                    <Lock className="w-4 h-4 text-amber-600" /> Exact Address Locked
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    To maintain society privacy and prevent unverified crowding, exact flat numbers and society gates are released upon access confirmation.
                  </p>

                  <div className="p-3 bg-amber-100/60 rounded-xl text-xs text-amber-900 space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>Address Unlock Fee:</span>
                      <span>₹1,000</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-tight">
                      *₹500 refundable if you decide not to proceed after viewing the property.
                    </p>
                  </div>

                  <button
                    onClick={() => setUnlockModalOpen(true)}
                    className="w-full bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-black py-3.5 px-4 rounded-2xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 text-sm"
                  >
                    <Unlock className="w-4 h-4 text-amber-400" />
                    <span>UNLOCK ADDRESS — ₹1,000</span>
                  </button>

                  <p className="text-[10px] text-center text-slate-500">
                    Dual options: Razorpay / Online UPI (active) • Direct Bank UPI (coming soon)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Broker Contact Desk */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 font-black flex items-center justify-center text-base">
                VB
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Area Property Desk</p>
                <h4 className="text-sm font-bold text-slate-900">{property.broker_name || 'Swapnil Navghare (Vedika Brokers)'}</h4>
                <p className="text-xs text-slate-500">{property.area} Locality Desk</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href={`tel:${cleanBrokerPhone}`}
                className="bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Phone className="w-3.5 h-3.5" /> Call Broker
              </a>

              <a
                href={`https://wa.me/${property.whatsapp || '919370148697'}?text=Hello%20Swapnil%20Navghare,%20I%20am%20interested%20in%20property%20${property.property_code}%20(${encodeURIComponent(property.title || 'Property')})`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp
              </a>
            </div>

            <button
              type="button"
              onClick={() => setEnquiryModalOpen(true)}
              className="w-full mt-2 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 hover:from-blue-900 hover:to-slate-800 text-amber-400 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer border border-amber-400/30"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Send Online Enquiry (Get Call Back)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Similar Properties Section */}
      {similarProperties.length > 0 && (
        <div className="pt-12 border-t border-slate-200 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Recommendations</span>
              <h2 className="text-2xl font-black text-slate-900 font-serif">Similar Properties Nearby</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {similarProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <UnlockModal
        property={property}
        isOpen={unlockModalOpen}
        onClose={() => setUnlockModalOpen(false)}
        onUnlocked={() => {
          setIsUnlocked(true);
          loadData();
        }}
      />

      <ScheduleVisitModal
        property={property}
        isOpen={visitModalOpen}
        onClose={() => setVisitModalOpen(false)}
        onScheduled={loadData}
      />

      <RefundRequestModal
        property={property}
        isOpen={refundModalOpen}
        onClose={() => setRefundModalOpen(false)}
        onRequested={loadData}
      />

      <PropertyEnquiryModal
        property={property}
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        onEnquirySent={loadData}
      />

      {/* Fullscreen Lightbox Image Gallery Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Top Bar */}
          <div 
            className="flex items-center justify-between text-white z-10 max-w-7xl mx-auto w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="font-bold text-sm sm:text-base line-clamp-1">{property.title}</h3>
              <p className="text-xs text-slate-400">
                Photo {activeImageIndex + 1} of {galleryImages.length} &bull; {property.bhk} in {property.locality || property.area}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition hover:scale-105"
              title="Close (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Full-Size Image Container */}
          <div 
            className="relative flex-1 flex items-center justify-center my-3 max-h-[78vh] w-full max-w-6xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryImages[activeImageIndex] || galleryImages[0]}
              alt={`Full view photo ${activeImageIndex + 1}`}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80';
              }}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl select-none"
            />

            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 shadow-2xl transition hover:scale-110 z-10"
                  title="Previous photo (Left Arrow)"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 shadow-2xl transition hover:scale-110 z-10"
                  title="Next photo (Right Arrow)"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Strip in Lightbox */}
          {galleryImages.length > 1 && (
            <div 
              className="flex items-center justify-center gap-2 overflow-x-auto py-2 scrollbar-thin max-w-3xl mx-auto w-full z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-amber-400 scale-105 shadow-lg ring-2 ring-amber-400/50'
                      : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
