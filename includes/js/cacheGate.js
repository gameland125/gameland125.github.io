// Cache readiness automation controller
(function(window) {
    var cacheGate = {
        readyCallback: null,
        isReady: false,
        
        init: function() {
            var cache = window.applicationCache;
            if (!cache) {
                this.setReady();
                return;
            }
            
            var status = cache.status;
            if (status === cache.UNCACHED || status === cache.IDLE || status === cache.UPDATEREADY) {
                this.setReady();
            } else {
                cache.addEventListener('cached', this.setReady.bind(this), false);
                cache.addEventListener('noupdate', this.setReady.bind(this), false);
                cache.addEventListener('updateready', this.setReady.bind(this), false);
                cache.addEventListener('error', this.setReady.bind(this), false);
            }
        },
        
        setReady: function() {
            this.isReady = true;
            if (this.readyCallback) {
                this.readyCallback();
                this.readyCallback = null; // single execution guard
            }
        },
        
        whenReady: function(callback) {
            if (this.isReady) {
                callback();
            } else {
                this.readyCallback = callback;
            }
        }
    };
    
    window.cacheGate = cacheGate;
})(window);
