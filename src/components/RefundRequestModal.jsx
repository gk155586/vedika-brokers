// src/components/RefundRequestModal.jsx
import React, { useState } from 'react';
import { X, RefreshCw, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import dataStore from '@/services/dataStore';
import { useAuth } from '@/hooks/useAuth';

export default function RefundRequestModal({ property, isOpen, onClose, onRequested }) {
  const { user } = useAuth();
  const [reason, setReason] = useState('Property did not match expectation upon visit');
  const [upiId, setUpiId] = useState('');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !property) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!upiId) {
      alert('Please provide your UPI ID for refund crediting.');
      return;
    }
    setLoading(true);
    await dataStore.requestRefund(
      user?.id || 'guest',
      property.id,
      `${reason} - ${comments}`,
      upiId
    );
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onRequested && onRequested();
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <RefreshCw className="w-4 h-4" /> Policy Guarantee
          </div>
          <h2 className="text-lg font-bold">Request ₹500 Post-Visit Refund</h2>
          <p className="text-xs text-slate-300 truncate">{property.title}</p>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Refund Request Lodged</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your refund request for <strong>₹500</strong> has been recorded under reference #REF-{Date.now().toString().slice(-6)}. Our billing team verifies visits within 24 hours and credits the amount to your UPI ID: <strong>{upiId}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
              <span>
                Vedika Brokers promises a ₹500 refund from your original ₹1,000 unlock fee if you inspect the flat and decide not to close the deal.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Not Proceeding</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-none"
              >
                <option value="Property did not match expectation upon visit">Property did not match expectation upon visit</option>
                <option value="Already rented/booked by another tenant">Already rented/booked by another tenant</option>
                <option value="Rent/Price exceeded my final budget">Rent/Price exceeded my final budget</option>
                <option value="Society restrictions or pet policy issue">Society restrictions or pet policy issue</option>
                <option value="Decided to rent/buy in another area">Decided to rent/buy in another area</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Receiving UPI ID / VPA</label>
              <input
                type="text"
                required
                placeholder="Enter your UPI ID (e.g. name@upi)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-none font-mono"
              />
              <p className="text-[10px] text-slate-500 mt-1">₹500 will be credited directly to this UPI address.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Feedback (Optional)</label>
              <textarea
                rows={2}
                placeholder="Tell us what could be improved..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl shadow transition text-xs disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit ₹500 Refund Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
