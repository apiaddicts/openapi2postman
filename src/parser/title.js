'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(definition){
	if (!_.isObject(definition.info) || !definition.info.title){
		require('../utils/error.js')('info.tittle is required');
	}
	return definition.info.title;
  };

}()