import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const SESSION_SECRET_KEY = 'vb_session_sign_key_nanded_broker_desk';

function verifyAdminSession(authHeader) {
  if (!authHeader || typeof authHeader !== 'string') return false;
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();
  const parts = token.split(':');
  if (parts.length !== 5) return false;
  const [userId, role, issuedAt, expiresAt, signature] = parts;
  if (role !== 'admin') return false;
  const expNum = Number(expiresAt);
  if (isNaN(expNum) || expNum < Date.now()) return false;
  const payload = `${userId}:${role}:${issuedAt}:${expiresAt}`;
  const hmac = crypto.createHmac('sha256', SESSION_SECRET_KEY).update(payload).digest('hex');
  return signature === hmac;
}

function mediaUploaderPlugin() {
  return {
    name: 'media-uploader-plugin',
    configureServer(server) {
      server.middlewares.use('/api/upload', (req, res, next) => {
        if (req.method === 'POST') {
          // Cryptographic Authorization Gate
          const authHeader = req.headers['authorization'] || req.headers['x-admin-token'];
          if (!verifyAdminSession(authHeader)) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Unauthorized: Cryptographically verified Admin session required for uploads.' }));
            return;
          }

          const chunks = [];
          let totalBytes = 0;
          const MAX_BYTES = 30 * 1024 * 1024; // 30 MB maximum payload

          req.on('data', (chunk) => {
            totalBytes += chunk.length;
            if (totalBytes > MAX_BYTES) {
              res.statusCode = 413;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'File size exceeds maximum allowed limit (30MB).' }));
              req.destroy();
              return;
            }
            chunks.push(chunk);
          });

          req.on('end', () => {
            try {
              const body = Buffer.concat(chunks).toString('utf8');
              const { filename, fileData } = JSON.parse(body);
              if (!fileData) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'No file data received' }));
                return;
              }

              // Whitelist allowed media extensions
              const allowedExts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4', '.webm', '.mov', '.avif']);
              const rawExt = path.extname(filename || '').toLowerCase();
              if (!allowedExts.has(rawExt)) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Invalid file type. Only verified image and video files are permitted.' }));
                return;
              }

              const base64Data = fileData.replace(/^data:[^;]+;base64,/, '');
              const buffer = Buffer.from(base64Data, 'base64');
              const uploadsDir = path.resolve(__dirname, 'public/uploads');

              if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
              }

              const baseName = path.basename(filename || 'media', rawExt)
                .replace(/[^a-zA-Z0-9_-]/g, '_')
                .toLowerCase();
              const uniqueName = `${Date.now()}-${baseName}${rawExt}`;
              const targetPath = path.join(uploadsDir, uniqueName);

              // Verify path stays within uploads directory
              if (!targetPath.startsWith(uploadsDir)) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Path traversal detected.' }));
                return;
              }

              fs.writeFileSync(targetPath, buffer);

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  url: `/uploads/${uniqueName}`,
                  filename: uniqueName,
                })
              );
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), mediaUploaderPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    cors: true,
    allowedHosts: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
  preview: {
    port: 5173,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons: ['lucide-react'],
        },
      },
    },
  },
});
