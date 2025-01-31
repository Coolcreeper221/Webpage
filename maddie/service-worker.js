self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open("app-cache").then(function (cache) {
      const urlsToCache = [
        "/maddie/",
        "/maddie/login/",
        "/maddie/calendar/",
        "/maddie/assets/css/main.css",
        "/maddie/calendar/cal.js",
        "/maddie/calendar/cal.css",
        "/maddie/assets/js/main.js",
        "/maddie/assets/js/browser.min.js",
        "/maddie/assets/js/jquery.scrollex.min.js",
        "/maddie/assets/js/jquery.min.js",
        "/maddie/assets/js/jquery.scrolly.min.js",
        "/maddie/assets/js/lock.js",
        "/maddie/assets/js/login.js",
        "/maddie/assets/js/util.js",
        "/maddie/assets/icons/192x192.png",
        "/maddie/assets/icons/512x512.png",
      ];

      function addResource(url) {
        return fetch(url).then((response) => {
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            throw new Error("Failed to fetch resource:", url);
          }
          return cache.put(url, response.clone());
        });
      }

      return urlsToCache.reduce((promise, url) => {
        return promise.then(() => addResource(url));
      }, Promise.resolve());
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
self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "New Notification";
  const options = {
    body: data.body || "You have a new message",
    icon: data.icon || "/app/icon.png",
    badge: "/app/badge.png",
    data: data.url || "/app/",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle click event
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  if (event.notification.data) {
    event.waitUntil(clients.openWindow(event.notification.data));
  }
});
