'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(definition,verb,path){
  	if (!_.isObject(definition.paths)) {
		require('../utils/error.js')('paths is required');
	}

	const parameters = definition.paths[path][_.toLower(verb)]['parameters'];
	const parametersPath = _.filter(parameters, ['in', 'path']);
	const result = [];
	_.forEach(parametersPath, function(parameterPath) {	
		result.push(parameterPath.name);
	});

	return result;
  };

}()