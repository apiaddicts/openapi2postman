"use strict";

const _ = require("lodash");

module.exports = (function () {
  return function get(path, method, status) {
    if (!_.isObject(global.definition.paths)) {
      require('../utils/error.js')('paths is required');
    }

    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    if (!global.definition.paths[path]) {
      return null;
    }

    const methodLower = _.toLower(method);
    const endpoint = global.definition.paths[path][methodLower];

    if (!endpoint) {
      return null;
    }

    return getFirstJsonExample(endpoint, status);
  };
})();

function getFirstJsonExample(endpoint, status) {
  const statusStr = status.toString();

  let response = endpoint.responses[statusStr];

  if (!response) {
    response = endpoint.responses['default'];
  }

  if (!response) {
    return null;
  }

  const content = response.content;

  if (!content) {
    return null;
  }

  for (const mediaTypeKey of Object.keys(content)) {
    const mediaType = content[mediaTypeKey];
    if (mediaType && mediaType.examples) {
      const examples = mediaType.examples;
      if (!_.isEmpty(examples)) {
        return Object.keys(examples)[0];
      }
    }
  }

  return null;
}
