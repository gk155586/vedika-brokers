# GSD Phase Plan: Direct Broker WhatsApp Bridge & Listing Share

## 1. Goal & Context
Enable prospective property seekers in Nanded to instantly bridge their online enquiry directly to Swapnil Navghare's verified broker WhatsApp desk (+91 93701 48697) with zero delay, while allowing one-tap property sharing to WhatsApp contacts and family groups.

## 2. Guardrails & Constraints
* **Zero Dummy / Mock Data:** No test users or mock enquiries can be generated or hardcoded.
* **Strict Validation:** Phone numbers must be sanitized before passing into `wa.me/` URLs.
* **Privacy & Resilience:** Use native `navigator.share` if available on mobile, with graceful fallback to WhatsApp Web / app deep-links.

## 3. Milestones & Work Units
1. **Unit 1: WhatsApp Utility (`src/utils/whatsapp.js`)**
   - Helper function `generateBrokerWhatsAppUrl({ name, phone, message, propertyTitle, propertyCode })`
   - Helper function `generatePropertyShareUrl({ propertyTitle, propertyCode, price, area, url })`
2. **Unit 2: Instant WhatsApp Bridge in `PropertyEnquiryModal.jsx`**
   - Provide direct one-tap WhatsApp button alongside confirmation, pre-filling customer inquiry details.
3. **Unit 3: One-Tap Listing Share in `PropertyCard.jsx`**
   - Add a subtle, elegant Share button on property cards allowing instant sharing to WhatsApp / native sheet.
4. **Unit 4: Quality & Verification**
   - Run production compilation (`npm run build`) and verify zero regressions.
