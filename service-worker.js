const CACHE_NAME = "skrivprata-v2";

// Lägg in alla resurser som ska cachas här
const FILES_TO_CACHE = [
  "index.html",
  "css/main.css",
  "js/main.js",
  "js/ios-hack.js",
  "js/jquery-3.4.1.min.js",
  "js/sweetalert.min.js",
  "js/fontawesome.all.js",
  "img/favicon.ico",
  "img/webapp-icon.jpg",
  // Lägg till alla dina ljudfiler
  "audio/a.mp3",
  "audio/b.mp3",
  "audio/c.mp3",
  "audio/d.mp3",
  "audio/e.mp3",
  "audio/f.mp3",
  "audio/g.mp3",
  "audio/h.mp3",
  "audio/i.mp3",
  "audio/j.mp3",
  "audio/k.mp3",
  "audio/l.mp3",
  "audio/m.mp3",
  "audio/n.mp3",
  "audio/o.mp3",
  "audio/p.mp3",
  "audio/q.mp3",
  "audio/r.mp3",
  "audio/s.mp3",
  "audio/t.mp3",
  "audio/u.mp3",
  "audio/v.mp3",
  "audio/w.mp3",
  "audio/x.mp3",
  "audio/y.mp3",
  "audio/z.mp3",
  "audio/å.mp3",
  "audio/ä.mp3",
  "audio/ö.mp3",
  "audio/eraser.mp3",
  // fonts
  "fonts/OpenDyslexic3-Regular.ttf",
  "fonts/OpenDyslexic3-Regular.woff2",
  "fonts/OpenDyslexic3-Regular.woff",
  "fonts/PatrickHand-Regular.ttf",
  "fonts/PatrickHand-Regular.woff2",
  "fonts/PatrickHand-Regular.woff",
];

// Installera service workern och cacha alla filer
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Cachar resurser...");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // gör att den aktiveras direkt
});

// Aktivera och rensa gammal cache om versionen ändrats
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Intercepta alla fetch-anrop
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log("Hämtat från cache:", event.request.url);
        return response;
      }
      // Försök hämta från nätverket, om det misslyckas, returnera t.ex. index.html
      return fetch(event.request).catch(() => {
        // fallback: index.html för SPA (single page app)
        if (event.request.mode === 'navigate') {
          return caches.match('index.html');
        }
      });
    })
  );
});
