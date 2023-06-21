/* eslint-disable operator-linebreak */
/*
 * Title:
 * Description:
 * Author:
 * Date:
 *
 */

// module scaffolding
const environments = {};

// staging environment
environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'jhajgkjdklsj',
    maxChecks: 5,
};

// production environment
environments.production = {
    port: 5000,
    envName: 'production',
};

// determine which environment was passed
const currentEnvironment =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
const envrionmentToExport =
    typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;

// export
module.exports = envrionmentToExport;
