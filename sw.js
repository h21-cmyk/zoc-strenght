// Zoc Strength : fonctionnement hors ligne. VERSION change à chaque mise à jour.
const VERSION = "zoc-202611101700";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./fonts/fonts.css",
  "./fonts/bebas-neue-latin-400-normal.woff2", "./fonts/barlow-latin-400-normal.woff2", "./fonts/barlow-latin-500-normal.woff2",
  "./fonts/barlow-latin-600-normal.woff2", "./fonts/barlow-latin-700-normal.woff2", "./icons/apple-touch-icon.png", "./icons/icon-192.png", "./icons/icon-512.png"];
// Chaque fichier est mis en cache séparément : un fichier manquant n'empêche plus l'installation.
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => Promise.all(ASSETS.map(a => c.add(a).catch(() => null)))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (req.mode === "navigate"){
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put("./index.html", copy)); return r; }).catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok){ const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); } return r; })));
});
