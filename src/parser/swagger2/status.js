'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(verb,path){
  	if (!_.isObject(global.definition.paths)) {
		require('../../utils/error.js')('paths is required');
	}

	const responses = global.definition.paths[path][_.toLower(verb)]['responses'];
	return _.keys(responses);
  };

}()