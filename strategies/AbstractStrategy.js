

class AbstractStrategy {
    constructor() {
        this.cache = new Map();
    }

    getFromCache(queryObject) {
        return false
    }

    addToCache(queryObject, data){
        return false
    }

}

module.exports = AbstractStrategy;