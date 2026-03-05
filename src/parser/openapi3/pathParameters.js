/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash')

module.exports = function () {

  return function get(verb, path) {
  	const hasPaths = _.isObject(globalThis.definition.paths);
    const hasWebhooks = _.isObject(globalThis.definition.webhooks);

    if (!hasPaths) {
      if (hasWebhooks) return [];
      require('../../utils/error.js')('paths is required');
    }

    const parameters = globalThis.definition.paths[path][_.toLower(verb)]['parameters']
    const parametersPath = _.filter(parameters, ['in', 'path'])
    const result = []
    _.forEach(parametersPath, function (parameterPath) {
      result.push({ name: parameterPath.name, type: parameterPath.schema.type, example: parameterPath.schema.example || parameterPath.schema.examples?.[0] })
    })

    return result
  }

}()