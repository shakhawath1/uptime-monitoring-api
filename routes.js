/*
 * Title: Sample Handler
 * Description: Sample Handler
 * Author:
 * Date:
 *
 */
// dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');

// module scaffolding
const routes = {
    sample: sampleHandler,
};

// export the module
module.exports = routes;
