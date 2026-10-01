// src/pages/Static/Terms.jsx
import React from 'react';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <h1 className="text-3xl font-black font-serif text-slate-900">Terms and Conditions of Service</h1>
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <p>Welcome to Vedika Brokers. By accessing our website, scanning our physical QR codes, or paying for property address unlocks, you agree to comply with and be bound by the following terms.</p>
        <h2 className="text-base font-bold text-slate-900 pt-2">1. Scope of Brokerage Services</h2>
        <p>Vedika Brokers acts as a technology-enabled property intermediary facilitating real estate discoveries for rental and sales across Maharashtra. While we verify property documents and availability with owners, physical condition inspections remain the responsibility of the tenant or purchaser.</p>
        <h2 className="text-base font-bold text-slate-900 pt-2">2. Information Unlocking & Security</h2>
        <p>Users agree not to share, scrape, or publish unlocked exact addresses. Unauthorized distribution of society premises details may lead to immediate termination of service and blacklisting from our broker network.</p>
        <h2 className="text-base font-bold text-slate-900 pt-2">3. Dispute Jurisdiction</h2>
        <p>All legal disputes relating to services or payment transactions fall under the exclusive jurisdiction of the competent courts in Nanded, Maharashtra, India.</p>
      </div>
    </div>
  );
}
