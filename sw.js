/* Jasspäpste PWA – network-first update, 2026-11-22 photo fix */
const CACHE_NAME = 'jasspaepste-pwa-photo-20261122-v2';
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    try { await cache.add(new Request('./index.html', {cache:'reload'})); } catch (_) {}
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE_NAME && /jass|pwa|offline|static/i.test(key)).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(new Request(request, {cache:'no-store'}));
        if (response.ok) (await caches.open(CACHE_NAME)).put('./index.html', response.clone()).catch(()=>{});
        return response;
      } catch (err) {
        return (await caches.match('./index.html')) || Response.error();
      }
    })());
  }
});
