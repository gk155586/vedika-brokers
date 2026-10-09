// src/components/RefundRequestModal.jsx
import React, { useState, useEffect } from 'react';
import { X, RefreshCw, AlertCircle, CheckCircle2, Shield, Clock, XCircle } from 'lucide-react';
import dataStore from '@/services/dataStore';
import { useAuth } from '@/hooks/useAuth';

export default function RefundRequestModal({ property, isOpen, onClose, onRequested }) {
  const { user } = useAuth();
  const [reason, setReason] = useState('Property did not match expectation upon visit');
  const [upiId, setUpiId] = useState('');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingRefund, setExistingRefund] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      setError('');
      setSubmitted(false);

      if (user?.id && property?.id) {
        dataStore.getRefundForProperty(user.id, property.id).then((ref) => {
          setExistingRefund(ref || null);
        });
      } else {
        setExistingRefund(null);
      }

      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen, property, user]);

  if (!isOpen || !property) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || user.id === 'guest') {
      setError('Please log in to submit a refund request.');
      return;
    }
    if (!upiId || !upiId.trim()) {
      setError('Please provide your receiving UPI ID / VPA.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await dataStore.requestRefund(
        user.id,
        property.id,
        `${reason}${comments ? ` - ${comments}` : ''}`,
        upiId.trim()
      );
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onRequested && onRequested();
        onClose();
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Unable to submit refund request.');
    }
  };

  const isPaid = ['processed', 'paid', 'approved', 'refunded'].includes(existingRefund?.status);
  const isRejected = existingRefund?.status === 'rejected';
  const isPending = existingRefund?.status === 'pending';

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in overflow-y-auto overscroll-contain"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92dvh] sm:max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <RefreshCw className="w-4 h-4" /> Policy Guarantee
          </div>
          <h2 className="text-lg font-bold">
            {existingRefund ? 'Refund Request Status' : 'Request ₹500 Post-Visit Refund'}
          </h2>
          <p className="text-xs text-slate-300 truncate">{property.title}</p>
        </div>

        {/* Existing Refund Already Filed (Prevent re-request) */}
        {existingRefund ? (
          <div className="p-6 space-y-4 overflow-y-auto flex-1 scrollbar-thin">
            {isPending && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <Clock className="w-5 h-5 text-amber-600 animate-pulse" />
                  <span>Refund Under Review</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  A refund request for <strong>₹{existingRefund.amount || 500}</strong> was lodged under reference{' '}
                  <span className="font-mono font-bold">#{existingRefund.id}</span>. Our billing team verifies site visits
                  within 24 hours. Multiple submissions for the same unlocked property are disabled.
                </p>
                <div className="bg-white/80 rounded-xl p-3 text-xs space-y-1 font-mono text-slate-700">
                  <div>Receiving UPI: <strong>{existingRefund.user_upi_id}</strong></div>
                  <div>Claimed On: {new Date(existingRefund.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            )}

            {isPaid && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>₹500 Refund Processed & Paid</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  The ₹500 refund for this address unlock has been successfully settled and paid. Further refund requests
                  for this property are closed.
                </p>
                <div className="bg-white/80 rounded-xl p-3 text-xs space-y-1 font-mono text-slate-700">
                  <div>Reference: <strong>#{existingRefund.id}</strong></div>
                  <div>Receiving UPI: <strong>{existingRefund.user_upi_id}</strong></div>
                  <div>Status: <strong className="text-emerald-700 uppercase">Settled</strong></div>
                </div>
              </div>
            )}

            {isRejected && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span>Refund Request Rejected</span>
                </div>
                <p className="text-xs text-red-800 leading-relaxed">
                  This refund request was previously evaluated and rejected by the admin.
                  {existingRefund.admin_notes && (
                    <span className="block mt-1 font-medium bg-red-100/60 p-2 rounded-lg text-red-950">
                      Admin remark: {existingRefund.admin_notes}
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-red-700">
                  Per policy terms, repeated submissions with alternate transaction IDs are not permitted. If you have questions, please contact desk support directly.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl shadow transition text-xs"
            >
              Close
            </button>
          </div>
        ) : submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Refund Request Lodged</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your refund request for <strong>₹500</strong> has been recorded. Our billing team verifies visits within 24 hours
              and credits the amount directly to your UPI ID: <strong>{upiId}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 scrollbar-thin touch-pan-y">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
              <span>
                Vedika Brokers promises a ₹500 refund from your original ₹1,000 unlock fee if you inspect the flat and decide
                not to close the deal.
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
              <p className="text-[10px] text-slate-500 mt-1">₹500 will be credited directly to this verified UPI address.</p>
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
