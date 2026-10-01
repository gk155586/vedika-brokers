// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, MapPin, Shield, CheckCircle2, MessageSquare } from 'lucide-react';
import dataStore from '@/services/dataStore';

export default function Footer() {
  const settings = dataStore.getSettings();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Identity */}
          <div>
            <div className="mb-4">
              <Link
                to="/"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-block group"
                title="Vedika Brokers - Home"
              >
                <img
                  src="/logo-white.png"
                  alt="Vedika Brokers"
                  className="h-14 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </Link>
            </div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Trusted tech-enabled property brokerage. We connect home-seekers with verified flats across Zenda Chowk, Chhatrapati Chowk, Vazirabad, and prime localities.
            </p>
            <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs space-y-1.5 shadow-inner">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Shield className="w-4 h-4 text-amber-400 shrink-0" /> Authorized Broker Desk
              </div>
              <p className="text-slate-300">
                Swapnil Navghare • Direct:{' '}
                <a href="tel:+919370148697" className="text-amber-400 font-bold hover:underline">
                  +91 93701 48697
                </a>
              </p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Quick Browse Localities</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/rent?area=Zenda%20Chowk" className="hover:text-amber-400 transition flex items-center gap-1.5 text-slate-300">
                  <span className="text-slate-500 text-xs">›</span> Flats for Rent in Zenda Chowk
                </Link>
              </li>
              <li>
                <Link to="/rent?area=Chhatrapati%20Chowk" className="hover:text-amber-400 transition flex items-center gap-1.5 text-slate-300">
                  <span className="text-slate-500 text-xs">›</span> Flats for Rent in Chhatrapati Chowk
                </Link>
              </li>
              <li>
                <Link to="/buy?area=Vazirabad" className="hover:text-amber-400 transition flex items-center gap-1.5 text-slate-300">
                  <span className="text-slate-500 text-xs">›</span> Flats for Sale in Vazirabad
                </Link>
              </li>
              <li>
                <Link to="/buy?area=Taroda%20Naka" className="hover:text-amber-400 transition flex items-center gap-1.5 text-slate-300">
                  <span className="text-slate-500 text-xs">›</span> Properties in Taroda Naka
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-amber-400 transition flex items-center gap-1.5 text-slate-300">
                  <span className="text-slate-500 text-xs">›</span> Compare Selected Properties
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Support & Terms</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/how-it-works" className="hover:text-amber-400 transition flex items-center gap-1.5 text-slate-300">
                  <span className="text-slate-500 text-xs">›</span> How Vedika Brokers Works
                </Link>
              </li>
              <li>
                <Link to="/#faqs" className="hover:text-amber-400 transition flex items-center gap-1.5 text-slate-300">
                  <span className="text-slate-500 text-xs">›</span> Frequently Asked Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-amber-400 transition flex items-center gap-1.5 text-slate-300">
                  <span className="text-slate-500 text-xs">›</span> Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-amber-400 transition flex items-center gap-1.5 text-slate-300">
                  <span className="text-slate-500 text-xs">›</span> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-amber-400 transition flex items-center gap-1.5 text-slate-300">
                  <span className="text-slate-500 text-xs">›</span> ₹500 Refund Policy Guarantee
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition flex items-center gap-1.5 text-slate-300">
                  <span className="text-slate-500 text-xs">›</span> File a Support Ticket
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Head Office</h3>
            <div className="space-y-3.5 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  {settings.office_address || 'Office 304, Vedika Tower, Near Zenda Chowk, Vazirabad, Nanded, Maharashtra - 431601'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${settings.phone || '+919370148697'}`} className="hover:text-amber-400 transition font-medium">
                  {settings.phone || '+91 93701 48697'}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href={`https://wa.me/${settings.whatsapp || '919370148697'}?text=Hello%20Swapnil%20Navghare,%20I%20am%20looking%20for%20property%20assistance%20in%20Nanded.`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:text-emerald-400 transition font-medium"
                >
                  WhatsApp Support
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`mailto:${settings.email || 'contact@vedikabrokers.com'}`} className="hover:text-blue-400 transition font-medium">
                  {settings.email || 'contact@vedikabrokers.com'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Vedika Brokers. All rights reserved. Registered Real Estate Brokerage.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> RERA Verified Broker</span>
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-blue-400" /> 100% Encrypted Transactions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
