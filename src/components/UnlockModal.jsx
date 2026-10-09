// src/components/UnlockModal.jsx
import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Building, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  ArrowRight,
  Sparkles,
  Smartphone
} from 'lucide-react';
import dataStore from '@/services/dataStore';
import { useAuth } from '@/hooks/useAuth';
import FizzyPaymentSuccess from '@/components/FizzyPaymentSuccess';
import { getAssetUrl } from '@/utils/assets';

export default function UnlockModal({ property, isOpen, onClose, onUnlocked }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('razorpay'); // 'razorpay' or 'bank'
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [paymentSuccessData, setPaymentSuccessData] = useState(null);

  React.useEffect(() => {
    if (!isOpen) {
      setPaymentSuccessData(null);
      setLoading(false);
    } else {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !property) return null;

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleRazorpayPayment = async () => {
    if (!agreeTerms) {
      alert('Please agree to the service and refund terms to proceed.');
      return;
    }
    setLoading(true);

    try {
      // Check if window.Razorpay SDK is available
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (window.Razorpay && razorpayKey && razorpayKey !== 'YOUR_RAZORPAY_KEY_ID') {
        const options = {
          key: razorpayKey,
          amount: 1000 * 100, // 1000 INR in paise
          currency: 'INR',
          name: 'VEDIKA BROKERS',
          description: `Unlock exact address for ${property.title}`,
          image: getAssetUrl('/logo.svg'),
          handler: async function (response) {
            const payData = {
              method: 'razorpay',
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
            };
            await dataStore.unlockAddress(user?.id || 'guest', property.id, payData);
            triggerCelebration();
            if (onUnlocked) onUnlocked();
            setPaymentSuccessData(payData);
            setLoading(false);
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: user?.phone || '',
          },
          theme: {
            color: '#1e3a8a',
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Instant simulated checkout for testing and presentation
        setTimeout(async () => {
          const payData = {
            method: 'razorpay_demo',
            razorpay_payment_id: `PAY_DEMO_${Date.now().toString(36).toUpperCase()}`,
          };
          await dataStore.unlockAddress(user?.id || 'guest', property.id, payData);
          triggerCelebration();
          if (onUnlocked) onUnlocked();
          setPaymentSuccessData(payData);
          setLoading(false);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      alert('Unable to initialize payment gateway. Please try again.');
      setLoading(false);
    }
  };

  // When payment is successful, show the Fizzy CSS Button Payment Successful component
  if (paymentSuccessData) {
    return (
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setPaymentSuccessData(null);
            onClose();
          }
        }}
      >
        <div className="w-full max-w-lg my-auto max-h-[92dvh] overflow-y-auto">
          <FizzyPaymentSuccess
            property={property}
            paymentDetails={paymentSuccessData}
            onClose={() => {
              setPaymentSuccessData(null);
              onClose();
            }}
            onViewProperty={() => {
              setPaymentSuccessData(null);
              onClose();
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto overscroll-contain"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[90dvh] sm:max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-4 sm:p-6 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <img src={getAssetUrl('/logo-icon.png')} alt="Vedika" className="w-4 h-4 object-contain" />
            <span>Secure Address Unlock</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-serif line-clamp-2">{property.title}</h2>
          <p className="text-xs text-blue-200 mt-1">Property Code: {property.property_code}</p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('razorpay')}
            className={`flex-1 py-3 px-3 sm:px-4 flex items-center justify-center gap-1.5 sm:gap-2 transition ${
              activeTab === 'razorpay'
                ? 'bg-white text-blue-900 border-b-2 border-blue-900 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4 text-blue-700" /> Razorpay / Online
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('bank')}
            className={`flex-1 py-3 px-3 sm:px-4 flex items-center justify-center gap-1.5 sm:gap-2 transition relative ${
              activeTab === 'bank'
                ? 'bg-white text-blue-900 border-b-2 border-blue-900 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building className="w-4 h-4 text-slate-500" /> Direct Bank UPI
            <span className="text-[9px] sm:text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full ml-1">
              Soon
            </span>
          </button>
        </div>

        {/* Modal Body - Scrollable Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 scrollbar-thin space-y-4 touch-pan-y">
          {activeTab === 'razorpay' ? (
            <div className="space-y-4">
              {/* Fee Breakdown Card */}
              <div className="bg-blue-50/60 border border-blue-200/60 rounded-2xl p-3.5 sm:p-4">
                <div className="flex justify-between items-center pb-2.5 border-b border-blue-200/50">
                  <span className="text-xs sm:text-sm font-medium text-slate-700">Address & Broker Connect Fee</span>
                  <span className="text-base sm:text-lg font-black text-blue-950 font-serif">₹1,000</span>
                </div>
                
                <div className="pt-2.5 flex items-start gap-2 text-xs text-blue-900 leading-relaxed">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">₹500 Viewing Guarantee:</strong> If you visit this property and decide not to rent/buy, you can request an instant ₹500 refund from your account dashboard.
                  </div>
                </div>
              </div>

              {/* Supported payment channels */}
              <div className="text-xs text-slate-500 space-y-1.5">
                <p className="font-semibold text-slate-700">Supported Payment Methods:</p>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-600 font-medium text-[11px]">Google Pay</span>
                  <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-600 font-medium text-[11px]">PhonePe</span>
                  <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-600 font-medium text-[11px]">Paytm</span>
                  <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-600 font-medium text-[11px]">Any UPI ID</span>
                  <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-600 font-medium text-[11px]">Credit/Debit Cards</span>
                  <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-600 font-medium text-[11px]">Netbanking</span>
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded text-blue-900 focus:ring-blue-900 mt-0.5"
                />
                <span>
                  I understand that ₹1,000 unlocks the complete verified address and Google Map location. ₹500 is refundable post-visit according to the refund policy.
                </span>
              </label>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleRazorpayPayment}
                disabled={loading}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 text-sm disabled:opacity-50 active:scale-[0.99]"
              >
                {loading ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <span>Pay ₹1,000 & Unlock Address</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Direct Bank UPI Tab (Coming Soon) */
            <div className="space-y-4 text-center py-2">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                <Building className="w-8 h-8" />
              </div>

              <div>
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Feature Coming Soon
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">Direct Bank Account Transfer</h3>
                <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
                  We are integrating direct bank UPI webhooks with SBI & HDFC merchant accounts so 100% of payments settle directly with zero payment gateway fees.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Merchant Name:</span>
                  <span className="font-bold text-slate-800">Vedika Brokers</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Direct VPA (Planned):</span>
                  <span className="font-mono font-semibold text-blue-900">vedikabrokers@sbi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Auto Verification:</span>
                  <span className="text-amber-700 font-medium">Bank Webhook (In Sandbox)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('razorpay')}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl text-xs transition"
              >
                Switch to Razorpay / UPI to Pay Now
              </button>
            </div>
          )}
        </div>

        {/* Security Footer Note */}
        <div className="bg-slate-50 px-4 sm:px-6 py-2.5 sm:py-3 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>256-bit Bank Grade Encryption • Official Vedika Brokers Desk</span>
        </div>
      </div>
    </div>
  );
}
