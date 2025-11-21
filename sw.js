const CACHE_NAME = 'daily-islamic-content-v10'; // Bumped version for new cache strategy

// Files to cache for offline use.
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/locales/ar.json',
  '/locales/en.json',
  '/icon.svg',
];

const EXTERNAL_ASSETS = [
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap'
];


// Install the service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache. Caching core and external assets.');
        
        // Cache core assets. This is critical for the app to work.
        const corePromise = cache.addAll(CORE_ASSETS).catch(error => {
            console.error('Failed to cache one or more core assets:', error);
            throw error; // Fail the SW installation if core assets fail
        });
        
        // Cache external assets on a best-effort basis.
        const externalPromise = Promise.all(
            EXTERNAL_ASSETS.map(url => {
                return cache.add(url).catch(err => {
                    console.warn(`Failed to cache external resource, continuing: ${url}`, err);
                });
            })
        );
        
        return Promise.all([corePromise, externalPromise]);
      })
  );
});

// Activate the service worker and clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});


// Intercept network requests and serve from cache if available
self.addEventListener('fetch', event => {
  // We only want to handle GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Try to get the response from the cache.
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        // If we found a match in the cache, return it.
        return cachedResponse;
      }

      // If the resource was not in the cache, try to fetch it from the network.
      try {
        const networkResponse = await fetch(event.request);

        // If the fetch was successful, clone the response and store it in the cache.
        // We only cache successful responses to avoid caching errors.
        if (networkResponse.ok) {
            const responseToCache = networkResponse.clone();
            await cache.put(event.request, responseToCache);
        }

        // Return the network response.
        return networkResponse;
      } catch (error) {
        // If the fetch fails (e.g., user is offline), we don't have a fallback,
        // so we just propagate the error. The browser will show its default offline page.
        console.error('Fetch failed; returning offline page instead.', error);
        throw error;
      }
    })
  );
});