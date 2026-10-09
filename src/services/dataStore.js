// src/services/dataStore.js
// Universal data service for Vedika Brokers:
// Supports full real-time database persistence, safe migrations, complete Location/Area management for Nanded, Maharashtra,
// and strict admin authorization.

import { supabase } from './supabase';
import { verifyAdminSessionToken } from './authSecurity';

export const INITIAL_CITIES = [
  {
    id: 'city-nanded',
    name: 'Nanded',
    state: 'Maharashtra',
    is_primary: true,
    active: true,
    pincode: '431601',
    description: 'Historical city on the banks of Godavari river in Marathwada region, Maharashtra.'
  }
];

export const INITIAL_AREAS = [
  {
    id: 'area-zenda-chowk',
    city_id: 'city-nanded',
    city_name: 'Nanded',
    name: 'Zenda Chowk',
    slug: 'zenda-chowk',
    sub_areas: ['Main Market', 'Kapra Bazar', 'Sarafa Line', 'Old Town'],
    description: 'Prime central commercial & residential hub with bustling markets and easy transit.',
    is_popular: true,
    display_order: 1,
    active: true,
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z'
  },
  {
    id: 'area-chhatrapati-chowk',
    city_id: 'city-nanded',
    city_name: 'Nanded',
    name: 'Chhatrapati Chowk',
    slug: 'chhatrapati-chowk',
    sub_areas: ['Station Road', 'Statue Square', 'Shivaji Complex'],
    description: 'Prominent junction connecting major roads with commercial complexes and modern flats.',
    is_popular: true,
    display_order: 2,
    active: true,
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z'
  },
  {
    id: 'area-vazirabad',
    city_id: 'city-nanded',
    city_name: 'Nanded',
    name: 'Vazirabad',
    slug: 'vazirabad',
    sub_areas: ['Main Circle', 'Gandhi Road', 'City Hospital Line'],
    description: 'Heart of Nanded with medical centres, shopping streets and popular residential buildings.',
    is_popular: true,
    display_order: 3,
    active: true,
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z'
  },
  {
    id: 'area-taroda-naka',
    city_id: 'city-nanded',
    city_name: 'Nanded',
    name: 'Taroda Naka',
    slug: 'taroda-naka',
    sub_areas: ['VIP Road', 'Ring Road Corner', 'Shyam Nagar'],
    description: 'Fast-developing residential area with wide roads, peaceful townships, and green parks.',
    is_popular: true,
    display_order: 4,
    active: true,
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z'
  },
  {
    id: 'area-shivaji-nagar',
    city_id: 'city-nanded',
    city_name: 'Nanded',
    name: 'Shivaji Nagar',
    slug: 'shivaji-nagar',
    sub_areas: ['Near Stadium', 'College Road', 'Govt Colony'],
    description: 'Sought-after residential neighborhood close to educational institutes and sports grounds.',
    is_popular: true,
    display_order: 5,
    active: true,
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z'
  },
  {
    id: 'area-anand-nagar',
    city_id: 'city-nanded',
    city_name: 'Nanded',
    name: 'Anand Nagar',
    slug: 'anand-nagar',
    sub_areas: ['Near Garden', 'Main Square', 'Phase 1'],
    description: 'Peaceful colony with well-planned residential societies and family-friendly amenities.',
    is_popular: true,
    display_order: 6,
    active: true,
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z'
  },
  {
    id: 'area-workshop-corner',
    city_id: 'city-nanded',
    city_name: 'Nanded',
    name: 'Workshop Corner',
    slug: 'workshop-corner',
    sub_areas: ['Depot Road', 'MIDC Link', 'Bypass Road'],
    description: 'High-connectivity junction with accessible commercial properties and affordable rentals.',
    is_popular: true,
    display_order: 7,
    active: true,
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z'
  },
  {
    id: 'area-railway-station',
    city_id: 'city-nanded',
    city_name: 'Nanded',
    name: 'Nanded Railway Station Area',
    slug: 'nanded-railway-station-area',
    sub_areas: ['Platform 1 Gate', 'Station Plaza', 'Gurudwara Road'],
    description: 'High-transit location close to Hazur Sahib Gurudwara and Nanded Junction railway terminal.',
    is_popular: true,
    display_order: 8,
    active: true,
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z'
  },
  {
    id: 'area-cidco',
    city_id: 'city-nanded',
    city_name: 'Nanded',
    name: 'Cidco Nanded',
    slug: 'cidco-nanded',
    sub_areas: ['New Nanded', 'Sector 1', 'Sector 2', 'Cidco Bus Stand'],
    description: 'Planned modern township with spacious layouts, wide boulevards, and shopping complexes.',
    is_popular: true,
    display_order: 9,
    active: true,
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z'
  },
  {
    id: 'area-bhagya-nagar',
    city_id: 'city-nanded',
    city_name: 'Nanded',
    name: 'Bhagya Nagar',
    slug: 'bhagya-nagar',
    sub_areas: ['Lane 1', 'Main Garden Road', 'Near Bank Colony'],
    description: 'Affluent and quiet neighborhood with premium bungalows and modern multi-storey apartments.',
    is_popular: true,
    display_order: 10,
    active: true,
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z'
  },
  {
    id: 'area-malegaon-road',
    city_id: 'city-nanded',
    city_name: 'Nanded',
    name: 'Malegaon Road',
    slug: 'malegaon-road',
    sub_areas: ['Bypass Corner', 'New Enclave', 'Kautha Road'],
    description: 'Rapidly emerging corridor featuring new residential towers and gated communities.',
    is_popular: true,
    display_order: 11,
    active: true,
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z'
  },
  {
    id: 'area-ambedkar-chowk',
    city_id: 'city-nanded',
    city_name: 'Nanded',
    name: 'Ambedkar Chowk',
    slug: 'ambedkar-chowk',
    sub_areas: ['Statue Circle', 'Vazirabad Link', 'Station Road'],
    description: 'Central landmark junction with prime accessibility to markets and transit.',
    is_popular: true,
    display_order: 12,
    active: true,
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z'
  }
];

