// service-worker.js
// Stratégie :
// - App shell (HTML/CSS/JS/police/librairies CDN) : cache d'abord, réseau en secours, mise à jour en arrière-plan.
// - Collections (collections/*.json) : réseau d'abord (toujours à jour si connecté), cache en secours si hors ligne.
// - Images (assets/*) : cache d'abord (elles changent rarement), réseau en secours.
//
// Pour forcer les visiteurs à récupérer une nouvelle version de l'app shell après une mise à jour,
// incrémente APP_VERSION ci-dessous.

const APP_VERSION = 'v3';
const SHELL_CACHE = `flashcards-shell-${APP_VERSION}`;
const DATA_CACHE = 'flashcards-data';
const ASSETS_CACHE = 'flashcards-assets';

const SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('flashcards-shell-') && k !== SHELL_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

function isCollectionRequest(url) {
  return url.pathname.includes('/collections/') && url.pathname.endsWith('.json');
}

function isAssetRequest(url) {
  return url.pathname.includes('/assets/');
}

// Réseau d'abord, cache en secours (pour les collections JSON : fraîcheur prioritaire)
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request, { cache: 'no-store' });
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw err;
  }
}

// Cache d'abord, réseau en secours + mise à jour silencieuse (pour images et app shell)
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);
  return cached || (await fetchPromise) || Response.error();
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  if (isCollectionRequest(url)) {
    event.respondWith(networkFirst(req, DATA_CACHE));
    return;
  }

  if (isAssetRequest(url)) {
    event.respondWith(cacheFirst(req, ASSETS_CACHE));
    return;
  }

  // App shell (même origine) et dépendances CDN (KaTeX, marked, DOMPurify, polices) : cache d'abord
  event.respondWith(cacheFirst(req, SHELL_CACHE));
});
