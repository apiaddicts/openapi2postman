'use strict'

const _ = require('lodash');
const argv = require('yargs').argv

module.exports = function() {
  
  return function get(){
	if (argv.name ){
		return argv.name;
	}
	if (!_.isObject(global.definition.info) || !global.definition.info.title){
		require('../utils/error.js')('info.tittle is required');
	}
	return global.definition.info.title;
  };

}()