const AbstractStrategy = require('./AbstractStrategy');
const hash = require('object-hash');
const config = require('./../config');


class MsProducts extends AbstractStrategy {

    constructor(){
        super();
        this.productsData = new Map();
    }

    getFromCache(query, context) {
        const requestHash = this.getHash(query);
        const cachedValue = this.cache.get(requestHash);
        if (cachedValue) {
            const {data, ttl, timeStored} = cachedValue;
            const now = Date.now();
            if (data && ttl && now - timeStored <= ttl * 1000) {
                return false;
            }
            this.cache.delete(requestHash);
        }
        return false;
    }

    addToCache(query, response, context){
        const requestHash = this.getHash(query);
        const timeStored = Date.now();
        const ttl = config.TTL;

        const data = response.products;
        if(response.products.items){
            const items = response.products.items.map(item => item.sku);
            data.items = items;
        }


        console.log(data);
        this.cache.set(requestHash, {ttl, timeStored, data})
    }

    getHash(body) {
        const s = JSON.stringify(body);
        let i,h;
        for(i = 0, h = 0; i < s.length; i++){
            h = Math.imul(31, h) + s.charCodeAt(i) | 0;
        }
        return h;
    }
}

module.exports = MsProducts;
