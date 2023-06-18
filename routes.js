/*
 * Title: Sample Handler
 * Description: Sample Handler
 * Author:
 * Date:
 *
 */
// dependencies
const { checkHandler } = require('./handlers/routeHandlers/checkHandler');
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');
const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');

// module scaffolding
const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
    check: checkHandler
};

// export the module
module.exports = routes;
