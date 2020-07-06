/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(verb,path){
  	if (!_.isObject(global.definition.paths)) {
		require('../../utils/error.js')('paths is required')
	}

	const parameters = global.definition.paths[path][_.toLower(verb)]['parameters']
	const queryParams = _.filter(parameters, ['in', 'query'])
	const result = []
	_.forEach(queryParams, function(queryParam) {	
		result.push( { name : queryParam.name , type : queryParam.type, required : queryParam.required } )
	})

	return result
  };

}()