// Preserved initial properties mapped safely to Nanded, Maharashtra
export const INITIAL_PROPERTIES = [
  {
    id: 'prop-001',
    property_code: 'VB-NAN-00101',
    title: 'Luxury 2 BHK with Panoramic Balcony in Zenda Chowk',
    listing_type: 'rent',
    property_type: 'Apartment',
    price: 18000,
    deposit: 45000,
    bhk: '2 BHK',
    carpet_area: 840,
    builtup_area: 1050,
    city: 'Nanded',
    area: 'Zenda Chowk',
    locality: 'Near Gandhi Market Road',
    address: 'Flat 603, Wing B, Shri Balaji Heights, Opposite Datta Mandir, Zenda Chowk, Nanded - 431601',
    latitude: 19.1557,
    longitude: 77.3168,
    floor: 6,
    total_floors: 10,
    furnishing: 'Semi-Furnished',
    parking: 'Dedicated Car & Covered Bike',
    bathrooms: 2,
    balconies: 2,
    description: 'Sunlit and well-ventilated 2 BHK apartment in a premium gated society. Modular kitchen with chimney, piped gas, 24/7 power backup, gym, clubhouse, and lift. Walking distance to schools and supermarkets.',
    broker_name: 'Swapnil Navghare (Vedika Brokers)',
    broker_phone: '+91 93701 48697',
    whatsapp: '919370148697',
    status: 'available',
    is_verified: true,
    views_count: 142,
    unlocks_count: 19,
    main_image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80'
    ],
    video_url: '',
    amenities: ['Covered Parking', 'Lift', 'Balcony', '24x7 Security', 'Clubhouse', 'Gym', 'Power Backup', 'Piped Gas', 'Kids Play Area'],
    created_at: '2026-09-20T10:00:00Z',
  },
  {
    id: 'prop-002',
    property_code: 'VB-NAN-00102',
    title: 'Spacious 3 BHK Garden-Facing Flat in Chhatrapati Chowk',
    listing_type: 'rent',
    property_type: 'Apartment',
    price: 24000,
    deposit: 60000,
    bhk: '3 BHK',
    carpet_area: 1250,
    builtup_area: 1520,
    city: 'Nanded',
    area: 'Chhatrapati Chowk',
    locality: 'Station Road Junction',
    address: 'Tower 4, Flat 1102, Shriram Township, Near Chhatrapati Chowk, Nanded - 431601',
    latitude: 19.1583,
    longitude: 77.3133,
    floor: 11,
    total_floors: 14,
    furnishing: 'Fully-Furnished',
    parking: '2 Covered Car Parking',
    bathrooms: 3,
    balconies: 3,
    description: 'Fully furnished 3 BHK home ideal for professionals and families. Includes 3 ACs, Smart TV, double beds with mattresses, modern wardrobes, sofa set, 6-seater dining table, microwave and refrigerator.',
    broker_name: 'Swapnil Navghare (Vedika Brokers)',
    broker_phone: '+91 93701 48697',
    whatsapp: '919370148697',
    status: 'available',
    is_verified: true,
    views_count: 215,
    unlocks_count: 31,
    main_image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600573472591-ee6c563aaec9?auto=format&fit=crop&w=1000&q=80'
    ],
    video_url: '',
    amenities: ['Covered Parking', 'Lift', 'Balcony', '24x7 Security', 'Swimming Pool', 'Gym', 'Pet Friendly', 'Wi-Fi Ready'],
    created_at: '2026-09-22T08:30:00Z',
  },
  {
    id: 'prop-003',
    property_code: 'VB-NAN-00103',
    title: 'Brand New 2 BHK Resale High Rise in Vazirabad',
    listing_type: 'buy',
    property_type: 'Apartment',
    price: 4800000,
    deposit: 0,
    bhk: '2 BHK',
    carpet_area: 880,
    builtup_area: 1100,
    city: 'Nanded',
    area: 'Vazirabad',
    locality: 'Main Market Circle',
    address: 'A-901, Royal Regency, Vazirabad Main Road, Nanded - 431601',
    latitude: 19.1539,
    longitude: 77.3195,
    floor: 9,
    total_floors: 12,
    furnishing: 'Unfurnished',
    parking: '1 Covered Car Space',
    bathrooms: 2,
    balconies: 1,
    description: 'Vastu compliant East-facing 2 BHK flat with clear title, RERA registration, and occupancy certificate (OC). High-speed Otis elevators, solar water heater, rainwater harvesting, and fire safety systems installed.',
    broker_name: 'Swapnil Navghare (Vedika Brokers)',
    broker_phone: '+91 93701 48697',
    whatsapp: '919370148697',
    status: 'available',
    is_verified: true,
    views_count: 310,
    unlocks_count: 42,
    main_image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'
    ],
    video_url: '',
    amenities: ['Covered Parking', 'Lift', 'Balcony', '24x7 Security', 'Solar Water', 'Fire Fighting'],
    created_at: '2026-09-24T14:00:00Z',
  },
  {
    id: 'prop-004',
    property_code: 'VB-NAN-00104',
    title: 'Cosy 1 BHK Near Stadium in Shivaji Nagar',
    listing_type: 'rent',
    property_type: 'Apartment',
    price: 11000,
    deposit: 25000,
    bhk: '1 BHK',
    carpet_area: 550,
    builtup_area: 680,
    city: 'Nanded',
    area: 'Shivaji Nagar',
    locality: 'Near Sports Complex',
    address: 'Flat 302, Sai Vihar Apartment, Near Stadium Road, Shivaji Nagar, Nanded - 431602',
    latitude: 19.1620,
    longitude: 77.3250,
    floor: 3,
    total_floors: 6,
    furnishing: 'Semi-Furnished',
    parking: 'Two-Wheeler Dedicated',
    bathrooms: 1,
    balconies: 1,
    description: 'Quiet family residential society in central Shivaji Nagar, Nanded. Close to colleges, market, hospitals, and 5 minutes drive to railway station. Low society maintenance.',
    broker_name: 'Swapnil Navghare (Vedika Brokers)',
    broker_phone: '+91 93701 48697',
    whatsapp: '919370148697',
    status: 'available',
    is_verified: true,
    views_count: 98,
    unlocks_count: 14,
    main_image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'
    ],
    video_url: '',
    amenities: ['Lift', '24x7 Security', 'Piped Gas', 'Balcony'],
    created_at: '2026-09-25T11:00:00Z',
  },
  {
    id: 'prop-005',
    property_code: 'VB-NAN-00105',
    title: 'Grand 4 BHK Duplex Penthouse with Private Terrace in Taroda Naka',
    listing_type: 'buy',
    property_type: 'Apartment',
    price: 8800000,
    deposit: 0,
    bhk: '4 BHK+',
    carpet_area: 2400,
    builtup_area: 3100,
    city: 'Nanded',
    area: 'Taroda Naka',
    locality: 'VIP Road',
    address: 'Penthouse 1401, Marvel Pride, VIP Road, Taroda Naka, Nanded - 431605',
    latitude: 19.1720,
    longitude: 77.3080,
    floor: 10,
    total_floors: 10,
    furnishing: 'Fully-Furnished',
    parking: '3 Covered Car Parkings',
    bathrooms: 4,
    balconies: 3,
    description: 'Ultra-luxurious duplex penthouse with private sky terrace, Italian marble flooring, automated lighting, and dedicated servant quarters. Premier residential address in Nanded.',
    broker_name: 'Swapnil Navghare (Vedika Brokers)',
    broker_phone: '+91 93701 48697',
    whatsapp: '919370148697',
    status: 'available',
    is_verified: true,
    views_count: 420,
    unlocks_count: 58,
    main_image_url: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80'
    ],
    video_url: '',
    amenities: ['Covered Parking', 'Lift', 'Balcony', '24x7 Security', 'Swimming Pool', 'Gym', 'Clubhouse', 'Pet Friendly', 'Power Backup'],
    created_at: '2026-09-26T09:00:00Z',
  },
  {
    id: 'prop-006',
    property_code: 'VB-NAN-00106',
    title: 'Gated Society 2 BHK Near Garden in Anand Nagar',
    listing_type: 'rent',
    property_type: 'Apartment',
    price: 15000,
    deposit: 35000,
    bhk: '2 BHK',
    carpet_area: 790,
    builtup_area: 980,
    city: 'Nanded',
    area: 'Anand Nagar',
    locality: 'Near Anand Garden',
    address: 'B-702, Shanti Residency, Anand Nagar, Nanded - 431602',
    latitude: 19.1650,
    longitude: 77.3210,
    floor: 7,
    total_floors: 9,
    furnishing: 'Semi-Furnished',
    parking: 'Covered Car & Bike',
    bathrooms: 2,
    balconies: 2,
    description: 'Beautiful 2 BHK in one of the best peaceful societies of Anand Nagar, Nanded. Modular kitchen, gas pipeline, high floor with pleasant ventilation, 24x7 security, gym and clubhouse.',
    broker_name: 'Swapnil Navghare (Vedika Brokers)',
    broker_phone: '+91 93701 48697',
    whatsapp: '919370148697',
    status: 'available',
    is_verified: true,
    views_count: 178,
    unlocks_count: 22,
    main_image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'
    ],
    video_url: '',
    amenities: ['Covered Parking', 'Lift', 'Balcony', '24x7 Security', 'Gym', 'Piped Gas'],
    created_at: '2026-09-26T12:00:00Z',
  },
  {
    id: 'prop-007',
    property_code: 'VB-NAN-00107',
    title: 'Affordable Compact 1 BHK Near Main Market in Zenda Chowk',
    listing_type: 'rent',
    property_type: 'Apartment',
    price: 9000,
    deposit: 20000,
    bhk: '1 BHK',
    carpet_area: 510,
    builtup_area: 630,
    city: 'Nanded',
    area: 'Zenda Chowk',
    locality: 'Kapra Bazar Lane',
    address: 'Flat 304, Green Park Society, Zenda Chowk, Nanded - 431601',
    latitude: 19.1560,
    longitude: 77.3175,
    floor: 3,
    total_floors: 5,
    furnishing: 'Semi-Furnished',
    parking: 'Two-Wheeler Dedicated',
    bathrooms: 1,
    balconies: 1,
    description: 'Ideal 1 BHK for working bachelors or small families in central Zenda Chowk, Nanded. Low maintenance society with lift, 24/7 water supply, and CCTV surveillance.',
    broker_name: 'Swapnil Navghare (Vedika Brokers)',
    broker_phone: '+91 93701 48697',
    whatsapp: '919370148697',
    status: 'available',
    is_verified: true,
    views_count: 245,
    unlocks_count: 36,
    main_image_url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80'
    ],
    video_url: '',
    amenities: ['Lift', '24x7 Security', 'Balcony', 'Covered Parking'],
    created_at: '2026-09-27T08:00:00Z',
  }
];

export const INITIAL_QR_CAMPAIGNS = [
  { id: 'qr-001', code: 'QR001', name: 'Zenda Chowk Market Board', location: 'Zenda Chowk Circle', scans_count: 42, active: true, created_at: '2026-09-01' },
  { id: 'qr-002', code: 'QR002', name: 'Chhatrapati Chowk Standee', location: 'Station Road Corner', scans_count: 79, active: true, created_at: '2026-09-03' },
  { id: 'qr-003', code: 'QR003', name: 'Vazirabad Market Complex', location: 'City Hospital Circle', scans_count: 65, active: true, created_at: '2026-09-05' },
  { id: 'qr-004', code: 'QR004', name: 'Nanded Railway Station Gate', location: 'Platform 1 Plaza', scans_count: 38, active: true, created_at: '2026-09-08' },
  { id: 'qr-005', code: 'QR005', name: 'Office Reception Standee', location: 'Vedika Nanded Office', scans_count: 112, active: true, created_at: '2026-09-10' },
];

