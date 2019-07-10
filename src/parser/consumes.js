'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(definition,verb,path){
  	if (!_.isObject(definition.paths)) {
		require('../utils/error.js')('paths is required');
	}

	const responses = definition.paths[path][_.toLower(verb)];
	if (_.isArray(responses.consumes) && responses.consumes.length > 0){
		return responses.consumes[0];
	} else if(_.isArray(definition.consumes) && definition.consumes.length > 0){
		return definition.consumes[0];
	}
	return 'application/json';
  };

}()