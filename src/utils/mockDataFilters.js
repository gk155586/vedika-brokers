// src/utils/mockDataFilters.js
// Rock-solid sanitizer and filter to guarantee strictly ZERO mock / dummy users
// and zero mock / default enquiries across the platform.

export const MOCK_USER_IDS = new Set([
  'user-101',
  'user-102',
  'user-103',
  'user-104',
  'user-105',
  'user-106',
]);

export const MOCK_ENQUIRY_IDS = new Set([
  'enq-179001',
  'enq-179002',
  'enq-179003',
  'enq-179004',
]);

export const MOCK_EMAIL_KEYWORDS = [
  'rajesh.kulkarni',
  'pooja.deshmukh',
  'amit.shinde',
  'dr.amit.shinde',
  'sanjay.patil',
  'sneha.joshi',
  'vikram.more',
  'nandedclinic.com',
];

export const MOCK_NAME_KEYWORDS = [
  'rajesh kulkarni',
  'pooja deshmukh',
  'amit shinde',
  'dr. amit shinde',
  'sanjay patil',
  'sneha joshi',
  'vikram more',
];

export const MOCK_PHONE_DIGITS = [
  '9822014820',
  '9423187654',
  '9765432109',
  '9158098765',
  '9922543210',
  '9890123456',
];

/**
 * Checks whether a user object is a seeded mock / test user.
 */
export function isMockUser(user) {
  if (!user || typeof user !== 'object') return false;

  const id = String(user.id || '').trim();
  const email = String(user.email || '').toLowerCase().trim();
  const name = String(user.name || '').toLowerCase().trim();
  const phone = String(user.phone || '').replace(/\D/g, '');

  // 1. Check ID
  if (MOCK_USER_IDS.has(id)) return true;
  if (/^user-10[1-9]$/i.test(id)) return true;
  if (/^mock-/i.test(id)) return true;

  // 2. Check Email
  if (email) {
    if (MOCK_EMAIL_KEYWORDS.some((kw) => email.includes(kw))) return true;
  }

  // 3. Check Name
  if (name) {
    if (MOCK_NAME_KEYWORDS.some((kw) => name.includes(kw))) return true;
  }

  // 4. Check Phone
  if (phone) {
    if (MOCK_PHONE_DIGITS.some((digits) => phone.includes(digits))) return true;
  }

  return false;
}

/**
 * Checks whether an enquiry object is a seeded mock / default enquiry.
 */
export function isMockEnquiry(enquiry) {
  if (!enquiry || typeof enquiry !== 'object') return false;

  const id = String(enquiry.id || '').trim();
  const email = String(enquiry.email || '').toLowerCase().trim();
  const name = String(enquiry.name || '').toLowerCase().trim();
  const phone = String(enquiry.phone || '').replace(/\D/g, '');

  // 1. Check ID
  if (MOCK_ENQUIRY_IDS.has(id)) return true;
  if (/^enq-17900[1-9]$/i.test(id)) return true;
  if (/^mock-/i.test(id)) return true;

  // 2. Check Email
  if (email) {
    if (MOCK_EMAIL_KEYWORDS.some((kw) => email.includes(kw))) return true;
  }

  // 3. Check Name
  if (name) {
    if (MOCK_NAME_KEYWORDS.some((kw) => name.includes(kw))) return true;
  }

  // 4. Check Phone
  if (phone) {
    if (MOCK_PHONE_DIGITS.some((digits) => phone.includes(digits))) return true;
  }

  return false;
}

/**
 * Sweeps localStorage and purges all mock users, enquiries, favorites, unlocks, visits, and active sessions.
 * Returns { purgedUsersCount, purgedEnquiriesCount }
 */
