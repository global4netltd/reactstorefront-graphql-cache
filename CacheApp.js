
const {setVariablesValues} = require('./utils/common');
const resolveStrategy = require('./strategy-resolver');

class CacheApp {

    getFromCache(query, context) {
        setVariablesValues(query.arguments, context.variables);
        const strategy = resolveStrategy(query.name.value);
        return strategy.getFromCache(query);
    }

    addToCache(query, data) {
        const strategy = resolveStrategy(query.name.value);
        return strategy.addToCache(query, data);
    }
}

module.exports = CacheApp;