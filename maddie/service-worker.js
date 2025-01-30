self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("app-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/login/",
        "/calendar/",
        "/calendar/cal.js",
        "/calendar/cal.css",
        "/assets/js/main.js",
        "/assets/js/browser.min.js",
        "/assets/js/jquery.scrollex.min.js",
        "/assets/js/jquery.min.js",
        "/assets/js/jquery.scrolly.min.js",
        "/assets/js/lock.js",
        "/assets/js/login.js",
        "/assets/js/util.js",
        "/assets/icons/192x192.png",
        "/assets/icons/512x512.png",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Ignore WebSocket requests (ws:// or wss://)
  if (url.protocol === "ws:" || url.protocol === "wss:") {
    return; // Do nothing, let WebSockets work normally
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        let responseClone = response.clone();
        caches.open("dynamic-cache").then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cachedResponse) => {
          return (
            cachedResponse ||
            new Response("Offline: No cache available", {
              status: 503,
              statusText: "Service Unavailable",
            })
          );
        })
      )
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = ["app-cache"];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
