const gql = require('graphql-tag');

const getQueryFromRequest = requestBody => gql`${requestBody.query}`;

module.exports = getQueryFromRequest;
