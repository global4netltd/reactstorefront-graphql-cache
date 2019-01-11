const {resolveStrategy} = require('./strategy-resolver');

class CacheApp {

    getFromCache(request) {
        const strategy = this.getStrategy(request);
        return strategy.getFromCache(request.body);
    }

    addToCache(request, response) {
        const strategy = this.getStrategy(request);
        return strategy.addToCache(request.body, response.data);
    }

    getStrategy(request){
        return resolveStrategy(request.body.operationName);
    }
}

module.exports = CacheApp;