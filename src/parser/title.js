'use strict'

const _ = require('lodash');
const argv = require('yargs').argv

module.exports = function() {
  
  return function get(){
	if (argv.name ){
		return argv.name;
	}
	require('../utils/error.js')('--name is required');
  };

}()