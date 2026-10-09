import React, { useState, useRef, useEffect } from 'react';
import { getAssetUrl } from '@/utils/assets';
import {
  ChevronDown,
  Sparkles,
  Phone,
  MessageSquare,
  Calendar,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Maximize2,
  CheckCircle2,
  Compass
} from 'lucide-react';

/**
 * Reusable TourScene component.
 * Occupies 100vh / 100dvh full viewport.
 * Media (video or image) acts as the 100% full-screen background.
 * UI and content are layered directly on top.
 */
export default function TourScene({
  id,
  index,
  total,
  media,
  video,
  tag,
  title,
  subtitle,
  description,
  specs = [],
  highlightBadge,
  align = 'left', // 'left' | 'center' | 'right'
  primaryCta,
  secondaryCta,
  onNextScene,
  onSchedule,
  onContactBroker,
  isGlobalMuted = true,
  onToggleMute,
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);

  // Auto-play videos when they come into view
  useEffect(() => {
    if (video && videoRef.current) {
      videoRef.current.muted = isGlobalMuted;
      videoRef.current.play().catch(() => {});
    }
  }, [isGlobalMuted, video]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const alignmentClasses = {
    left: 'items-start text-left max-w-2xl',
    center: 'items-center text-center max-w-3xl mx-auto',
    right: 'items-end text-right max-w-2xl ml-auto',
  }[align] || 'items-start text-left max-w-2xl';

  return (
    <section
      id={id || `scene-${index}`}
      data-scene-index={index}
      className="relative w-full h-screen min-h-[640px] max-h-screen overflow-hidden flex flex-col justify-between text-white snap-start shrink-0 select-none"
    >
      {/* 1. FULL-SCREEN BACKGROUND MEDIA (IMAGE OR VIDEO) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        {video ? (
          <video
            ref={videoRef}
            src={getAssetUrl(video)}
            poster={getAssetUrl(media)}
            autoPlay
            loop
            muted={isGlobalMuted}
            playsInline
            onLoadedData={() => setIsLoaded(true)}
            className={`w-full h-full object-cover object-center transition-transform duration-1000 brightness-110 ${
              isLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-90'
            }`}
          />
        ) : (
          <img
            src={getAssetUrl(media)}
            alt={title}
            loading={index < 2 ? 'eager' : 'lazy'}
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover object-center transition-transform duration-1000 brightness-105 ${
              isLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-90'
            }`}
          />
        )}

        {/* 2. SUBTLE CINEMATIC GRADIENT OVERLAY (Guarantees text readability without hiding the home) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/25 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/15 pointer-events-none" />
      </div>

      {/* 3. TOP SCENE HUD (Scene numbering & optional controls) */}
      <div className="relative z-10 px-6 sm:px-12 lg:px-16 pt-24 sm:pt-28 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-amber-400 font-mono text-xs font-bold tracking-wider">
            SCENE {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          {tag && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-slate-300 text-xs font-medium tracking-widest uppercase">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {tag}
            </span>
          )}
        </div>

        {/* Video Audio & Play toggle if current scene has video */}
        {video && (
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMute}
              className="p-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white transition hover:scale-105"
              title={isGlobalMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isGlobalMuted ? (
                <VolumeX className="w-4 h-4 text-slate-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-amber-400" />
              )}
            </button>
            <button
              onClick={togglePlay}
              className="p-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white transition hover:scale-105"
              title={isPlaying ? 'Pause Motion' : 'Play Motion'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        )}
      </div>

      {/* 4. MAIN SCENE CONTENT OVERLAY */}
      <div className="relative z-10 px-6 sm:px-12 lg:px-16 py-6 my-auto pointer-events-auto">
        <div className={`flex flex-col ${alignmentClasses} space-y-4 sm:space-y-6`}>
          {/* Subtitle / Badge */}
          {subtitle && (
            <div className="inline-flex items-center gap-2">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-400 drop-shadow-md">
                {subtitle}
              </p>
            </div>
          )}

          {/* Main Title */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-serif tracking-tight text-white leading-[1.1] drop-shadow-lg">
            {title}
          </h2>

          {/* Description */}
          {description && (
            <p className="text-sm sm:text-base lg:text-lg text-slate-200 font-light leading-relaxed drop-shadow-md max-w-xl">
              {description}
            </p>
          )}

          {/* Architectural Specs Chips */}
          {specs && specs.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {specs.map((spec, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl bg-black/45 backdrop-blur-md border border-white/15 text-xs text-slate-100 font-medium tracking-wide shadow-sm"
                >
                  {spec}
                </span>
              ))}
            </div>
          )}

          {/* Interactive CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            {primaryCta ? (
              <button
                onClick={primaryCta.onClick}
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-400/20 hover:scale-105 active:scale-95 transition flex items-center gap-2"
              >
                {primaryCta.icon}
                <span>{primaryCta.label}</span>
              </button>
            ) : (
              <button
                onClick={onSchedule}
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-400/20 hover:scale-105 active:scale-95 transition flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Private Viewing</span>
              </button>
            )}

            {secondaryCta ? (
              <button
                onClick={secondaryCta.onClick}
                className="px-5 py-3 rounded-2xl bg-black/50 hover:bg-black/75 backdrop-blur-md border border-white/25 text-white font-bold text-xs sm:text-sm hover:border-white/50 transition flex items-center gap-2"
              >
                {secondaryCta.icon}
                <span>{secondaryCta.label}</span>
              </button>
            ) : (
              <a
                href="tel:+919370148697"
                className="px-5 py-3 rounded-2xl bg-black/50 hover:bg-black/75 backdrop-blur-md border border-white/25 text-white font-bold text-xs sm:text-sm hover:border-white/50 transition flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call Swapnil Navghare: +91 93701 48697</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 5. BOTTOM HUD: SCROLL DOWN INDICATOR */}
      <div className="relative z-10 px-6 sm:px-12 lg:px-16 pb-6 sm:pb-8 flex items-end justify-between pointer-events-auto">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>VEDIKA BROKERS</span>
        </div>

        {index < total - 1 ? (
          <button
            onClick={onNextScene}
            className="group flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-amber-400 transition"
          >
            <span className="tracking-widest uppercase text-[11px]">Next Room</span>
            <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:translate-y-0.5 transition">
              <ChevronDown className="w-4 h-4 text-amber-400 animate-bounce" />
            </div>
          </button>
        ) : (
          <button
            onClick={() => {
              const first = document.getElementById('scene-0');
              first?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
          >
            <span>Back to Beginning ↑</span>
          </button>
        )}
      </div>
    </section>
  );
}
