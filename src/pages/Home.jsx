// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Key, 
  ShoppingBag, 
  ShieldCheck, 
  Clock, 
  Compass, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle, 
  ChevronDown, 
  Star, 
  Users,
  MapPin,
  X,
  Phone,
  Play,
  Pause,
  SlidersHorizontal,
  MessageSquare
} from 'lucide-react';
import dataStore from '@/services/dataStore';
import PropertyCard from '@/components/PropertyCard';

export default function Home() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [areas, setAreas] = useState([]);
  const [settings, setSettings] = useState(() => dataStore.getSettings());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedBhk, setSelectedBhk] = useState('All');
  const [openFaq, setOpenFaq] = useState(null);
  const [animatingBtn, setAnimatingBtn] = useState(null); // 'buy' | 'rent' | null

  const handleHeroNavClick = (e, path, type) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || (e.button && e.button !== 0)) {
      return;
    }
    e.preventDefault();
    setAnimatingBtn(type);
    setTimeout(() => {
      navigate(path);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      setAnimatingBtn(null);
    }, 280);
  };

  // Smooth scroll to hash anchor if present (e.g. #tour-showcase)
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

  // Background video playback state
  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const scrollTimeoutRef = useRef(null);

  const loadData = async () => {
    const allProps = await dataStore.getProperties();
    setProperties(allProps || []);
    const loadedAreas = await dataStore.getAreas({ includeInactive: false });
    setAreas(loadedAreas || []);
    setSettings(dataStore.getSettings());
  };

  useEffect(() => {
    loadData();
    const unsub = dataStore.subscribe(loadData);
    return () => unsub();
  }, []);

  // Play video while scrolling effect
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start with video playing
    video.play().catch(() => {});

    const handleScroll = () => {
      if (video.paused) {
        video.play().catch(() => {});
        setIsVideoPlaying(true);
      }
      // After scroll stops, keep playing or pause after idle
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        // Keeps subtle ambient motion alive smoothly
      }, 2500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeoutRef.current);
    };
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
  };

  const activeAreasList = areas.length > 0 ? areas : [];
  const popularAreas = [
    'All',
    ...(activeAreasList.length === 0
      ? ['Zenda Chowk', 'Chhatrapati Chowk', 'Vazirabad', 'Taroda Naka', 'Shivaji Nagar', 'Anand Nagar']
      : activeAreasList.slice(0, 6).map((a) => a.name))
  ];

  const filteredProperties = properties.filter((p) => {
    const isAvail = !p.status || p.status.toLowerCase() === 'available';
    if (!isAvail) return false;

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
            Explore premium rental and purchase flats across Nanded with verified high-resolution imagery, floor plans, and verified carpet area. Filter effortlessly by locality (Zenda Chowk, Chhatrapati Chowk, Vazirabad, Taroda Naka), BHK size, and budget tier.
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

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. CINEMATIC FULL-SCREEN PROPERTY VIDEO / IMAGE HERO */}
      <section id="hero-section" className="relative min-h-screen flex items-center justify-center text-white overflow-hidden pt-20 sm:pt-24 pb-12">
        {/* Full-screen Background Video & Fallback Image */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <video
            ref={videoRef}
            src="/tour/full-tour-merged.mp4"
            poster="/tour/1.jpg"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 brightness-110 contrast-[1.02]"
          />
          {/* Light cinematic overlay so the video stays bright, luminous, and clear */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-black/20 to-slate-950/30" />
        </div>

        {/* Minimal Hero UI Layered Directly on Top */}
        <div className="max-w-4xl mx-auto text-center relative z-10 px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6 w-full pt-4 sm:pt-6">
          {/* Minimal Typography with high-contrast drop shadows */}
          <div className="space-y-2.5 sm:space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-serif drop-shadow-[0_4px_18px_rgba(0,0,0,0.9)]">
              VEDIKA BROKERS
            </h1>
            <p className="text-base sm:text-xl lg:text-2xl text-slate-100 font-medium tracking-wide max-w-xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
              Find a place that feels like home.
            </p>
          </div>

          {/* Prominent High-Clarity Action Buttons: BUY & RENT with Left-to-Right Parda Animation */}
          <div className="flex items-center justify-center gap-3.5 sm:gap-6 pt-1 max-w-md mx-auto w-full">
            <Link
              to="/buy"
              onClick={(e) => handleHeroNavClick(e, '/buy', 'buy')}
              className={`relative group overflow-hidden flex-1 py-3.5 sm:py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 font-black text-sm sm:text-base shadow-[0_10px_30px_rgba(245,158,11,0.35)] hover:shadow-[0_14px_35px_rgba(245,158,11,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center border-2 border-amber-300 select-none ${
                animatingBtn === 'buy' ? 'scale-95 shadow-amber-500/60 ring-2 ring-amber-400/80' : ''
              }`}
            >
              {/* Left-to-Right Parda (Curtain) Sheet with Glowing Leading Edge */}
              <span
                className={`absolute inset-0 bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 border-r-2 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.9)] transition-transform duration-300 ease-out pointer-events-none z-0 ${
                  animatingBtn === 'buy' ? 'translate-x-0' : '-translate-x-full'
                }`}
              />

              {/* Shimmer light sweep animation */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none z-0" />

              {/* Elements sliding in sequential order from left to right like a curtain */}
              <div className="relative z-10 flex items-center justify-center gap-2.5">
                <Building2
                  className={`w-5 h-5 transition-all duration-250 ease-out ${
                    animatingBtn === 'buy'
                      ? 'translate-x-3 text-amber-400 scale-110'
                      : 'text-slate-950 group-hover:scale-110'
                  }`}
                />
                <span
                  className={`tracking-wider transition-all duration-280 delay-50 ease-out ${
                    animatingBtn === 'buy'
                      ? 'translate-x-6 sm:translate-x-8 text-white font-black tracking-widest'
                      : 'text-slate-950'
                  }`}
                >
                  BUY
                </span>
                <ArrowRight
                  className={`w-4 h-4 transition-all duration-300 delay-100 ease-out ${
                    animatingBtn === 'buy'
                      ? 'translate-x-10 sm:translate-x-12 scale-125 text-amber-400'
                      : 'text-slate-950/70 group-hover:translate-x-1.5'
                  }`}
                />
              </div>
            </Link>

            <Link
              to="/rent"
              onClick={(e) => handleHeroNavClick(e, '/rent', 'rent')}
              className={`relative group overflow-hidden flex-1 py-3.5 sm:py-4 px-6 rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 font-black text-sm sm:text-base shadow-[0_10px_30px_rgba(255,255,255,0.3)] hover:shadow-[0_14px_35px_rgba(255,255,255,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center border-2 border-white select-none ${
                animatingBtn === 'rent' ? 'scale-95 shadow-white/60 ring-2 ring-white/80' : ''
              }`}
            >
              {/* Left-to-Right Parda (Curtain) Sheet with Glowing Leading Edge */}
              <span
                className={`absolute inset-0 bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 border-r-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.9)] transition-transform duration-300 ease-out pointer-events-none z-0 ${
                  animatingBtn === 'rent' ? 'translate-x-0' : '-translate-x-full'
                }`}
              />

              {/* Shimmer light sweep animation */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-slate-200/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none z-0" />

              {/* Elements sliding in sequential order from left to right like a curtain */}
              <div className="relative z-10 flex items-center justify-center gap-2.5">
                <Key
                  className={`w-5 h-5 transition-all duration-250 ease-out ${
                    animatingBtn === 'rent'
                      ? 'translate-x-3 rotate-[20deg] text-amber-400 scale-110'
                      : 'text-slate-950 group-hover:rotate-[15deg] group-hover:scale-110'
                  }`}
                />
                <span
                  className={`tracking-wider transition-all duration-280 delay-50 ease-out ${
                    animatingBtn === 'rent'
                      ? 'translate-x-6 sm:translate-x-8 text-white font-black tracking-widest'
                      : 'text-slate-950'
                  }`}
                >
                  RENT
                </span>
                <ArrowRight
                  className={`w-4 h-4 transition-all duration-300 delay-100 ease-out ${
                    animatingBtn === 'rent'
                      ? 'translate-x-10 sm:translate-x-12 scale-125 text-white'
                      : 'text-slate-950/70 group-hover:translate-x-1.5'
                  }`}
                />
              </div>
            </Link>
          </div>

          {/* Integrated Search Box - Transparent Glassmorphic Design */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-slate-900/60 hover:bg-slate-900/75 backdrop-blur-xl p-2 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/25 focus-within:border-amber-400/80 focus-within:bg-slate-900/85 flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto text-white transition-all duration-300"
          >
            <div className="flex items-center gap-3 px-3.5 py-2.5 w-full flex-1">
              <Search className="w-5 h-5 text-amber-400 shrink-0" />
              <input
                type="text"
                placeholder="Search location, area or property..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent w-full focus:outline-none text-xs sm:text-sm font-medium text-white placeholder:text-slate-300"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="text-slate-300 hover:text-white p-1 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Locality Jump Chips */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mr-1">
              Popular Localities:
            </span>
            {popularAreas.map((area) => (
              <button
                key={area}
                onClick={() => handleAreaSelect(area)}
                className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 ${
                  selectedArea === area
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                    : 'bg-black/40 text-slate-300 hover:bg-white/20 border border-white/10'
                }`}
              >
                {area === 'All' ? 'All Areas' : area}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. FEATURED PROPERTIES GRID (ANCHOR FOR SEARCH) */}
      <section id="properties-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4 text-amber-500" />
              <span>{selectedArea === 'All' ? 'Property Listings' : `Properties in ${selectedArea}`}</span>
              <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full text-[11px] font-bold">
                {filteredProperties.length} Available
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
                {selectedArea === 'All' ? 'Featured Properties' : `Available in ${selectedArea}`}
              </h2>
              {selectedArea !== 'All' && (
                <button
                  onClick={() => setSelectedArea('All')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 transition"
                  title="Clear area filter"
                >
                  <span>Area: {selectedArea}</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Link
              to={selectedArea !== 'All' ? `/rent?area=${encodeURIComponent(selectedArea)}` : '/rent'}
              className="text-xs font-bold text-blue-900 hover:text-amber-600 flex items-center gap-1 transition bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200"
            >
              <span>Explore Rent Catalog</span> <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to={selectedArea !== 'All' ? `/buy?area=${encodeURIComponent(selectedArea)}` : '/buy'}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 transition bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200"
            >
              <span>Explore Buy Catalog</span> <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Listings Grid */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-slate-200 space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">
              No properties currently listed in {selectedArea === 'All' ? 'this filter' : selectedArea}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We frequently onboard verified properties across Nanded. You can reset filters or contact our broker directly.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={handleResetFilters}
                className="bg-blue-950 hover:bg-blue-900 text-amber-400 text-xs font-bold px-5 py-2.5 rounded-xl shadow transition"
              >
                Show All Areas
              </button>
              <Link
                to="/contact"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition"
              >
                Inquire Directly
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

      {/* 3. DIRECT BROKER DESK (COMPACT EXECUTIVE SPOTLIGHT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white p-5 sm:p-7 lg:p-8 border border-blue-900/60 shadow-xl">
          {/* Subtle decorative glow accents */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Column: Heading, description & credibility badges */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-3.5 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Direct Broker Desk</span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-serif tracking-tight text-white leading-tight">
                Have questions or want to list your property?
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                Connect directly with <strong className="text-white font-semibold">Swapnil Navghare</strong> for fast, transparent, and personalized assistance across Nanded's prime residential hubs.
              </p>

              {/* Verified Trust Badges */}
              <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-2.5 text-[11px] font-semibold text-slate-300">
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>RERA Verified Broker Partner</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fast Response (&lt; 15 mins)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>Local Nanded Expert</span>
                </div>
              </div>
            </div>

            {/* Right Column: Broker Card with Action Buttons */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md border border-white/15 p-4 sm:p-5 rounded-2xl shadow-lg space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-base sm:text-lg flex items-center justify-center shadow-md">
                    SN
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" title="Online for inquiries" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm sm:text-base font-bold text-white leading-snug">Swapnil Navghare</h4>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                      Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">Principal Broker & Consultant</p>
                  <p className="text-[10px] text-amber-400/90 font-mono">Vedika Brokers • Nanded Desk</p>
                </div>
              </div>

              {/* Primary Call & WhatsApp Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                <a
                  href="tel:+919370148697"
                  className="py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md shadow-amber-400/20 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Call Broker</span>
                </a>

                <a
                  href="https://wa.me/919370148697?text=Hello%20Swapnil%20Navghare,%20I%20am%20looking%20for%20property%20assistance%20in%20Nanded."
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Consultation availability note */}
              <div className="pt-2 border-t border-white/10 text-center">
                <p className="text-[10px] text-slate-400">
                  Open Mon - Sun: 9:00 AM – 8:30 PM • Zero Obligation Consultation
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPACT SPACE-EFFICIENT FAQS */}
      <section id="faqs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 lg:p-10">
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
                        className="w-full py-3.5 px-4 sm:px-5 text-left font-bold text-xs sm:text-sm text-slate-900 flex justify-between items-center gap-3 transition"
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
