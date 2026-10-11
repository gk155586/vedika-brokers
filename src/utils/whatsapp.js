// src/utils/whatsapp.js
// Utility functions for direct WhatsApp messaging and property listing sharing

export const BROKER_WHATSAPP_NUMBER = '919370148697';
export const BROKER_NAME = 'Swapnil Navghare';

/**
 * Generates a pre-filled WhatsApp deep link directly to Swapnil Navghare's broker desk
 */
export function generateBrokerWhatsAppUrl({ name = '', phone = '', message = '', propertyTitle = '', propertyCode = '', source = 'Website' } = {}) {
  const parts = [
    `Hello ${BROKER_NAME} (Vedika Brokers Nanded),`,
  ];

  if (propertyTitle || propertyCode) {
    parts.push(`I have an enquiry regarding *${propertyTitle || 'Property'}* ${propertyCode ? `(Code: ${propertyCode})` : ''}.`);
  } else {
    parts.push(`I have an enquiry regarding properties in Nanded.`);
  }

  if (name) parts.push(`*Name:* ${name}`);
  if (phone) parts.push(`*Phone:* ${phone}`);
  if (message) parts.push(`*Requirement/Message:* "${message}"`);
  if (source) parts.push(`_Source: ${source}_`);

  const fullText = parts.join('\n\n');
  return `https://wa.me/${BROKER_WHATSAPP_NUMBER}?text=${encodeURIComponent(fullText)}`;
}

/**
 * Generates a WhatsApp share text for prospective buyers and tenants sharing a listing
 */
export function generatePropertyShareUrl(property) {
  if (!property) return '';
  const priceDisplay = property.price 
    ? (property.listing_type === 'rent' ? `₹${Number(property.price).toLocaleString('en-IN')}/month` : `₹${(Number(property.price) / 100000).toFixed(2)} Lakhs`)
    : '';

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://vedikabrokers.com';
  const propertyUrl = `${origin}/property/${property.id}`;

  const text = [
    `🏡 *Verified Listing on Vedika Brokers Nanded*`,
    `*${property.title || 'Property'}* ${property.property_code ? `(${property.property_code})` : ''}`,
    property.area ? `📍 Location: ${property.area}, Nanded` : '',
    priceDisplay ? `💰 Price/Rent: ${priceDisplay}` : '',
    property.bhk ? `🛏️ Type: ${property.bhk}` : '',
    `🔗 View Photos & Details: ${propertyUrl}`,
    `\nContact Broker Swapnil Navghare: +91 93701 48697`
  ].filter(Boolean).join('\n');

  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/**
 * Native Web Share with fallback to WhatsApp Web/App
 */
export async function shareProperty(property) {
  if (!property) return false;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://vedikabrokers.com';
  const propertyUrl = `${origin}/property/${property.id}`;

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: `${property.title} | Vedika Brokers Nanded`,
        text: `Check out ${property.title} in ${property.area || 'Nanded'} on Vedika Brokers`,
        url: propertyUrl,
      });
      return true;
    } catch (err) {
      // AbortError is normal when user cancels the share sheet
      if (err.name === 'AbortError') return true;
    }
  }

  // Fallback to WhatsApp share in new window
  const waUrl = generatePropertyShareUrl(property);
  window.open(waUrl, '_blank', 'noopener,noreferrer');
  return true;
}
