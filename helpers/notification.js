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
const notificarions = {};

// send sms to user using twilio api
notificatins.sendTwilioSms = (phone, msg, callbck) => {
    // input validation
    const userPhone = typeof (phone) === 'string' && phone.trim().length === 11 ? phone.trim() : false;
    const userMsg = typeof (msg) === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;

    if (userPhone && userMsg) {
        // configure the request payload
        const payload = {
            From: twilio.fromPhone,
            To: `+88${userPhone}`,
            Body: userMsg
        }

        // stringify the payload
        stringifyPayload = querystring.stringify(payload);

        // configure the request details
        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        // instatiate the request object
        const req = https.request(requestDetails, (res) => {
            // get the status of the request
            const status = res.statusCode;

            // callback successfully if the request went through
            if (status === 200 || status === 201) {
                callbck(false)
            } else {
                callbck(`Status code returned was ${status}`)
            }
        });
        req.on('error', (e) => {
            callbck(e)
        });
        req.write(stringifyPayload);
        req.end();
    } else {

    }
};

// export the module
module.exports = notificarions;