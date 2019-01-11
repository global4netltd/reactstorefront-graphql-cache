const AbstractStrategy = require('./AbstractStrategy');
const hash = require('object-hash');
const config = require('./../config');


class Default extends AbstractStrategy {

    getFromCache(requestBody) {
        const requestHash = this.getHash(requestBody);
        const cachedValue = this.cache.get(requestHash);
        if (cachedValue) {
            const {data, ttl, timeStored} = cachedValue;
            const now = Date.now();
            if (data && ttl && now - timeStored <= ttl * 1000) {
                return data;
            }
            this.cache.delete(requestHash);
        }
        return false;
    }

    addToCache(requestBody, data){
        const requestHash = this.getHash(requestBody);
        const timeStored = Date.now();
        const ttl = config.TTL;
        this.cache.set(requestHash, {ttl, timeStored, data})
    }

    getHash(body) {
        return JSON.stringify(body);
    }
}

module.exports = Default;
