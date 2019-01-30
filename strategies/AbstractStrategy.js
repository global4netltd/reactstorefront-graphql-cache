

class AbstractStrategy {
    constructor() {
        this.cache = new Map();
    }

    getFromCache(queryObject, context) {
        return false
    }

    addToCache(queryObject, data, context){
        return false
    }

}

module.exports = AbstractStrategy;