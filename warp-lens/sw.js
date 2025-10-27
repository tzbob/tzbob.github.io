const cacheName = "static-assets-cache-v1";

async function fetchAssets(type) {
  const response = await fetch("/"); // You could make a request to the root
  const text = await response.text();

  let assets = [];
  let regex;

  // Dynamically generate regex based on asset type
  if (type === "css") {
    regex = /href="([^"]+\.css)"/g; // Match CSS files by href attributes
  } else if (type === "js") {
    regex = /src="([^"]+\.js)"/g; // Match JS files by src attribute
  }

  let match;
  while ((match = regex.exec(text))) {
    assets.push(match[1]); // Add matched asset URLs
  }

  return assets;
}

self.addEventListener("install", (event) => {
  console.log("[Service Worker] Install");
  event.waitUntil(
    caches.open(cacheName).then(async (cache) => {
      console.log("[Service Worker] Caching static assets");
      await cache.addAll(["/", "/index.html", "/favicons.svg"]);

      const cssAssets = await fetchAssets("css");
      await cache.addAll(cssAssets);

      const jsAssets = await fetchAssets("js");
      return await cache.addAll(jsAssets);
    })
  );
});

async function cacheFirstWithRefresh(request) {
  const fetchResponsePromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });

  return (await caches.match(request)) || (await fetchResponsePromise);
}

self.addEventListener("fetch", (event) => {
  event.respondWith(cacheFirstWithRefresh(event.request));
});
