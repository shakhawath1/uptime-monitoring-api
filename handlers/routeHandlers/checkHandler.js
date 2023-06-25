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
    const id =
        typeof requestProperties.body.id === 'string' &&
            requestProperties.body.id.trim().length === 20
            ? requestProperties.body.id
            : false;

    let protocol = typeof (requestProperties.body.protocol) === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

    let url = typeof (requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

    let method = typeof (requestProperties.body.method) === 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

    let successCodes = typeof (requestProperties.body.successCodes) === 'object' && requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;

    let timeOutSeconds = typeof (requestProperties.body.timeOutSeconds) === 'number' && requestProperties.body.timeOutSeconds % 1 === 0 && requestProperties.body.timeOutSeconds >= 1 && requestProperties.body.timeOutSeconds <= 5 ? requestProperties.body.timeOutSeconds : false;

    if (id) {
        if (protocol || url || method || successCodes || timeOutSeconds) {
            data.read('checks', id, (err, checkData) => {
                if (!err && checkData) {
                    let checkObject = parseJSON(checkData);

                    let token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;
                    tokenHandler._token.verify(token, checkObject.userPhone, (tokenIsValid) => {
                        if (tokenIsValid) {
                            if (protocol) {
                                checkObject.protocol = protocol;
                            }
                            if (url) {
                                checkObject.url = url;
                            }
                            if (method) {
                                checkObject.method = method;
                            }
                            if (successCodes) {
                                checkObject.successCodes = successCodes;
                            }
                            if (timeOutSeconds) {
                                checkObject.timeOutSeconds = timeOutSeconds;
                            }

                            // store the checkObject
                            data.update('checks', id, checkObject, (err2) => {
                                if (!err2) {
                                    callback(200)
                                } else {
                                    callback(500, {
                                        error: 'There was a server side error!',
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
                    callback(500, {
                        error: 'There was a problem in in the server side!'
                    });
                }
            });
        } else {
            callback(400, {
                error: 'You have must provide atleast one field to update!'
            });
        }
    } else {
        callback(400, {
            error: 'There was a problem in your request!'
        });
    }
};

// delete check
handler._check.delete = (requestProperties, callback) => {


    tokenHandler._token.verify(
        token,
        parseJSON(checkData).userPhone,
        (tokenIsValid) => {
            if (tokenIsValid) {
                // delete the check data
                data.delete('checks', id, (err2) => {
                    if (!err2) {
                        data.read(
                            'users',
                            parseJSON(checkData).userPhone,
                            (err3, userData) => {
                                const userObject = parseJSON(userData);
                                if (!err3 && userData) {
                                    const userChecks =
                                        typeof userObject.checks === 'object' &&
                                            userObject.checks instanceof Array
                                            ? userObject.checks
                                            : [];


                                }
                            }
                        );
                    } else {
                        callback(500, {
                            error:
                                'The check id that you are trying to remove is not found in user!',
                        });
                    }
                }


                );
            } else {
                callback(500, {
                    error: 'You have a problem in your request',
                });
            }
        });
}




module.exports = handler;
