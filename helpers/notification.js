/*
 * Title: Notifications Library
 * Description: Important functions to notify users
 * Author:
 * Date:
 *
 */

// dependencies
const https = require('https');
const querystring = require('querystring');
const { twilio } = require('./environments');


// module scaffolding
const notifications = {};


// send sms to user using twilio api
cotifications.sendTwilioSms = (phone, msg, callback) => {
    // input validation
    const userPhone = typeof (phone) === 'string' && phone.trim().length === 11 ? phone.trim() : false;
    const userMsg = typeof (msg) === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? phone.trim() : false;

    if (userPhone && userMsg) {
        // configure the requset payload
        const payload = {
            From: twilio.fromPhone,
            To: `+88${userPhone}`,
            Body: userMsg
        }

        // stringify the payload
        const stringifyPayload = querystring.stringify(payload);
        // configure the requset object
        const requsetDateils = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `&{twilio.accountSid}:&{twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };
        // instatiate the requset object
        const req = https.request(requsetDateils, (res) => {
            //get the status of the sent requset
            const status = res.statusCode;
            // callback successfully if the requset went through
            if (status === 200 || status === 201) {
                callback(false)
            } else {
                callback(`Status code returned was ${status}~`)
            }
        });
        req.on(error, (e) => {
            callback(e)
        });
        req.write(stringifyPayload);
        req.end();
    } else {
        callback('Given paramiters were missing or invalid!')
    }
};

// export the module
module.exports = notifications;