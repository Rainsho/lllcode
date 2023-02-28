importScripts('https://cdnjs.cloudflare.com/ajax/libs/idb-keyval/6.2.0/umd.min.js');

const VERSION = 'v1.1';
const ONE_DAY = 1000 * 60 * 60 * 24;
const DB = self.idbKeyval.createStore(VERSION, 'cache-time');

const CACHE_STRATEGY: Array<{ rule: (key: string) => boolean; time: number }> = [
  { rule: key => key.endsWith('.js'), time: 3 * ONE_DAY },
  { rule: key => key.endsWith('.css'), time: 3 * ONE_DAY },
  { rule: key => key.endsWith('.png'), time: 7 * ONE_DAY },
  { rule: () => true, time: 0.01 * ONE_DAY },
];

async function upsertCacheTime(key: string, time?: number): Promise<number> {
  if (time !== undefined) {
    await self.idbKeyval.set(key, time, DB);
    return time;
  }

  return (await self.idbKeyval.get(key, DB)) || 0;
}

async function updateCache(request: Request): Promise<Response> {
  const cache = await caches.open(VERSION);
  const response = await fetch(request);
  if (response.ok) {
    await cache.put(request, response.clone());
    upsertCacheTime(request.url, Date.now());
  }
  return response;
}

async function checkFresh(request: Request) {
  const now = Date.now();
  const cacheTime = await upsertCacheTime(request.url);
  const dur = now - cacheTime;

  for (const { rule, time } of CACHE_STRATEGY) {
    if (rule(request.url)) {
      if (dur > time) updateCache(request);
      break;
    }
  }
}

self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;

  // ignore chrome-extension scheme
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(
    caches.match(request).then(response => {
      if (response) {
        checkFresh(request);
        return response;
      }

      return updateCache(request);
    })
  );
});
