// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAssetUrl } from '@/utils/assets';
import { 
  Building2, 
  Search, 
  Key, 
  ShieldCheck, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle, 
  ChevronDown, 
  MapPin, 
  X, 
  Phone, 
  MessageSquare,
  SlidersHorizontal,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import dataStore from '@/services/dataStore';
import PropertyCard from '@/components/PropertyCard';

// Smooth, Lightweight & GPU-Accelerated Location Ribbon (Zero CPU Jank)
function HeroLocationSlider({ popularAreas, selectedArea, onAreaSelect }) {
  const containerRef = useRef(null);

  const handleSlide = (dir) => {
    const el = containerRef.current;
    if (el) {
      el.scrollBy({ left: 240 * dir, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-xl sm:max-w-2xl mx-auto pt-0.5 relative flex items-center gap-1.5 sm:gap-2">
      {/* Slide Left Option Button */}
      <button
        type="button"
        onClick={() => handleSlide(-1)}
        aria-label="Slide locations left"
        className="shrink-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-950/80 hover:bg-slate-900 active:scale-95 text-slate-200 hover:text-amber-400 border border-white/15 backdrop-blur-md transition shadow-md cursor-pointer z-10"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Smooth, Native Touch-Friendly Scrollable Ribbon */}
      <div
        ref={containerRef}
        className="overflow-x-auto no-scrollbar flex-1 relative py-1 select-none scroll-smooth [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
      >
        <div className="flex items-center gap-2 w-max px-2">
          {popularAreas.map((area) => {
            const isSelected = selectedArea === area;
            return (
              <button
                key={area}
                type="button"
                onClick={() => onAreaSelect(area)}
                className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold backdrop-blur-md transition-all shrink-0 whitespace-nowrap cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 font-black shadow-lg ring-2 ring-amber-300 scale-105'
                    : 'bg-slate-950/65 text-slate-200 hover:bg-white/20 border border-white/15 hover:text-white'
                }`}
              >
                {area === 'All' ? 'All Areas' : area}
              </button>
            );
          })}
        </div>
      </div>

      {/* Slide Right Option Button */}
      <button
        type="button"
        onClick={() => handleSlide(1)}
        aria-label="Slide locations right"
        className="shrink-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-950/80 hover:bg-slate-900 active:scale-95 text-slate-200 hover:text-amber-400 border border-white/15 backdrop-blur-md transition shadow-md cursor-pointer z-10"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  // Frame-1 instant data: load synchronously from local store so content is visible in 0ms
  const [properties, setProperties] = useState(() => dataStore.getPropertiesSync());
  const [areas, setAreas] = useState(() => dataStore.getAreasSync({ includeInactive: false }));
  const [settings, setSettings] = useState(() => dataStore.getSettings());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedBhk, setSelectedBhk] = useState('All');
  const [selectedListingType, setSelectedListingType] = useState('All'); // 'All' | 'rent' | 'buy'
  const [openFaq, setOpenFaq] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  // Smooth scroll to hash anchor if present
  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash;
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 350);
    }
  }, []);

  const loadData = async () => {
    const allProps = await dataStore.getProperties();
    if (allProps) setProperties(allProps);
    const loadedAreas = await dataStore.getAreas({ includeInactive: false });
    if (loadedAreas) setAreas(loadedAreas);
    setSettings(dataStore.getSettings());
  };

  useEffect(() => {
    loadData();
    const unsub = dataStore.subscribe(loadData);
    return () => unsub();
  }, []);

  // Performance Optimization: Never load heavy 5.7MB video on mobile screens or touch devices.
  // On desktop, load only after user has finished initial interaction to avoid network choking.
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || ('ontouchstart' in window && window.innerWidth < 1024));
    if (isMobile) {
      setVideoLoaded(false);
      return;
    }
    const t = setTimeout(() => {
      setVideoLoaded(true);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const targetSection = document.getElementById('properties-section');
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAreaSelect = (areaName) => {
    setSelectedArea(areaName);
    const targetSection = document.getElementById('properties-section');
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedArea('All');
    setSelectedBhk('All');
    setSelectedListingType('All');
  };

  const activeAreasList = areas.length > 0 ? areas : [];
  const popularAreas = [
    'All',
    ...(activeAreasList.length === 0
      ? [
          'Zenda Chowk',
          'Chhatrapati Chowk',
          'Vazirabad',
          'Taroda Naka',
          'Shivaji Nagar',
          'Anand Nagar',
          'Workshop Corner',
          'Nanded Railway Station Area',
          'Cidco Nanded',
          'Bhagya Nagar',
          'Malegaon Road',
          'Ambedkar Chowk'
        ]
      : activeAreasList.map((a) => a.name))
  ];

  // Counts for listings
  const availableProperties = properties.filter((p) => !p.status || p.status.toLowerCase() === 'available');
  const rentCount = availableProperties.filter((p) => p.listing_type === 'rent').length;
  const buyCount = availableProperties.filter((p) => p.listing_type === 'buy').length;

  const filteredProperties = availableProperties.filter((p) => {
    // Type Filter (All, Rent, Buy)
    if (selectedListingType !== 'All' && p.listing_type !== selectedListingType) {
      return false;
    }

    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (p.title && p.title.toLowerCase().includes(query)) ||
      (p.locality && p.locality.toLowerCase().includes(query)) ||
      (p.area && p.area.toLowerCase().includes(query)) ||
      (p.subArea && p.subArea.toLowerCase().includes(query)) ||
      (p.address && p.address.toLowerCase().includes(query)) ||
      (p.city && p.city.toLowerCase().includes(query));

    const pArea = (p.area || '').trim().toLowerCase();
    const pLoc = (p.locality || '').trim().toLowerCase();
    const pSub = (p.subArea || '').trim().toLowerCase();
    const pAddr = (p.address || '').trim().toLowerCase();
    const target = selectedArea.trim().toLowerCase();

    const matchesArea =
      selectedArea === 'All' ||
      pArea === target ||
      pLoc.includes(target) ||
      pArea.includes(target) ||
      pSub.includes(target) ||
      pAddr.includes(target);

    const matchesBhk = selectedBhk === 'All' || p.bhk === selectedBhk;

    return matchesSearch && matchesArea && matchesBhk;
  });

  const faqs = [
    {
      q: "How does Vedika Brokers help me find a home?",
      a: (
        <div className="space-y-2.5">
          <p>
            Explore verified rental and purchase flats across Nanded with genuine high-resolution imagery, floor plans, and verified carpet area. Filter effortlessly by locality (Zenda Chowk, Chhatrapati Chowk, Vazirabad, Taroda Naka), BHK size, and budget tier.
          </p>
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <Link to="/rent" className="text-xs font-bold text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-lg transition inline-flex items-center gap-1">
              Browse Rent Catalog <ChevronRight className="w-3 h-3" />
            </Link>
            <Link to="/buy" className="text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1 rounded-lg transition inline-flex items-center gap-1">
              Browse Buy Catalog <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )
    },
    {
      q: "Can I inspect the property in person?",
      a: (
        <div className="space-y-2.5">
          <p>
            Yes! Every property listing offers an option to schedule an accompanied physical inspection with our local broker desk. We coordinate convenient visit timings with property owners and societies so you never waste time waiting.
          </p>
          <div className="pt-1">
            <Link to="/contact" className="text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-lg transition inline-flex items-center gap-1">
              Schedule Accompanied Visit <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )
    },
    {
      q: "How does the ₹1,000 Address Unlock and ₹500 Refund work?",
      a: (
        <div className="space-y-2.5">
          <p>
            To protect society resident privacy and prevent overcrowding, exact building addresses and Google Maps directions require a ₹1,000 unlock fee. After your scheduled visit, if you decide not to proceed with the property, ₹500 is credited directly back to your UPI account within 24 hours.
          </p>
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <Link to="/how-it-works" className="text-xs font-bold text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-lg transition inline-flex items-center gap-1">
              Read How It Works <ChevronRight className="w-3 h-3" />
            </Link>
            <Link to="/refund-policy" className="text-xs font-bold text-slate-800 bg-slate-200 hover:bg-slate-300 px-3 py-1 rounded-lg transition inline-flex items-center gap-1">
              ₹500 Refund Policy <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )
    },
    {
      q: "Can I contact the broker directly before making a decision?",
      a: (
        <div className="space-y-2.5">
          <p>
            Absolutely. Every property listing provides direct telephone and WhatsApp contact to Swapnil Navghare (+91 93701 48697) for instant assistance, neighborhood insights, and society rules—with zero upfront charges or obligations.
          </p>
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <a href="tel:+919370148697" className="text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 px-3 py-1 rounded-lg transition inline-flex items-center gap-1">
              Call +91 93701 48697
            </a>
            <a href="https://wa.me/919370148697?text=Hello%20Swapnil%20Navghare,%20I%20have%20questions%20about%20a%20property%20listing." target="_blank" rel="noreferrer" className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded-lg transition inline-flex items-center gap-1">
              WhatsApp Broker
            </a>
          </div>
        </div>
      )
    },
    {
      q: "Can I compare multiple properties side-by-side?",
      a: (
        <div className="space-y-2.5">
          <p>
            Yes. Use our built-in Compare tool to view up to 3 properties side-by-side—comparing monthly rent or purchase price, security deposit, carpet area, furnishing, and society amenities on a single unified screen.
          </p>
          <div className="pt-1">
            <Link to="/compare" className="text-xs font-bold text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-lg transition inline-flex items-center gap-1">
              Open Compare Tool <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )
    }
  ];

  const hasActiveFilters = searchTerm || selectedArea !== 'All' || selectedBhk !== 'All' || selectedListingType !== 'All';

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. CINEMATIC PROPERTY VIDEO / IMAGE HERO */}
      <section id="hero-section" className="relative min-h-[62vh] sm:min-h-[75vh] lg:min-h-[82vh] flex items-center justify-center text-white overflow-hidden pt-16 sm:pt-20 pb-12 sm:pb-14 bg-slate-950">
        {/* Background Visual Backdrop: Fast Instant Poster for Zero Mobile Lag */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center filter brightness-110 contrast-105 saturate-110"
            style={{ 
              backgroundImage: `url(${getAssetUrl('/tour/1.jpg')})`,
              opacity: 0.95
            }}
          />
          {videoLoaded && (
            <video
              ref={videoRef}
              src={getAssetUrl('/tour/full-tour-merged.mp4')}
              poster={getAssetUrl('/tour/1.jpg')}
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              className="w-full h-full object-cover object-center pointer-events-none transform-gpu animate-in fade-in duration-500 filter brightness-[1.14] contrast-[1.04] saturate-[1.12]"
            />
          )}
          {/* Subtle light vignette scrim so the visual stays bright & vivid while text remains sharp */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-black/10 to-slate-950/20" />
        </div>

        {/* Minimal Hero UI Layered Directly on Top */}
        <div className="max-w-4xl mx-auto text-center relative z-10 px-4 sm:px-6 lg:px-8 space-y-3.5 sm:space-y-5 w-full pt-2 sm:pt-4">
          {/* Minimal Typography with high-contrast drop shadows */}
          <div className="space-y-1 sm:space-y-1.5">
            <h1 className="text-2xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white font-serif drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] leading-tight">
              VEDIKA BROKERS
            </h1>
            <p className="text-xs sm:text-base lg:text-xl text-slate-100 font-medium tracking-wide max-w-md mx-auto drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
              Find a place that feels like home.
            </p>
          </div>

          {/* Action Buttons: BUY & RENT (Clean, Static, Instant - Zero Right-to-Left or Sliding Animation) */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 pt-0.5 max-w-[290px] sm:max-w-md mx-auto w-full">
            <Link
              to="/buy"
              className="flex-1 py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 font-black text-xs sm:text-base text-slate-950 shadow-md flex items-center justify-center gap-2 border border-amber-300 cursor-pointer"
            >
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 shrink-0" />
              <span className="tracking-wider">BUY</span>
            </Link>

            <Link
              to="/rent"
              className="flex-1 py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 font-black text-xs sm:text-base text-slate-950 shadow-md flex items-center justify-center gap-2 border border-white cursor-pointer"
            >
              <Key className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 shrink-0" />
              <span className="tracking-wider">RENT</span>
            </Link>
          </div>

          {/* Integrated Search Box - Compact Single-Row Design */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-slate-950/80 hover:bg-slate-950/90 backdrop-blur-2xl p-1 sm:p-1.5 rounded-full shadow-2xl border border-white/20 focus-within:border-amber-400 focus-within:bg-slate-950/95 flex items-center gap-1 sm:gap-2 max-w-md sm:max-w-xl mx-auto text-white transition-all duration-300 w-full"
          >
            <div className="flex items-center gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 flex-1 min-w-0">
              <Search className="w-4 h-4 text-amber-400 shrink-0" />
              <input
                type="text"
                placeholder="Search location, area or property..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent w-full focus:outline-none text-xs sm:text-sm font-medium text-white placeholder:text-slate-300 truncate"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="text-slate-300 hover:text-white p-1 transition shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>Search</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Locality Ribbon */}
          <HeroLocationSlider 
            popularAreas={popularAreas} 
            selectedArea={selectedArea} 
            onAreaSelect={handleAreaSelect} 
          />

          {/* Direct Instant Scroll Jump to Listings */}
          <div className="pt-0.5">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('properties-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 hover:text-white bg-slate-950/60 hover:bg-slate-900/80 px-3 py-1 rounded-full border border-white/15 backdrop-blur-md transition shadow cursor-pointer"
            >
              <span>Browse Properties Below</span>
              <ChevronDown className="w-3 h-3 text-amber-400 animate-bounce" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION & TRUST ASSURANCE STRIP (Directly Below Hero) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl p-4 sm:p-5 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 divide-y sm:divide-y-0 lg:divide-x divide-slate-100">
          <div className="flex items-center gap-3.5 p-1.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">100% Verified</h4>
              <p className="text-[11px] text-slate-500">Physical inspection in Nanded</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-1.5 pt-3 sm:pt-1.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-900 shrink-0 shadow-xs">
              <MapPin className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">Prime Localities</h4>
              <p className="text-[11px] text-slate-500">Zenda Chowk, Vazirabad & Cidco</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-1.5 pt-3 sm:pt-1.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
              <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">₹500 Visit Refund</h4>
              <p className="text-[11px] text-slate-500">Guaranteed UPI refund in 24h</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-1.5 pt-3 sm:pt-1.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-purple-50 border border-purple-200/80 flex items-center justify-center text-purple-700 shrink-0 shadow-xs">
              <Phone className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">Direct Broker Desk</h4>
              <p className="text-[11px] text-slate-500">Swapnil Navghare (+91 93701 48697)</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES EXPLORER & SMART FILTER TOOLBAR */}
      <section id="properties-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-20">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-slate-200/90">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Verified Properties in Nanded</span>
              <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full text-[11px] font-black">
                {filteredProperties.length} Available
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
              Featured Properties
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Authentic photos, verified carpet area, transparent pricing, and zero fake listings.
            </p>
          </div>

          {/* Quick Segmented Listing Type Tabs: All | For Rent | For Sale */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 self-stretch sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setSelectedListingType('All')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedListingType === 'All'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({availableProperties.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedListingType('rent')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedListingType === 'rent'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rent ({rentCount})
            </button>
            <button
              type="button"
              onClick={() => setSelectedListingType('buy')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedListingType === 'buy'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Buy ({buyCount})
            </button>
          </div>
        </div>

        {/* Clean Filter Chips Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          {/* BHK Filter Chips */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> BHK:
            </span>
            {['All', '1 BHK', '2 BHK', '3 BHK', '4 BHK+'].map((bhk) => (
              <button
                key={bhk}
                type="button"
                onClick={() => setSelectedBhk(bhk)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedBhk === bhk
                    ? 'bg-blue-950 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {bhk}
              </button>
            ))}
          </div>

          {/* Active Filter Tags & Reset */}
          <div className="flex items-center gap-2 flex-wrap">
            {selectedArea !== 'All' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                <MapPin className="w-3 h-3 text-amber-700" />
                <span>{selectedArea}</span>
                <button
                  type="button"
                  onClick={() => setSelectedArea('All')}
                  className="hover:text-amber-950 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
                <span>"{searchTerm}"</span>
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="hover:text-blue-950 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline px-2 py-1 cursor-pointer"
              >
                Reset All Filters
              </button>
            )}

            <div className="hidden sm:flex items-center gap-2 ml-auto">
              <Link
                to="/rent"
                className="text-xs font-bold text-blue-900 hover:text-blue-800 transition flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200"
              >
                <span>Full Rent Catalog</span> <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/buy"
                className="text-xs font-bold text-emerald-800 hover:text-emerald-900 transition flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"
              >
                <span>Full Buy Catalog</span> <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-slate-200 space-y-3 shadow-xs">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">
              No properties found matching your criteria
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We frequently onboard verified properties across Nanded. Try adjusting your filters or reach out to our broker desk directly.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="bg-blue-950 hover:bg-blue-900 text-amber-400 text-xs font-bold px-5 py-2.5 rounded-xl shadow transition cursor-pointer"
              >
                Reset All Filters
              </button>
              <Link
                to="/contact"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition"
              >
                Contact Broker
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.slice(0, 9).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* 4. HOW VEDIKA BROKERS WORKS (Luxury Feature Section with High-Resolution Architecture Backgrounds) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border border-slate-300/80 space-y-8">
          {/* Outside Container Background Image - Modern Glass Villa Architectural Design */}
          <img
            src="/modern_glass_villa.jpg"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1920&q=85";
            }}
            alt="Vedika Brokers Modern Architecture"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
            loading="lazy"
          />

          {/* Section Header */}
          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-950/85 border border-amber-400 text-amber-300 text-[11px] font-bold uppercase tracking-wider shadow-lg">
              <span>Simple, Transparent & Reliable</span>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif text-white drop-shadow-[0_2px_6px_rgba(0,0,0,1)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
              How Vedika Brokers Works
            </h3>
            <p className="text-xs sm:text-sm text-white font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
              We eliminated the stress of broker calls and fake listings with a crystal-clear, verified process.
            </p>
          </div>

          {/* 3 Steps - Ultra-Transparent Frosted Blue Glass Containers with White Text */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 max-w-6xl mx-auto pt-2 sm:pt-4">
            
            {/* Step 01 */}
            <div className="space-y-3 p-5 sm:p-6 rounded-2xl bg-blue-950/20 backdrop-blur-sm border border-white/25 shadow-xl hover:border-amber-400/80 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-slate-900/80 text-amber-300 border border-amber-400/60 font-black text-xs tracking-wider shadow-sm">
                  Step 01
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-900/80 text-amber-400 flex items-center justify-center shadow-sm border border-white/20">
                  <Search className="w-4 h-4" />
                </div>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                Explore Verified Flats
              </h4>
              <p className="text-xs sm:text-sm text-white font-medium leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,1)]">
                Browse hand-verified homes across Nanded with genuine photographs, exact carpet area, and transparent pricing.
              </p>
            </div>

            {/* Step 02 */}
            <div className="space-y-3 p-5 sm:p-6 rounded-2xl bg-blue-950/20 backdrop-blur-sm border border-white/25 shadow-xl hover:border-amber-400/80 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-slate-900/80 text-amber-300 border border-amber-400/60 font-black text-xs tracking-wider shadow-sm">
                  Step 02
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-900/80 text-amber-400 flex items-center justify-center shadow-sm border border-white/20">
                  <Key className="w-4 h-4" />
                </div>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                Unlock & Visit Society
              </h4>
              <p className="text-xs sm:text-sm text-white font-medium leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,1)]">
                Pay ₹1,000 to unlock the exact building address and schedule an accompanied in-person walkthrough at your convenience.
              </p>
            </div>

            {/* Step 03 */}
            <div className="space-y-3 p-5 sm:p-6 rounded-2xl bg-blue-950/20 backdrop-blur-sm border border-white/25 shadow-xl hover:border-amber-400/80 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-slate-900/80 text-amber-300 border border-amber-400/60 font-black text-xs tracking-wider shadow-sm">
                  Step 03
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-900/80 text-amber-400 flex items-center justify-center shadow-sm border border-white/20">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                Move In or Get ₹500 Refund
              </h4>
              <p className="text-xs sm:text-sm text-white font-medium leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,1)]">
                Finalized the deal? Move in hassle-free. Decided not to proceed? ₹500 is credited straight back to your UPI within 24 hours.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. DIRECT BROKER DESK (Swapnil Navghare Spotlight) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white text-slate-900 p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* Left Column: Heading, description & credibility badges */}
            <div className="lg:col-span-7 space-y-3.5 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-950 text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-900" />
                <span>Direct Broker Desk</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight text-slate-900 leading-tight">
                Have questions or looking to list your property?
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                Connect directly with <strong className="text-slate-900 font-bold">Swapnil Navghare</strong> for fast, transparent, and personalized property guidance across Nanded's prime residential hubs.
              </p>

              {/* Verified Trust Badges */}
              <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-[11px] font-semibold text-slate-600">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>RERA Verified Broker Partner</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Fast Response (&lt; 15 mins)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Local Nanded Expert</span>
                </div>
              </div>
            </div>

            {/* Right Column: Broker Card with Action Buttons */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200/90 p-5 sm:p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-lg flex items-center justify-center shadow-md">
                    SN
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" title="Online for inquiries" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">Swapnil Navghare</h4>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Principal Broker & Consultant</p>
                  <p className="text-[10px] text-amber-600 font-mono font-bold">Vedika Brokers • Nanded Desk</p>
                </div>
              </div>

              {/* Primary Call & WhatsApp Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <a
                  href="tel:+919370148697"
                  className="py-2.5 px-3 rounded-xl bg-blue-950 hover:bg-blue-900 text-amber-400 font-black text-xs shadow-md hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Call Broker</span>
                </a>

                <a
                  href="https://wa.me/919370148697?text=Hello%20Swapnil%20Navghare,%20I%20am%20looking%20for%20property%20assistance%20in%20Nanded."
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Consultation availability note */}
              <div className="pt-2 border-t border-slate-200 text-center">
                <p className="text-[10px] text-slate-500">
                  Open Mon - Sun: 9:00 AM – 8:30 PM • 100% Free Consultation
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. STREAMLINED SPACE-EFFICIENT FAQS */}
      <section id="faqs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            {/* Left Column: Compact Header & Direct Contact */}
            <div className="lg:col-span-5 space-y-3 lg:sticky lg:top-24">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-950 text-[11px] font-bold uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5 text-blue-900" />
                <span>Quick Answers</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif leading-tight">
                Frequently Asked Questions
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Everything you need to know about verified listings, accompanied visits, and our ₹500 refund guarantee.
              </p>

              {/* Direct Compact Help Box */}
              <div className="pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Have more questions? Ask our broker desk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="tel:+919370148697"
                      className="flex-1 py-2 px-3 rounded-xl bg-blue-950 hover:bg-blue-900 text-amber-400 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Broker</span>
                    </a>
                    <a
                      href="https://wa.me/919370148697?text=Hello%20Swapnil%20Navghare,%20I%20have%20questions%20regarding%20properties%20in%20Nanded."
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sleek Space-Saving Accordion */}
            <div className="lg:col-span-7">
              <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200/90 overflow-hidden bg-slate-50/50">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div
                      key={index}
                      className={`transition-colors duration-200 ${isOpen ? 'bg-white' : 'hover:bg-white/80'}`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full py-3.5 px-4 sm:px-5 text-left font-bold text-xs sm:text-sm text-slate-900 flex justify-between items-center gap-3 transition cursor-pointer"
                      >
                        <span className="flex items-center gap-2.5">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-colors ${
                            isOpen ? 'bg-blue-950 text-amber-400' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="font-semibold">{faq.q}</span>
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-950' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="px-4 sm:px-5 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100/80 pl-11 sm:pl-12 animate-in fade-in duration-200">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
