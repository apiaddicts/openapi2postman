'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(){
	if (!global.definition.host){
		require('../utils/error.js')('host is required');
	}
	if (!global.definition.basePath){
		require('../utils/error.js')('basePath is required');
	}
	const schema = global.definition.schemes && _.isArray(global.definition.schemes) && global.definition.schemes.length > 0 ? global.definition.schemes[0] : 'http'; 
	return schema+'://'+global.definition.host+global.definition.basePath;
  };

}()