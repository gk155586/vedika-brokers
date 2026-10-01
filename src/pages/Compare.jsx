// src/pages/Compare.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Scale, X, Building2, Check, ArrowRight, Bed, Maximize2 } from 'lucide-react';
import dataStore from '@/services/dataStore';

export default function Compare() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    loadComparedProperties();
  }, []);

  const loadComparedProperties = async () => {
    const ids = JSON.parse(localStorage.getItem('vb_compare_list') || '[]');
    const all = await dataStore.getProperties();
    const matched = all.filter((p) => ids.includes(p.id));
    setProperties(matched);
  };

  const handleRemove = (id) => {
    const ids = JSON.parse(localStorage.getItem('vb_compare_list') || '[]');
    const filtered = ids.filter((item) => item !== id);
    localStorage.setItem('vb_compare_list', JSON.stringify(filtered));
    window.dispatchEvent(new Event('vb_compare_updated'));
    dataStore.notify();
    loadComparedProperties();
  };

  const formatPrice = (val, type) => {
    if (type === 'rent') return `₹${Number(val).toLocaleString('en-IN')}/mo`;
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    return `₹${(val / 100000).toFixed(2)} L`;
  };

  if (properties.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <Scale className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-800">No Properties Selected for Comparison</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          You can compare up to 3 properties side-by-side. Click the balance scale icon on any property card while browsing.
        </p>
        <Link
          to="/rent"
          className="inline-block bg-blue-900 text-white font-bold text-xs px-6 py-3 rounded-xl shadow"
        >
          Browse Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Side-by-Side</span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-serif">Property Comparison</h1>
        </div>
        <button
          onClick={() => {
            localStorage.setItem('vb_compare_list', JSON.stringify([]));
            window.dispatchEvent(new Event('vb_compare_updated'));
            dataStore.notify();
            loadComparedProperties();
          }}
          className="text-xs text-red-600 hover:underline font-semibold"
        >
          Clear Comparison
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-x-auto shadow-sm">
        <table className="w-full text-left text-xs sm:text-sm">
          <tbody>
            {/* Header: Images & Title */}
            <tr className="border-b border-slate-100">
              <td className="p-4 font-bold text-slate-400 uppercase tracking-wider w-40 bg-slate-50">Property</td>
              {properties.map((p) => (
                <td key={p.id} className="p-4 min-w-[240px]">
                  <div className="relative group">
                    <button
                      onClick={() => handleRemove(p.id)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/70 hover:bg-red-600 text-white transition z-10"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <img
                      src={p.main_image_url}
                      alt={p.title}
                      className="w-full h-36 object-cover rounded-xl mb-2"
                    />
                    <h3 className="font-bold text-slate-900 line-clamp-1">{p.title}</h3>
                    <p className="text-xs text-blue-900 font-semibold">{p.locality}, {p.area}</p>
                    <button
                      onClick={() => navigate(`/property/${p.id}`)}
                      className="mt-3 w-full bg-blue-900 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm"
                    >
                      <span>View Listing</span> <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              ))}
            </tr>

            {/* Price */}
            <tr className="border-b border-slate-100">
              <td className="p-4 font-bold text-slate-500 bg-slate-50">Price / Rent</td>
              {properties.map((p) => (
                <td key={p.id} className="p-4 font-black text-base text-blue-950 font-serif">
                  {formatPrice(p.price, p.listing_type)}
                </td>
              ))}
            </tr>

            {/* Type */}
            <tr className="border-b border-slate-100">
              <td className="p-4 font-bold text-slate-500 bg-slate-50">Listing Type</td>
              {properties.map((p) => (
                <td key={p.id} className="p-4 font-semibold uppercase text-xs">
                  {p.listing_type}
                </td>
              ))}
            </tr>

            {/* BHK */}
            <tr className="border-b border-slate-100">
              <td className="p-4 font-bold text-slate-500 bg-slate-50">BHK</td>
              {properties.map((p) => (
                <td key={p.id} className="p-4 font-semibold text-slate-800">
                  {p.bhk}
                </td>
              ))}
            </tr>

            {/* Carpet Area */}
            <tr className="border-b border-slate-100">
              <td className="p-4 font-bold text-slate-500 bg-slate-50">Carpet Area</td>
              {properties.map((p) => (
                <td key={p.id} className="p-4 font-medium text-slate-700">
                  {p.carpet_area} sq ft
                </td>
              ))}
            </tr>

            {/* Furnishing */}
            <tr className="border-b border-slate-100">
              <td className="p-4 font-bold text-slate-500 bg-slate-50">Furnishing</td>
              {properties.map((p) => (
                <td key={p.id} className="p-4 font-medium text-slate-700">
                  {p.furnishing}
                </td>
              ))}
            </tr>

            {/* Parking */}
            <tr className="border-b border-slate-100">
              <td className="p-4 font-bold text-slate-500 bg-slate-50">Parking</td>
              {properties.map((p) => (
                <td key={p.id} className="p-4 font-medium text-slate-700">
                  {p.parking}
                </td>
              ))}
            </tr>

            {/* Deposit */}
            <tr className="border-b border-slate-100">
              <td className="p-4 font-bold text-slate-500 bg-slate-50">Deposit</td>
              {properties.map((p) => (
                <td key={p.id} className="p-4 font-medium text-slate-700">
                  {p.deposit > 0 ? `₹${Number(p.deposit).toLocaleString('en-IN')}` : 'N/A'}
                </td>
              ))}
            </tr>

            {/* Broker Contact */}
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50">Broker Desk</td>
              {properties.map((p) => (
                <td key={p.id} className="p-4 font-medium text-slate-700">
                  {p.broker_phone}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
