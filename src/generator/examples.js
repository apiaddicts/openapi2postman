/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

"use strict";

const _ = require("lodash");

module.exports = (function () {
return function get(path, method, status) {

  if (!_.isObject(global.definition.paths)) {
      require('../../utils/error.js')('paths is required');
    }

    const endpoint = global.definition.paths[path][_.toLower(method)];
    
    return getFirstJsonExample(endpoint, status);
  };
})();


function getFirstJsonExample(endpoint, status) {
  const examples = endpoint?.responses?.[status]?.content?.['application/json']?.examples ?? [];

  if(_.isEmpty(examples)) {
    return false;
  }

  return Object.keys(examples)[0];
}