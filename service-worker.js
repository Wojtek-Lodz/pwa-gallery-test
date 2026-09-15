// Prosty Service Worker: cache-first dla powłoki aplikacji, umożliwia pracę offline.
const CACHE_NAME = "pwa-gallery-v4";
const APP_SHELL = [
  "./",
  "./index.html",
  "./app.js",
  "./images.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-512.png",
];

self.addEventListener("install", (event) => {
  // fetch(..., {cache: "reload"}) omija zwykły cache HTTP przeglądarki,
  // dzięki czemu każda instalacja zawsze pobiera świeże pliki z serwera —
  // użytkownik nie musi ręcznie robić twardego odświeżenia (Ctrl+Shift+R).
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.all(
          APP_SHELL.map((url) =>
            fetch(url, { cache: "reload" }).then((response) => cache.put(url, response))
          )
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ||
        fetch(event.request)
          .then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            return response;
          })
          .catch(() => cached)
    )
  );
});
