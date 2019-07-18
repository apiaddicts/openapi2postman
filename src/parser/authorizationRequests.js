'use strict'

const _ = require('lodash');
const fs   = require('fs');
const argv = require('yargs').argv
const path = require('path')

module.exports = function() {
  
  return function get(){
	let definition;
	try {
		definition = JSON.parse(fs.readFileSync(argv.authorization, 'utf8'));
	} catch (e) {
	  	require('../utils/error.js')('Error reading authorization file');
	}
	return definition;
  };

}()