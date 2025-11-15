const cacheName = self.location.pathname
const pages = [

  "/categories/",
  "/docs/",
  "/",
  "/docs/table/",
  "/tags/",
  "/book.min.6970156cec683193d93c9c4edaf0d56574e4361df2e0c1be4f697ae81c3ba55f.css",
  "/en.search-data.min.752c9bab4b416ff8e9676562bf0ef56e79aa0c334f87057723c0076c355d6197.json",
  "/en.search.min.36e80dc18afe3c986bf90ad888a11bb0d52a84352c40c5d4b17922fd41049b28.js",
  
];

self.addEventListener("install", function (event) {
  self.skipWaiting();

  caches.open(cacheName).then((cache) => {
    return cache.addAll(pages);
  });
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") {
    return;
  }

  /**
   * @param {Response} response
   * @returns {Promise<Response>}
   */
  function saveToCache(response) {
    if (cacheable(response)) {
      return caches
        .open(cacheName)
        .then((cache) => cache.put(request, response.clone()))
        .then(() => response);
    } else {
      return response;
    }
  }

  /**
   * @param {Error} error
   */
  function serveFromCache(error) {
    return caches.open(cacheName).then((cache) => cache.match(request.url));
  }

  /**
   * @param {Response} response
   * @returns {Boolean}
   */
  function cacheable(response) {
    return response.type === "basic" && response.ok && !response.headers.has("Content-Disposition")
  }

  event.respondWith(fetch(request).then(saveToCache).catch(serveFromCache));
});
