import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Compass,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Phone,
  Calendar,
  Layers,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Eye,
  Info
} from 'lucide-react';
import ScheduleVisitModal from './ScheduleVisitModal';

export const TOUR_STOPS = [
  {
    id: 1,
    step: '01',
    category: 'Exterior Architecture',
    title: 'Grand Villa Facade & Arrival',
    subtitle: 'Modern Minimalist Architecture with Warm Timber Cladding',
    image: '/tour/1.jpg',
    video: '/tour/video-1.mp4',
    videoTime: 0,
    description: 'A striking contemporary two-level facade featuring floor-to-ceiling double-glazed curtain walls, architectural timber vertical cladding, and landscaped drought-tolerant greenery.',
    features: ['Double-Height Glazing', 'White Oak Siding', 'Integrated Double Garage', 'Manicured Entry Lawn'],
    specs: { area: '4,500 sq.ft Built-up', orientation: 'North-East Facing', ceiling: '3.4m High Ceilings' },
    hotspots: [
      { x: '35%', y: '30%', label: 'Curtain Glazing', detail: 'Acoustic thermal double-glazed facade with slim thermal-break frames' },
      { x: '75%', y: '35%', label: 'White Oak Siding', detail: 'Sustainably sourced vertical timber battens with weather protection' }
    ]
  },
  {
    id: 2,
    step: '02',
    category: 'Entrance Threshold',
    title: 'Architectural Pivot Entry Door',
    subtitle: 'Oversized Natural Oak with Side Glass Insets',
    image: '/tour/2.jpg',
    video: '/tour/video-2.mp4',
    videoTime: 4,
    description: 'Arrive through a monumental 2.8m solid timber pivot door flanked by handcrafted terracotta olive planters, concrete entry steps, and unbroken sightlines through to the interior living space.',
    features: ['2.8m Heavy Pivot Door', 'Brushed Brass Pull Bar', 'Dual Tuscan Olive Trees', 'Cast Concrete Steps'],
    specs: { doorHeight: '2.8m Height', lock: 'Digital Smart Lock', finish: 'Natural Matte Polyurethane' },
    hotspots: [
      { x: '50%', y: '50%', label: 'Precision Pivot Hinge', detail: 'German floor-concealed hydraulic pivot bearing with soft damping' },
      { x: '20%', y: '70%', label: 'Terracotta Planter', detail: 'Imported Tuscan olive tree in aged terracotta pot' }
    ]
  },
  {
    id: 3,
    step: '03',
    category: 'Foyer & Hallway',
    title: 'Grand Gallery Foyer',
    subtitle: 'Polished Concrete Floors & Seamless Sightlines',
    image: '/tour/3.jpg',
    video: '/tour/video-3.mp4',
    videoTime: 8,
    description: 'Step into the light-washed foyer showcasing industrial polished concrete floors, minimalist contemporary art, and an unbroken visual axis toward the formal dining and alfresco gardens.',
    features: ['Continuous Polished Screed', 'Gallery Wall Lighting', 'Courtyard Glass Sidelight', 'Recessed Skirting'],
    specs: { flooring: 'Honed Screed Concrete', lighting: '2700K Warm LED Niches', artWall: 'Double-Reinforced Plaster' },
    hotspots: [
      { x: '80%', y: '40%', label: 'Curated Art Wall', detail: 'Dedicated gallery picture-rail track with directional museum spotlights' },
      { x: '60%', y: '55%', label: 'Dining Sightline', detail: 'Direct visual connection to formal dining and landscaped garden' }
    ]
  },
  {
    id: 4,
    step: '04',
    category: 'Living & Hearth',
    title: 'Sunken Lounge & Stone Fireplace',
    subtitle: 'Rough-Cut Limestone Chimney & Garden View Lounge',
    image: '/tour/4.jpg',
    video: '/tour/video-4.mp4',
    videoTime: 12,
    description: 'The social heart of the residence featuring a natural dry-stacked limestone fireplace with floating timber mantel, deep woven linen modular sectional, and floor-to-ceiling glass sliding doors.',
    features: ['Dry-Stacked Limestone Fireplace', 'Custom Linen Sectional', 'Full-Height Sliding Glass', 'Sculptural Petal Chandelier'],
    specs: { fireplace: 'Gas-Fired Real Flame', glazing: 'Floor-to-Ceiling 3.2m', carpet: '100% Berber Wool Rug' },
    hotspots: [
      { x: '68%', y: '55%', label: 'Dry-Stacked Hearth', detail: 'Hand-chiselled natural limestone blocks with integrated gas fireplace' },
      { x: '25%', y: '15%', label: 'Petal Suspension Luminaire', detail: 'Sculptural organic fabric pendant lighting casting ambient diffuse glow' }
    ]
  },
  {
    id: 5,
    step: '05',
    category: 'Media & Library',
    title: 'Bespoke Architectural Media Unit',
    subtitle: 'Custom White Oak Display & Recessed Storage',
    image: '/tour/5.jpg',
    video: '/tour/video-4.mp4',
    videoTime: 14,
    description: 'Crafted wall alcoves with natural white oak shelving, integrated warm LED accent backlight, and hidden storage cabinetry designed for curated ceramics, art books, and entertainment.',
    features: ['Integrated Accent Glow', 'Concealed Wiring Channels', 'Solid Timber Trim', 'Flush Plaster Niches'],
    specs: { joinery: 'Natural American White Oak', shelving: 'Adjustable Floating Shelves', lighting: 'Cove Perimeter LED' },
    hotspots: [
      { x: '50%', y: '45%', label: 'Media & Canvas Alcove', detail: 'Engineered flush niche accommodating up to 85-inch display' }
    ]
  },
  {
    id: 6,
    step: '06',
    category: 'Dining Pavilion',
    title: 'Formal Dining & Courtyard Vista',
    subtitle: 'Solid White Oak Banquet Table Overlooking Pool',
    image: '/tour/6.jpg',
    video: '/tour/video-5.mp4',
    videoTime: 16,
    description: 'Positioned between the interior chef kitchen and exterior poolside terrace, this dining hall seats 10 guests under the floral pendant chandelier with sliding panels opening wide to summer breezes.',
    features: ['Solid White Oak Table', 'Curved Wishbone Chairs', 'Direct Poolside Access', 'Motorized Sheer Curtains'],
    specs: { capacity: '10-Seater Banquet', tableLength: '3.2m Solid Timber', chandelier: 'Triple Petal Cluster' },
    hotspots: [
      { x: '50%', y: '35%', label: 'Sculptural Pendant', detail: 'Organic draped luminaire providing intimate dinner lighting' },
      { x: '20%', y: '60%', label: 'Glass Pocket Doors', detail: 'Recessed sliding doors tuck completely away into wall pockets' }
    ]
  },
  {
    id: 7,
    step: '07',
    category: 'Chef’s Kitchen',
    title: 'Italian Carrara Marble Kitchen',
    subtitle: 'Honed Marble Waterfall Island & Satin Lacquer Joinery',
    image: '/tour/7.jpg',
    video: '/tour/video-5.mp4',
    videoTime: 18,
    description: 'A culinary centerpiece with a continuous 3.6m honed Carrara marble waterfall island, undermount brushed brass sink, integrated induction cooktop, and flush floor-to-ceiling pantry doors.',
    features: ['Honed Carrara Marble', 'Brushed Brass Mixer', 'Integrated Miele Appliances', 'Seamless Flush Cabinetry'],
    specs: { islandLength: '3.6m Solid Marble', appliances: 'Integrated Miele Series', tapware: 'Brushed Brass Pull-out' },
    hotspots: [
      { x: '50%', y: '75%', label: 'Carrara Marble Waterfall', detail: 'Mitred 40mm slab waterfall with continuous book-matched veining' },
      { x: '50%', y: '45%', label: 'Brushed Brass Gooseneck', detail: 'Ceramic disc pull-out kitchen mixer with filtered water tap' }
    ]
  },
  {
    id: 8,
    step: '08',
    category: 'Prep Kitchen & Scullery',
    title: 'Butler’s Pantry & Walk-in Storage',
    subtitle: 'Concealed Prep Kitchen with Custom Open Oak Shelving',
    image: '/tour/9.jpg',
    video: '/tour/video-5.mp4',
    videoTime: 20,
    description: 'Hidden behind a pocket door from the main kitchen, the butler’s pantry provides secondary prep sinks, oak display shelves for artisanal ceramics, under-cabinet lighting, and generous dry food larders.',
    features: ['Secondary Deep Prep Sink', 'Under-Cabinet Warm LED', 'Solid Oak Countertop', 'L-Shaped Storage Modules'],
    specs: { layout: 'Walk-in L-Configuration', shelving: 'Solid Oak Open Display', sink: 'Undermount Ceramic' },
    hotspots: [
      { x: '50%', y: '50%', label: 'Oak Butcher Block', detail: 'Oiled food-grade solid oak counter with integrated undermount prep sink' }
    ]
  },
  {
    id: 9,
    step: '09',
    category: 'Alfresco & Resort Living',
    title: 'Resort Pool Deck & Outdoor Kitchen',
    subtitle: 'Integrated Stainless BBQ, Dining Pergola & Azure Pool',
    image: '/tour/10.jpg',
    video: '/tour/video-6.mp4',
    videoTime: 21,
    description: 'Experience indoor-outdoor living at its finest with an outdoor lounge terrace, stainless steel built-in BBQ kitchen, granite prep surfaces, and a crystal-clear swimming pool surrounded by timber deck.',
    features: ['Built-in Stainless BBQ Grill', 'Granite Wet Bar', 'Weatherproof Lounge Suite', 'Solar Heated Lap Pool'],
    specs: { poolLength: '10m x 4m Heated Lap Pool', deck: 'Composite Timber Decking', bbq: '6-Burner Built-in Rotisserie' },
    hotspots: [
      { x: '85%', y: '65%', label: 'Azure Swimming Pool', detail: 'Heated saltwater lap pool with recessed waterline LED lighting' },
      { x: '10%', y: '60%', label: 'Outdoor BBQ Island', detail: 'Heavy-duty 316 marine stainless steel grill with granite benchtop' }
    ]
  },
  {
    id: 10,
    step: '10',
    category: 'Private Bedroom Wing',
    title: 'Gallery Corridor & Clerestory Windows',
    subtitle: 'Acoustic Wall Panelling & Natural Top Skylights',
    image: '/tour/11.jpg',
    video: '/tour/video-6.mp4',
    videoTime: 22,
    description: 'Moving into the quiet residential wing, upper clerestory windows flood the gallery hallway with natural light. Flush timber doors conceal guest bedrooms, laundry, and the primary master suite.',
    features: ['High Clerestory Windows', 'Vertical Timber Wall Accents', 'Integrated Flush Doors', 'Polished Concrete'],
    specs: { corridorWidth: '1.6m Extra Wide', glazing: 'Upper Clerestory Transom', doors: '2.4m Flush Frameless' },
    hotspots: [
      { x: '50%', y: '10%', label: 'Clerestory Skylights', detail: 'Passive solar clerestory windows capturing all-day natural diffuse sunlight' }
    ]
  },
  {
    id: 11,
    step: '11',
    category: 'Primary Sanctuary',
    title: 'Master Suite Pivot Entry',
    subtitle: 'Matte Black Steel Frame & Acoustic Glass Partition',
    image: '/tour/12.jpg',
    video: '/tour/video-6.mp4',
    videoTime: 23,
    description: 'The entrance to the owner’s sanctuary features a minimalist matte black steel and frosted glass pivot door, revealing private balcony views, plush wool carpeting, and walk-in dressing wardrobes.',
    features: ['Steel & Glass Pivot Door', 'Private Balcony Access', 'Limewash Plaster Walls', 'Bespoke Wardrobe Joinery'],
    specs: { partition: 'Powder-coated Black Steel', glass: 'Fluted Acoustic Laminated', suiteType: 'Executive Master Sanctuary' },
    hotspots: [
      { x: '55%', y: '45%', label: 'Steel Pivot Door', detail: 'Custom architectural pivot divider separating private dressing room' }
    ]
  }
];

