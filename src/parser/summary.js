/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash')

module.exports = function () {

  return function get(verb, path) {
    const hasPaths = _.isObject(globalThis.definition.paths);
    const hasWebhooks = _.isObject(globalThis.definition.webhooks);

    if (!hasPaths) {
      if (hasWebhooks) return false;
      require('../../utils/error.js')('paths is required');
    }

    const endpoint = globalThis.definition.paths[path][_.toLower(verb)]
    if (_.has(endpoint, 'summary')) {
      return endpoint.summary
    }

    return false
  }

}()