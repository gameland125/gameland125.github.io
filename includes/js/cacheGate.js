function getCache(){ return null; }
const cacheGate = { whenReady: fn => Promise.resolve().then(fn), run: fn => fn(), forceReady: () => true, isReady: () => true };
