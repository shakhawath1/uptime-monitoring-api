/*
 * Title: User Handler
 * Description: User Handler
 * Author:
 * Date:
 *
 */

// dependencies
const { hash } = require('../../helpers/utilities');
const data = require('../../lib/data');
// const { parseJson } = require('../../helpers/utilities');

// module scaffolding
const handler = {};

//
handler.userHandler = (requestProperties, callback) => {
    const acceptedMethod = ['get', 'post', 'put', 'delete'];

    if (acceptedMethod.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._users = {};

// create user
handler._users.post = (requestProperties, callback) => {
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

    const tosAgreement =
        typeof requestProperties.body.tosAgreement === 'boolean' &&
        requestProperties.body.tosAgreement
            ? requestProperties.body.tosAgreement
            : false;

    // create user
    if (firstName && lastName && phone && password && tosAgreement) {
        data.read('users', phone, (err) => {
            if (err) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password:hash(password),
                    tosAgreement,
                };
                // create user
                data.create('users', phone, userObject, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'Success',
                        });
                    } else {
                        callback(500, {
                            message: 'Error2',
                        });
                    }
                });
            } else {
                callback(500, {
                    message: 'Error',
                });
            }
        });
    } else {
        callback(505, {
            message: 'err',
        });
    }
};

// get user
handler._users.get = (requestProperties, callback) => {
    callback(200);
};

// update user
handler._users.put = (requestProperties, callback) => {};

// delete user
handler._users.delete = (requestProperties, callback) => {};

module.exports = handler;
