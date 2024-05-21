/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

"use strict";

const _ = require("lodash");

module.exports = (function () {
return function get(path, method, status) {
    // If the global definition object does not have a paths property, throw an error  
    if (!_.isObject(global.definition.paths)) {
      require('../../utils/error.js')('paths is required');
    }
    // Get the property of the global definition object that corresponds to the path parameter
    const endpoint = global.definition?.paths[path][_.toLower(method)];
    /**
     * If the endpoint object does not have a responses property, or the responses property does not have a status property, or the status property does not have a content property, 
     * or the content property does not have an application/json property, or the application/json property does not have an examples property, return an false
     */
    return Object.keys(endpoint?.["responses"][status]?.["content"]?.["application/json"]?.["examples"] ?? [])[0] ?? false;
  };
})();
