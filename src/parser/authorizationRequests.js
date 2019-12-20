'use strict'

const _ = require('lodash');
const fs   = require('fs');
const argv = require('yargs').argv
const path = require('path')


module.exports = function() {
  
  return function get(endpoints,file){
	let definition;
	try {
		definition = JSON.parse(fs.readFileSync(file, 'utf8'));
	} catch (e) {
	  	require('../utils/error.js')('error reading auth file ')
	}
	for (let i in definition.item){
		definition.item[i].authType = true
		endpoints.unshift(definition.item[i])
	}

  };

}()