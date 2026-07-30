
// Cache Gate - Silent Mode
var cacheGate = {
    ready: false,
    check: function() {
        if (window.applicationCache.status === window.applicationCache.IDLE) {
            this.ready = true;
        }
    }
};
setInterval(() => cacheGate.check(), 1000);
