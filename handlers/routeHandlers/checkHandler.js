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
