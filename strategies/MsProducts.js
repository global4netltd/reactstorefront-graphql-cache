const AbstractStrategy = require('./AbstractStrategy');
const config = require('./../config');
const deepmerge = require('deepmerge');
const {mapRequest, isNeedToSendRequest} = require('./../utils/common');


class MsProducts extends AbstractStrategy {

    constructor() {
        super();
        this.productsData = [];
    }

    getFromCache(query, context) {
        const fieldsMap = mapRequest(query.selectionSet.selections);
        const requestHash = this.getHash(query);
        const cachedValue = this.cache.get(requestHash);
        if (cachedValue) {
            const {data, ttl, timeStored} = cachedValue;
            const now = Date.now();
            if (data && ttl && now - timeStored <= ttl * 1000) {
                this.verifyCacheData(data, fieldsMap);
                const cachedData = this.buildData(data, fieldsMap);
                return false;
                const request = this.buildRequest(query, fieldsMap);
                if (!request) {
                    return cachedData;
                }

                return this.mergeData(request, cachedData)
            }
            this.cache.delete(requestHash);
        }
        return false;
    }

    buildData(cachedData, fieldsMap) {
        const isArray = Array.isArray(cachedData);
        let data;
        if(isArray){
            data = [];
            cachedData.forEach(el => {
                const elObj = {};
                this.mergeData(fieldsMap, el, elObj);
                data.push(elObj);
            })
        }else{
            data = {};
            this.mergeData(fieldsMap, cachedData, data);
        }
        return data;
    }

    mergeData(fieldsMap, cachedData, dataObject){
        Object.keys(fieldsMap).forEach(field => {
            if (field === 'items') {

            } else if (typeof fieldsMap[field] === 'object') {
                dataObject[field] = this.buildData(cachedData[field], fieldsMap[field]);
            } else {
                if (fieldsMap[field]) {
                    dataObject[field] = cachedData[field];
                }
            }
        });
    }

    verifyCacheData(data, fieldsMap) {
        Object.keys(fieldsMap).forEach(field => {
            if (field === 'items') {
                this.verifyProductsData(data.items, fieldsMap[field])
            } else if (typeof fieldsMap[field] === 'object') {
                if (data[field] && data[field][0]) {
                    this.verifyCacheData(data[field][0], fieldsMap[field]);
                }
            } else {
                fieldsMap[field] = !!data[field];
            }

        });
    }

    verifyProductsData(productsSku, fieldsMap) {
        if (!Array.isArray(productsSku) || !productsSku.length > 0) {
            return;
        }
        const cachedData = [];
        productsSku.forEach(sku => {
            const cachedProductData = this.productsData.find(productData => productData.sku === sku);
            if (!cachedProductData) {
                return;
            }
            cachedData.push(cachedProductData);
        });

        Object.keys(fieldsMap).some(field => {
            const isMissing = cachedData.some(productData => {
                return !productData[field]
            });
            fieldsMap[field] = !isMissing;
        });
    }

    addToCache(query, response, context) {
        const requestHash = this.getHash(query);
        const timeStored = Date.now();
        const ttl = config.TTL;

        const data = response.data[this.getRequestName(query)];
        if (data) {
            if (data.items) {
                this.mergeProductsData(data.items);
            }
            data.items = data.items.map(item => item.sku);
        }

        this.cache.set(requestHash, {ttl, timeStored, data})
    }

    getHash(body) {
        const s = JSON.stringify(body.arguments);
        let i, h;
        for (i = 0, h = 0; i < s.length; i++) {
            h = Math.imul(31, h) + s.charCodeAt(i) | 0;
        }
        return h;
    }

    getRequestName(query) {
        return (query.alias) ? query.alias.value : query.name.value;
    }

    mergeProductsData(payload) {
        const products = this.productsData;
        payload.forEach(item => {
            const savedProduct = products.find(product => product.sku === item.sku);
            if (savedProduct) {
                products[products.indexOf(savedProduct)] = deepmerge(
                    savedProduct,
                    item,
                    {
                        arrayMerge: (destinationArray, sourceArray) => sourceArray
                    }
                );
            } else {
                products.push(item);
            }
        });
    };

}

module.exports = MsProducts;
