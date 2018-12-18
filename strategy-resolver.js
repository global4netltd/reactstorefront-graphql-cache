const Test = require('./strategies/Test');
const Default = require('./strategies/Default');


const DefaultStrategy = new Default();
const TestStrategy = new Test();

const strategiesMap = {
    test: TestStrategy,
//    Implement strategies...
};

exports.resolveStrategy = name => {
    return strategiesMap[name] ? strategiesMap[name] : DefaultStrategy;
};