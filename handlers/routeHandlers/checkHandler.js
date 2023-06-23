/*
 * Title: check Handler
 * Description: check Handler
 * Author:
 * Date:
 *
 */

// dependencies
const { hash, parseJSON, createRandomStaring } = require('../../helpers/utilities');
const data = require('../../lib/data');
const tokenHandler = require('./tokenHandler');
const { maxChecks } = require('../../helpers/environments')

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
    let protocol = typeof (requestProperties.body.protocol) === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

    let url = typeof (requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

    let method = typeof (requestProperties.body.method) === 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

    let successCodes = typeof (requestProperties.body.successCodes) === 'object' && requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;

    let timeOutSeconds = typeof (requestProperties.body.timeOutSeconds) === 'number' && requestProperties.body.timeOutSeconds % 1 === 0 && requestProperties.body.timeOutSeconds >= 1 && requestProperties.body.timeOutSeconds <= 5 ? requestProperties.body.timeOutSeconds : false;

    if (protocol && url && method && successCodes && timeOutSeconds) {
        let token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;

        // lookup the user phone by reading the token 
        data.read('tokens', token, (err, tokenData) => {
            if (!err && tokenData) {
                let userPhone = parseJSON(tokenData).phone;

                // lookup tha user Data
                data.read('users', userPhone, (err, userData) => {
                    if (!err && userData) {
                        tokenHandler._token.verify(token, userPhone, (tokenIsValid) => {
                            if (tokenIsValid) {
                                let userObject = parseJSON(userData);
                                let userChecks = typeof (userObject.checks) === 'object' && userObject.checks instanceof Array ? userObject.checks : [];

                                if (userChecks.length <= maxChecks) {
                                    let checkId = createRandomStaring(20);
                                    let checkObject = {
                                        'id': checkId,
                                        userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successCodes,
                                        timeOutSeconds
                                    }

                                    // create check
                                    data.create('checks', checkId, checkObject, (err3) => {
                                        if (!err3) {
                                            // add checkId to the user's object
                                            userObject.checks = userChecks;
                                            userObject.checks.push(checkId);

                                            // save the new user data
                                            data.update('users', userPhone, userObject, (err4) => {
                                                if (!err4) {
                                                    // return the data about the new check
                                                    callback(200, checkObject)
                                                } else {
                                                    callback(500, {
                                                        error:
                                                            'There was a problem in the server side!',
                                                    });
                                                }
                                            });
                                        } else {
                                            callback(500, {
                                                error: 'There was a problem in the server side!',
                                            });
                                        }
                                    });
                                } else {
                                    callback(401, {
                                        error: 'Userhas already reached max check limit!',
                                    });
                                }
                            } else {
                                callback(403, {
                                    error: 'Authentication problem!'
                                });
                            }
                        });
                    } else {
                        callback(403, {
                            error: 'User not found!'
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'Authentication problem!'
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request!'
        });
    }
};

// get check
handler._check.get = (requestProperties, callback) => {
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
            requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
            : false;
    if (id) {
        // lookup the check
        data.read('checks', id, (err, checkData) => {
            let checkObject = parseJSON(checkData);
            if (!err && checkObject) {
                let token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;

                tokenHandler._token.verify(token, checkObject.userPhone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        callback(200, checkObject)
                    } else {
                        callback(403, {
                            error: 'Authentication problem!'
                        });
                    }
                });
            } else {
                callback(400, {
                    error: 'You have a problem in your request!'
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request!'
        });
    }
};

// update check
handler._check.put = (requestProperties, callback) => {
    let protocol = typeof (requestProperties.body.protocol) === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

    let url = typeof (requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

    let method = typeof (requestProperties.body.method) === 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

    let successCodes = typeof (requestProperties.body.successCodes) === 'object' && requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;

    let timeOutSeconds = typeof (requestProperties.body.timeOutSeconds) === 'number' && requestProperties.body.timeOutSeconds % 1 === 0 && requestProperties.body.timeOutSeconds >= 1 && requestProperties.body.timeOutSeconds <= 5 ? requestProperties.body.timeOutSeconds : false;
};

// delete check
handler._check.delete = (requestProperties, callback) => {
};

module.exports = handler;
