const _ = require('lodash');

module.exports = (function (verb, path) {
  const hasPaths = _.isObject(global.definition.paths);
  const hasWebhooks = _.isObject(global.definition.webhooks);

  if (!hasPaths) {
    if (hasWebhooks) return false;
    require('../../utils/error.js')('paths is required');
  }

  const endpoint = global.definition.paths[path][_.toLower(verb)]

  return !!endpoint["x-microcks-operation"]
})