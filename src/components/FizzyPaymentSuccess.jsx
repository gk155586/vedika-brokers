// src/components/FizzyPaymentSuccess.jsx
import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowDown, 
  Check, 
  MapPin, 
  ExternalLink, 
  Phone, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles,
  X
} from 'lucide-react';
import '@/styles/fizzy-button.scss';

export default function FizzyPaymentSuccess({ 
  property, 
  paymentDetails, 
  onClose, 
  onViewProperty 
}) {
  const [isChecked, setIsChecked] = useState(false);
  const [showAddressCard, setShowAddressCard] = useState(false);

  useEffect(() => {
    // Trigger the fizzy sequence on mount
    const triggerTimer = setTimeout(() => {
      setIsChecked(true);
    }, 80);

    // After animation reaches tick (~3.8s), trigger celebratory confetti & show address details
    const confettiTimer = setTimeout(() => {
      setShowAddressCard(true);
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#00C4FF', '#00C1FC', '#fbbf24', '#34d399', '#f43f5e']
        });
      } catch (e) {
        // ignore
      }
    }, 3800);

    return () => {
      clearTimeout(triggerTimer);
      clearTimeout(confettiTimer);
    };
  }, []);

  const handleReplay = () => {
    setIsChecked(false);
    setTimeout(() => {
      setIsChecked(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.5 },
          colors: ['#00C4FF', '#38bdf8', '#fbbf24', '#f43f5e']
        });
      } catch (e) {}
    }, 150);
  };

  const paymentId = paymentDetails?.razorpay_payment_id || `PAY_${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="fizzy-payment-container bg-[#2C3940] rounded-3xl p-6 sm:p-8 max-w-lg w-full mx-auto relative overflow-hidden shadow-2xl border border-white/10 text-white">
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-20"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Main Fizzy Button Component */}
      <div className="button relative my-2">
        <h1 className="tracking-widest">Payment Successful</h1>
        <h2>With verified address & broker line</h2>

        <input 
          id="fizzy-payment-checkbox" 
          type="checkbox" 
          checked={isChecked} 
          onChange={(e) => setIsChecked(e.target.checked)} 
        />

        <label htmlFor="fizzy-payment-checkbox" className="cursor-pointer" title="Click to toggle fizzy particles">
          <div className="button_inner q">
            <i className="l" aria-hidden="true">
              <ArrowDown className="w-5 h-5" />
            </i>
            <span className="t">Payment Complete</span>
            <span>
              <i className="tick" aria-hidden="true">
                <Check className="w-6 h-6 stroke-[3]" />
              </i>
            </span>
            <div className="b_l_quad">
              {Array.from({ length: 52 }).map((_, i) => (
                <div key={i} className="button_spots" />
              ))}
            </div>
          </div>
        </label>
      </div>

      {/* Replay action */}
      <div className="flex items-center justify-center gap-3 mt-1 mb-4">
        <button
          type="button"
          onClick={handleReplay}
          className="inline-flex items-center gap-1.5 text-xs text-cyan-300 hover:text-white bg-white/5 hover:bg-white/15 px-3 py-1.5 rounded-full transition border border-cyan-400/20 shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Replay Fizzy Particle Effect
        </button>
      </div>

      {/* Payment details & Unlocked Address Details */}
      <div className={`space-y-4 w-full transition-all duration-500 ${showAddressCard ? 'opacity-100 translate-y-0' : 'opacity-90 translate-y-1'}`}>
        {/* Transaction Badge */}
        <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-3.5 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Transaction Verified</span>
            <span className="font-mono text-cyan-400 font-bold text-xs truncate max-w-[200px] block">
              {paymentId}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Amount Paid</span>
            <span className="font-serif font-black text-emerald-400 text-sm">₹1,000.00</span>
          </div>
        </div>

        {/* Unlocked Property Address Card */}
        {property && (
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-left space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Address Unlocked
              </span>
              <span className="text-[10px] font-mono text-slate-300">
                {property.property_code}
              </span>
            </div>

            <h3 className="text-sm font-bold text-white truncate">
              {property.title}
            </h3>

            <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5 text-xs space-y-1 text-slate-200">
              <div className="flex items-start gap-1.5 font-semibold text-emerald-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {property.address || `${property.locality || property.area}, Near Main Landmark, Nanded - 431602`}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 pl-5">
                Landmark: {property.landmark || `${property.area} Market Circle, Nanded`}
              </div>
            </div>

            {/* Quick Contact & Navigation Shortcuts */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.title} ${property.address || property.area} Nanded Maharashtra`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[130px] px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow"
              >
                <MapPin className="w-3.5 h-3.5" /> Open Google Map
              </a>

              <a
                href="tel:919422170321"
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow"
              >
                <Phone className="w-3.5 h-3.5" /> Call Broker
              </a>

              {onViewProperty && (
                <button
                  type="button"
                  onClick={onViewProperty}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Listing
                </button>
              )}
            </div>
          </div>
        )}

        {/* Dismiss / Done Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold rounded-2xl text-xs uppercase tracking-wider transition shadow-lg"
          >
            Done • Access Listing Now
          </button>
        )}
      </div>
    </div>
  );
}
