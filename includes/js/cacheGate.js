
var cacheGate = (function() {
    var isReady = false;
    var callback = null;

    function checkStatus() {
        if (window.applicationCache.status === window.applicationCache.IDLE || 
            window.applicationCache.status === window.applicationCache.UPDATEREADY) {
            isReady = true;
            if (callback) callback();
        }
    }

    window.applicationCache.addEventListener('cached', function() { isReady = true; if(callback) callback(); }, false);
    window.applicationCache.addEventListener('noupdate', function() { isReady = true; if(callback) callback(); }, false);
    
    return {
        whenReady: function(fn) {
            callback = fn;
            if (isReady) callback();
            else setInterval(checkStatus, 1000);
        }
    };
})();
