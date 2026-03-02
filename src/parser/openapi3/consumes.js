/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function () {

  return function get(verb, path) {
    const hasPaths = _.isObject(globalThis.definition.paths);
    const hasWebhooks = _.isObject(globalThis.definition.webhooks);

    if (!hasPaths) {
      if (hasWebhooks) return 'application/json';
      require('../../utils/error.js')('paths is required');
    }

    const request = globalThis.definition.paths[path][_.toLower(verb)]
    if (request.requestBody && request.requestBody.content) {
      return _.keys(request.requestBody.content)[0]
    }
    return 'application/json';
  };

}()