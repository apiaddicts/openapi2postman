const _ = require('lodash');

module.exports = (function (verb, path) {
    if (!_.isObject(global.definition.paths)) {
        require('../../utils/error.js')('paths is required');
    }

    const endpoint = global.definition.paths[path][_.toLower(verb)]
    
    return !!endpoint["x-microcks-operation"] 
})