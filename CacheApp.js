const {resolveStrategy} = require('./strategy-resolver');

class CacheApp {

    getFromCache(queryObject) {
        const strategy = this.getStrategy(queryObject);
        return strategy.getFromCache(queryObject);
    }

    addToCache(queryObject, response) {
        const strategy = this.getStrategy(queryObject);
        return strategy.addToCache(queryObject, response.data);
    }

    getStrategy(queryObject){
        const name = queryObject.definitions[0].selectionSet.selections[0].name.value;
        return resolveStrategy(name);
    }
}

module.exports = CacheApp;