const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const CacheApp = require('./CacheApp');
const config = require('./config');
const gql = require('graphql-tag');


const app = express();
app.use(bodyParser.raw());
app.use(bodyParser.json());

const cache = new CacheApp();

app.post('/graphql', (request, response) => {

    const queryObject = gql`
        ${request.body.query}
        `;
    const cachedResponse = cache.getFromCache(queryObject);

    if(cachedResponse !== false){
        response.send(cachedResponse);
        console.log('From Cache!');
    }else{
        axios.post(config.MAGENTO_BACKEND_URL, request.body).then(magentoResponse => {
            response.send(magentoResponse.data);
            cache.addToCache(queryObject, magentoResponse);
            console.log('From Magento');
        }).catch(err => console.log(err))
    }
});
app.listen(config.PORT, () => console.info(`Application running on port ${config.PORT}`));
