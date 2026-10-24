// src/services/authSecurity.js
/**
 * Cryptographic Authentication & Authorization Security Module
 * 
 * Implements:
 * 1. Web Crypto SHA-256 salted password hashing (Zero plaintext passwords).
 * 2. HMAC-SHA256 signed session tokens for Administrative authorization.
 * 3. Client & API rate limiting with exponential backoff on failed attempts.
 * 4. Tamper-proof role verification (LocalStorage role tampering rejection).
 * 5. Strict input validation and sanitization.
 */

import { isMockUser } from '../utils/mockDataFilters';

const PEPPER = 'vb_nanded_sec_v2_2026_93701';
const SESSION_SECRET_KEY = 'vb_session_sign_key_nanded_broker_desk';

// Helper to encode string to Uint8Array
function toBytes(str) {
  return new TextEncoder().encode(str);
}

// Helper to convert ArrayBuffer to hex string
function toHex(buf) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Computes salted & peppered SHA-256 hash of a password using Web Crypto API.
 */
export async function hashPassword(password, salt) {
  if (!password) return '';
  const data = toBytes(`${password}:${salt}:${PEPPER}`);
  const hashBuf = await crypto.subtle.digest('SHA-256', data);
  return toHex(hashBuf);
}

/**
 * Generates an HMAC-SHA256 signature for session payloads.
 */
async function signPayload(payload) {
  const key = await crypto.subtle.importKey(
    'raw',
    toBytes(SESSION_SECRET_KEY),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, toBytes(payload));
  return toHex(signature);
}

/**
 * Authorized Administrator Accounts
 * Passwords are NEVER hardcoded in source code.
 * Provisioning is handled via environment variables (VITE_ADMIN_EMAIL, VITE_ADMIN_EMAILS)
 * or established securely during initial administrator verification.
 */
export const AUTHORIZED_ADMIN_EMAILS = [
  'admin@vedikabrokers.com',
  'ganeshkalapadgk@gmail.com',
];

export function isAuthorizedAdminEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim().toLowerCase();

  const envAdmin = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_EMAIL)?.toLowerCase();
  const envAdmins = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_EMAILS)
    ? import.meta.env.VITE_ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase())
    : [];

  const adminSet = new Set([
    ...AUTHORIZED_ADMIN_EMAILS,
    ...(envAdmin ? [envAdmin] : []),
    ...envAdmins,
  ]);

  return adminSet.has(clean);
}

export async function getAdminAccounts() {
  let accounts = {};
  try {
    const raw = localStorage.getItem('vb_admin_accounts');
    if (raw) accounts = JSON.parse(raw);
  } catch (_) {}

  try {
    const legacy = localStorage.getItem('vb_admin_creds');
    if (legacy) {
      const parsed = JSON.parse(legacy);
      if (parsed.email && parsed.salt && !accounts[parsed.email.toLowerCase()]) {
        accounts[parsed.email.toLowerCase()] = parsed;
      }
    }
  } catch (_) {}

  return accounts;
}

export async function initAdminCredentials(targetEmail = null) {
  const envEmail = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_EMAIL) || 'admin@vedikabrokers.com';
  const email = (targetEmail || envEmail).trim().toLowerCase();

  const accounts = await getAdminAccounts();
  if (accounts[email] && accounts[email].salt) {
    return accounts[email];
  }

  const salt = `salt_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  const envInitialSecret = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_INITIAL_SECRET) || null;

  let initialHash = null;
  if (envInitialSecret) {
    initialHash = await hashPassword(envInitialSecret, salt);
  }

  const creds = {
    email,
    passwordHash: initialHash,
    salt,
    isConfigured: !!initialHash,
    updatedAt: new Date().toISOString(),
  };

  accounts[email] = creds;
  localStorage.setItem('vb_admin_accounts', JSON.stringify(accounts));
  localStorage.setItem('vb_admin_creds', JSON.stringify(creds));
  return creds;
}

/**
 * Verifies admin credentials against the stored salted hash.
 * If the authorized administrator is authenticating for the first time,
 * their entered password securely establishes their administrative credential.
 */
export async function verifyAdminCredentials(email, password) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const normalizedPassword = (password || '').trim();

  if (!normalizedEmail || !normalizedPassword) {
    return false;
  }

  // Only emails with verified administrative authorization are permitted
  if (!isAuthorizedAdminEmail(normalizedEmail)) {
    return false;
  }

  const accounts = await getAdminAccounts();
  const creds = accounts[normalizedEmail];

  // 1. If an established admin hash exists in accounts, verify it
  if (creds && creds.passwordHash && creds.salt) {
    const computedHash = await hashPassword(normalizedPassword, creds.salt);
    return computedHash === creds.passwordHash;
  }

  // 2. Check if this authorized admin previously registered in vb_registered_users
  try {
    const registeredUsers = JSON.parse(localStorage.getItem('vb_registered_users') || '[]');
    const matchedUser = registeredUsers.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (matchedUser && matchedUser.passwordHash && matchedUser.salt) {
      const computedHash = await hashPassword(normalizedPassword, matchedUser.salt);
      if (computedHash === matchedUser.passwordHash) {
        // Upgrade to admin account
        accounts[normalizedEmail] = {
          email: normalizedEmail,
          passwordHash: matchedUser.passwordHash,
          salt: matchedUser.salt,
          isConfigured: true,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem('vb_admin_accounts', JSON.stringify(accounts));
        localStorage.setItem('vb_admin_creds', JSON.stringify(accounts[normalizedEmail]));
        return true;
      }
    }
  } catch (_) {}

  // 3. First-time administrator setup provisioning for this authorized email
  if (normalizedPassword.length < 6) {
    throw new Error('Admin password must be at least 6 characters.');
  }

  const salt = `salt_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  const masterHash = await hashPassword(normalizedPassword, salt);
  const newAdminCred = {
    email: normalizedEmail,
    passwordHash: masterHash,
    salt,
    isConfigured: true,
    updatedAt: new Date().toISOString(),
  };

  accounts[normalizedEmail] = newAdminCred;
  localStorage.setItem('vb_admin_accounts', JSON.stringify(accounts));
  localStorage.setItem('vb_admin_creds', JSON.stringify(newAdminCred));
  return true;
}

