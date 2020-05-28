import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { precacheAndRoute } from 'workbox-precaching';
import createDB from './indexDb';
import { fetchAndStoreDb, cacheStatic, dynamicCacheWithOfflineFallback } from './cacheHelper';
import { handleSync } from './syncHelper';
import { handleNotification, handleCloseNotification } from './notificationHelper';

(async () => {

  await createDB();

})();

// Add root and offline page fallback to cache
self.addEventListener('install', cacheStatic);

// Implement dynamic cache for html pages and offline fallback
registerRoute(
  (routeData) => (routeData.event.request.headers.get('accept').includes('text/html')),
  dynamicCacheWithOfflineFallback
);

// cache Google fonts
registerRoute(
  /.*(?:googleapis|gstatic)\.com.*$/,
  new CacheFirst({ cacheName: 'google-fonts' })
);

// Cache CDNs
registerRoute(
  /.*cdn.*$/,
  new StaleWhileRevalidate({
    cacheName      : 'cdn',
    cacheExpiration: {
      maxEntries   : 3,
      maxAgeSeconds: 60 * 60 * 24 * 30
    }
  })
);

// Cache assets (svg|png)
registerRoute(
  /.*(?:png|svg|json|webp)$/,
  new StaleWhileRevalidate({
    cacheName      : 'static-assets',
    cacheExpiration: {
      maxEntries   : 3,
      maxAgeSeconds: 60 * 60 * 24 * 30
    }
  })
);

// Cache Movie search response
registerRoute(
  /.*omdbapi.*$/, ({ request }) => {

    fetchAndStoreDb(request, 'omdbapi');

  }
);

// Cache chat messages
registerRoute(
  /.*messages.*$/, ({ request }) => {

    fetchAndStoreDb(request, 'messages');

  }
);

// Cache javascript file and chunk generated by webpack
precacheAndRoute(self.__WB_MANIFEST);

// Background sync
self.addEventListener('sync', handleSync);

// Push notification
self.addEventListener('notificationclick', handleNotification);

// Push notification close
self.addEventListener('notificationclose', handleCloseNotification);
