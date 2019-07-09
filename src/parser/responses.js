'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(definition,verb,path){
  	if (!_.isObject(definition.paths)) {
		require('../utils/error.js')('paths is required');
	}

	const responses = definition.paths[path][_.toLower(verb)]['responses'];
	return _.keys(responses);
  };

}()