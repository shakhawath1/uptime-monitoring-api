// dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');

// module scaffoulding
const routes = {
    sample: sampleHandler,
};

// export the module
module.exports = routes;
