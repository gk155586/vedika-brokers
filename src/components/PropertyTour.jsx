import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  Phone,
  Calendar,
  MessageSquare,
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  Compass,
  ChevronDown,
  Sparkles,
  Layers,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import TourScene from './TourScene';
import ScheduleVisitModal from './ScheduleVisitModal';

export const PROPERTY_SCENES = [
  {
    id: 'scene-exterior',
    tag: '01 / ARCHITECTURE',
    title: 'The Glass Pavilion Villa',
    subtitle: 'Modern Minimalist Architecture with Warm Timber Cladding',
    media: '/tour/1.jpg',
    video: '/tour/video-1.mp4',
    description:
      'A striking contemporary two-level residence featuring floor-to-ceiling double-glazed curtain walls, architectural timber vertical cladding, and landscaped drought-tolerant greenery in Nanded.',
    specs: ['4,500 sq.ft Built-up', 'Double-Height Glazing', 'White Oak Siding', 'Integrated Double Garage'],
    align: 'left',
    navLabel: 'Exterior',
  },
  {
    id: 'scene-entrance',
    tag: '02 / THRESHOLD',
    title: 'The Architectural Pivot Entry',
    subtitle: '2.8m Solid American White Oak with Concealed Hydraulics',
    media: '/tour/2.jpg',
    video: '/tour/video-2.mp4',
    description:
      'Arrive through a monumental 2.8-metre solid timber pivot door flanked by handcrafted terracotta olive pots, cast concrete steps, and unbroken sightlines through to the interior living space.',
    specs: ['2.8m Pivot Mechanism', 'Brushed Brass Pull Bar', 'Dual Tuscan Olive Trees', 'Smooth Cast Concrete'],
    align: 'left',
    navLabel: 'Pivot Entry',
  },
  {
    id: 'scene-foyer',
    tag: '03 / GALLERY FOYER',
    title: 'Grand Gallery Hallway',
    subtitle: 'Polished Concrete Screed & Seamless Sightlines',
    media: '/tour/3.jpg',
    video: '/tour/video-3.mp4',
    description:
      'Step into the light-washed gallery foyer showcasing industrial polished concrete floors, minimalist contemporary art, and an unbroken visual axis toward the formal dining and alfresco gardens.',
    specs: ['Continuous Polished Screed', 'Museum Art Lighting', 'Glass Courtyard Sidelights', 'Recessed Skirting'],
    align: 'left',
    navLabel: 'Gallery Foyer',
  },
  {
    id: 'scene-living',
    tag: '04 / LIVING & HEARTH',
    title: 'Sunken Lounge & Stone Fireplace',
    subtitle: 'Dry-Stacked Natural Limestone Hearth & Garden Glazing',
    media: '/tour/4.jpg',
    video: '/tour/video-3.mp4',
    description:
      'The social heart of the residence featuring a natural dry-stacked limestone fireplace with floating timber mantel, deep woven linen modular sectional, and floor-to-ceiling sliding glass panels.',
    specs: ['Dry-Stacked Limestone Fireplace', 'Custom Linen Sectional', 'Full-Height Sliding Glass', 'Sculptural Petal Chandelier'],
    align: 'left',
    navLabel: 'Living Lounge',
  },
  {
    id: 'scene-media',
    tag: '05 / ENTERTAINMENT',
    title: 'Curated Media & Display Wall',
    subtitle: 'Bespoke Architectural White Oak Joinery',
    media: '/tour/5.jpg',
    video: '/tour/video-4.mp4',
    description:
      'Crafted wall alcoves with natural white oak shelving, integrated warm 2700K perimeter LED glow, and hidden storage cabinetry designed for curated ceramics, art books, and flush screen entertainment.',
    specs: ['Natural American White Oak', 'Adjustable Floating Shelves', 'Concealed Wiring Channels', 'Flush Plaster Niches'],
    align: 'center',
    navLabel: 'Media Wall',
  },
  {
    id: 'scene-dining',
    tag: '06 / DINING PAVILION',
    title: 'Formal Dining & Courtyard Vista',
    subtitle: 'Solid White Oak Banquet Table Overlooking Pool',
    media: '/tour/6.jpg',
    video: '/tour/video-4.mp4',
    description:
      'Positioned between the interior chef kitchen and exterior poolside terrace, this dining hall seats 10 guests under the floral pendant chandelier with sliding panels opening wide to summer breezes.',
    specs: ['Solid White Oak Table', '10-Seater Banquet', 'Curved Wishbone Chairs', 'Direct Poolside Access'],
    align: 'left',
    navLabel: 'Dining Pavilion',
  },
  {
    id: 'scene-kitchen',
    tag: '07 / CHEF’S KITCHEN',
    title: 'Italian Carrara Marble Kitchen',
    subtitle: '3.6m Honed Marble Waterfall Island & Satin Lacquer Joinery',
    media: '/tour/7.jpg',
    video: '/tour/video-5.mp4',
    description:
      'A culinary centerpiece with a continuous 3.6m honed Carrara marble waterfall island, undermount brushed brass sink, integrated induction cooktop, and flush floor-to-ceiling pantry doors.',
    specs: ['Honed Carrara Marble', 'Brushed Brass Mixer', 'Integrated Miele Appliances', 'Seamless Flush Cabinetry'],
    align: 'left',
    navLabel: 'Marble Kitchen',
  },
  {
    id: 'scene-pantry',
    tag: '08 / PREP SCULLERY',
    title: 'Butler’s Pantry & Walk-in Storage',
    subtitle: 'Concealed Prep Kitchen with Custom Open Oak Shelving',
    media: '/tour/9.jpg',
    video: '/tour/video-5.mp4',
    description:
      'Hidden behind a pocket door from the main kitchen, the butler’s pantry provides secondary prep sinks, oak display shelves for artisanal ceramics, under-cabinet lighting, and generous dry food larders.',
    specs: ['Secondary Deep Prep Sink', 'Under-Cabinet Warm LED', 'Solid Oak Countertop', 'L-Shaped Storage Modules'],
    align: 'left',
    navLabel: 'Butler’s Pantry',
  },
  {
    id: 'scene-pool',
    tag: '09 / RESORT LIVING',
    title: 'Resort Pool Deck & Outdoor Kitchen',
    subtitle: 'Heated Lap Pool, Alfresco Pergola & Stainless BBQ Grill',
    media: '/tour/10.jpg',
    video: '/tour/video-6.mp4',
    description:
      'Experience indoor-outdoor living at its finest with an outdoor lounge terrace, stainless steel built-in BBQ kitchen, granite prep surfaces, and a crystal-clear swimming pool surrounded by timber deck.',
    specs: ['Heated Saltwater Lap Pool', '6-Burner Stainless BBQ', 'Granite Wet Bar', 'Weatherproof Pergola Lounge'],
    align: 'left',
    navLabel: 'Pool Terrace',
  },
  {
    id: 'scene-corridor',
    tag: '10 / PRIVATE WING',
    title: 'The Skyline Gallery Corridor',
    subtitle: 'Passive Solar Clerestory Windows & Acoustic Wall Panelling',
    media: '/tour/11.jpg',
    video: '/tour/video-6.mp4',
    description:
      'Moving into the quiet residential wing, upper clerestory windows flood the gallery hallway with natural light. Flush timber doors conceal guest bedrooms, laundry, and the primary master suite.',
    specs: ['High Clerestory Windows', 'Vertical Timber Wall Accents', 'Integrated Flush Doors', 'Polished Concrete'],
    align: 'left',
    navLabel: 'Gallery Wing',
  },
  {
    id: 'scene-bedroom',
    tag: '11 / PRIMARY SANCTUARY',
    title: 'The Master Suite Sanctuary',
    subtitle: 'Minimalist Black Steel & Acoustic Fluted Glass Pivot Entry',
    media: '/tour/12.jpg',
    video: '/tour/video-6.mp4',
    description:
      'The entrance to the owner’s sanctuary features a minimalist matte black steel and frosted glass pivot door, revealing private balcony views, plush wool carpeting, and walk-in dressing wardrobes.',
    specs: ['Steel & Glass Pivot Door', 'Private Balcony Access', 'Limewash Plaster Walls', 'Bespoke Wardrobe Joinery'],
    align: 'left',
    navLabel: 'Master Suite',
  },
  {
    id: 'scene-contact',
    tag: '12 / EXCLUSIVE DESK',
    title: 'Step Inside Your New Home',
    subtitle: 'Accompanied In-Person Site Visits Available Daily',
    media: '/tour/1.jpg',
    video: '/tour/full-tour-merged.mp4',
    description:
      'Represented exclusively by Vedika Brokers in Nanded. Connect directly with our authorized broker Swapnil Navghare to review complete architectural documentation, verify possession timelines, and reserve your private walk-through.',
    specs: ['Authorized Broker: Swapnil Navghare', 'Phone: +91 93701 48697', 'WhatsApp Desk Active', 'Accompanied Inspections Daily'],
    align: 'center',
    navLabel: 'Contact Desk',
  },
];

