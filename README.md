# VEDIKA BROKERS — QR-Powered Property Brokerage Platform

A production-ready, mobile-first property brokerage website built for **Vedika Brokers** (Pune & Maharashtra). 
Customers discover flats for **RENT** or **BUY** by scanning on-street QR codes placed on society boards, street poles, and flyers. 

Users can view photos, videos, and broker contact info, unlock the exact flat address for **₹1,000**, and claim a **₹500 refund** if they visit and decide not to proceed.

---

## 🌟 Key Features

### 1. User Website
- **Mobile-First Experience**: High-speed responsive UI tailored for phone camera QR scans.
- **On-Street QR Code Detection**: Reads `?source=QR001` URL parameters, logs scan analytics, and welcomes the user with localized nearby listings.
- **Rent & Buy Listing Portals**: Filter by City, Area (Wakad, Hinjewadi, Baner, Kothrud, Viman Nagar), BHK (1 RK to 4 BHK+), Budget sliders, Furnishing, Balconies, and Parking.
- **Protected Address System**: The exact address (flat number, society wing, and Google Maps pin) is securely locked until payment is verified.
- **Dual Payment Channels**:
  - **Razorpay Online Gateway**: Active for instant UPI, Cards, Netbanking, Google Pay, and PhonePe.
  - **Direct Bank UPI Transfer**: Pre-configured **Coming Soon** tab with 0% gateway commission bank settlement architecture.
- **₹500 Post-Visit Refund Guarantee**: Simple refund claim form with instant status tracking in the customer dashboard.
- **Visit Scheduling**: Schedule physical viewings directly with the on-site property broker desk.
- **Property Comparison**: Compare up to 3 flats side-by-side on rent, deposit, carpet area, and amenities.
- **User Dashboard (`/account`)**: Manage unlocked addresses, scheduled visits, refund requests, and saved favorite flats.

### 2. Admin Operations Portal (`/admin`)
- **Secure Access**: Protected dashboard accessible via credentials (pre-configured: `admin@vedikabrokers.com` / `admin123`).
- **Property Inventory CRUD**: Add, edit, delete, duplicate, upload media links, and toggle status (*Available, Reserved, Sold, Rented, Draft*).
- **QR Campaign Generator**: Create tracking campaigns, generate on-street QR codes, and test or download them.
- **Payment & Refund Management**: Review ₹1,000 unlocks and approve, reject, or process ₹500 post-visit refunds.
- **Visit Desk**: Confirm or complete physical viewing appointments.
- **Global Settings**: Configure unlock fee (₹1,000), refund guarantee (₹500), broker phone, and office address dynamically without touching code.
- **Audit Logging**: Tamper-evident record of all administrative modifications.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

### 2. Install & Run
```bash
# 1. Clone repository & navigate to directory
cd "c:\Users\SK Studio\Downloads\Vedika Brockers"

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open your browser at `http://localhost:5173`.

> **Note**: The application is equipped with an interactive, resilient `dataStore` that runs out of the box with realistic Pune property listings, QR campaigns, payment simulation, and admin panel even before you configure external API keys.

---

## 🔑 Test Credentials

| Portal | URL | Email | Password | Role |
|---|---|---|---|---|
| **Admin Operations** | `/admin/login` | `admin@vedikabrokers.com` | `admin123` | Full Administrator |
| **Demo Customer** | `/login` | `customer@vedikabrokers.com` | `user123` | Verified User |

*(Both portals also include 1-click **"Demo Login"** buttons for instant testing).*

---

## 📲 Testing the Entire Flow

### Flow 1: On-Street QR Scan to Address Unlock & ₹500 Refund
1. Open `http://localhost:5173/?source=QR001` in your browser.
2. Notice the top banner: **"QR Code Verified: Wakad Flyover Pole A (Wakad Bridge Corner)"**.
3. Click on any property (e.g. *Luxury 2 BHK with Panoramic Balcony in Wakad*).
4. See that the exact address displays: **"Exact Address Locked • ₹1,000 Unlock"**.
5. Click **"UNLOCK ADDRESS — ₹1,000"**.
6. In the modal:
   - Notice Tab 1: **Razorpay / Online UPI** (Active).
   - Notice Tab 2: **Direct Bank UPI** (Marked as *Coming Soon* with merchant details).
7. Click **"Pay ₹1,000 & Unlock Address"**.
8. Confetti fires and the verified address is instantly revealed:
   - Full flat number & building name.
   - **"Open in Google Maps (Directions)"** button.
   - **"Schedule Physical Visit"** button.
   - **"No — Request ₹500 Refund"** button.
9. Click **"No — Request ₹500 Refund"**, enter your UPI ID, and submit.
10. Open **My Account** (`/account`) -> go to **₹500 Refund Requests** to see the pending claim.

### Flow 2: Admin Operations
1. Go to `http://localhost:5173/admin/login` and log in with `admin@vedikabrokers.com` / `admin123`.
2. Go to **₹500 Refunds**: approve the user's refund claim with one click.
3. Go to **QR Campaigns**: generate a new QR code (e.g. `QR006` for *Aundh Metro Station*).
4. Go to **Properties**: add a new flat or edit an existing price.
5. Visit the public site: the new property and updated price appear immediately in real-time.

---

## 🗄️ Supabase Production Setup

### 1. Database Schema & RLS
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/migrations/20240927_init.sql` from this repository.
4. Paste the entire SQL script and click **Run**.
5. All 15 relational tables, custom ENUMs, and Row Level Security (RLS) policies will be created automatically.

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in your Supabase & Razorpay credentials:

```ini
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_RAZORPAY_KEY_ID=rzp_live_your_key_id

# Server / Edge Function secrets (Do not commit to public git)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

### 3. Deploying Supabase Edge Functions
To deploy the server-side HMAC payment verification functions:
```bash
npx supabase functions deploy create-payment
npx supabase functions deploy verify-payment
```

---

## 🌐 Deployment to GitHub Pages / Vercel

### Deploying on Vercel / Netlify (Recommended)
1. Push code to your GitHub repository.
2. Connect the repo on [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. Set Build Command: `npm run build`
4. Set Output Directory: `dist`
5. Add the `VITE_SUPABASE_URL` and `VITE_RAZORPAY_KEY_ID` environment variables.
6. Deploy!

### Deploying on GitHub Pages
1. In `vite.config.js`, set `base: '/<repo-name>/'`.
2. Run `npm run build`.
3. Deploy the contents of the `dist/` directory to the `gh-pages` branch.

---

## 🛡️ License
Private commercial license for **Vedika Brokers**. All rights reserved.
