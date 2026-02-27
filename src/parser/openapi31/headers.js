/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function () {

  return function get(verb, path) {
    const hasPaths = _.isObject(global.definition.paths);
    const hasWebhooks = _.isObject(global.definition.webhooks);

    if (!hasPaths) {
      if (hasWebhooks) return [];
      require('../../utils/error.js')('paths is required');
    }

    let parameters = global.definition.paths[path][_.toLower(verb)]['parameters'];
    let headers = _.filter(parameters, ['in', 'header'])
    const result = []
    _.forEach(headers, function (header) {
      result.push({
        key: header.name,
        type: header.schema.type,
        required: header.required,
        value: getExamples(header)
      });
    });
    return result
  };

  function getExamples(header) {
    if (header.example) return header.example;

    if (header.schema?.examples) {
      return header.schema.examples[0];
    }

    if (header.examples) {
      const firstKey = Object.keys(header.examples)[0];
      return header.examples[firstKey]?.value;
    }

    return undefined;
  }

}()