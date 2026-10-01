// src/pages/Rent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  SlidersHorizontal, 
  RotateCcw, 
  Key,
  X,
  MapPin,
  ChevronDown,
  ChevronUp,
  Check,
  CheckCircle2
} from 'lucide-react';
import dataStore from '@/services/dataStore';
import PropertyCard from '@/components/PropertyCard';

export default function Rent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [areas, setAreas] = useState([]);
  const [areaFilter, setAreaFilter] = useState(() => searchParams.get('area') || 'All');
  const [bhkFilter, setBhkFilter] = useState('All');
  const [budgetTier, setBudgetTier] = useState('all'); // 'all', 'under15k', '15k-25k', '25k-40k', 'above40k'
  const [furnishingFilter, setFurnishingFilter] = useState('All');
  const [maxRent, setMaxRent] = useState(100000);
  const [useCustomSlider, setUseCustomSlider] = useState(false);
  const [parkingOnly, setParkingOnly] = useState(false);
  const [balconyOnly, setBalconyOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState('newest');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const filterCardRef = useRef(null);

  useEffect(() => {
    if (showAdvancedFilters && filterCardRef.current) {
      filterCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [showAdvancedFilters]);

  const loadData = async () => {
    const all = await dataStore.getProperties();
    if (all && all.length > 0) {
      setProperties(all.filter((p) => p.listing_type === 'rent'));
    }
    const loadedAreas = await dataStore.getAreas({ includeInactive: false });
    setAreas(loadedAreas || []);
  };

  useEffect(() => {
    loadData();
    const unsub = dataStore.subscribe(loadData);
    return unsub;
  }, []);

  useEffect(() => {
    const areaParam = searchParams.get('area');
    if (areaParam) {
      setAreaFilter(areaParam);
    }
    const qParam = searchParams.get('q');
    if (qParam) {
      setSearchQuery(qParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!showAdvancedFilters) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowAdvancedFilters(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAdvancedFilters]);

  const [appliedNotice, setAppliedNotice] = useState(false);

  const resetFilters = () => {
    setAreaFilter('All');
    setBhkFilter('All');
    setBudgetTier('all');
    setFurnishingFilter('All');
    setMaxRent(100000);
    setUseCustomSlider(false);
    setParkingOnly(false);
    setBalconyOnly(false);
    setSearchQuery('');
    setSortBy('newest');
    // NOTE: Keep filter card open in its position - do not close it!
  };

  const handleApplyFilters = () => {
    setAppliedNotice(true);
    setTimeout(() => {
      setAppliedNotice(false);
    }, 2000);
  };

  const handleBudgetTierChange = (tier) => {
    setBudgetTier(tier);
    setUseCustomSlider(false);
  };

  const filtered = properties
    .filter((p) => {
      const isAvail = !p.status || p.status.toLowerCase() === 'available';
      if (!isAvail) return false;
      
      // Locality
      if (areaFilter !== 'All') {
        const target = areaFilter.trim().toLowerCase();
        const pArea = (p.area || '').trim().toLowerCase();
        const pLoc = (p.locality || '').trim().toLowerCase();
        const pSub = (p.subArea || '').trim().toLowerCase();
        const pAddr = (p.address || '').trim().toLowerCase();
        if (
          pArea !== target &&
          !pArea.includes(target) &&
          !pLoc.includes(target) &&
          !pSub.includes(target) &&
          !pAddr.includes(target)
        ) {
          return false;
        }
      }
      
      // BHK
      if (bhkFilter !== 'All' && p.bhk !== bhkFilter) return false;
      
      // Budget Tier for Nanded rentals
      if (budgetTier === 'under15k' && p.price > 15000) return false;
      if (budgetTier === '15k-25k' && (p.price < 15000 || p.price > 25000)) return false;
      if (budgetTier === '25k-40k' && (p.price < 25000 || p.price > 40000)) return false;
      if (budgetTier === 'above40k' && p.price < 40000) return false;
      
      // Custom Slider
      if (useCustomSlider && maxRent < 100000 && p.price > maxRent) return false;

      // Furnishing
      if (furnishingFilter !== 'All' && (!p.furnishing || p.furnishing.toLowerCase() !== furnishingFilter.toLowerCase())) return false;
      
      // Amenities
      if (parkingOnly && (!p.parking || p.parking.toLowerCase().includes('none'))) return false;
      if (balconyOnly && (!p.balconies || p.balconies < 1)) return false;
      
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matched = (p.title && p.title.toLowerCase().includes(q)) ||
          (p.locality && p.locality.toLowerCase().includes(q)) ||
          (p.area && p.area.toLowerCase().includes(q)) ||
          (p.bhk && p.bhk.toLowerCase().includes(q));
        if (!matched) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

  const activeFilterCount = (areaFilter !== 'All' ? 1 : 0) +
    (bhkFilter !== 'All' ? 1 : 0) +
    (budgetTier !== 'all' || (useCustomSlider && maxRent < 100000) ? 1 : 0) +
    (furnishingFilter !== 'All' ? 1 : 0) +
    (parkingOnly ? 1 : 0) +
    (balconyOnly ? 1 : 0) +
    (searchQuery ? 1 : 0);

  // Dynamic area names from location store
  const allAreaOptions = ['All', ...areas.map((a) => a.name)];
  const bhkOptions = ['All', '1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK+'];

  const renderPortraitFilterCard = () => (
    <div className="bg-white rounded-3xl border-2 border-blue-950/20 shadow-xl overflow-hidden flex flex-col h-[620px] transition-all hover:border-blue-950/30">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-950 to-slate-900 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow">
            <SlidersHorizontal className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-300">Property Filters</h3>
            <p className="text-[10px] text-slate-300">Filter verified rentals in Nanded</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-[10px] font-bold text-amber-300 hover:text-white px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition"
              title="Reset all filters"
            >
              Reset
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowAdvancedFilters(false)}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center transition"
            title="Close Filter Card"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Body: all controls in portrait layout */}
      <div className="p-4 space-y-4 overflow-y-auto scrollbar-thin flex-1 text-xs">
        {/* 1. Search Box */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Search</label>
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-blue-950 focus-within:bg-white transition">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Locality, society, landmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent w-full focus:outline-none placeholder:text-slate-400 font-medium text-xs text-slate-800"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-0.5 text-slate-400 hover:text-slate-600">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* 2. Locality / Area Selection */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Locality / Area</label>
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-950"
          >
            {allAreaOptions.map((a) => (
              <option key={a} value={a}>
                {a === 'All' ? 'All Areas & Localities' : a}
              </option>
            ))}
          </select>
        </div>

        {/* 3. BHK Configuration */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">BHK Configuration</label>
          <div className="grid grid-cols-3 gap-1.5">
            {bhkOptions.map((bhk) => (
              <button
                key={bhk}
                type="button"
                onClick={() => setBhkFilter(bhk)}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition text-center border ${
                  bhkFilter === bhk
                    ? 'bg-blue-950 text-amber-400 border-blue-950 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {bhk}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Budget / Rent Tiers */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Monthly Rent</label>
            <span className="text-[11px] font-black text-blue-950">
              {useCustomSlider ? `Up to ₹${maxRent.toLocaleString('en-IN')}` : budgetTier === 'all' ? 'Any' : budgetTier === 'under15k' ? '< ₹15k' : budgetTier === '15k-25k' ? '₹15k - ₹25k' : budgetTier === '25k-40k' ? '₹25k - ₹40k' : '₹40k+'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: 'Any Budget', value: 'all' },
              { label: '< ₹15,000', value: 'under15k' },
              { label: '₹15k - ₹25k', value: '15k-25k' },
              { label: '₹25,000+', value: '25k-40k' },
            ].map((tier) => (
              <button
                key={tier.value}
                type="button"
                onClick={() => handleBudgetTierChange(tier.value)}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition border ${
                  budgetTier === tier.value && !useCustomSlider
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>

          {/* Slider */}
          <div className="pt-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mb-0.5">
              <span>Slider</span>
              <span>₹5k - ₹1,00,000</span>
            </div>
            <input
              type="range"
              min="5000"
              max="100000"
              step="2000"
              value={maxRent}
              onChange={(e) => {
                setMaxRent(Number(e.target.value));
                setUseCustomSlider(true);
                setBudgetTier('all');
              }}
              className="w-full accent-blue-950 cursor-pointer"
            />
          </div>
        </div>

        {/* 5. Furnishing Status */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Furnishing</label>
          <div className="grid grid-cols-2 gap-1.5">
            {['All', 'Fully-Furnished', 'Semi-Furnished', 'Unfurnished'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFurnishingFilter(f)}
                className={`py-1.5 px-1.5 rounded-xl text-[11px] font-bold transition border text-center ${
                  furnishingFilter === f
                    ? 'bg-blue-950 text-amber-400 border-blue-950 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {f === 'All' ? 'Any' : f.replace('-Furnished', '')}
              </button>
            ))}
          </div>
        </div>

        {/* 6. Preferences */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Amenities</label>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={parkingOnly}
                onChange={(e) => setParkingOnly(e.target.checked)}
                className="rounded accent-blue-950 w-3.5 h-3.5"
              />
              Dedicated Parking
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={balconyOnly}
                onChange={(e) => setBalconyOnly(e.target.checked)}
                className="rounded accent-blue-950 w-3.5 h-3.5"
              />
              Balcony Required
            </label>
          </div>
        </div>

        {/* 7. Sort Order */}
        <div className="space-y-1 pt-1 border-t border-slate-100">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Sort Order</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-950"
          >
            <option value="newest">Recently Added</option>
            <option value="price_asc">Rent: Low to High</option>
            <option value="price_desc">Rent: High to Low</option>
          </select>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3.5 bg-slate-50 border-t border-slate-100 shrink-0">
        <button
          type="button"
          onClick={handleApplyFilters}
          className={`w-full font-black py-2.5 px-4 rounded-xl shadow transition text-xs flex items-center justify-center gap-1.5 ${
            appliedNotice
              ? 'bg-emerald-600 text-white shadow-emerald-500/20'
              : 'bg-gradient-to-r from-blue-950 to-slate-900 hover:from-blue-900 hover:to-slate-800 text-amber-400'
          }`}
        >
          {appliedNotice ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span className="text-emerald-100 font-bold">Filters Applied ({filtered.length} Flats)</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Apply Filters ({filtered.length} Flats)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-4">
      {/* 1. COMPACT SLEEK HEADER */}
      <div className="bg-gradient-to-r from-blue-950 via-[#0C1A30] to-slate-900 text-white rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-3.5 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 text-amber-400 flex items-center justify-center shrink-0">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-black tracking-wider text-amber-300">Rental Desk</div>
              <h1 className="text-base sm:text-xl font-black font-serif text-white tracking-tight leading-tight">
                Rental Flats & Apartments
              </h1>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl text-center shrink-0 flex items-center gap-2">
            <span className="text-sm sm:text-lg font-black text-amber-400 leading-none">{filtered.length}</span>
            <span className="text-[9px] sm:text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Available</span>
          </div>
        </div>
      </div>

      {/* 2. SUB-BAR: FILTER BUTTON ALIGNED TO THE RIGHT SIDE (BELOW THE BANNER) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Left: Summary text */}
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <span className="font-bold text-slate-900">{filtered.length} verified flats</span>
          <span>available for rent in Nanded</span>
          {activeFilterCount > 0 && (
            <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full text-[11px]">
              ({activeFilterCount} active)
            </span>
          )}
        </div>

        {/* Right: The Filter Button (aligned to right side, above 3rd property column) */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-bold text-slate-600 hover:text-red-600 px-3 py-2.5 rounded-xl transition flex items-center gap-1.5 hover:bg-slate-100 border border-slate-200"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`font-black px-5 py-2.5 sm:py-3 rounded-2xl flex items-center gap-2.5 shadow-md transition-all border ${
              showAdvancedFilters
                ? 'bg-blue-950 text-white border-blue-900 ring-2 ring-blue-950/20'
                : 'bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 border-amber-300 hover:shadow-lg'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 stroke-[2.5]" />
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider">
              {showAdvancedFilters ? 'Hide Filters' : 'Filters'}
            </span>
            {activeFilterCount > 0 && (
              <span className={`w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center ${
                showAdvancedFilters ? 'bg-amber-400 text-slate-950' : 'bg-blue-950 text-amber-400'
              }`}>
                {activeFilterCount}
              </span>
            )}
            {showAdvancedFilters ? (
              <ChevronUp className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <ChevronDown className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>

      {/* 3. MAIN PROPERTIES GRID: 3 PROPERTIES IN A ROW */}
      <main className="w-full">
        {!showAdvancedFilters ? (
          /* Normal grid when filters are closed */
          filtered.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-sm space-y-4 max-w-xl mx-auto my-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
                <Building2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">No rental properties match this filter</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try selecting "All Areas", clearing your budget filter, or resetting to view all available flats for rent.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition inline-flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Reset Filters & Show All
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {filtered.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )
        ) : (
          /* FILTERS OPEN: SINGLE STABLE GRID
             The portrait filter card is strictly fixed at Row 1, Column 3 on desktop (lg:col-start-3 lg:row-start-1).
             It NEVER moves from its position when filters are applied, changed, or reset! */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {/* If 0 properties match: Empty state message occupies Row 1, Cols 1 & 2 */}
            {filtered.length === 0 ? (
              <div className="sm:col-span-2 lg:col-span-2 lg:col-start-1 lg:row-start-1 bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-sm space-y-4 flex flex-col items-center justify-center order-1 min-h-[420px]">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Building2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">No rental properties match this filter</h3>
                  <p className="text-xs text-slate-500 max-w-sm">
                    Try selecting "All Areas", clearing your budget filter, or resetting to view all available flats for rent.
                  </p>
                </div>
                <button
                  onClick={resetFilters}
                  className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Reset Filters & Show All
                </button>
              </div>
            ) : (
              <>
                {/* 1st Property: Row 1, Col 1 */}
                {filtered[0] && (
                  <div className="order-1">
                    <PropertyCard property={filtered[0]} />
                  </div>
                )}

                {/* 2nd Property: Row 1, Col 2 */}
                {filtered[1] && (
                  <div className="order-2">
                    <PropertyCard property={filtered[1]} />
                  </div>
                )}
              </>
            )}

            {/* 3rd Slot: PORTRAIT FILTER CARD (Firmly locked at Row 1, Col 3 on desktop) */}
            <div 
              ref={filterCardRef} 
              className="w-full lg:col-start-3 lg:row-start-1 order-3 lg:order-none"
            >
              {renderPortraitFilterCard()}
            </div>

            {/* 3rd Property and subsequent properties (pushed below to Row 2 onwards) */}
            {filtered.length > 2 && (
              filtered.slice(2).map((property) => (
                <div key={property.id} className="order-4">
                  <PropertyCard property={property} />
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
