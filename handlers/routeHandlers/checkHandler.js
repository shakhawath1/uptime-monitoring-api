/*
 * Title: check Handler
 * Description: check Handler
 * Author:
 * Date:
 *
 */

// dependencies
const { hash, parseJSON } = require('../../helpers/utilities');
const data = require('../../lib/data');

// module scaffolding
const handler = {};

//
handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethod = ['get', 'post', 'put', 'delete'];

    if (acceptedMethod.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._check = {};

// create check
handler._check.post = (requestProperties, callback) => {
    let protocol = typeog(requestProperties.body.protocol === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false)
    let url = typeog(requestProperties.body.url === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false)
    let method = typeog(requestProperties.body.method === 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false)
    let successCods = typeog(requestProperties.body.successCods === 'object' && requestProperties.body.successCods instanceof Array ? requestProperties.body.successCods : false)
};

// get check
handler._check.get = (requestProperties, callback) => {
};

// update check
handler._check.put = (requestProperties, callback) => {
};

// delete check
handler._check.delete = (requestProperties, callback) => {
};

module.exports = handler;
