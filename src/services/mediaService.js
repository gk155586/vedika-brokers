// src/services/mediaService.js
// Handles direct gallery image & video uploads for Admin
// Writes directly to project folder (/public/uploads) via Vite dev server,
// uploads to Supabase Storage if configured, or falls back to optimized Data URLs for zero failure.

import { supabase } from './supabase';

/**
 * Compresses an image file in browser memory using HTML5 Canvas.
 */
export async function compressImage(file, maxWidth = 1600, quality = 0.85) {
  return new Promise((resolve) => {
    // If not an image, resolve with standard file reader
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to webp or jpeg
        const dataUrl = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        // Fallback to raw data url
        resolve(event.target.result);
      };
      img.src = event.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

/**
 * Read any media file (image, video, etc.) as Data URL
 */
export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Primary Upload Function:
 * 1. Reads & optimizes the media from admin's device/gallery.
 * 2. Attempts to save to /public/uploads/ via Vite dev server middleware.
 * 3. Attempts Supabase Storage if configured.
 * 4. Falls back to Data URL for instant real-time offline rendering.
 */
export async function uploadMediaFile(file) {
  if (!file) throw new Error('No file provided');

  let fileDataUrl;
  if (file.type.startsWith('image/')) {
    fileDataUrl = await compressImage(file);
  } else {
    fileDataUrl = await readFileAsDataUrl(file);
  }

  // 1. Try local dev server API (writes directly to /public/uploads/)
  try {
    const adminToken = typeof sessionStorage !== 'undefined'
      ? (sessionStorage.getItem('vb_admin_token') || localStorage.getItem('vb_admin_token'))
      : null;

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken || ''}`,
      },
      body: JSON.stringify({
        filename: file.name,
        fileData: fileDataUrl,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.url) {
        return {
          url: data.url,
          filename: data.filename || file.name,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          source: 'local_disk',
        };
      }
    }
  } catch (_) {
    // If running in production or outside dev server, proceed to cloud/fallback
  }

  // 2. Try Supabase Storage if configured
  try {
    if (supabase && supabase.storage) {
      const cleanName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const { data, error } = await supabase.storage
        .from('property-media')
        .upload(cleanName, file, { upsert: true });

      if (!error && data) {
        const { data: pubData } = supabase.storage
          .from('property-media')
          .getPublicUrl(cleanName);

        if (pubData?.publicUrl) {
          return {
            url: pubData.publicUrl,
            filename: cleanName,
            type: file.type.startsWith('video/') ? 'video' : 'image',
            source: 'supabase_storage',
          };
        }
      }
    }
  } catch (_) {}

  // 3. Fallback: Return optimized Data URL directly
  // This ensures real-time instant display on the site without needing network storage!
  return {
    url: fileDataUrl,
    filename: file.name,
    type: file.type.startsWith('video/') ? 'video' : 'image',
    source: 'data_url',
  };
}
