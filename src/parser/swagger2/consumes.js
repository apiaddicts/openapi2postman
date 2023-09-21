/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(verb, path){
  	if (!_.isObject(global.definition.paths)) {
		require('../../utils/error.js')('paths is required');
	}

	const responses = global.definition.paths[path][_.toLower(verb)];
	if (_.isArray(responses.consumes) && responses.consumes.length > 0){
		return responses.consumes[0];
	} else if(_.isArray(global.definition.consumes) && global.definition.consumes.length > 0){
		return global.definition.consumes[0];
	}
	return 'application/json';
  };

}()