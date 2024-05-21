const _ = require('lodash');

module.exports = (function (verb, path) {
    // If the global definition object does not have a paths property, throw an error 
    if (!_.isObject(global.definition.paths)) {
        require('../../utils/error.js')('paths is required');
    }

    // Get the property of the global definition object that corresponds to the path parameter
    const endpoint = global.definition.paths[path][_.toLower(verb)]
    
    // Return the x-microcks-operations property of the endpoint object, or false if it does not exist
    return !!endpoint["x-microcks-operation"] 
})