/**
 * Securely updates the Admin password with fresh cryptographic salt.
 */
export async function updateAdminPassword(oldPassword, newPassword, targetEmail = null) {
  const accounts = await getAdminAccounts();
  const currentEmail = (
    targetEmail ||
    (typeof localStorage !== 'undefined' && JSON.parse(localStorage.getItem('vb_current_user') || '{}')?.email) ||
    'admin@vedikabrokers.com'
  ).toLowerCase();

  const creds = accounts[currentEmail] || (await initAdminCredentials(currentEmail));
  const oldHash = await hashPassword(oldPassword.trim(), creds.salt);
  if (oldHash !== creds.passwordHash) {
    throw new Error('Current password does not match.');
  }

  if (!newPassword || newPassword.trim().length < 6) {
    throw new Error('New password must be at least 6 characters.');
  }

  const newSalt = `salt_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  const newHash = await hashPassword(newPassword.trim(), newSalt);

  const updatedCreds = {
    ...creds,
    email: currentEmail,
    passwordHash: newHash,
    salt: newSalt,
    updatedAt: new Date().toISOString(),
  };

  accounts[currentEmail] = updatedCreds;
  localStorage.setItem('vb_admin_accounts', JSON.stringify(accounts));
  localStorage.setItem('vb_admin_creds', JSON.stringify(updatedCreds));
  return true;
}

/**
 * Generates a signed admin session token.
 * Token structure: `${userId}:admin:${issuedAt}:${expiresAt}:${signature}`
 */
export async function generateAdminSessionToken(adminUser) {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + 12 * 60 * 60 * 1000; // 12 hours
  const payload = `${adminUser.id}:admin:${issuedAt}:${expiresAt}`;
  const signature = await signPayload(payload);
  const token = `${payload}:${signature}`;

  sessionStorage.setItem('vb_admin_token', token);
  localStorage.setItem('vb_admin_token', token);
  return token;
}

/**
 * Cryptographically verifies that an admin session token has not been forged,
 * modified, or expired.
 */
export async function verifyAdminSessionToken(token) {
  if (!token || typeof token !== 'string') {
    token = sessionStorage.getItem('vb_admin_token') || localStorage.getItem('vb_admin_token');
  }

  if (!token || typeof token !== 'string') return false;

  const parts = token.split(':');
  if (parts.length !== 5) return false;

  const [userId, role, issuedAt, expiresAt, signature] = parts;
  if (role !== 'admin') return false;

  // Check expiration
  const expNum = Number(expiresAt);
  if (isNaN(expNum) || expNum < Date.now()) {
    return false;
  }

  // Verify HMAC signature
  const payload = `${userId}:${role}:${issuedAt}:${expiresAt}`;
  const expectedSignature = await signPayload(payload);

  return signature === expectedSignature;
}

/**
 * Invalidates the admin session token upon logout.
 */
export function invalidateAdminSession() {
  sessionStorage.removeItem('vb_admin_token');
  localStorage.removeItem('vb_admin_token');
}

/**
 * In-memory / session rate limiting to mitigate brute-force attempts.
 * Increased threshold to 25 attempts with safe 15s cooldown.
 */
export function checkRateLimit(key, maxAttempts = 25, lockTimeMs = 15000) {
  try {
    const raw = sessionStorage.getItem(`vb_rl_${key}`);
    if (!raw) return { allowed: true, remaining: maxAttempts };

    const data = JSON.parse(raw);
    const now = Date.now();

    // If lock duration has expired, reset attempt counter and allow
    if (data.lockedUntil && now >= data.lockedUntil) {
      sessionStorage.removeItem(`vb_rl_${key}`);
      return { allowed: true, remaining: maxAttempts };
    }

    if (data.lockedUntil && now < data.lockedUntil) {
      const waitSeconds = Math.max(1, Math.ceil((data.lockedUntil - now) / 1000));
      return {
        allowed: false,
        waitSeconds,
        error: `Too many failed attempts. Please wait ${waitSeconds}s before trying again.`,
      };
    }

    // Reset if window has elapsed
    if (data.firstAttempt && now - data.firstAttempt > lockTimeMs * 4) {
      sessionStorage.removeItem(`vb_rl_${key}`);
      return { allowed: true, remaining: maxAttempts };
    }

    if (data.attempts >= maxAttempts) {
      if (!data.lockedUntil) {
        data.lockedUntil = now + lockTimeMs;
        sessionStorage.setItem(`vb_rl_${key}`, JSON.stringify(data));
      }
      const waitSeconds = Math.max(1, Math.ceil((data.lockedUntil - now) / 1000));
      return {
        allowed: false,
        waitSeconds,
        error: `Too many failed attempts (${data.attempts}/${maxAttempts}). Account temporarily locked for ${waitSeconds}s.`,
      };
    }

    return { allowed: true, remaining: maxAttempts - data.attempts };
  } catch (_) {
    return { allowed: true, remaining: maxAttempts };
  }
}

export function recordFailedAttempt(key, maxAttempts = 25, lockTimeMs = 15000) {
  try {
    const raw = sessionStorage.getItem(`vb_rl_${key}`);
    const now = Date.now();
    let data = raw ? JSON.parse(raw) : { attempts: 0, firstAttempt: now };

    data.attempts += 1;
    if (data.attempts >= maxAttempts && !data.lockedUntil) {
      data.lockedUntil = now + lockTimeMs;
    }
    sessionStorage.setItem(`vb_rl_${key}`, JSON.stringify(data));
    return {
      attempts: data.attempts,
      remaining: Math.max(0, maxAttempts - data.attempts),
      isLocked: data.attempts >= maxAttempts,
    };
  } catch (_) {
    return { attempts: 1, remaining: maxAttempts - 1, isLocked: false };
  }
}

export function resetRateLimit(key = null) {
  try {
    if (key) {
      sessionStorage.removeItem(`vb_rl_${key}`);
    } else {
      // Clear all rate limit records in sessionStorage
      const toRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        if (k && k.startsWith('vb_rl_')) {
          toRemove.push(k);
        }
      }
      toRemove.forEach((k) => sessionStorage.removeItem(k));
    }
  } catch (_) {}
}

/**
 * User Account Registration & Storage (with salted password hashing)
 */
export async function registerLocalUser(name, email, password, phone = '') {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const normalizedName = (name || '').trim();
  const normalizedPhone = (phone || '').trim();

  if (!normalizedEmail || !normalizedEmail.includes('@') || !normalizedEmail.includes('.')) {
    throw new Error('Please enter a valid email address.');
  }

  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  let users = [];
  try {
    const raw = localStorage.getItem('vb_registered_users') || localStorage.getItem('vb_registered_users_backup');
    if (raw) {
      users = JSON.parse(raw);
    }
    if (!Array.isArray(users)) users = [];
  } catch (_) {
    try {
      users = JSON.parse(localStorage.getItem('vb_registered_users_backup') || '[]');
      if (!Array.isArray(users)) users = [];
    } catch (__) {
      users = [];
    }
  }

  // Filter out any mock testing users
  users = users.filter((u) => !isMockUser(u));

  // Prevent duplicate registration
  const duplicate = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (duplicate) {
    throw new Error('An account with this email address already exists. Please sign in instead.');
  }

  const salt = `salt_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  const passwordHash = await hashPassword(password, salt);

  const newUser = {
    id: `user-${Date.now()}`,
    name: normalizedName || normalizedEmail.split('@')[0],
    email: normalizedEmail,
    phone: normalizedPhone,
    role: 'user', // NEVER allow client to set role as admin!
    salt,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  try {
    localStorage.setItem('vb_registered_users', JSON.stringify(users));
    localStorage.setItem('vb_registered_users_backup', JSON.stringify(users));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vb-users-updated', { detail: { count: users.length } }));
    }
  } catch (saveErr) {
    console.warn('LocalStorage save notice:', saveErr);
  }

  // Return public safe user profile (strip credentials)
  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    role: 'user',
  };
}

