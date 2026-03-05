/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function() {

  return function get(){
    if (!globalThis.definition.servers || !_.isArray(globalThis.definition.servers) || !globalThis.definition.servers[0]?.url || !_.isString(globalThis.definition.servers[0].url)) {
      require('../../utils/error.js')('servers is required')
    }
      const all = globalThis.definition.servers[0].url
      const allArray = all.split( '/' )
      const protocol = allArray[0]
      if (protocol !== 'http:' && protocol !== 'https:' && protocol !== '{scheme}:') {
          require('../../utils/error.js')('servers.url should be http or https')
      }
      const domain = allArray[2]
      const host = protocol + '//' + domain
    return {
      host: host,
      basePath: all.replace(host, '')
    };
  };

}()