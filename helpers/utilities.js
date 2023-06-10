/*
 * Title: Utilities
 * Description: Utilities
 * Author:
 * Date:
 *
 */
// dependencies
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

// export the module
module.exports = utilities;
