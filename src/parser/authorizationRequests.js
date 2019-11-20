'use strict'

const _ = require('lodash');
const fs   = require('fs');
const argv = require('yargs').argv
const path = require('path')


module.exports = function() {
  
  return function get(authorizationTokens){
	if (argv.configuration){
		try {
			return JSON.parse(fs.readFileSync("example/authorizations.postman_collection.json", 'utf8')); 
		} catch (e) {
		  	require('../utils/error.js')('error reading auth file ');
		}
	}
	if (!authorizationTokens || authorizationTokens.length === 0){
		return {};
	}
	let definition;
	try {
		definition = JSON.parse(fs.readFileSync(argv.authorization, 'utf8'));
	} catch (e) {
	  	definition = false;
	}
	return definition;
  };

}()