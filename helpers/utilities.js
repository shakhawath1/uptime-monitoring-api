/*
 * Title: Utilities
 * Description: Utilities
 * Author:
 * Date:
 *
 */
// dependencies
const crypto = require('crypto');
const environments = require('./environments');

// module scaffolding
const utilities = {};

// parse JSON string to object
utilities.parseJSON = (jsonString) => {
    let output;

    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }
    return output;
};

// password hashing
utilities.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        const hash = crypto
            .createHmac('sha256', environments.secretKey)
            .update(str)
            .digest('hex');
        return hash;
    }
    return false;
};

// create random string
utilities.createRandomStaring = (strLength) => {
    let length = strLength;
    length = typeof (strLength) === 'number' && strLength > 0 ? strLength : false;

    if (length) {
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let output = '';

        for (let i = 1; i <= possibleCharacters.length; i += 1) {
            let randomCharacters = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length)
            );
            output += randomCharacters;
        }
        return output;
    }
    return false;
};

// export the module
module.exports = utilities;
