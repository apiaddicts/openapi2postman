'use strict'

const yaml = require('js-yaml');
const fs   = require('fs');
const argv = require('yargs').argv
const path = require('path')

module.exports = function() {
  
  return function get(){

	if (path.extname(argv.file) !== '.yaml' && path.extname(argv.file) !== '.yml'){
		require('../utils/error.js')('Only yaml and yml is supported');
	}

	let definition;
	try {
		definition = yaml.safeLoad(fs.readFileSync(argv.file, 'utf8'));
	} catch (e) {
	  	require('../utils/error.js')('The yaml format is not correct');
	}
	return definition;
  };

}()