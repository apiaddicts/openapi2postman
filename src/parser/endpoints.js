'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(definition){
	if (!_.isObject(definition.paths)) {
		require('../utils/error.js')('paths is required');
	}

	const items = [];
	_.forEach(definition.paths, function(pathInfo,path) {	  	
	  	_.forEach(pathInfo, function(verbInfo,verb) {
	  		items.push({
	  			'verb' :  _.toUpper(verb),
	  			'path' : path
	  		});
	  	});
	});
	return items;
  };

}()