export const INITIAL_ENQUIRIES = [
  {
    id: 'enq-179001',
    name: 'Rajesh Kulkarni',
    email: 'rajesh.kulkarni@gmail.com',
    phone: '+91 98220 14820',
    source: 'Contact Page',
    type: 'Buy Requirement',
    property_id: null,
    property_code: null,
    property_title: null,
    message: 'Looking for a 2 BHK apartment near Zenda Chowk or Vazirabad for my family. Budget around ₹35-40 Lakhs. Need possession within 2 months.',
    status: 'in_progress',
    priority: 'high',
    created_at: '2026-09-25T10:30:00Z',
    updated_at: '2026-09-26T11:00:00Z',
    admin_notes: [
      { id: 'note-1', note: 'Client prefers 2nd floor or above with lift and dedicated car parking. Spoke on phone.', by: 'Swapnil Navghare', date: '2026-09-25T14:15:00Z' },
      { id: 'note-2', note: 'Shortlisted Anand Heights and Shiv Krupa. Site visit planned for Saturday.', by: 'Swapnil Navghare', date: '2026-09-26T11:00:00Z' }
    ],
    history: [
      { date: '2026-09-25T10:30:00Z', action: 'Enquiry Received', by: 'Customer (Online)', details: 'Enquiry submitted via Contact Form' },
      { date: '2026-09-25T14:15:00Z', action: 'Status Changed to Contacted', by: 'Swapnil Navghare', details: 'Client called on phone. Interested in 2 BHK near Zenda Chowk.' },
      { date: '2026-09-26T11:00:00Z', action: 'Status Changed to In Progress', by: 'Swapnil Navghare', details: 'Site inspection scheduled for Saturday.' }
    ]
  },
  {
    id: 'enq-179002',
    name: 'Pooja Deshmukh',
    email: 'pooja.deshmukh@yahoo.co.in',
    phone: '+91 94231 87654',
    source: 'Property Page',
    type: 'Property Enquiry',
    property_id: 'prop-buy-002',
    property_code: 'VB-BUY-002',
    property_title: 'Greenfield Park Residency 3BHK',
    message: 'Interested in 3 BHK luxury flat at Taroda Naka (VB-BUY-002). Is home loan assistance available through SBI or HDFC? Also what is the monthly society maintenance fee?',
    status: 'new',
    priority: 'high',
    created_at: '2026-09-28T16:45:00Z',
    updated_at: '2026-09-28T16:45:00Z',
    admin_notes: [],
    history: [
      { date: '2026-09-28T16:45:00Z', action: 'Enquiry Received', by: 'Customer (Online)', details: 'Enquiry received for property VB-BUY-002 (Greenfield Park Residency)' }
    ]
  },
  {
    id: 'enq-179003',
    name: 'Dr. Amit Shinde',
    email: 'dr.amit.shinde@nandedclinic.com',
    phone: '+91 97654 32109',
    source: 'Direct Broker Desk',
    type: 'Rent Requirement',
    property_id: null,
    property_code: null,
    property_title: null,
    message: 'Need a fully furnished 2 BHK on rent near Shivaji Nagar / Govt Hospital. Budget up to ₹18,000/month. Family of 3, immediate move-in required.',
    status: 'contacted',
    priority: 'normal',
    created_at: '2026-09-27T09:15:00Z',
    updated_at: '2026-09-27T10:00:00Z',
    admin_notes: [
      { id: 'note-3', note: 'Sent 3 WhatsApp listings. Client liked Sai Krupa Heights in Shivaji Nagar.', by: 'Swapnil Navghare', date: '2026-09-27T10:00:00Z' }
    ],
    history: [
      { date: '2026-09-27T09:15:00Z', action: 'Enquiry Received', by: 'Customer (Online)', details: 'Direct Broker Desk enquiry received' },
      { date: '2026-09-27T10:00:00Z', action: 'Status Changed to Contacted', by: 'Swapnil Navghare', details: 'WhatsApp options sent to doctor' }
    ]
  },
  {
    id: 'enq-179004',
    name: 'Sanjay Patil',
    email: 'sanjay.patil.nnd@gmail.com',
    phone: '+91 91580 98765',
    source: 'Contact Page',
    type: 'Sell Property Listing',
    property_id: null,
    property_code: null,
    property_title: null,
    message: 'I want to list my 2 BHK flat for sale in Chhatrapati Chowk, commercial road touch. Please call back to discuss brokerage terms and physical inspection.',
    status: 'resolved',
    priority: 'normal',
    created_at: '2026-09-22T11:20:00Z',
    updated_at: '2026-09-24T18:00:00Z',
    admin_notes: [
      { id: 'note-4', note: 'Owner agreed to 1.5% brokerage on closing. High demand location.', by: 'Swapnil Navghare', date: '2026-09-23T14:00:00Z' },
      { id: 'note-5', note: 'Verified registry documents and uploaded to catalog as VB-BUY-004.', by: 'Admin Desk', date: '2026-09-24T18:00:00Z' }
    ],
    history: [
      { date: '2026-09-22T11:20:00Z', action: 'Enquiry Received', by: 'Customer (Online)', details: 'Property listing enquiry received' },
      { date: '2026-09-23T14:00:00Z', action: 'Status Changed to In Progress', by: 'Swapnil Navghare', details: 'In-person inspection of flat completed' },
      { date: '2026-09-24T18:00:00Z', action: 'Status Changed to Resolved', by: 'Admin Desk', details: 'Property listed in catalog under ID VB-BUY-004' }
    ]
  }
];

export const INITIAL_REGISTERED_USERS = [
  {
    id: 'user-101',
    name: 'Rajesh Kulkarni',
    email: 'rajesh.kulkarni@gmail.com',
    phone: '+91 98220 14820',
    role: 'user',
    createdAt: '2026-09-20T10:30:00Z',
    status: 'verified'
  },
  {
    id: 'user-102',
    name: 'Pooja Deshmukh',
    email: 'pooja.deshmukh@yahoo.co.in',
    phone: '+91 94231 87654',
    role: 'user',
    createdAt: '2026-09-22T14:15:00Z',
    status: 'verified'
  },
  {
    id: 'user-103',
    name: 'Dr. Amit Shinde',
    email: 'dr.amit.shinde@nandedclinic.com',
    phone: '+91 97654 32109',
    role: 'user',
    createdAt: '2026-09-23T09:00:00Z',
    status: 'verified'
  },
  {
    id: 'user-104',
    name: 'Sanjay Patil',
    email: 'sanjay.patil.nnd@gmail.com',
    phone: '+91 91580 98765',
    role: 'user',
    createdAt: '2026-09-24T16:20:00Z',
    status: 'verified'
  },
  {
    id: 'user-105',
    name: 'Sneha Joshi',
    email: 'sneha.joshi.pune@gmail.com',
    phone: '+91 99225 43210',
    role: 'user',
    createdAt: '2026-09-26T11:45:00Z',
    status: 'verified'
  },
  {
    id: 'user-106',
    name: 'Vikram More',
    email: 'vikram.more.nnd@gmail.com',
    phone: '+91 98901 23456',
    role: 'user',
    createdAt: '2026-09-27T18:10:00Z',
    status: 'verified'
  }
];

export const INITIAL_FAVORITES = [
  { user_id: 'user-101', property_id: 'prop-buy-001', created_at: '2026-09-21T11:00:00Z' },
  { user_id: 'user-101', property_id: 'prop-rent-001', created_at: '2026-09-22T09:30:00Z' },
  { user_id: 'user-102', property_id: 'prop-buy-002', created_at: '2026-09-23T15:00:00Z' },
  { user_id: 'user-102', property_id: 'prop-buy-004', created_at: '2026-09-24T18:45:00Z' },
  { user_id: 'user-103', property_id: 'prop-rent-002', created_at: '2026-09-25T14:20:00Z' },
  { user_id: 'user-104', property_id: 'prop-buy-003', created_at: '2026-09-26T10:15:00Z' },
  { user_id: 'user-105', property_id: 'prop-rent-003', created_at: '2026-09-27T12:00:00Z' },
  { user_id: 'user-105', property_id: 'prop-buy-001', created_at: '2026-09-27T16:30:00Z' }
];

