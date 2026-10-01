// src/pages/Static/RefundPolicy.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import dataStore from '@/services/dataStore';

export default function RefundPolicy() {
  const settings = dataStore.getSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider border border-amber-200">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
          Consumer Transparency Policy
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 tracking-tight">
          Payment Terms & ₹500 Refund Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl mx-auto">
          Last updated: September 2026 • Simple, transparent rules for address unlock fees and our inspection refund guarantee.
        </p>
      </div>

      {/* 3-Step Visual Process */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-900 text-amber-400 font-black text-sm flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base font-serif">
              ₹1,000 Unlock Fee
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pay once to instantly reveal the complete building address, flat number, Google Maps pin, society gate location, and broker inspection contact.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-blue-900">
            <CreditCard className="w-3.5 h-3.5 text-amber-500" /> Instant Address Access
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base font-serif">
              Inspect in Person
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Visit and physically evaluate the property with our authorized broker desk. If you decide not to rent or purchase it, you are eligible for a ₹500 refund.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-amber-900">
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" /> ₹500 Refund Guarantee
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base font-serif">
              Direct UPI Payout
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Submit your refund request from your account within 7 days. Once verified, ₹500 is sent directly to your UPI ID within 24–48 business hours.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
            <Clock className="w-3.5 h-3.5 text-emerald-600" /> 24–48 Hours Settlement
          </div>
        </div>
      </div>

      {/* Eligibility vs Non-Eligibility (Concise Side-by-Side Comparison) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Eligible */}
        <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm sm:text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Eligible for ₹500 Refund</span>
          </div>
          <p className="text-xs text-emerald-900/90 font-medium">
            Satisfy all conditions below to receive your ₹500 refund:
          </p>
          <ul className="space-y-2 text-xs text-emerald-950">
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">✓</span>
              <span>₹1,000 Address Access Fee paid via Vedika Brokers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">✓</span>
              <span>You inspected the property or coordinated with our broker.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">✓</span>
              <span>You decided <strong>not</strong> to proceed with renting or buying that unit.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">✓</span>
              <span>Claim submitted through your account within <strong>7 days</strong> of unlock.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-700 font-bold">✓</span>
              <span>Valid UPI ID provided for disbursement.</span>
            </li>
          </ul>
        </div>

        {/* Not Eligible */}
        <div className="bg-rose-50/60 border border-rose-200/90 rounded-2xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 text-rose-950 font-bold text-sm sm:text-base">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>When Refund Does Not Apply</span>
          </div>
          <p className="text-xs text-rose-900/90 font-medium">
            The ₹500 refund will not be approved under these scenarios:
          </p>
          <ul className="space-y-2 text-xs text-rose-950">
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✕</span>
              <span>You decide to rent or buy the property and execute an agreement.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✕</span>
              <span>The property transaction is completed successfully.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✕</span>
              <span>The refund claim is submitted after the 7-day eligibility window.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✕</span>
              <span>The transaction has already been refunded or is under chargeback dispute.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✕</span>
              <span>Fraudulent, abusive, or duplicate refund requests.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* How to Claim & Quick Support Desk */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Ready to submit or check your refund status?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Login to your account and click "Request ₹500 Refund" beside any eligible unlocked listing.
            </p>
          </div>
          <Link
            to="/account"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow transition shrink-0"
          >
            <span>Open My Account</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </Link>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Broker Desk</span>
            <div className="font-bold text-slate-900">Swapnil Navghare</div>
            <a href="tel:+919370148697" className="text-blue-900 hover:underline font-semibold block mt-0.5">
              +91 93701 48697
            </a>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Email Support</span>
            <div className="font-bold text-slate-900">Consumer Policy Team</div>
            <a href="mailto:contact@vedikabrokers.com" className="text-blue-900 hover:underline font-semibold block mt-0.5">
              contact@vedikabrokers.com
            </a>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Head Office</span>
            <div className="font-bold text-slate-900">Vedika Brokers</div>
            <p className="text-slate-600 text-[11px] leading-tight mt-0.5">
              304, Vedika Tower, Near Zenda Chowk, Vazirabad, Nanded
            </p>
          </div>
        </div>

        {/* Important Disclaimer Note */}
        <p className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
          <strong>Important Notice:</strong> The ₹1,000 Address Access Fee is charged for restricted property location access and inspection assistance. The ₹500 refund is strictly available upon meeting the policy conditions above. Paying this fee does not guarantee property availability or lease/purchase completion, as properties remain subject to owner decisions and market changes.
        </p>
      </div>
    </div>
  );
}
