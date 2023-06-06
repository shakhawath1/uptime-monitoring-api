/*
 * Title: Sample Handler
 * Description: Sample Handler
 * Author:
 * Date:
 *
 */

// dependencies

// module scaffoulding
const handler = {};

//
handler.sampleHandler = (requestProperties, callback) => {
    console.log(requestProperties);

    callback(200, {
        message: 'This is sample route.',
    });
};

module.exports = handler;