export function purgeAllMockData() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { purgedUsersCount: 0, purgedEnquiriesCount: 0 };
  }

  let purgedUsersCount = 0;
  let purgedEnquiriesCount = 0;

  try {
    // 1. Remove obsolete legacy key
    localStorage.removeItem('vb_users');

    // 2. Purge mock users from primary and backup stores
    let registered = [];
    try {
      const raw = localStorage.getItem('vb_registered_users') || localStorage.getItem('vb_registered_users_backup');
      if (raw) registered = JSON.parse(raw);
      if (!Array.isArray(registered)) registered = [];
    } catch (_) {
      registered = [];
    }

    const initialUsersLen = registered.length;
    const cleanUsers = registered.filter((u) => !isMockUser(u));
    purgedUsersCount = initialUsersLen - cleanUsers.length;

    localStorage.setItem('vb_registered_users', JSON.stringify(cleanUsers));
    localStorage.setItem('vb_registered_users_backup', JSON.stringify(cleanUsers));

    // 3. Purge mock enquiries
    let enquiries = [];
    try {
      const rawEnq = localStorage.getItem('vb_enquiries');
      if (rawEnq) enquiries = JSON.parse(rawEnq);
      if (!Array.isArray(enquiries)) enquiries = [];
    } catch (_) {
      enquiries = [];
    }

    const initialEnqLen = enquiries.length;
    const cleanEnquiries = enquiries.filter((e) => !isMockEnquiry(e));
    purgedEnquiriesCount = initialEnqLen - cleanEnquiries.length;

    localStorage.setItem('vb_enquiries', JSON.stringify(cleanEnquiries));

    // 4. Purge mock user favorites
    try {
      const favsRaw = localStorage.getItem('vb_favorites');
      if (favsRaw) {
        const favs = JSON.parse(favsRaw);
        if (Array.isArray(favs)) {
          const cleanFavs = favs.filter(
            (f) => !f || (!/^user-10[1-9]$/i.test(String(f.user_id || '')) && !/^mock-/i.test(String(f.user_id || '')))
          );
          localStorage.setItem('vb_favorites', JSON.stringify(cleanFavs));
        }
      }
    } catch (_) {}

    // 5. Purge mock user unlocks
    try {
      const unlocksRaw = localStorage.getItem('vb_unlocks');
      if (unlocksRaw) {
        const unlocks = JSON.parse(unlocksRaw);
        if (Array.isArray(unlocks)) {
          const cleanUnlocks = unlocks.filter(
            (u) => !u || (!/^user-10[1-9]$/i.test(String(u.user_id || '')) && !/^mock-/i.test(String(u.user_id || '')))
          );
          localStorage.setItem('vb_unlocks', JSON.stringify(cleanUnlocks));
        }
      }
    } catch (_) {}

    // 6. Purge mock user visits
    try {
      const visitsRaw = localStorage.getItem('vb_visits');
      if (visitsRaw) {
        const visits = JSON.parse(visitsRaw);
        if (Array.isArray(visits)) {
          const cleanVisits = visits.filter(
            (v) => !v || (!/^user-10[1-9]$/i.test(String(v.user_id || '')) && !/^mock-/i.test(String(v.user_id || '')))
          );
          localStorage.setItem('vb_visits', JSON.stringify(cleanVisits));
        }
      }
    } catch (_) {}

    // 7. Purge mock active sessions
    try {
      const sessRaw = localStorage.getItem('vb_active_sessions');
      if (sessRaw) {
        const sessions = JSON.parse(sessRaw);
        if (Array.isArray(sessions)) {
          const cleanSessions = sessions.filter(
            (s) => !isMockUser({ id: s.userId, email: s.userEmail, name: s.userName, phone: s.phone })
          );
          localStorage.setItem('vb_active_sessions', JSON.stringify(cleanSessions));
        }
      }
    } catch (_) {}

    // 8. Purge mock property unlock counters: ensure unlocks_count reflects only genuine transactions
    try {
      const propsRaw = localStorage.getItem('vb_properties');
      if (propsRaw) {
        const props = JSON.parse(propsRaw);
        if (Array.isArray(props)) {
          const rawUnlocks = localStorage.getItem('vb_unlocks');
          let currentUnlocks = [];
          try {
            currentUnlocks = JSON.parse(rawUnlocks || '[]');
          } catch (_) {
            currentUnlocks = [];
          }
          if (!Array.isArray(currentUnlocks)) currentUnlocks = [];

          const realCounts = {};
          currentUnlocks.forEach((u) => {
            if (u && u.property_id) {
              realCounts[u.property_id] = (realCounts[u.property_id] || 0) + 1;
            }
          });

          const sanitizedProps = props.map((p) => ({
            ...p,
            unlocks_count: realCounts[p.id] || 0,
          }));
          localStorage.setItem('vb_properties', JSON.stringify(sanitizedProps));
        }
      }
    } catch (_) {}
  } catch (err) {
    console.warn('Notice during mock data purge:', err);
  }

  return { purgedUsersCount, purgedEnquiriesCount };
}

// Self-execute immediately on module load in any client browser environment
if (typeof window !== 'undefined') {
  try {
    purgeAllMockData();
  } catch (_) {}
}
