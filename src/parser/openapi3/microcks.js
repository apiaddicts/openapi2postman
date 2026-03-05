const _ = require('lodash');

module.exports = (function hasMicrocksOperation(verb, path) {
  const hasPaths = _.isObject(globalThis.definition.paths);
  const hasWebhooks = _.isObject(globalThis.definition.webhooks);

  if (!hasPaths) {
    if (hasWebhooks) return false;
    require('../../utils/error.js')('paths is required');
  }

  const endpoint = globalThis.definition.paths[path][_.toLower(verb)]

  return !!endpoint["x-microcks-operation"]
})