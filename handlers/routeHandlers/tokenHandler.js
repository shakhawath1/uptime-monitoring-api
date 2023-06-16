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

// create user
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
                data.create('tokens', phone, tokenObject, (err2) => {
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

// get user
handler._token.get = (requestProperties, callback) => {
    // check the phone number is valide
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
            requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;

    if (phone) {
        // lookup the user
        data.read('users', phone, (err, u) => {
            const user = { ...parseJSON(u) };

            if (!err && user) {
                delete user.password;
                callback(200, user);
            } else {
                callback(404, {
                    error: 'Requestd user was not found',
                });
            }
        });
    } else {
        callback(404, {
            error: 'Requestd user was not found',
        });
    }
};

// update user
handler._token.put = (requestProperties, callback) => {
    // check the phone number if valid
    const phone =
        typeof requestProperties.body.phone === 'string' &&
            requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;

    if (phone) {
        // lookup the user
        const firstName =
            typeof requestProperties.body.firstName === 'string' &&
                requestProperties.body.firstName.trim().length > 0
                ? requestProperties.body.firstName
                : false;

        const lastName =
            typeof requestProperties.body.lastName === 'string' &&
                requestProperties.body.lastName.trim().length > 0
                ? requestProperties.body.lastName
                : false;

        const password =
            typeof requestProperties.body.password === 'string' &&
                requestProperties.body.password.trim().length > 0
                ? requestProperties.body.password
                : false;

        if (firstName || lastName || password) {
            // lookup the uesr
            data.read('users', phone, (err, uData) => {
                const userData = { ...parseJSON(uData) };
                if (!err && uData) {
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (password) {
                        userData.password = hash(password);
                    }

                    data.update('users', phone, userData, (err2) => {
                        if (!err2) {
                            callback(200, {
                                message: 'User was updated successfully!',
                            });
                        } else {
                            callback(500, {
                                error: 'There was a problem in the server side!',
                            });
                        }
                    });
                } else {
                    callback(400, {
                        error: 'You have a problem in your request.',
                    });
                }
            });
        } else {
            callback(400, {
                error: 'You have a problem in your request.',
            });
        }
    } else {
        callback(400, {
            error: 'Invalid phone number, please try again.',
        });
    }
};

// delete user
handler._token.delete = (requestProperties, callback) => {
    // check the phone number is valide
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
            requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;

    if (phone) {
        // lookup the user
        data.read('users', phone, (err1, userData) => {
            if (!err1 && userData) {
                data.delete('users', phone, (err2) => {
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

module.exports = handler;
