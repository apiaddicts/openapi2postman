'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(){
	if (!_.isObject(global.definition.info) || !global.definition.info.title){
		require('../utils/error.js')('info.tittle is required');
	}
	return global.definition.info.title;
  };

}()