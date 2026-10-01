// src/pages/Static/HowItWorks.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Search, Key, ShieldCheck, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Transparent Real Estate
        </span>
        <h1 className="text-3xl sm:text-5xl font-black font-serif text-slate-900">
          How Vedika Brokers Works
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          We bring complete transparency to property searching in Nanded with verified listings and a fair viewing-guarantee refund model.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-900 text-amber-400 flex items-center justify-center font-black text-xl">
            1
          </div>
          <h2 className="text-xl font-bold text-slate-900">Scan QR Code on Physical Location</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Spot a Vedika Brokers QR code on society notice boards, street banners, or brochures across Zenda Chowk, Chhatrapati Chowk, Vazirabad, and Shivaji Nagar. Scanning instantly filters listings available within walking distance.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-900 text-amber-400 flex items-center justify-center font-black text-xl">
            2
          </div>
          <h2 className="text-xl font-bold text-slate-900">Explore Photos & Broker Info</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Check high-definition photos, carpet area, furnishing, and society rules. You can also directly call or WhatsApp our assigned broker desk before making any payment.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl">
            3
          </div>
          <h2 className="text-xl font-bold text-slate-900">Unlock Exact Address for ₹1,000</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To prevent overcrowding and respect society residents' security, the exact wing, flat number, and Google Maps pin are released via a ₹1,000 address unlock fee.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl">
            4
          </div>
          <h2 className="text-xl font-bold text-slate-900">₹500 Post-Visit Refund Guarantee</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Visit the property at your scheduled time. If you decide not to proceed, simply submit a refund request from your dashboard. ₹500 is credited directly to your bank UPI ID within 24 hours.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black font-serif">Ready to Discover Verified Homes?</h2>
        <div className="flex justify-center gap-4">
          <Link
            to="/rent"
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm transition flex items-center gap-2"
          >
            <span>Browse Rentals</span> <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/buy"
            className="bg-white hover:bg-slate-100 text-blue-950 font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm transition flex items-center gap-2"
          >
            <span>Explore Properties to Buy</span> <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