export default function PropertyTour({ scenes = PROPERTY_SCENES }) {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isGlobalMuted, setIsGlobalMuted] = useState(true);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isMergedModalOpen, setIsMergedModalOpen] = useState(false);
  const [mergedTime, setMergedTime] = useState(0);
  const [mergedDuration, setMergedDuration] = useState(24.25);
  const [isMergedPlaying, setIsMergedPlaying] = useState(true);

  const containerRef = useRef(null);
  const mergedVideoRef = useRef(null);

  // Sync scroll with active scene index
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const newIndex = Math.min(
        Math.floor((scrollPosition + windowHeight * 0.4) / windowHeight),
        scenes.length - 1
      );
      if (newIndex >= 0 && newIndex !== activeSceneIndex) {
        setActiveSceneIndex(newIndex);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSceneIndex, scenes.length]);

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isMergedModalOpen || isScheduleModalOpen) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToScene(Math.min(activeSceneIndex + 1, scenes.length - 1));
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToScene(Math.max(activeSceneIndex - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSceneIndex, scenes.length, isMergedModalOpen, isScheduleModalOpen]);

  // Smooth scroll to scene
  const scrollToScene = (index) => {
    const el = document.getElementById(scenes[index]?.id || `scene-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSceneIndex(index);
    }
  };

  const currentScene = scenes[activeSceneIndex] || scenes[0];

  return (
    <div ref={containerRef} className="relative w-full bg-slate-950 font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* 1. FLOATING MINIMAL GLASS NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3.5 sm:py-4 transition-all duration-300 bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => scrollToScene(0)}
            className="flex items-center space-x-2.5 text-left group"
          >
            <img
              src="/logo-icon.png"
              alt="Vedika Brokers"
              className="w-9 h-9 object-contain group-hover:scale-105 transition-transform shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-white font-serif">VEDIKA</span>
                <span className="text-base sm:text-lg font-light tracking-wide text-amber-400">BROKERS</span>
              </div>
              <p className="text-[10px] text-slate-300 font-medium -mt-1 tracking-widest uppercase">
                Architectural Showcase
              </p>
            </div>
          </button>

          {/* Quick Scene Jump Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {scenes.slice(0, 8).map((sc, idx) => (
              <button
                key={sc.id}
                onClick={() => scrollToScene(idx)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                  activeSceneIndex === idx
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {sc.navLabel}
              </button>
            ))}
            <button
              onClick={() => scrollToScene(scenes.length - 1)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                activeSceneIndex === scenes.length - 1
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMergedModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs backdrop-blur-md transition"
              title="Watch full 24s walkthrough movie"
            >
              <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Full Movie (24s)</span>
            </button>

            <a
              href="tel:+919370148697"
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-400/20 hover:scale-105 active:scale-95 transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Swapnil:</span>
              <span>+91 93701 48697</span>
            </a>

            <button
              onClick={() => setIsGlobalMuted(!isGlobalMuted)}
              className="p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/15 text-white transition backdrop-blur-md"
              title={isGlobalMuted ? 'Unmute tour audio' : 'Mute tour audio'}
            >
              {isGlobalMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* 2. VERTICAL PROGRESS DOTS RAIL (RIGHT EDGE) */}
      <div className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-center gap-3 bg-black/35 backdrop-blur-md p-2 rounded-full border border-white/10 shadow-2xl">
        {scenes.map((sc, idx) => {
          const isActive = activeSceneIndex === idx;
          return (
            <button
              key={sc.id}
              onClick={() => scrollToScene(idx)}
              className="group relative flex items-center justify-center p-1 focus:outline-none"
              title={sc.title}
            >
              {/* Dot */}
              <span
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? 'w-3 h-3 bg-amber-400 shadow-lg shadow-amber-400/50 scale-125'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/80 group-hover:scale-125'
                }`}
              />

              {/* Hover Tooltip on Left */}
              <span className="absolute right-full mr-3.5 px-2.5 py-1 rounded-lg bg-black/90 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/15 shadow-xl">
                {sc.navLabel || sc.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. SEQUENCE OF FULL-SCREEN SCENES */}
      <main className="w-full">
        {scenes.map((scene, index) => (
          <TourScene
            key={scene.id}
            id={scene.id}
            index={index}
            total={scenes.length}
            media={scene.media}
            video={scene.video}
            tag={scene.tag}
            title={scene.title}
            subtitle={scene.subtitle}
            description={scene.description}
            specs={scene.specs}
            align={scene.align}
            isGlobalMuted={isGlobalMuted}
            onToggleMute={() => setIsGlobalMuted(!isGlobalMuted)}
            onNextScene={() => scrollToScene(index + 1)}
            onSchedule={() => setIsScheduleModalOpen(true)}
            primaryCta={
              index === 0
                ? {
                    label: 'Start House Tour ↓',
                    icon: <Compass className="w-4 h-4" />,
                    onClick: () => scrollToScene(1),
                  }
                : index === scenes.length - 1
                ? {
                    label: 'Schedule Site Visit',
                    icon: <Calendar className="w-4 h-4" />,
                    onClick: () => setIsScheduleModalOpen(true),
                  }
                : null
            }
            secondaryCta={
              index === scenes.length - 1
                ? {
                    label: 'WhatsApp Swapnil Navghare',
                    icon: <MessageSquare className="w-4 h-4 text-emerald-400" />,
                    onClick: () =>
                      window.open(
                        'https://wa.me/919370148697?text=Hello%20Swapnil%20Navghare,%20I%20am%20interested%20in%20The%20Glass%20Pavilion%20Villa%20showcase.',
                        '_blank'
                      ),
                  }
                : null
            }
          />
        ))}
      </main>

      {/* 4. MERGED CONTINUOUS 24-SECOND MOVIE MODAL */}
      {isMergedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
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

            <div className="relative bg-black aspect-[16/9] w-full flex items-center justify-center overflow-hidden">
              <video
                ref={mergedVideoRef}
                src="/tour/full-tour-merged.mp4"
                autoPlay
                playsInline
                loop
                muted={isGlobalMuted}
                onTimeUpdate={() => {
                  if (mergedVideoRef.current) {
                    setMergedTime(mergedVideoRef.current.currentTime);
                    if (mergedVideoRef.current.duration) setMergedDuration(mergedVideoRef.current.duration);
                  }
                }}
                className="w-full h-full object-contain"
              />
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

            <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 space-y-3">
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
                    { label: 'Pool Terrace', time: 20 },
                  ].map((ch, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (mergedVideoRef.current) {
                          mergedVideoRef.current.currentTime = ch.time;
                          mergedVideoRef.current.play();
                          setIsMergedPlaying(true);
                        }
                      }}
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
                    onClick={() => setIsGlobalMuted(!isGlobalMuted)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition"
                    title={isGlobalMuted ? 'Unmute' : 'Mute'}
                  >
                    {isGlobalMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                  </button>

                  <a
                    href="tel:+919370148697"
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition ml-2"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Broker: Swapnil Navghare</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. SCHEDULE PRIVATE VISIT MODAL */}
      {isScheduleModalOpen && (
        <ScheduleVisitModal
          property={{
            id: 'flagship-villa-showcase',
            title: `The Glass Pavilion Villa (${currentScene.title})`,
            area: 'Zenda Chowk / Chhatrapati Chowk, Nanded',
            broker_name: 'Swapnil Navghare (Vedika Brokers)',
            broker_phone: '+91 93701 48697',
          }}
          onClose={() => setIsScheduleModalOpen(false)}
        />
      )}
    </div>
  );
}