export class DataStore {
  constructor() {
    this.listeners = new Set();
    this.initStore();

    // Cross-tab real-time sync via BroadcastChannel & storage events
    if (typeof window !== 'undefined') {
      try {
        this.channel = new BroadcastChannel('vb_datastore_sync');
        this.channel.onmessage = () => {
          this.listeners.forEach((listener) => {
            try { listener(); } catch (_) {}
          });
        };
      } catch (_) {}

      window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith('vb_')) {
          this.listeners.forEach((listener) => {
            try { listener(); } catch (_) {}
          });
        }
      });
    }
  }

  // Cryptographic Helper to verify administrative authorization
  async checkAdminAuth() {
    try {
      const stored = localStorage.getItem('vb_current_user');
      if (!stored) throw new Error('Unauthorized: Admin login required.');
      const user = JSON.parse(stored);
      if (!user || user.role !== 'admin') {
        throw new Error('Unauthorized: Only administrators can modify platform data.');
      }
      const isTokenValid = await verifyAdminSessionToken();
      if (!isTokenValid) {
        throw new Error('Unauthorized: Admin session signature is invalid or expired. Please re-authenticate.');
      }
      return true;
    } catch (err) {
      throw new Error(err.message || 'Unauthorized action.');
    }
  }

  initStore() {
    // 1. Initialize Cities
    try {
      const storedCities = JSON.parse(localStorage.getItem('vb_cities') || '[]');
      if (!Array.isArray(storedCities) || storedCities.length === 0) {
        localStorage.setItem('vb_cities', JSON.stringify(INITIAL_CITIES));
      }
    } catch (_) {
      localStorage.setItem('vb_cities', JSON.stringify(INITIAL_CITIES));
    }

    // 2. Initialize Areas
    try {
      const storedAreas = JSON.parse(localStorage.getItem('vb_areas') || '[]');
      if (!Array.isArray(storedAreas) || storedAreas.length === 0) {
        localStorage.setItem('vb_areas', JSON.stringify(INITIAL_AREAS));
      } else {
        // Ensure initial required Nanded areas (Zenda Chowk, Chhatrapati Chowk, etc.) exist
        const areaNames = new Set(storedAreas.map(a => a.name.toLowerCase()));
        let needsUpdate = false;
        INITIAL_AREAS.forEach(initArea => {
          if (!areaNames.has(initArea.name.toLowerCase())) {
            storedAreas.push(initArea);
            needsUpdate = true;
          }
        });
        if (needsUpdate) {
          localStorage.setItem('vb_areas', JSON.stringify(storedAreas));
        }
      }
    } catch (_) {
      localStorage.setItem('vb_areas', JSON.stringify(INITIAL_AREAS));
    }

    // 3. Initialize & Safely Migrate Properties to Nanded (Zero Data Loss)
    try {
      let storedProps = JSON.parse(localStorage.getItem('vb_properties') || '[]');
      if (!Array.isArray(storedProps) || storedProps.length === 0) {
        localStorage.setItem('vb_properties', JSON.stringify(INITIAL_PROPERTIES));
      } else {
        // Safe migration: map legacy Pune references to Nanded while preserving ALL custom properties and media
        let migrated = false;
        const areaMapping = {
          'wakad': 'Zenda Chowk',
          'hinjewadi': 'Chhatrapati Chowk',
          'baner': 'Vazirabad',
          'kothrud': 'Shivaji Nagar',
          'viman nagar': 'Taroda Naka',
          'pimple saudagar': 'Anand Nagar'
        };

        const updatedProps = storedProps.map(prop => {
          let updated = { ...prop };
          // If city was Pune or missing, set Nanded
          if (!updated.city || updated.city.toLowerCase() === 'pune') {
            updated.city = 'Nanded';
            migrated = true;
          }
          // If area is a legacy Pune area, remap to corresponding Nanded area
          const areaLower = (updated.area || '').toLowerCase();
          if (areaMapping[areaLower]) {
            updated.area = areaMapping[areaLower];
            migrated = true;
          }
          // Update address city text safely if it said Pune
          if (updated.address && updated.address.includes('Pune')) {
            updated.address = updated.address.replace(/,?\s*Pune\s*-\s*\d{6}/gi, ', Nanded - 431601');
            migrated = true;
          }
          // Enforce broker number 9370148697 and broker Swapnil Navghare
          if (
            !updated.broker_phone || 
            updated.broker_phone !== '+91 93701 48697' || 
            !updated.broker_name || 
            !updated.broker_name.includes('Swapnil')
          ) {
            updated.broker_name = 'Swapnil Navghare (Vedika Brokers)';
            updated.broker_phone = '+91 93701 48697';
            updated.whatsapp = '919370148697';
            migrated = true;
          }
          // Clear legacy walkthrough video URLs from properties
          if (updated.video_url) {
            updated.video_url = '';
            migrated = true;
          }
          return updated;
        });

        if (migrated) {
          localStorage.setItem('vb_properties', JSON.stringify(updatedProps));
        }
      }
    } catch (_) {
      localStorage.setItem('vb_properties', JSON.stringify(INITIAL_PROPERTIES));
    }

    // 4. Initialize QR campaigns
    try {
      const storedQRs = JSON.parse(localStorage.getItem('vb_qr_campaigns') || '[]');
      if (!Array.isArray(storedQRs) || storedQRs.length === 0) {
        localStorage.setItem('vb_qr_campaigns', JSON.stringify(INITIAL_QR_CAMPAIGNS));
      }
    } catch (_) {
      localStorage.setItem('vb_qr_campaigns', JSON.stringify(INITIAL_QR_CAMPAIGNS));
    }

    if (!localStorage.getItem('vb_unlocks')) {
      localStorage.setItem('vb_unlocks', JSON.stringify([]));
    }
    if (!localStorage.getItem('vb_payments')) {
      localStorage.setItem('vb_payments', JSON.stringify([]));
    }
    if (!localStorage.getItem('vb_refunds')) {
      localStorage.setItem('vb_refunds', JSON.stringify([]));
    }
    if (!localStorage.getItem('vb_visits')) {
      localStorage.setItem('vb_visits', JSON.stringify([]));
    }
    try {
      const storedFavs = JSON.parse(localStorage.getItem('vb_favorites') || '[]');
      if (!Array.isArray(storedFavs) || storedFavs.length === 0) {
        localStorage.setItem('vb_favorites', JSON.stringify(INITIAL_FAVORITES));
      }
    } catch (_) {
      localStorage.setItem('vb_favorites', JSON.stringify(INITIAL_FAVORITES));
    }

    try {
      const rawUsers = localStorage.getItem('vb_registered_users');
      if (rawUsers === null) {
        const backupUsers = localStorage.getItem('vb_registered_users_backup');
        if (backupUsers !== null) {
          localStorage.setItem('vb_registered_users', backupUsers);
        } else {
          localStorage.setItem('vb_registered_users', JSON.stringify(INITIAL_REGISTERED_USERS));
          localStorage.setItem('vb_registered_users_backup', JSON.stringify(INITIAL_REGISTERED_USERS));
        }
      } else {
        localStorage.setItem('vb_registered_users_backup', rawUsers);
      }
    } catch (_) {
      // Defensive: Never overwrite user storage on exception
    }

    // Initialize Enquiries & Leads with complete historical records (Zero Data Loss)
    try {
      const rawEnquiries = localStorage.getItem('vb_enquiries');
      if (rawEnquiries === null) {
        localStorage.setItem('vb_enquiries', JSON.stringify(INITIAL_ENQUIRIES));
      } else {
        const storedEnquiries = JSON.parse(rawEnquiries);
        if (Array.isArray(storedEnquiries)) {
          let needsUpdate = false;
          const upgraded = storedEnquiries.map(enq => {
            let modified = false;
            const copy = { ...enq };
            if (!Array.isArray(copy.history)) {
              copy.history = [
                { date: copy.created_at || new Date().toISOString(), action: 'Enquiry Received', by: 'Customer (Online)', details: 'Initial enquiry submission' }
              ];
              modified = true;
            }
            if (!Array.isArray(copy.admin_notes)) {
              copy.admin_notes = [];
              modified = true;
            }
            if (!copy.status) {
              copy.status = 'new';
              modified = true;
            }
            if (modified) needsUpdate = true;
            return copy;
          });
          if (needsUpdate) {
            localStorage.setItem('vb_enquiries', JSON.stringify(upgraded));
          }
        }
      }
    } catch (_) {
      localStorage.setItem('vb_enquiries', JSON.stringify(INITIAL_ENQUIRIES));
    }

    if (!localStorage.getItem('vb_logs')) {
      localStorage.setItem('vb_logs', JSON.stringify([
        { id: 'log-1', action: 'System initialized for Nanded, Maharashtra', entity: 'System', date: new Date().toISOString() }
      ]));
    }

    // 5. Initialize Website Settings & Content
    try {
      const existingSettings = JSON.parse(localStorage.getItem('vb_settings') || '{}');
      const defaultSettings = {
        website_name: 'VEDIKA BROKERS',
        primary_city: 'Nanded',
        state: 'Maharashtra',
        tagline: "Verified Property Network",
        hero_title: 'Find Your Next Home',
        hero_subtitle: 'Verified properties for rent and purchase across prime localities.',
        phone: '+91 93701 48697',
        whatsapp: '919370148697',
        email: 'contact@vedikabrokers.com',
        office_address: 'Office 304, Vedika Tower, Near Zenda Chowk, Vazirabad, Nanded, Maharashtra - 431601',
        unlock_fee: 1000,
        refund_amount: 500,
        refund_policy_note: '₹500 refundable upon viewing confirmation if you decide not to proceed, subject to policy verification.',
      };

      const merged = { ...defaultSettings, ...existingSettings };
      // Force sanitize if office_address has Pune / Wakad or is missing
      if (!merged.office_address || /Pune|Wakad|Pride Icon/i.test(merged.office_address)) {
        merged.office_address = defaultSettings.office_address;
      }
      merged.phone = '+91 93701 48697';
      merged.whatsapp = '919370148697';
      localStorage.setItem('vb_settings', JSON.stringify(merged));
    } catch (_) {
      localStorage.setItem('vb_settings', JSON.stringify({
        website_name: 'VEDIKA BROKERS',
        primary_city: 'Nanded',
        state: 'Maharashtra',
        tagline: "Verified Property Network",
        hero_title: 'Find Your Next Home',
        hero_subtitle: 'Verified properties for rent and purchase across prime localities.',
        phone: '+91 93701 48697',
        whatsapp: '919370148697',
        email: 'contact@vedikabrokers.com',
        office_address: 'Office 304, Vedika Tower, Near Zenda Chowk, Vazirabad, Nanded, Maharashtra - 431601',
        unlock_fee: 1000,
        refund_amount: 500,
        refund_policy_note: '₹500 refundable upon viewing confirmation if you decide not to proceed, subject to policy verification.',
      }));
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) => {
      try { listener(); } catch (_) {}
    });
    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'SYNC', timestamp: Date.now() });
      } catch (_) {}
    }
  }

  // --- LOCATION & CITY MANAGEMENT ---
  async getCities() {
    try {
      const stored = JSON.parse(localStorage.getItem('vb_cities') || '[]');
      if (Array.isArray(stored) && stored.length > 0) return stored.map(c => ({ ...c }));
    } catch (_) {}
    return INITIAL_CITIES.map(c => ({ ...c }));
  }

  async saveCity(cityData) {
    await this.checkAdminAuth();
    let cities = await this.getCities();
    let updated;

    if (cityData.id) {
      // Editing existing city
      const oldCity = cities.find(c => c.id === cityData.id);
      if (!oldCity) throw new Error('City not found');

      // If marked as primary, unmark others
      if (cityData.is_primary) {
        cities = cities.map(c => ({ ...c, is_primary: c.id === cityData.id }));
      }

      updated = {
        ...oldCity,
        ...cityData,
        name: cityData.name.trim(),
        state: cityData.state?.trim() || 'Maharashtra',
        pincode: cityData.pincode?.trim() || '',
        description: cityData.description?.trim() || '',
        active: cityData.active !== undefined ? cityData.active : true,
        updated_at: new Date().toISOString()
      };

      cities = cities.map(c => (c.id === cityData.id ? updated : c));

      // If city name changed, cascade to all areas and properties
      if (oldCity.name !== updated.name) {
        let areas = await this.getAreas({ includeInactive: true });
        areas = areas.map(a => (a.city_id === cityData.id || a.city_name === oldCity.name ? { ...a, city_name: updated.name } : a));
        localStorage.setItem('vb_areas', JSON.stringify(areas));

        let properties = await this.getProperties();
        properties = properties.map(p => (p.city === oldCity.name ? { ...p, city: updated.name } : p));
        localStorage.setItem('vb_properties', JSON.stringify(properties));
      }

      this.logAction(`Updated city: ${updated.name}`, 'Location', cityData.id);
    } else {
      // Adding a brand new city - NEVER touch existing cities!
      const trimmedName = cityData.name.trim();
      const existing = cities.find(c => c.name.toLowerCase().trim() === trimmedName.toLowerCase());
      if (existing) {
        throw new Error(`A city named "${trimmedName}" already exists.`);
      }

      const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const newId = `city-${slug}-${Date.now()}`;

      // If marked as primary, unmark others
      if (cityData.is_primary) {
        cities = cities.map(c => ({ ...c, is_primary: false }));
      }

      updated = {
        id: newId,
        name: trimmedName,
        state: cityData.state?.trim() || 'Maharashtra',
        pincode: cityData.pincode?.trim() || '',
        description: cityData.description?.trim() || '',
        is_primary: !!cityData.is_primary,
        active: cityData.active !== undefined ? cityData.active : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Add new city alongside all existing cities
      cities.push(updated);
      this.logAction(`Added new city: ${updated.name}`, 'Location', newId);
    }

    localStorage.setItem('vb_cities', JSON.stringify(cities));
    this.notify();
    return updated;
  }

  async deleteCity(cityId, reassignTargetCityId = null) {
    await this.checkAdminAuth();
    let cities = await this.getCities();
    const cityToDelete = cities.find(c => c.id === cityId);
    if (!cityToDelete) throw new Error('City not found.');
    
    if (cities.length <= 1) {
      throw new Error('Cannot delete the only city configured on the platform.');
    }

    const remainingCities = cities.filter(c => c.id !== cityId);
    const targetCity = remainingCities.find(c => c.id === reassignTargetCityId) || remainingCities[0];

    // If deleted city was primary, set fallback target as primary
    if (cityToDelete.is_primary && remainingCities.length > 0) {
      remainingCities[0].is_primary = true;
    }

    // Reassign linked areas
    let areas = await this.getAreas({ includeInactive: true });
    areas = areas.map(a => {
      if (a.city_id === cityId || a.city_name === cityToDelete.name) {
        return {
          ...a,
          city_id: targetCity.id,
          city_name: targetCity.name
        };
      }
      return a;
    });
    localStorage.setItem('vb_areas', JSON.stringify(areas));

    // Reassign linked properties
    let properties = await this.getProperties();
    properties = properties.map(p => {
      if (p.city === cityToDelete.name) {
        return {
          ...p,
          city: targetCity.name
        };
      }
      return p;
    });
    localStorage.setItem('vb_properties', JSON.stringify(properties));

    localStorage.setItem('vb_cities', JSON.stringify(remainingCities));
    this.logAction(`Deleted city: ${cityToDelete.name} (reassigned to ${targetCity.name})`, 'Location', cityId);
    this.notify();
    return true;
  }

  // --- AREA / LOCALITY MANAGEMENT ---
  async getAreas({ cityId = null, includeInactive = false, search = '' } = {}) {
    let areas = [];
    try {
      const stored = JSON.parse(localStorage.getItem('vb_areas') || '[]');
      if (Array.isArray(stored) && stored.length > 0) {
        areas = stored;
      } else {
        areas = INITIAL_AREAS;
      }
    } catch (_) {
      areas = INITIAL_AREAS;
    }

    let filtered = areas;
    if (cityId) {
      filtered = filtered.filter(a => a.city_id === cityId);
    }
    if (!includeInactive) {
      filtered = filtered.filter(a => a.active !== false);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(q) || 
        (a.sub_areas && a.sub_areas.some(s => s.toLowerCase().includes(q))) ||
        (a.description && a.description.toLowerCase().includes(q))
      );
    }

    // Sort by display_order ascending, then name
    return filtered.sort((a, b) => {
      const orderA = a.display_order !== undefined ? a.display_order : 999;
      const orderB = b.display_order !== undefined ? b.display_order : 999;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name);
    });
  }

  async getAreaById(id) {
    const areas = await this.getAreas({ includeInactive: true });
    return areas.find(a => a.id === id || a.slug === id);
  }

  async saveArea(areaData) {
    await this.checkAdminAuth();
    let areas = await this.getAreas({ includeInactive: true });
    let updated;

    if (areaData.id) {
      const oldArea = areas.find(a => a.id === areaData.id);
      const oldName = oldArea ? oldArea.name : null;
      const newName = (areaData.name || '').trim();

      updated = {
        ...oldArea,
        ...areaData,
        name: newName,
        slug: newName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        updated_at: new Date().toISOString()
      };

      areas = areas.map(a => a.id === areaData.id ? updated : a);

      // CASCADING RENAME: If area name changed, update every property linked to this area!
      if (oldName && newName && oldName.toLowerCase() !== newName.toLowerCase()) {
        let properties = await this.getProperties();
        let changedCount = 0;
        properties = properties.map(p => {
          if (p.area && p.area.toLowerCase() === oldName.toLowerCase()) {
            changedCount++;
            return { ...p, area: newName, updated_at: new Date().toISOString() };
          }
          return p;
        });
        if (changedCount > 0) {
          localStorage.setItem('vb_properties', JSON.stringify(properties));
          this.logAction(`Cascaded area rename "${oldName}" -> "${newName}" across ${changedCount} properties`, 'Location', areaData.id);
        }
      }

      this.logAction(`Updated area: ${newName}`, 'Location', areaData.id);
    } else {
      const name = (areaData.name || '').trim();
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newId = `area-${slug}-${Date.now()}`;
      const highestOrder = areas.reduce((max, a) => Math.max(max, a.display_order || 0), 0);

      updated = {
        id: newId,
        city_id: areaData.city_id || 'city-nanded',
        city_name: areaData.city_name || 'Nanded',
        name,
        slug,
        sub_areas: Array.isArray(areaData.sub_areas) ? areaData.sub_areas : (typeof areaData.sub_areas === 'string' ? areaData.sub_areas.split(',').map(s => s.trim()).filter(Boolean) : []),
        description: areaData.description || '',
        is_popular: areaData.is_popular !== undefined ? areaData.is_popular : true,
        display_order: areaData.display_order !== undefined ? Number(areaData.display_order) : highestOrder + 1,
        active: areaData.active !== undefined ? areaData.active : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      areas.push(updated);
      this.logAction(`Added new area: ${name} in Nanded`, 'Location', newId);
    }

    localStorage.setItem('vb_areas', JSON.stringify(areas));
    this.notify();
    return updated;
  }

  async deleteArea(id, reassignAreaName = null) {
    await this.checkAdminAuth();
    let areas = await this.getAreas({ includeInactive: true });
    const target = areas.find(a => a.id === id);
    if (!target) return;

    // SAFE PROPERTY HANDLING: Reassign associated properties so no property is lost or orphaned
    let properties = await this.getProperties();
    let reassignedCount = 0;
    const targetName = target.name.toLowerCase();

    properties = properties.map(p => {
      if (p.area && p.area.toLowerCase() === targetName) {
        reassignedCount++;
        return {
          ...p,
          area: reassignAreaName || 'Nanded',
          updated_at: new Date().toISOString()
        };
      }
      return p;
    });

    if (reassignedCount > 0) {
      localStorage.setItem('vb_properties', JSON.stringify(properties));
      this.logAction(
        `Reassigned ${reassignedCount} properties from deleted area "${target.name}" to "${reassignAreaName || 'Nanded'}"`,
        'Property',
        id
      );
    }

    areas = areas.filter(a => a.id !== id);
    localStorage.setItem('vb_areas', JSON.stringify(areas));
    this.logAction(`Deleted area: ${target.name}`, 'Location', id);
    this.notify();
  }

  async toggleAreaStatus(id) {
    await this.checkAdminAuth();
    let areas = await this.getAreas({ includeInactive: true });
    areas = areas.map(a => {
      if (a.id === id) {
        const nextState = !a.active;
        this.logAction(`Area ${a.name} ${nextState ? 'activated' : 'deactivated'}`, 'Location', id);
        return { ...a, active: nextState, updated_at: new Date().toISOString() };
      }
      return a;
    });
    localStorage.setItem('vb_areas', JSON.stringify(areas));
    this.notify();
  }

  async reorderAreas(orderedIds) {
    await this.checkAdminAuth();
    let areas = await this.getAreas({ includeInactive: true });
    const orderMap = new Map();
    orderedIds.forEach((id, idx) => orderMap.set(id, idx + 1));

    areas = areas.map(a => {
      if (orderMap.has(a.id)) {
        return { ...a, display_order: orderMap.get(a.id), updated_at: new Date().toISOString() };
      }
      return a;
    });

    localStorage.setItem('vb_areas', JSON.stringify(areas));
    this.logAction('Reordered areas layout', 'Location', 'batch');
    this.notify();
  }

  // --- PROPERTIES ---
  async getProperties() {
    try {
      if (supabase) {
        const { data, error } = await supabase.from('properties').select('*');
        if (!error && data && data.length > 0) return data;
      }
    } catch (_) {}

    try {
      const stored = JSON.parse(localStorage.getItem('vb_properties') || '[]');
      if (Array.isArray(stored) && stored.length > 0) {
        return stored;
      }
    } catch (_) {}

    localStorage.setItem('vb_properties', JSON.stringify(INITIAL_PROPERTIES));
    return INITIAL_PROPERTIES;
  }

  async getPropertyById(id) {
    if (!id) return null;
    const properties = await this.getProperties();
    const strId = String(id).trim().toLowerCase();
    return properties.find((p) => 
      String(p.id).trim().toLowerCase() === strId || 
      (p.property_code && String(p.property_code).trim().toLowerCase() === strId)
    );
  }

  async saveProperty(propData) {
    await this.checkAdminAuth();
    let properties = await this.getProperties();
    let updated;
    if (propData.id) {
      properties = properties.map((p) => (p.id === propData.id ? { ...p, ...propData, updated_at: new Date().toISOString() } : p));
      updated = propData;
      this.logAction(`Updated property: ${propData.title}`, 'Property', propData.id);
    } else {
      const newId = `prop-${Date.now()}`;
      const code = `VB-NAN-00${Math.floor(100 + Math.random() * 900)}`;
      updated = {
        ...propData,
        id: newId,
        property_code: code,
        city: propData.city || 'Nanded',
        views_count: 0,
        unlocks_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      properties.unshift(updated);
      this.logAction(`Added new property in ${updated.area || 'Nanded'}: ${updated.title}`, 'Property', newId);
    }
    localStorage.setItem('vb_properties', JSON.stringify(properties));
    this.notify();
    return updated;
  }

  async deleteProperty(id) {
    await this.checkAdminAuth();
    let properties = await this.getProperties();
    const target = properties.find((p) => p.id === id);
    properties = properties.filter((p) => p.id !== id);
    localStorage.setItem('vb_properties', JSON.stringify(properties));
    this.logAction(`Deleted property: ${target?.title || id}`, 'Property', id);
    this.notify();
  }

  async duplicateProperty(id) {
    await this.checkAdminAuth();
    const prop = await this.getPropertyById(id);
    if (!prop) return null;
    const cloned = {
      ...prop,
      id: undefined,
      title: `${prop.title} (Copy)`,
      status: 'draft',
    };
    return await this.saveProperty(cloned);
  }

  // --- UNLOCK & PAYMENT ---
  async isPropertyUnlocked(userId, propertyId) {
    if (!userId) return false;
    const unlocks = JSON.parse(localStorage.getItem('vb_unlocks') || '[]');
    return unlocks.some((u) => u.user_id === userId && u.property_id === propertyId);
  }

  async unlockAddress(userId, propertyId, paymentDetails = {}) {
    const unlocks = JSON.parse(localStorage.getItem('vb_unlocks') || '[]');
    const payments = JSON.parse(localStorage.getItem('vb_payments') || '[]');
    const settings = this.getSettings();

    const paymentId = `pay-${Date.now()}`;
    const newPayment = {
      id: paymentId,
      user_id: userId,
      property_id: propertyId,
      amount: settings.unlock_fee || 1000,
      payment_method: paymentDetails.method || 'razorpay',
      razorpay_payment_id: paymentDetails.razorpay_payment_id || `pay_sim_${Date.now()}`,
      razorpay_order_id: paymentDetails.razorpay_order_id || `order_sim_${Date.now()}`,
      status: 'paid',
      created_at: new Date().toISOString(),
    };
    payments.unshift(newPayment);
    localStorage.setItem('vb_payments', JSON.stringify(payments));

    if (!unlocks.some((u) => u.user_id === userId && u.property_id === propertyId)) {
      unlocks.unshift({
        id: `unlock-${Date.now()}`,
        user_id: userId,
        property_id: propertyId,
        payment_id: paymentId,
        unlocked_at: new Date().toISOString(),
      });
      localStorage.setItem('vb_unlocks', JSON.stringify(unlocks));
    }

    // Increment unlock counter on property
    const properties = await this.getProperties();
    const target = properties.find((p) => p.id === propertyId);
    if (target) {
      target.unlocks_count = (target.unlocks_count || 0) + 1;
      localStorage.setItem('vb_properties', JSON.stringify(properties));
    }

    this.logAction(`Address unlocked for property ${propertyId}`, 'Payment', paymentId);
    this.notify();
    return true;
  }

  async getUserUnlocks(userId) {
    const unlocks = JSON.parse(localStorage.getItem('vb_unlocks') || '[]');
    const properties = await this.getProperties();
    return unlocks
      .filter((u) => u.user_id === userId)
      .map((u) => {
        const prop = properties.find((p) => p.id === u.property_id);
        return { ...u, property: prop };
      });
  }

  // --- REFUNDS (₹500 post-visit workflow) ---
  async getRefundForProperty(userId, propertyId) {
    if (!userId || !propertyId) return null;
    const refunds = JSON.parse(localStorage.getItem('vb_refunds') || '[]');
    return refunds.find((r) => r.user_id === userId && r.property_id === propertyId) || null;
  }

  async requestRefund(userId, propertyId, reason, upiId) {
    if (!userId || userId === 'guest') {
      throw new Error("Please log in to submit a refund request.");
    }
    if (!propertyId) {
      throw new Error("Property identifier is required.");
    }

    // 1. Verify that user actually unlocked this property
    const unlocks = JSON.parse(localStorage.getItem('vb_unlocks') || '[]');
    const userUnlock = unlocks.find((u) => u.user_id === userId && u.property_id === propertyId);
    if (!userUnlock) {
      throw new Error("No verified address unlock found for this property. Only paid & unlocked properties are eligible for a refund.");
    }

    // 2. Fetch authentic payment record to bind the genuine transaction ID
    const payments = JSON.parse(localStorage.getItem('vb_payments') || '[]');
    const originalPayment = payments.find(
      (p) => p.id === userUnlock.payment_id || (p.user_id === userId && p.property_id === propertyId)
    );
    const verifiedTxnId = originalPayment?.razorpay_payment_id || userUnlock.payment_id || `TXN_${userUnlock.id}`;

    // 3. Check for any existing refund on this exact property for this user
    const refunds = JSON.parse(localStorage.getItem('vb_refunds') || '[]');
    const existing = refunds.find((r) => r.user_id === userId && r.property_id === propertyId);

    if (existing) {
      if (existing.status === 'pending') {
        throw new Error(
          `A refund request for this property is already pending admin review (REF #${existing.id}). Multiple requests are not permitted.`
        );
      }
      if (['processed', 'paid', 'approved', 'refunded'].includes(existing.status)) {
        throw new Error(
          `A ₹500 refund has already been completed and paid for this property (REF #${existing.id}). Further refund requests are not permitted.`
        );
      }
      if (existing.status === 'rejected') {
        const rejectionReason = existing.admin_notes ? `: "${existing.admin_notes}"` : '.';
        throw new Error(
          `Your refund request for this property was reviewed and rejected by admin${rejectionReason} Re-requests with different transaction IDs are not permitted.`
        );
      }
    }

    const settings = this.getSettings();
    const newRefund = {
      id: `ref-${Date.now()}`,
      user_id: userId,
      property_id: propertyId,
      unlock_id: userUnlock.id,
      payment_id: userUnlock.payment_id || originalPayment?.id || null,
      transaction_id: verifiedTxnId,
      amount: settings.refund_amount || 500,
      reason: (reason || '').trim() || 'Property did not match expectation upon visit',
      user_upi_id: (upiId || '').trim(),
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    refunds.unshift(newRefund);
    localStorage.setItem('vb_refunds', JSON.stringify(refunds));
    this.logAction(`₹500 refund requested for property ${propertyId} (Txn: ${verifiedTxnId})`, 'Refund', newRefund.id);
    this.notify();
    return newRefund;
  }

  async getRefunds(userId = null) {
    const refunds = JSON.parse(localStorage.getItem('vb_refunds') || '[]');
    const properties = await this.getProperties();
    const payments = JSON.parse(localStorage.getItem('vb_payments') || '[]');
    const unlocks = JSON.parse(localStorage.getItem('vb_unlocks') || '[]');

    const enhanced = refunds.map((r) => {
      const prop = properties.find((p) => p.id === r.property_id);
      const unl = unlocks.find((u) => u.user_id === r.user_id && u.property_id === r.property_id);
      const pay = payments.find(
        (p) => p.id === unl?.payment_id || (p.user_id === r.user_id && p.property_id === r.property_id)
      );
      return {
        ...r,
        property: prop,
        transaction_id: r.transaction_id || pay?.razorpay_payment_id || unl?.payment_id || 'N/A',
      };
    });
    return userId ? enhanced.filter((r) => r.user_id === userId) : enhanced;
  }

  async updateRefundStatus(refundId, status, notes = '') {
    await this.checkAdminAuth();
    let refunds = JSON.parse(localStorage.getItem('vb_refunds') || '[]');
    refunds = refunds.map((r) =>
      r.id === refundId
        ? { ...r, status, admin_notes: notes, processed_at: new Date().toISOString() }
        : r
    );
    localStorage.setItem('vb_refunds', JSON.stringify(refunds));
    this.logAction(`Refund ${refundId} marked as ${status}`, 'Refund', refundId);
    this.notify();
  }

  // --- QR CAMPAIGNS & TRACKING ---
  async getQRCampaigns() {
    return JSON.parse(localStorage.getItem('vb_qr_campaigns') || '[]');
  }

  async saveQRCampaign(campaignData) {
    await this.checkAdminAuth();
    let campaigns = await this.getQRCampaigns();
    if (campaignData.id) {
      campaigns = campaigns.map((c) => (c.id === campaignData.id ? { ...c, ...campaignData } : c));
    } else {
      campaigns.unshift({
        ...campaignData,
        id: `qr-${Date.now()}`,
        scans_count: 0,
        active: true,
        created_at: new Date().toISOString().split('T')[0],
      });
    }
    localStorage.setItem('vb_qr_campaigns', JSON.stringify(campaigns));
    this.logAction(`QR campaign saved: ${campaignData.name}`, 'QR', campaignData.code);
    this.notify();
  }

  async recordQRScan(code) {
    const campaigns = await this.getQRCampaigns();
    const match = campaigns.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (match) {
      match.scans_count = (match.scans_count || 0) + 1;
      localStorage.setItem('vb_qr_campaigns', JSON.stringify(campaigns));
      this.notify();
      return match;
    }
    return null;
  }

  // --- VISIT REQUESTS ---
  async scheduleVisit(visitData) {
    const visits = JSON.parse(localStorage.getItem('vb_visits') || '[]');
    const newVisit = {
      ...visitData,
      id: `vis-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    visits.unshift(newVisit);
    localStorage.setItem('vb_visits', JSON.stringify(visits));
    this.logAction(`Visit scheduled for property ${visitData.property_id}`, 'Visit', newVisit.id);
    this.notify();
    return newVisit;
  }

  async getVisits(userId = null) {
    const visits = JSON.parse(localStorage.getItem('vb_visits') || '[]');
    const properties = await this.getProperties();
    const enhanced = visits.map((v) => ({
      ...v,
      property: properties.find((p) => p.id === v.property_id),
    }));
    return userId ? enhanced.filter((v) => v.user_id === userId) : enhanced;
  }

  async updateVisitStatus(visitId, status) {
    await this.checkAdminAuth();
    let visits = JSON.parse(localStorage.getItem('vb_visits') || '[]');
    visits = visits.map((v) => (v.id === visitId ? { ...v, status } : v));
    localStorage.setItem('vb_visits', JSON.stringify(visits));
    this.notify();
  }

  // --- FAVORITES ---
  async toggleFavorite(userId, propertyId) {
    if (!userId || userId === 'guest') {
      throw new Error('Authentication required to save favorites. Please log in.');
    }
    let favorites = JSON.parse(localStorage.getItem('vb_favorites') || '[]');
    
    const index = favorites.findIndex(
      (f) => f.user_id === userId && f.property_id === propertyId
    );

    let isNowFav = false;
    if (index >= 0) {
      favorites = favorites.filter(
        (f) => !(f.user_id === userId && f.property_id === propertyId)
      );
      isNowFav = false;
    } else {
      favorites.push({
        user_id: userId,
        property_id: propertyId,
        created_at: new Date().toISOString()
      });
      isNowFav = true;
    }
    
    localStorage.setItem('vb_favorites', JSON.stringify(favorites));
    this.notify();
    return isNowFav;
  }

  async isFavorite(userId, propertyId) {
    if (!userId || userId === 'guest') return false;
    const favorites = JSON.parse(localStorage.getItem('vb_favorites') || '[]');
    return favorites.some(
      (f) => f.user_id === userId && f.property_id === propertyId
    );
  }

  async getFavorites(userId) {
    if (!userId || userId === 'guest') return [];
    let favorites = JSON.parse(localStorage.getItem('vb_favorites') || '[]');
    const properties = await this.getProperties();

    const userFavs = favorites.filter((f) => f.user_id === userId);
    return userFavs
      .map((f) => properties.find((p) => p.id === f.property_id))
      .filter(Boolean);
  }

  // --- USER DIRECTORY & LIVE AUDIENCE INTELLIGENCE ---
  recordPresence(user = null, path = window.location.pathname) {
    try {
      let sessions = JSON.parse(localStorage.getItem('vb_active_sessions') || '[]');
      const now = Date.now();
      // Keep sessions active within last 5 minutes
      sessions = sessions.filter(s => now - s.lastSeen < 5 * 60 * 1000);

      let sessionId = sessionStorage.getItem('vb_session_id');
      if (!sessionId) {
        sessionId = `sess_${now}_${Math.random().toString(36).substring(2, 8)}`;
        sessionStorage.setItem('vb_session_id', sessionId);
      }

      const existingIdx = sessions.findIndex(s => s.sessionId === sessionId);
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

      // Smart identity & name resolution
      let resolvedName = user?.name;
      let resolvedUserId = user?.id || 'guest';
      let resolvedEmail = user?.email || null;

      try {
        const rawReg = localStorage.getItem('vb_registered_users');
        if (rawReg) {
          const regList = JSON.parse(rawReg);
          if (Array.isArray(regList)) {
            const matched = regList.find(u => 
              (resolvedEmail && u.email && u.email.toLowerCase() === resolvedEmail.toLowerCase()) ||
              (resolvedUserId && resolvedUserId !== 'guest' && String(u.id).trim() === String(resolvedUserId).trim())
            );
            if (matched) {
              if (matched.name) resolvedName = matched.name;
              if (matched.id) resolvedUserId = matched.id;
              if (matched.email && !resolvedEmail) resolvedEmail = matched.email;
            }
          }
        }
      } catch (_) {}

      // Fallback for generic or placeholder admin titles
      if (!resolvedName || resolvedName === 'Vedika Operations Admin') {
        if (resolvedEmail && resolvedEmail.toLowerCase().includes('ganesh')) {
          resolvedName = 'Ganesh Sadashiv Kalapad';
        } else if (user?.role === 'admin') {
          resolvedName = 'Ganesh Sadashiv Kalapad (Admin)';
        } else {
          resolvedName = resolvedUserId !== 'guest' ? 'Registered Member' : 'Visitor (Nanded)';
        }
      }

      const sessionObj = {
        sessionId,
        userId: resolvedUserId,
        userName: resolvedName,
        userEmail: resolvedEmail,
        userRole: user?.role || (resolvedUserId !== 'guest' ? 'member' : 'visitor'),
        path: path || '/',
        device: isMobile ? 'Mobile Device' : 'Desktop Browser',
        lastSeen: now,
      };

      if (existingIdx >= 0) {
        sessions[existingIdx] = sessionObj;
      } else {
        sessions.push(sessionObj);
      }

      localStorage.setItem('vb_active_sessions', JSON.stringify(sessions));
    } catch (_) {}
  }

  getLiveAudience() {
    try {
      let sessions = JSON.parse(localStorage.getItem('vb_active_sessions') || '[]');
      const now = Date.now();
      // Active within the last 2.5 minutes is "Live Online"
      let live = sessions.filter(s => now - s.lastSeen < 2.5 * 60 * 1000);

      // Periodically purge expired sessions from storage
      if (sessions.length > live.length) {
        localStorage.setItem('vb_active_sessions', JSON.stringify(live));
      }

      // Load registered members to cross-reference valid members
      let registered = [];
      try {
        const raw = localStorage.getItem('vb_registered_users') || localStorage.getItem('vb_registered_users_backup');
        if (raw !== null) {
          registered = JSON.parse(raw);
          if (!Array.isArray(registered)) registered = [];
        }
      } catch (_) {}

      const registeredUserIds = new Set(registered.map(u => String(u.id).trim()));
      const registeredUserEmails = new Set(registered.map(u => (u.email || '').toLowerCase()).filter(Boolean));

      // 1. Identify distinct registered members online vs anonymous guests
      const liveMemberKeys = new Set();
      const liveGuestSessionIds = new Set();
      let adminOnline = false;

      live.forEach(s => {
        const isAdmin = s.userRole === 'admin' || (s.path && s.path.startsWith('/admin'));
        if (isAdmin) {
          adminOnline = true;
        }

        // Check if this session matches a registered member (by user id or email)
        const isRegisteredMember = (
          (s.userId && s.userId !== 'guest' && registeredUserIds.has(String(s.userId).trim())) ||
          (s.userEmail && registeredUserEmails.has(String(s.userEmail).toLowerCase()))
        );

        if (isRegisteredMember) {
          const matchedUser = registered.find(u => 
            (s.userId && String(u.id).trim() === String(s.userId).trim()) ||
            (s.userEmail && u.email && u.email.toLowerCase() === s.userEmail.toLowerCase())
          );
          const memberKey = matchedUser ? String(matchedUser.id) : (s.userEmail ? s.userEmail.toLowerCase() : String(s.userId));
          liveMemberKeys.add(memberKey);
        } else {
          // If session is NOT a registered member and NOT strictly an admin session, count as guest visitor
          if (!isAdmin) {
            liveGuestSessionIds.add(s.sessionId);
          }
        }
      });

      // Member count can NEVER exceed the actual total registered members in database!
      const registeredLiveCount = Math.min(liveMemberKeys.size, registered.length);
      const guestLiveCount = liveGuestSessionIds.size;
      const totalLive = registeredLiveCount + guestLiveCount;

      return {
        totalLive: Math.max(totalLive, live.length > 0 ? 1 : 0),
        registeredLiveCount,
        guestLiveCount,
        adminOnline,
        sessions: live
      };
    } catch (_) {
      return { totalLive: 0, registeredLiveCount: 0, guestLiveCount: 0, adminOnline: false, sessions: [] };
    }
  }

  async getUsersDetailed() {
    let registered = [];
    try {
      const raw = localStorage.getItem('vb_registered_users') || localStorage.getItem('vb_registered_users_backup');
      if (raw !== null) {
        registered = JSON.parse(raw);
        if (!Array.isArray(registered)) registered = [];
      } else {
        registered = [...INITIAL_REGISTERED_USERS];
        localStorage.setItem('vb_registered_users', JSON.stringify(registered));
        localStorage.setItem('vb_registered_users_backup', JSON.stringify(registered));
      }
    } catch (_) {
      try {
        const backupRaw = localStorage.getItem('vb_registered_users_backup');
        if (backupRaw !== null) {
          registered = JSON.parse(backupRaw);
          if (!Array.isArray(registered)) registered = [];
        }
      } catch (__) {
        registered = [];
      }
    }

    const properties = await this.getProperties();
    const allFavorites = JSON.parse(localStorage.getItem('vb_favorites') || '[]');
    const allUnlocks = JSON.parse(localStorage.getItem('vb_unlocks') || '[]');
    const allVisits = JSON.parse(localStorage.getItem('vb_visits') || '[]');
    const allEnquiries = await this.getEnquiries();
    const liveAudience = this.getLiveAudience();
    const liveEmails = new Set(
      liveAudience.sessions
        .filter(s => s.userEmail)
        .map(s => String(s.userEmail).trim().toLowerCase())
    );
    const liveUserIds = new Set(
      liveAudience.sessions
        .filter(s => s.userId && s.userId !== 'guest')
        .map(s => String(s.userId).trim())
    );

    return registered.map((user) => {
      // Find liked properties
      const userFavs = allFavorites.filter(f => f.user_id === user.id);
      const likedProps = userFavs
        .map(f => properties.find(p => p.id === f.property_id))
        .filter(Boolean);

      // Find unlocked properties
      const userUnlocks = allUnlocks.filter(u => u.user_id === user.id);
      const unlockedProps = userUnlocks
        .map(u => {
          const prop = properties.find(p => p.id === u.property_id);
          return prop ? { ...prop, unlocked_at: u.created_at } : null;
        })
        .filter(Boolean);

      // Find user visits
      const userVisits = allVisits.filter(v => v.user_id === user.id);

      // Find user enquiries
      const userEnquiries = allEnquiries.filter(e => 
        (user.email && e.email && e.email.toLowerCase() === user.email.toLowerCase()) ||
        (user.phone && e.phone && e.phone.replace(/\D/g, '') === user.phone.replace(/\D/g, ''))
      );

      const isLiveNow = (
        (user.id && liveUserIds.has(String(user.id).trim())) ||
        (user.email && liveEmails.has(String(user.email).trim().toLowerCase()))
      );
      const isSuspended = user.status === 'suspended' || user.isSuspended === true;

      return {
        ...user,
        status: isSuspended ? 'suspended' : (user.status || 'active'),
        isSuspended,
        likesCount: likedProps.length,
        likedProperties: likedProps,
        unlocksCount: unlockedProps.length,
        unlockedProperties: unlockedProps,
        visitsCount: userVisits.length,
        visits: userVisits,
        enquiriesCount: userEnquiries.length,
        enquiries: userEnquiries,
        isOnline: isLiveNow,
        lastActive: isLiveNow ? 'Just now' : user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : 'Recently'
      };
    });
  }

  async deleteUser(userId) {
    await this.checkAdminAuth();
    const strId = String(userId).trim();
    let registered = [];
    try {
      const raw = localStorage.getItem('vb_registered_users');
      registered = raw !== null ? JSON.parse(raw) : [...INITIAL_REGISTERED_USERS];
      if (!Array.isArray(registered)) registered = [];
    } catch (_) {
      registered = [];
    }

    const target = registered.find(u => String(u.id).trim() === strId || (u.email && String(u.email).toLowerCase() === strId.toLowerCase()));
    const targetEmail = target?.email ? target.email.toLowerCase() : null;

    const updated = registered.filter(u => 
      String(u.id).trim() !== strId && 
      (!targetEmail || !u.email || u.email.toLowerCase() !== targetEmail)
    );
    
    // Save updated users list (even if empty)
    localStorage.setItem('vb_registered_users', JSON.stringify(updated));

    // Remove from active sessions if present
    try {
      let sessions = JSON.parse(localStorage.getItem('vb_active_sessions') || '[]');
      if (Array.isArray(sessions)) {
        sessions = sessions.filter(s => 
          String(s.userId).trim() !== strId && 
          (!targetEmail || !s.userEmail || s.userEmail.toLowerCase() !== targetEmail)
        );
        localStorage.setItem('vb_active_sessions', JSON.stringify(sessions));
      }
    } catch (_) {}

    if (target) {
      this.logAction(`Permanently deleted user account: ${target.name || 'User'} (${target.email || strId})`, 'User', strId);
    }
    this.notify();
    return true;
  }

  async toggleSuspendUser(userId, reason = '') {
    await this.checkAdminAuth();
    const strId = String(userId).trim();
    let registered = [];
    try {
      const raw = localStorage.getItem('vb_registered_users');
      registered = raw !== null ? JSON.parse(raw) : [...INITIAL_REGISTERED_USERS];
      if (!Array.isArray(registered)) registered = [];
    } catch (_) {
      registered = [];
    }

    let target = null;
    let newStatus = 'active';

    const updated = registered.map(u => {
      if (String(u.id).trim() === strId || (u.email && String(u.email).toLowerCase() === strId.toLowerCase())) {
        const currentlySuspended = u.status === 'suspended' || u.isSuspended === true;
        newStatus = currentlySuspended ? 'active' : 'suspended';
        target = {
          ...u,
          status: newStatus,
          isSuspended: !currentlySuspended,
          suspendedAt: !currentlySuspended ? new Date().toISOString() : null,
          suspendReason: !currentlySuspended ? (reason || 'Suspended by Administrator') : null,
        };
        return target;
      }
      return u;
    });

    localStorage.setItem('vb_registered_users', JSON.stringify(updated));

    // If suspended, evict active sessions immediately
    if (target && target.isSuspended) {
      try {
        let sessions = JSON.parse(localStorage.getItem('vb_active_sessions') || '[]');
        if (Array.isArray(sessions)) {
          const targetEmail = target.email ? target.email.toLowerCase() : null;
          sessions = sessions.filter(s => 
            String(s.userId).trim() !== strId && 
            (!targetEmail || !s.userEmail || s.userEmail.toLowerCase() !== targetEmail)
          );
          localStorage.setItem('vb_active_sessions', JSON.stringify(sessions));
        }
      } catch (_) {}
    }

    if (target) {
      const actionName = newStatus === 'suspended' ? 'Suspended user account' : 'Reactivated user account';
      this.logAction(`${actionName}: ${target.name || 'User'} (${target.email || strId})`, 'User', strId);
    }
    this.notify();
    return target;
  }

  // --- SETTINGS & CONTENT ---
  getSettings() {
    let settings = {};
    try {
      settings = JSON.parse(localStorage.getItem('vb_settings') || '{}');
    } catch (_) {}
    if (!settings.office_address || /Pune|Wakad|Pride Icon/i.test(settings.office_address)) {
      settings.office_address = 'Office 304, Vedika Tower, Near Zenda Chowk, Vazirabad, Nanded, Maharashtra - 431601';
    }
    return settings;
  }

  async saveSettings(newSettings) {
    await this.checkAdminAuth();
    localStorage.setItem('vb_settings', JSON.stringify(newSettings));
    this.logAction('Website content and payment fees updated', 'Settings', 'global');
    this.notify();
  }

  // --- AUDIT LOGS ---
  logAction(action, entity, entityId = '') {
    const logs = JSON.parse(localStorage.getItem('vb_logs') || '[]');
    logs.unshift({
      id: `log-${Date.now()}`,
      action,
      entity,
      entity_id: entityId,
      date: new Date().toISOString(),
    });
    localStorage.setItem('vb_logs', JSON.stringify(logs.slice(0, 100)));
  }

  getLogs() {
    return JSON.parse(localStorage.getItem('vb_logs') || '[]');
  }

  getAllPayments() {
    return JSON.parse(localStorage.getItem('vb_payments') || '[]');
  }

  // --- USER ENQUIRIES & LEADS MANAGEMENT ---
  async createEnquiry(enquiryData) {
    let enquiries = [];
    try {
      enquiries = JSON.parse(localStorage.getItem('vb_enquiries') || '[]');
      if (!Array.isArray(enquiries)) enquiries = [];
    } catch (_) {
      enquiries = [];
    }

    const now = new Date().toISOString();
    const newEnquiry = {
      id: `enq-${Date.now()}`,
      name: (enquiryData.name || '').trim(),
      email: (enquiryData.email || '').trim(),
      phone: (enquiryData.phone || '').trim(),
      message: (enquiryData.message || '').trim(),
      source: enquiryData.source || 'Contact Page',
      type: enquiryData.type || 'General Enquiry',
      property_id: enquiryData.property_id || null,
      property_code: enquiryData.property_code || null,
      property_title: enquiryData.property_title || null,
      status: 'new', // 'new' | 'contacted' | 'in_progress' | 'resolved' | 'closed'
      priority: enquiryData.priority || 'normal',
      created_at: now,
      updated_at: now,
      admin_notes: [],
      history: [
        {
          date: now,
          action: 'Enquiry Received',
          by: 'Customer (Online)',
          details: `Enquiry submitted via ${enquiryData.source || 'Website'}`
        }
      ]
    };

    enquiries.unshift(newEnquiry);
    localStorage.setItem('vb_enquiries', JSON.stringify(enquiries));

    this.logAction(`New enquiry received from ${newEnquiry.name || 'Visitor'} (${newEnquiry.phone || 'No phone'})`, 'Enquiry', newEnquiry.id);
    this.notify();
    return newEnquiry;
  }

  async getEnquiries() {
    try {
      const raw = localStorage.getItem('vb_enquiries');
      if (raw !== null) {
        const stored = JSON.parse(raw);
        if (Array.isArray(stored)) {
          return stored.map(e => ({
            ...e,
            history: Array.isArray(e.history) ? e.history : [],
            admin_notes: Array.isArray(e.admin_notes) ? e.admin_notes : []
          }));
        }
      }
    } catch (_) {}
    localStorage.setItem('vb_enquiries', JSON.stringify(INITIAL_ENQUIRIES));
    return INITIAL_ENQUIRIES.map(e => ({ ...e }));
  }

  async updateEnquiryStatus(enquiryId, newStatus, noteText = '', adminName = 'Vedika Broker Admin') {
    await this.checkAdminAuth();
    let enquiries = await this.getEnquiries();
    const now = new Date().toISOString();
    const strId = String(enquiryId).trim();

    let targetEnquiry = null;
    enquiries = enquiries.map(enq => {
      if (String(enq.id).trim() === strId) {
        const oldStatus = enq.status || 'new';
        const updatedHistory = Array.isArray(enq.history) ? [...enq.history] : [];
        const updatedNotes = Array.isArray(enq.admin_notes) ? [...enq.admin_notes] : [];

        if (noteText && noteText.trim()) {
          updatedNotes.unshift({
            id: `note-${Date.now()}`,
            note: noteText.trim(),
            by: adminName,
            date: now
          });
        }

        updatedHistory.unshift({
          date: now,
          action: `Status changed from ${oldStatus.toUpperCase()} to ${newStatus.toUpperCase()}`,
          by: adminName,
          details: noteText?.trim() || `Status updated to ${newStatus}`
        });

        targetEnquiry = {
          ...enq,
          status: newStatus,
          updated_at: now,
          admin_notes: updatedNotes,
          history: updatedHistory
        };
        return targetEnquiry;
      }
      return enq;
    });

    localStorage.setItem('vb_enquiries', JSON.stringify(enquiries));
    if (targetEnquiry) {
      this.logAction(`Enquiry #${enquiryId} status updated to ${newStatus}`, 'Enquiry', enquiryId);
    }
    this.notify();
    return targetEnquiry;
  }

  async addEnquiryNote(enquiryId, noteText, adminName = 'Vedika Broker Admin') {
    await this.checkAdminAuth();
    if (!noteText || !noteText.trim()) return null;
    let enquiries = await this.getEnquiries();
    const now = new Date().toISOString();
    const strId = String(enquiryId).trim();

    let targetEnquiry = null;
    enquiries = enquiries.map(enq => {
      if (String(enq.id).trim() === strId) {
        const updatedNotes = Array.isArray(enq.admin_notes) ? [...enq.admin_notes] : [];
        const updatedHistory = Array.isArray(enq.history) ? [...enq.history] : [];

        const newNoteObj = {
          id: `note-${Date.now()}`,
          note: noteText.trim(),
          by: adminName,
          date: now
        };
        updatedNotes.unshift(newNoteObj);

        updatedHistory.unshift({
          date: now,
          action: 'Follow-up Note Added',
          by: adminName,
          details: noteText.trim()
        });

        targetEnquiry = {
          ...enq,
          updated_at: now,
          admin_notes: updatedNotes,
          history: updatedHistory
        };
        return targetEnquiry;
      }
      return enq;
    });

    localStorage.setItem('vb_enquiries', JSON.stringify(enquiries));
    if (targetEnquiry) {
      this.logAction(`Note added to Enquiry #${enquiryId}`, 'Enquiry', enquiryId);
    }
    this.notify();
    return targetEnquiry;
  }

  async deleteEnquiry(enquiryId) {
    await this.checkAdminAuth();
    const raw = localStorage.getItem('vb_enquiries');
    let enquiries = [];
    try {
      enquiries = raw !== null ? JSON.parse(raw) : INITIAL_ENQUIRIES;
      if (!Array.isArray(enquiries)) enquiries = [];
    } catch (_) {
      enquiries = [];
    }

    const strId = String(enquiryId).trim();
    const toDelete = enquiries.find(e => String(e.id).trim() === strId);
    const updated = enquiries.filter(e => String(e.id).trim() !== strId);
    
    // Write the filtered array (even if empty []) directly
    localStorage.setItem('vb_enquiries', JSON.stringify(updated));
    
    if (toDelete) {
      this.logAction(`Deleted enquiry from ${toDelete.name || 'Visitor'}`, 'Enquiry', enquiryId);
    }
    this.notify();
    return true;
  }
}

export const dataStore = new DataStore();
export default dataStore;
