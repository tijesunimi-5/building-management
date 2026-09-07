// Empty Service Worker to prevent 404 / 500 errors on /sw.js
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
