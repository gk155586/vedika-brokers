// src/components/QRWelcomeBanner.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QrCode, MapPin, X, Sparkles } from 'lucide-react';
import dataStore from '@/services/dataStore';

export default function QRWelcomeBanner() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sourceCode = searchParams.get('source');
  const [campaign, setCampaign] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sourceCode) {
      dataStore.recordQRScan(sourceCode).then((camp) => {
        if (camp) {
          setCampaign(camp);
          setVisible(true);
        } else {
          setCampaign({
            code: sourceCode,
            name: `Direct QR Scan (${sourceCode})`,
            location: 'Street Poster / Wall QR',
          });
          setVisible(true);
        }
      });
    }
  }, [sourceCode]);

  if (!visible || !campaign) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 px-4 py-3 shadow-md border-b border-amber-600 relative z-30 animate-in slide-in-from-top duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold uppercase tracking-wide">QR Code Verified:</span>{' '}
            <span>{campaign.name}</span>{' '}
            <span className="inline-flex items-center gap-1 bg-slate-900/10 px-2 py-0.5 rounded-full text-xs font-medium">
              <MapPin className="w-3 h-3" /> {campaign.location}
            </span>
          </div>
        </div>

        <button
          onClick={() => setVisible(false)}
          className="p-1 rounded-full hover:bg-slate-900/10 text-slate-900 transition shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
