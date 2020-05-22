'use strict'

module.exports = function() {
  
  return function get(){
    if (typeof global.definition.swagger !== 'undefined' && (global.definition.swagger === '2.0' || global.definition.swagger === '2.0.0')) {
        return 'swagger2'
    } else if (typeof global.definition.openapi !== 'undefined' && (global.definition.openapi === '3.0' || global.definition.openapi === '3.0.0')){
        return 'openapi3'
    }
	require('../utils/error.js')('Specification is not supported')
  };

}()