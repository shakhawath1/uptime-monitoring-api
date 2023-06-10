/*
 * Title: Sample Handler
 * Description: Sample Handler
 * Author:
 * Date:
 *
 */
// dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');

// module scaffolding
const routes = {
    sample: sampleHandler,
    user: userHandler,
};

// export the module
module.exports = routes;
