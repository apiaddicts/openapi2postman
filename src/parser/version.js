/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

module.exports = function() {
  
  return function get(){
    const versions = {
      swagger : ['2.0', '2.0.0'],
      openapi : ['3.0', '3.0.0', '3.0.1','3.0.2' , '3.0.3']
    }

    if (versions.swagger.includes(global.definition.swagger)) {
        return 'swagger2'
    } else if (versions.openapi.includes(global.definition.openapi)){
        return 'openapi3'
    }
	require('../utils/error.js')('Specification is not supported')
  };

}()