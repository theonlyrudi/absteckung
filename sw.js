// Offline-Cache. Bei Änderungen an der App VERSION hochzählen.
const VERSION = 'v5';
const TILES = 'kacheln';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './leaflet.js', './leaflet.css'];
let trimAt = 0;
function trim(c) { // Kachelspeicher auf ca. 5000 Kacheln begrenzen
  if (Date.now() - trimAt < 60000) return; trimAt = Date.now();
  c.keys().then(k => { if (k.length > 5000) k.slice(0, k.length - 4000).forEach(x => c.delete(x)); });
}
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION && k !== TILES).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  if (r.mode === 'navigate') { // online: neueste Version holen, offline: Cache
    e.respondWith(fetch(r).then(res => {
      const cp = res.clone(); caches.open(VERSION).then(c => c.put('./index.html', cp)); return res;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  const u = new URL(r.url);
  if (/geodatenzentrum\.de|arcgisonline\.com|tile\.openstreetmap\.org/.test(u.hostname)) {
    // Kacheln: online laden und merken, offline aus dem Speicher
    e.respondWith(fetch(r).then(res => {
      if (res.ok || res.type === 'opaque') { const cp = res.clone(); caches.open(TILES).then(c => c.put(r, cp).then(() => trim(c))); }
      return res;
    }).catch(() => caches.match(r)));
    return;
  }
  e.respondWith(caches.match(r).then(m => m || fetch(r)));
});