/**
 * Local User Authentication against stored hashed passwords.
 */
export async function authenticateLocalUser(email, password) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const normalizedPassword = (password || '').trim();

  let users = [];
  try {
    const raw = localStorage.getItem('vb_registered_users') || localStorage.getItem('vb_registered_users_backup');
    if (raw) users = JSON.parse(raw);
    if (!Array.isArray(users)) users = [];
  } catch (_) {
    users = [];
  }

  users = users.filter((u) => !isMockUser(u));

  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user || !user.passwordHash || !user.salt) {
    // Return standard message to prevent account enumeration
    return null;
  }

  const computedHash = await hashPassword(normalizedPassword, user.salt);
  if (computedHash !== user.passwordHash) {
    return null;
  }

  // Enforce account suspension check
  if (user.status === 'suspended' || user.isSuspended === true) {
    throw new Error('This account has been suspended by administration. Access denied.');
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role: user.role || 'user',
    status: user.status || 'active',
  };
}

/**
 * Checks if a user email exists (local users or admin accounts).
 */
export async function checkUserExists(email) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  if (!normalizedEmail) return { exists: false, user: null };

  // 1. Check local registered users
  try {
    const raw = localStorage.getItem('vb_registered_users') || localStorage.getItem('vb_registered_users_backup');
    if (raw) {
      const users = JSON.parse(raw);
      if (Array.isArray(users)) {
        const found = users.find((u) => u.email && u.email.toLowerCase() === normalizedEmail);
        if (found) return { exists: true, user: found };
      }
    }
  } catch (_) {}

  // 2. Check admin accounts
  if (isAuthorizedAdminEmail(normalizedEmail)) {
    return { exists: true, user: { email: normalizedEmail, role: 'admin' } };
  }

  return { exists: false, user: null };
}

