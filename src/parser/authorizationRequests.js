/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

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
	  	require('../utils/error.js')('error reading auth file ');
	}
	for (let i in definition.item){
		definition.item[i].authType = true
		// Comprobar que viene un status dentro del objeto aux para cada endpoint de autorización
		if (definition.item[i].item) {
			if (!definition.item[i].item[0].aux || !definition.item[i].item[0].aux.status) {
				createStatus(definition.item[i].item);
			}
		}
		endpoints.unshift(definition.item[i])
	}

  };

  function createStatus(collection) {
	for (let i = 0; i < collection.length; i++) {
		if (!collection[i].aux || !collection[i].aux.status) {
			collection[i].aux = {
				status: 200
			}
		}
	}
  }

}()