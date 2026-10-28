"use strict";

var CACHE = "cartao-cena-v1";
var ARQUIVOS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./icon.svg"
];

self.addEventListener("install", function (evento) {
  evento.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(ARQUIVOS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (evento) {
  evento.waitUntil(
    caches.keys().then(function (chaves) {
      return Promise.all(
        chaves.filter(function (c) { return c !== CACHE; })
          .map(function (c) { return caches.delete(c); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (evento) {
  if (evento.request.method !== "GET") { return; }
  var url = new URL(evento.request.url);
  if (url.origin !== self.location.origin) { return; }

  evento.respondWith(
    caches.match(evento.request).then(function (emCache) {
      if (emCache) { return emCache; }
      return fetch(evento.request).then(function (resposta) {
        if (resposta && resposta.status === 200) {
          var copia = resposta.clone();
          caches.open(CACHE).then(function (cache) { cache.put(evento.request, copia); });
        }
        return resposta;
      }).catch(function () {
        return caches.match("./index.html");
      });
    })
  );
});