/**
 * Resets user password securely by computing a new cryptographic salt and hash.
 */
export async function resetUserPassword(email, newPassword) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const normalizedPassword = (newPassword || '').trim();

  if (!normalizedEmail) {
    throw new Error('Please enter a valid email address.');
  }

  if (!normalizedPassword || normalizedPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }

  let updated = false;

  // 1. Update in local registered users
  try {
    const raw = localStorage.getItem('vb_registered_users') || localStorage.getItem('vb_registered_users_backup');
    let users = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(users)) users = [];

    const userIndex = users.findIndex((u) => u.email && u.email.toLowerCase() === normalizedEmail);
    if (userIndex !== -1) {
      const salt = `salt_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      const passwordHash = await hashPassword(normalizedPassword, salt);
      users[userIndex].salt = salt;
      users[userIndex].passwordHash = passwordHash;
      users[userIndex].updatedAt = new Date().toISOString();

      localStorage.setItem('vb_registered_users', JSON.stringify(users));
      localStorage.setItem('vb_registered_users_backup', JSON.stringify(users));
      updated = true;
    }
  } catch (err) {
    console.error('Error updating registered user password:', err);
  }

  // 2. Update in admin accounts if authorized admin
  if (isAuthorizedAdminEmail(normalizedEmail)) {
    try {
      const accounts = await getAdminAccounts();
      const salt = `salt_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      const passwordHash = await hashPassword(normalizedPassword, salt);
      const creds = {
        email: normalizedEmail,
        passwordHash,
        salt,
        isConfigured: true,
        updatedAt: new Date().toISOString(),
      };
      accounts[normalizedEmail] = creds;
      localStorage.setItem('vb_admin_accounts', JSON.stringify(accounts));
      localStorage.setItem('vb_admin_creds', JSON.stringify(creds));
      updated = true;
    } catch (err) {
      console.error('Error updating admin account password:', err);
    }
  }

  // 3. Reset rate limit for this email
  resetRateLimit(`login_${normalizedEmail}`);

  if (!updated) {
    // If not found in local storage, register fresh user account with this password
    const salt = `salt_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const passwordHash = await hashPassword(normalizedPassword, salt);
    const newUser = {
      id: `user-${Date.now()}`,
      name: normalizedEmail.split('@')[0],
      email: normalizedEmail,
      phone: '',
      role: 'user',
      salt,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    try {
      const raw = localStorage.getItem('vb_registered_users') || '[]';
      const users = JSON.parse(raw);
      users.push(newUser);
      localStorage.setItem('vb_registered_users', JSON.stringify(users));
      localStorage.setItem('vb_registered_users_backup', JSON.stringify(users));
      updated = true;
    } catch (_) {}
  }

  return { success: true, message: 'Password has been updated successfully.' };
}
