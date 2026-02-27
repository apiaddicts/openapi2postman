/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function () {

  return function get() {
    const hasPaths = _.isObject(global.definition.paths);
    const hasWebhooks = _.isObject(global.definition.webhooks);

    if (!hasPaths) {
      if (hasWebhooks) return [];
      require('../utils/error.js')('paths is required');
    }

    const items = [];
    _.forEach(global.definition.paths, function (pathInfo, path) {
      _.forEach(pathInfo, function (verbInfo, verb) {
        items.push({
          'verb': _.toUpper(verb),
          'path': path
        });
      });
    });
    return items;
  };

}()