// src/pages/Static/Privacy.jsx
import React from 'react';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <h1 className="text-3xl font-black font-serif text-slate-900">Privacy & Data Protection Policy</h1>
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <p>At Vedika Brokers, safeguarding our customers' personal data and society owners' privacy is our highest priority.</p>
        <h2 className="text-base font-bold text-slate-900 pt-2">1. Data Collected</h2>
        <p>We collect essential information only: your name, phone number, and email for authentication and scheduling visits. When scanning QR codes, we record anonymous campaign tracking to measure outdoor flyer effectiveness.</p>
        <h2 className="text-base font-bold text-slate-900 pt-2">2. Payment Security</h2>
        <p>Vedika Brokers never stores your credit card numbers, CVVs, or netbanking passwords. All payment transactions are encrypted via bank-grade Razorpay payment gateways and secure banking channels.</p>
        <h2 className="text-base font-bold text-slate-900 pt-2">3. No Sale of User Data</h2>
        <p>We strictly do not sell, rent, or trade your contact information to external advertisers or unsolicited third-party loan telemarketers.</p>
      </div>
    </div>
  );
}
