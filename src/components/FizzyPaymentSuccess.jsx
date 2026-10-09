// src/components/FizzyPaymentSuccess.jsx
import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  ExternalLink,
  X 
} from 'lucide-react';

export default function FizzyPaymentSuccess({ 
  property, 
  paymentDetails, 
  onClose, 
  onViewProperty 
}) {
  useEffect(() => {
    // Elegant celebratory confetti burst on mount
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#3b82f6', '#38bdf8']
      });
    } catch (_) {}
  }, []);

  const paymentId = paymentDetails?.razorpay_payment_id || `PAY_${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="bg-slate-900 rounded-3xl p-5 sm:p-7 max-w-lg w-full mx-auto relative overflow-hidden shadow-2xl border border-slate-700/80 text-white animate-in zoom-in-95 duration-200">
      {/* Top Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-20 cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Success Icon & Header */}
      <div className="text-center pt-2 pb-1">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
          Payment Successful
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Address unlocked & verified broker desk connected
        </p>
      </div>

      {/* Transaction & Amount Receipt Pill */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs my-3.5">
        <div className="text-left">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Transaction ID</span>
          <span className="font-mono text-cyan-400 font-bold text-xs truncate max-w-[170px] sm:max-w-[220px] block">
            {paymentId}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Amount Paid</span>
          <span className="font-serif font-black text-emerald-400 text-sm">₹1,000.00</span>
        </div>
      </div>

      {/* Unlocked Property Address Card */}
      {property && (
        <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-4 text-left space-y-2.5 shadow-md">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Complete Address Unlocked
            </span>
            <span className="text-[11px] font-mono text-slate-400 font-semibold">
              {property.property_code}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
            {property.title}
          </h3>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
            <div className="flex items-start gap-2 text-slate-100 font-semibold">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span className="leading-snug">
                {property.address || `${property.locality || property.area}, Nanded - 431602`}
              </span>
            </div>
            {property.landmark && (
              <div className="text-[11px] text-slate-400 pl-6">
                Landmark: {property.landmark}
              </div>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.title} ${property.address || property.area} Nanded Maharashtra`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow active:scale-[0.98]"
            >
              <MapPin className="w-3.5 h-3.5" /> Google Maps
            </a>

            <a
              href="tel:+919370148697"
              className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow active:scale-[0.98]"
            >
              <Phone className="w-3.5 h-3.5" /> Call Broker
            </a>
          </div>

          {onViewProperty && (
            <button
              type="button"
              onClick={onViewProperty}
              className="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1 border border-white/10 mt-1"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Full Property Details
            </button>
          )}
        </div>
      )}

      {/* Done / Continue Button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition shadow-lg mt-3 active:scale-[0.99] cursor-pointer"
        >
          Done • Continue Browsing
        </button>
      )}
    </div>
  );
}
