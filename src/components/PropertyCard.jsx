// src/components/PropertyCard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bed, 
  Maximize2, 
  MapPin, 
  Phone, 
  Images, 
  CheckCircle, 
  Lock, 
  Heart, 
  Scale, 
  ShieldCheck 
} from 'lucide-react';
import dataStore from '@/services/dataStore';
import { useAuth } from '@/hooks/useAuth';

export default function PropertyCard({ property }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(false);
  const [isCompared, setIsCompared] = useState(false);

  useEffect(() => {
    let mounted = true;
    const syncFav = async () => {
      const fav = await dataStore.isFavorite(user?.id, property.id);
      if (mounted) setIsFav(fav);
    };

    const syncCompare = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('vb_compare_list') || '[]');
        if (mounted) setIsCompared(stored.includes(property.id));
      } catch (_) {}
    };

    syncFav();
    syncCompare();

    const unsub = dataStore.subscribe(() => {
      syncFav();
      syncCompare();
    });

    window.addEventListener('vb_compare_updated', syncCompare);
    window.addEventListener('storage', syncCompare);

    return () => {
      mounted = false;
      unsub();
      window.removeEventListener('vb_compare_updated', syncCompare);
      window.removeEventListener('storage', syncCompare);
    };
  }, [user?.id, property.id]);

  const formatPrice = (val, type) => {
    if (type === 'rent') {
      return `₹${Number(val).toLocaleString('en-IN')}/mo`;
    }
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(2)} Lakhs`;
  };

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    if (!user || !user.id || user.id === 'guest') {
      navigate('/login', {
        state: {
          from: window.location.pathname + window.location.search,
          message: 'Please sign in or create an account to save properties to your favorites.'
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

  const handleCompare = (e) => {
    e.stopPropagation();
    try {
      let stored = JSON.parse(localStorage.getItem('vb_compare_list') || '[]');
      if (stored.includes(property.id)) {
        stored = stored.filter((id) => id !== property.id);
        localStorage.setItem('vb_compare_list', JSON.stringify(stored));
        setIsCompared(false);
      } else {
        if (stored.length >= 3) {
          alert('You can compare a maximum of 3 properties at once.');
          return;
        }
        stored.push(property.id);
        localStorage.setItem('vb_compare_list', JSON.stringify(stored));
        setIsCompared(true);
      }
      window.dispatchEvent(new Event('vb_compare_updated'));
      dataStore.notify();
    } catch (_) {}
  };

  return (
    <div 
      onClick={() => navigate(`/property/${property.id}`)}
      className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer hover:-translate-y-1"
    >
      {/* Media Header */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-100">
        <img
          src={property.main_image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-black tracking-wide uppercase shadow ${
            property.listing_type === 'rent' ? 'bg-blue-900 text-white' : 'bg-amber-500 text-slate-950 font-black'
          }`}>
            {property.listing_type === 'rent' ? 'FOR RENT' : 'FOR SALE'}
          </span>
          {property.is_verified && (
            <span className="bg-emerald-600/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shadow">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified
            </span>
          )}
        </div>

        {/* Action icons (Heart & Compare) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={handleCompare}
            title={isCompared ? 'Selected for compare (Click to remove)' : 'Add to compare'}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow backdrop-blur-sm transition-all hover:scale-110 ${
              isCompared
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 font-bold shadow-md'
                : 'bg-white/90 hover:bg-white text-slate-700'
            }`}
          >
            <Scale className={`w-4 h-4 ${isCompared ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </button>
          <button
            onClick={handleFavoriteToggle}
            title="Save to favorites"
            className={`w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow backdrop-blur-sm transition hover:scale-110 ${
              isFav ? 'text-rose-600 fill-rose-600' : 'text-slate-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Media Indicators & Price */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <div className="text-2xl font-black tracking-tight drop-shadow-md text-amber-300 font-serif">
              {formatPrice(property.price, property.listing_type)}
            </div>
            {property.deposit > 0 && (
              <p className="text-[11px] text-slate-200 font-medium">Dep: ₹{Number(property.deposit).toLocaleString('en-IN')}</p>
            )}
          </div>

          {property.images && property.images.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs bg-slate-900/70 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-white">
              <Images className="w-3.5 h-3.5 text-amber-400" />
              <span>{property.images.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Locality & Area */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">{property.locality}, {property.area}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-base line-clamp-1 mb-3 group-hover:text-blue-900 transition">
            {property.title}
          </h3>

          {/* Key Specs Pills */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-blue-800 shrink-0" />
              <span className="font-medium text-slate-900">{property.bhk}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-blue-800 shrink-0" />
              <span>{property.carpet_area || property.builtup_area} sq ft</span>
            </div>
            <div className="col-span-2 flex items-center justify-between text-[11px] pt-1 border-t border-slate-200">
              <span className="text-slate-500">{property.furnishing}</span>
              <span className="text-slate-700 font-medium">{property.parking}</span>
            </div>
          </div>

          {/* Address Locked Indicator */}
          <div className="mb-4 bg-amber-50 border border-amber-200/80 rounded-xl px-3 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-900 font-medium">
              <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Exact Address Locked</span>
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">₹1,000 Unlock</span>
          </div>
        </div>

        {/* Footer with Broker Contact & Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="text-xs">
            <p className="text-slate-400 text-[10px] uppercase font-bold">{property.broker_name || 'Swapnil Navghare'}</p>
            <p className="font-semibold text-slate-800 flex items-center gap-1">
              <Phone className="w-3 h-3 text-emerald-600" /> {property.broker_phone || '+91 93701 48697'}
            </p>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/property/${property.id}`);
            }}
            className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
