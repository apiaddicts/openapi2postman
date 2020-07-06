/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

module.exports = function() {
  
  return function post(message){
	console.error('[31m%s[0m',message);
	process.exit(1);
  };

}()