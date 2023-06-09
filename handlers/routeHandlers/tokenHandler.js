/*
 * Title: User Handler
 * Description: User Handler
 * Author:
 * Date:
 *
 */

// dependencies
const { hash, parseJSON, createRandomStaring } = require('../../helpers/utilities');
const data = require('../../lib/data');

// module scaffolding
const handler = {};

//
handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethod = ['get', 'post', 'put', 'delete'];

    if (acceptedMethod.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._token = {};

// create token
handler._token.post = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.body.phone === 'string' &&
            requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;

    const password =
        typeof requestProperties.body.password === 'string' &&
            requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;

    if (phone && password) {
        data.read('users', phone, (err, userData) => {
            let hashedPassword = hash(password);
            if (hashedPassword === parseJSON(userData).password) {
                let tokenId = createRandomStaring(20);
                let expires = Date.now() + 60 * 60 * 1000;
                let tokenObject = {
                    phone,
                    id: tokenId,
                    expires
                }

                // store the token
                data.create('tokens', tokenId, tokenObject, (err2) => {
                    if (!err && tokenObject) {
                        callback(200, tokenObject)
                    } else {
                        callback(500, {
                            error: 'There in a problem in the server side.'
                        })
                    }
                })
            } else {
                callback(400, {
                    error: 'Password is not valid.'
                })
            }
        })
    } else {
        callback(400, {
            error: 'You have a problem in your request.'
        })
    }
};

// get token
handler._token.get = (requestProperties, callback) => {
    // check the phone number is valide
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
            requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
            : false;

    if (id) {
        // lookup the token
        data.read('tokens', id, (err, tokenData) => {
            const token = { ...parseJSON(tokenData) };

            if (!err && token) {
                callback(200, token);
            } else {
                callback(404, {
                    error: 'Requestd token was not found',
                });
            }
        });
    } else {
        callback(404, {
            error: 'Requestd token was not found.',
        });
    }
};

// update token
handler._token.put = (requestProperties, callback) => {
    // check the token if valid
    const id =
        typeof requestProperties.body.id === 'string' &&
            requestProperties.body.id.trim().length === 20
            ? requestProperties.body.id
            : false;

    const extend =
        typeof requestProperties.body.extend === 'boolean' &&
            requestProperties.body.extend === true
            ? true
            : false;

    if (id && extend) {
        data.read('tokens', id, (err, tokenData) => {
            let tokenObject = parseJSON(tokenData);

            if (tokenObject.expires > Date.now()) {
                tokenObject.expires = Date.now() + 60 * 60 * 1000;
                data.update('tokens', id, tokenObject, (err2) => {
                    if (!err2) {
                        callback(200)
                    } else {
                        callback(500, {
                            error: 'There was a problem in the server side!',
                        })
                    }
                })
            } else (400, {
                error: 'Token already expired!',
            })
        })
    } else {
        callback(400, {
            error: 'There was a problem in your request!',
        })
    }
};

// delete token
handler._token.delete = (requestProperties, callback) => {
    // check the token is valide
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
            requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
            : false;

    if (id) {
        // lookup the user
        data.read('tokens', id, (err1, tokenData) => {
            if (!err1 && tokenData) {
                data.delete('tokens', id, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'Successfully deleted',
                        });
                    } else {
                        callback(500, {
                            error: 'There was a problem in server side.',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'There was a problem in server side.',
                });
            }
        });
    } else {
        callback(400, {
            error: 'There was a problem in your request',
        });
    }
};

// token verify function
handler._token.verify = (id, phone, callback) => {
    data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
            let tokenObject = parseJSON(tokenData);
            if (tokenObject.phone === phone && tokenObject.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            };
        } else {
            callback(false);
        };
    });
};


module.exports = handler;