export default function HouseTourScroller() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState('photo'); // 'photo' | 'video'
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [isMergedModalOpen, setIsMergedModalOpen] = useState(false);
  const [mergedTime, setMergedTime] = useState(0);
  const [mergedDuration, setMergedDuration] = useState(24.25);
  const [isMergedPlaying, setIsMergedPlaying] = useState(true);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const singleVideoRef = useRef(null);
  const mergedVideoRef = useRef(null);

  const currentStop = TOUR_STOPS[activeIndex];

  // IntersectionObserver to sync scroll position with active tour stop
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0.2
    };

    const observers = [];
    cardRefs.current.forEach((el, index) => {
      if (!el) return;
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setActiveIndex(index);
        }
      }, options);
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  // Jump to specific stop
  const jumpToStop = (index) => {
    setActiveIndex(index);
    if (cardRefs.current[index]) {
      cardRefs.current[index].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  // Next / Prev handlers
  const handleNext = () => {
    if (activeIndex < TOUR_STOPS.length - 1) {
      jumpToStop(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      jumpToStop(activeIndex - 1);
    }
  };

  // Merged video timeline update
  const handleMergedTimeUpdate = () => {
    if (mergedVideoRef.current) {
      setMergedTime(mergedVideoRef.current.currentTime);
      if (mergedVideoRef.current.duration) {
        setMergedDuration(mergedVideoRef.current.duration);
      }
    }
  };

  const seekMergedVideo = (seconds) => {
    if (mergedVideoRef.current) {
      mergedVideoRef.current.currentTime = seconds;
      mergedVideoRef.current.play();
      setIsMergedPlaying(true);
    }
  };

  return (
    <section className="relative bg-slate-950 text-white py-16 sm:py-24 overflow-hidden scroll-mt-14" id="tour-showcase">
      {/* Background Ambience Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 sm:space-y-12">
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/60 border border-blue-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Scroll-Driven Architectural Tour</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight text-white">
              Walkthrough House Tour
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              Step inside Vedika's premier architectural showcase in Nanded. Scroll down to advance seamlessly from the grand facade, through the foyer, living lounge, chef's kitchen, to the private sanctuary and resort pool deck.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsMergedModalOpen(true)}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Watch Full Merged Video Tour (24s)</span>
            </button>

            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs sm:text-sm transition"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Book Site Visit</span>
            </button>
          </div>
        </div>

        {/* QUICK ROOM NAV PILLS (STICKY / HORIZONTAL SCROLL) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 border-b border-slate-800/80 -mx-4 px-4 sm:mx-0 sm:px-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" /> Room Tour:
          </span>
          {TOUR_STOPS.map((stop, idx) => (
            <button
              key={stop.id}
              onClick={() => jumpToStop(idx)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 shrink-0 ${
                activeIndex === idx
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20 scale-105'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span className="text-[10px] opacity-70 font-mono">{stop.step}</span>
              <span>{stop.title.split('&')[0].trim()}</span>
            </button>
          ))}
        </div>

        {/* MAIN INTERACTIVE TOUR WORKSPACE (STICKY SPLIT-VIEW) */}
        <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          {/* LEFT: CINEMATIC STICKY VIEWPORT (7 COLS ON DESKTOP) */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 z-20 space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl aspect-[16/10] sm:aspect-[16/9] group">
              {/* Media Display: Photo vs Motion Video */}
              {viewMode === 'photo' ? (
                <div className="relative w-full h-full">
                  <img
                    key={currentStop.image}
                    src={currentStop.image}
                    alt={currentStop.title}
                    className="w-full h-full object-cover object-center animate-in fade-in zoom-in-95 duration-500"
                  />
                  {/* Subtle Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none" />

                  {/* Interactive Hotspot Pins */}
                  {currentStop.hotspots &&
                    currentStop.hotspots.map((spot, i) => (
                      <div
                        key={i}
                        style={{ left: spot.x, top: spot.y }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group/spot"
                      >
                        <button
                          onClick={() => setActiveHotspot(activeHotspot === spot.label ? null : spot.label)}
                          className="relative flex items-center justify-center"
                          title={spot.label}
                        >
                          <span className="absolute w-8 h-8 rounded-full bg-amber-400/40 animate-ping" />
                          <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-[10px] shadow-lg border-2 border-white cursor-pointer hover:scale-125 transition">
                            +
                          </span>
                        </button>

                        {/* Hotspot Tooltip Card */}
                        <div
                          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 rounded-2xl bg-slate-950/95 border border-amber-400/40 backdrop-blur-md shadow-2xl text-left transition duration-200 pointer-events-auto z-40 ${
                            activeHotspot === spot.label
                              ? 'opacity-100 visible scale-100'
                              : 'opacity-0 invisible group-hover/spot:opacity-100 group-hover/spot:visible group-hover/spot:scale-100'
                          }`}
                        >
                          <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-amber-400" /> {spot.label}
                          </p>
                          <p className="text-[11px] text-slate-300 mt-1 leading-snug">{spot.detail}</p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="relative w-full h-full bg-black">
                  <video
                    ref={singleVideoRef}
                    key={currentStop.video}
                    src={currentStop.video}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover animate-in fade-in duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                </div>
              )}

              {/* TOP HUD: Step Counter & Mode Toggle */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto z-30">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-amber-400 font-mono text-xs font-bold shadow-md">
                    ROOM {currentStop.step} / {TOUR_STOPS.length}
                  </span>
                  <span className="hidden sm:inline-block px-3 py-1 rounded-xl bg-slate-950/70 backdrop-blur-md border border-slate-700/50 text-slate-300 text-xs font-medium">
                    {currentStop.category}
                  </span>
                </div>

                {/* View Mode Toggle: Photo vs 3D Motion */}
                <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-700/70 shadow-lg">
                  <button
                    onClick={() => setViewMode('photo')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      viewMode === 'photo'
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Photo</span>
                  </button>
                  <button
                    onClick={() => setViewMode('video')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      viewMode === 'video'
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>3D Motion</span>
                  </button>
                </div>
              </div>

              {/* BOTTOM HUD: Room Title & Navigation Prev/Next */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-30 pointer-events-auto">
                <div className="space-y-0.5 max-w-[70%]">
                  <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Info className="w-3 h-3" /> {currentStop.subtitle}
                  </p>
                  <h3 className="text-base sm:text-xl font-bold text-white drop-shadow-md truncate">
                    {currentStop.title}
                  </h3>
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrev}
                    disabled={activeIndex === 0}
                    className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-700/60 text-white disabled:opacity-30 disabled:pointer-events-none transition shadow-lg"
                    title="Previous Room"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={activeIndex === TOUR_STOPS.length - 1}
                    className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold disabled:opacity-30 disabled:pointer-events-none transition shadow-lg shadow-amber-400/20"
                    title="Next Room"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Specs Strip below viewport */}
            <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              {Object.entries(currentStop.specs).map(([key, val]) => (
                <div key={key} className="space-y-0.5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </p>
                  <p className="text-xs font-semibold text-slate-200 truncate">{val}</p>
                </div>
              ))}
            </div>

            {/* Direct Broker CTA for this showcase */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/80 to-slate-900 border border-blue-900/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs shadow-sm">
                  SN
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Authorized Area Broker</p>
                  <p className="text-xs font-bold text-white">Swapnil Navghare (Vedika Brokers)</p>
                </div>
              </div>
              <a
                href="tel:+919370148697"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Call</span> +91 93701 48697
              </a>
            </div>
          </div>

          {/* RIGHT: SCROLLABLE SEQUENCE OF ROOM CARDS (5 COLS ON DESKTOP) */}
          <div className="lg:col-span-5 space-y-6 lg:py-4">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Scroll to step through every room ({TOUR_STOPS.length} Stops)</span>
            </div>

            {TOUR_STOPS.map((stop, index) => {
              const isSelected = activeIndex === index;
              return (
                <div
                  key={stop.id}
                  ref={(el) => (cardRefs.current[index] = el)}
                  onClick={() => jumpToStop(index)}
                  className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-slate-900 border-amber-400/80 shadow-xl shadow-amber-400/5 ring-1 ring-amber-400/50 scale-[1.01]'
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70 hover:border-slate-700'
                  }`}
                >
                  {/* Active Indicator Bar */}
                  {isSelected && (
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 to-amber-600" />
                  )}

                  <div className="space-y-4">
                    {/* Card Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-7 h-7 rounded-xl font-mono text-xs font-black flex items-center justify-center ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950 shadow-sm'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {stop.step}
                        </span>
                        <span className="text-xs font-bold text-amber-400/90 uppercase tracking-wider">
                          {stop.category}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Active View
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h4 className="text-lg font-bold text-white font-serif tracking-tight">{stop.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{stop.subtitle}</p>
                      <p className="text-xs text-slate-300 leading-relaxed mt-2.5">{stop.description}</p>
                    </div>

                    {/* Architectural Feature Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {stop.features.map((feat, fi) => (
                        <span
                          key={fi}
                          className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-[11px] text-slate-300 border border-slate-700/60 font-medium"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>

                    {/* Bottom Action strip for each card */}
                    <div className="pt-2 flex items-center justify-between border-t border-slate-800/60 text-xs">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          jumpToStop(index);
                          setViewMode('video');
                        }}
                        className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 transition"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Play 4s 3D Motion</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          jumpToStop(index);
                          setIsScheduleModalOpen(true);
                        }}
                        className="text-slate-400 hover:text-white font-medium flex items-center gap-1 transition"
                      >
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>Inspect in Person</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODAL: FULL CONTINUOUS MERGED VIDEO TOUR (24 SECONDS) */}
      {isMergedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-950 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                  <Play className="w-5 h-5 fill-slate-950" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-serif">
                    Continuous 3D Motion House Tour Walkthrough
                  </h3>
                  <p className="text-xs text-slate-400">
                    Seamlessly merged multi-room camera flight (24 Seconds) • Vedika Brokers
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsMergedModalOpen(false)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Canvas */}
            <div className="relative bg-black aspect-[16/9] w-full flex items-center justify-center overflow-hidden">
              <video
                ref={mergedVideoRef}
                src="/tour/full-tour-merged.mp4"
                autoPlay
                playsInline
                loop
                muted={isMuted}
                onTimeUpdate={handleMergedTimeUpdate}
                className="w-full h-full object-contain"
              />

              {/* Big Center Play overlay if paused */}
              {!isMergedPlaying && (
                <button
                  onClick={() => {
                    if (mergedVideoRef.current) {
                      mergedVideoRef.current.play();
                      setIsMergedPlaying(true);
                    }
                  }}
                  className="absolute p-5 rounded-full bg-amber-400 text-slate-950 shadow-2xl hover:scale-110 transition"
                >
                  <Play className="w-8 h-8 fill-slate-950 ml-0.5" />
                </button>
              )}
            </div>

            {/* Video Controls & Chapter Markers */}
            <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 space-y-3">
              {/* Timeline scrubber bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>{Math.floor(mergedTime)}s</span>
                  <span className="text-amber-400 font-bold">
                    {mergedTime < 4
                      ? 'Scene 1: Exterior Arrival'
                      : mergedTime < 8
                      ? 'Scene 2: Pivot Entrance'
                      : mergedTime < 12
                      ? 'Scene 3: Foyer Hallway'
                      : mergedTime < 16
                      ? 'Scene 4: Living Lounge & Fireplace'
                      : mergedTime < 20
                      ? 'Scene 5: Kitchen & Dining Pavilion'
                      : 'Scene 6: Resort Pool & Suites'}
                  </span>
                  <span>{Math.floor(mergedDuration)}s</span>
                </div>
                <div className="relative w-full h-2 rounded-full bg-slate-800 overflow-hidden cursor-pointer">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-100"
                    style={{ width: `${(mergedTime / mergedDuration) * 100}%` }}
                  />
                </div>
              </div>

              {/* Chapter Jump Buttons */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                    Jump To:
                  </span>
                  {[
                    { label: 'Exterior', time: 0 },
                    { label: 'Entrance', time: 4 },
                    { label: 'Foyer', time: 8 },
                    { label: 'Lounge', time: 12 },
                    { label: 'Dining & Kitchen', time: 16 },
                    { label: 'Pool Terrace', time: 20 }
                  ].map((ch, i) => (
                    <button
                      key={i}
                      onClick={() => seekMergedVideo(ch.time)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                        mergedTime >= ch.time && mergedTime < ch.time + 4
                          ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (mergedVideoRef.current) {
                        if (isMergedPlaying) {
                          mergedVideoRef.current.pause();
                          setIsMergedPlaying(false);
                        } else {
                          mergedVideoRef.current.play();
                          setIsMergedPlaying(true);
                        }
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition text-xs font-bold flex items-center gap-1.5"
                  >
                    {isMergedPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isMergedPlaying ? 'Pause' : 'Play'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMuted(!isMuted);
                      if (mergedVideoRef.current) {
                        mergedVideoRef.current.muted = !isMuted;
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                  </button>

                  <a
                    href="tel:+919370148697"
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition ml-2"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Broker Swapnil Navghare</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE VISIT MODAL */}
      {isScheduleModalOpen && (
        <ScheduleVisitModal
          property={{
            id: 'tour-showcase-01',
            title: `Luxury Architectural Villa (${currentStop.title})`,
            area: 'Zenda Chowk / Chhatrapati Chowk, Nanded',
            broker_name: 'Swapnil Navghare (Vedika Brokers)',
            broker_phone: '+91 93701 48697'
          }}
          onClose={() => setIsScheduleModalOpen(false)}
        />
      )}
    </section>
  );
}
