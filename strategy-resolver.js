const MsProducts = require('./strategies/MsProducts');
const Default = require('./strategies/Default');


const DefaultStrategy = new Default();
const MsProductsStrategy = new MsProducts();

const strategiesMap = {
    msProducts: MsProductsStrategy,
//    Implement strategies...
};

const resolveStrategy = name => strategiesMap[name] ? strategiesMap[name] : DefaultStrategy;

module.exports = resolveStrategy;
