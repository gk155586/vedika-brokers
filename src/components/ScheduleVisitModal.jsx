// src/components/ScheduleVisitModal.jsx
import React, { useState } from 'react';
import { X, Calendar, Clock, Phone, FileText, CheckCircle2 } from 'lucide-react';
import dataStore from '@/services/dataStore';
import { useAuth } from '@/hooks/useAuth';

export default function ScheduleVisitModal({ property, isOpen, onClose, onScheduled }) {
  const { user } = useAuth();
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 01:00 PM');
  const [phone, setPhone] = useState(user?.phone || '');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !property) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) {
      alert('Please select a visit date');
      return;
    }
    await dataStore.scheduleVisit({
      user_id: user?.id || 'guest',
      property_id: property.id,
      requested_date: date,
      requested_time: timeSlot,
      phone: phone || '+91 93701 48697',
      message: notes,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onScheduled && onScheduled();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" /> Physical Inspection
          </div>
          <h2 className="text-lg font-bold">Schedule Property Visit</h2>
          <p className="text-xs text-blue-200 truncate">{property.title}</p>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-slate-900">Visit Scheduled!</h3>
            <p className="text-xs text-slate-600">
              Broker <strong>{property.broker_name || 'Swapnil Navghare'}</strong> has been notified and will call you to confirm your visit.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Date</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-900 focus:outline-none"
              >
                <option value="10:00 AM - 12:00 PM">Morning (10:00 AM - 12:00 PM)</option>
                <option value="12:00 PM - 03:00 PM">Afternoon (12:00 PM - 03:00 PM)</option>
                <option value="03:00 PM - 06:00 PM">Evening (03:00 PM - 06:00 PM)</option>
                <option value="06:00 PM - 08:00 PM">Late Evening (06:00 PM - 08:00 PM)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                required
                placeholder="Enter your mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Instructions (Optional)</label>
              <textarea
                rows={2}
                placeholder="E.g., I will be visiting with my family around 4 PM"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow transition text-sm"
            >
              Confirm Visit Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
