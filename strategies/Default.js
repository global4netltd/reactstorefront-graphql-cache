const AbstractStrategy = require('./AbstractStrategy');
const hash = require('object-hash');
const config = require('./../config');


class Default extends AbstractStrategy {

    getFromCache(queryObject) {
        const requestHash = this.getHash(queryObject);
        const cachedValue = this.cache.get(requestHash);
        if (cachedValue) {
            const {data, ttl, timeStored} = cachedValue;
            const now = Date.now();
            if (data && ttl && now - timeStored <= ttl * 1000) {
                return data
            }
            this.cache.delete(requestHash);
        }
        return false;
    }

    addToCache(queryObject, data){
        const requestHash = this.getHash(queryObject);
        const timeStored = Date.now();
        const ttl = config.TTL;
        this.cache.set(requestHash, {ttl, timeStored, data})
    }

    getHash(body) {
        return JSON.stringify(body);
    }
}

module.exports = Default;
