/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function () {

  return function get(verb, path) {
    const hasPaths = _.isObject(globalThis.definition.paths);
    const hasWebhooks = _.isObject(globalThis.definition.webhooks);

    if (!hasPaths) {
      if (hasWebhooks) return [];
      require('../../utils/error.js')('paths is required');
    }

    const responses = globalThis.definition.paths[path][_.toLower(verb)]['responses']
    const keys = _.keys(responses)
    for (const index in keys) {
      keys[index] = _.toInteger(keys[index])
      if (keys[index] < 200) {
        keys[index] = 500
      }
    }
    return keys
  }

}()