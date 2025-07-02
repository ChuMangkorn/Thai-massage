const CACHE_NAME = 'thai-massage-leelawadee-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const IMAGE_CACHE = 'images-v1';

// Assets to cache immediately - only cache what exists
const STATIC_ASSETS = [
  '/',
  '/manifest.json'
];

// Network-first resources (always try network first)
const NETWORK_FIRST = [
  '/api/',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com'
];

// Cache-first resources (serve from cache if available)
const CACHE_FIRST = [
  'https://images.pexels.com',
  '.woff2',
  '.woff',
  '.ttf',
  '.css',
  '.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(async (cache) => {
        console.log('Service Worker: Caching static assets');
        
        // Cache assets individually to avoid single failure stopping all caching
        const cachePromises = STATIC_ASSETS.map(async (asset) => {
          try {
            const response = await fetch(asset);
            if (response.ok) {
              await cache.put(asset, response);
              console.log(`Service Worker: Cached ${asset}`);
            } else {
              console.warn(`Service Worker: Failed to cache ${asset} - ${response.status}`);
            }
          } catch (error) {
            console.warn(`Service Worker: Error caching ${asset}:`, error);
          }
        });
        
        await Promise.allSettled(cachePromises);
        console.log('Service Worker: Static assets caching completed');
      })
      .then(() => {
        console.log('Service Worker: Installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with different strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Network-first strategy for API calls and fonts
    if (NETWORK_FIRST.some(pattern => request.url.includes(pattern))) {
      return await networkFirst(request);
    }
    
    // Cache-first strategy for images and static assets
    if (CACHE_FIRST.some(pattern => request.url.includes(pattern))) {
      return await cacheFirst(request);
    }
    
    // Stale-while-revalidate for HTML pages
    if (request.headers.get('accept')?.includes('text/html')) {
      return await staleWhileRevalidate(request);
    }
    
    // Default to network-first
    return await networkFirst(request);
    
  } catch (error) {
    console.error('Service Worker: Request failed', error);
    
    // Return offline fallback for HTML requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return await getOfflineFallback();
    }
    
    throw error;
  }
}

// Network-first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Cache-first strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cacheName = request.url.includes('images') ? IMAGE_CACHE : DYNAMIC_CACHE;
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    throw error;
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const networkResponsePromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Network failed, but we might have cache
    return null;
  });
  
  // Return cached version immediately if available
  if (cachedResponse) {
    // Update cache in background
    networkResponsePromise;
    return cachedResponse;
  }
  
  // Wait for network if no cache
  return await networkResponsePromise || await getOfflineFallback();
}

// Offline fallback
async function getOfflineFallback() {
  const cache = await caches.open(STATIC_CACHE);
  return await cache.match('/index.html') || new Response(
    `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Offline - Thai Massage Leelawadee</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex; 
          align-items: center; 
          justify-content: center; 
          min-height: 100vh; 
          margin: 0; 
          background: #f9fafb;
          color: #374151;
        }
        .container { 
          text-align: center; 
          max-width: 400px; 
          padding: 2rem;
        }
        .icon { 
          width: 64px; 
          height: 64px; 
          margin: 0 auto 1rem; 
          opacity: 0.5;
        }
        h1 { 
          margin: 0 0 1rem; 
          font-size: 1.5rem; 
          font-weight: 600;
        }
        p { 
          margin: 0 0 1.5rem; 
          color: #6b7280;
        }
        button {
          background: #B8860B;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
        }
        button:hover {
          background: #9a7209;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z"/>
        </svg>
        <h1>You're Offline</h1>
        <p>Please check your internet connection and try again.</p>
        <button onclick="window.location.reload()">Try Again</button>
      </div>
    </body>
    </html>
    `,
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm());
  }
});

async function syncContactForm() {
  // Handle background sync for contact forms
  console.log('Service Worker: Syncing contact form data');
}

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    data: data.url,
    actions: [
      {
        action: 'open',
        title: 'Open',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data || '/')
    );
  }
});

// Cache size management
async function cleanupCaches() {
  const caches = await caches.keys();
  
  for (const cacheName of caches) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    // Remove old entries if cache is too large
    if (requests.length > 100) {
      const oldRequests = requests.slice(0, requests.length - 50);
      await Promise.all(oldRequests.map(request => cache.delete(request)));
    }
  }
}

// Periodic cleanup
setInterval(cleanupCaches, 24 * 60 * 60 * 1000); // Daily cleanup