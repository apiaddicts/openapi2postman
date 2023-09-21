/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const fs   = require('fs');
const argv = require('yargs').argv
const _ = require('lodash');

module.exports = function() {
  
	return function post(target,title,host,port,schemaHostBasePath,items){
		if (! argv.target ){
			argv.target = process.cwd()+'/'
		}

		items.push({
  		"description": {
    		"content": "",
    		"type": "text/plain"
  		},
  		"value": host,
  		"key": 'host',
  		"enabled": true
		})

		items.push({
  		"description": {
    		"content": "",
    		"type": "text/plain"
  		},
  		"value": port,
  		"key": 'port',
  		"enabled": true
		})

		items.push({
  		"description": {
    		"content": "",
    		"type": "text/plain"
  		},
  		"value": schemaHostBasePath.basePath,
  		"key": 'basePath',
  		"enabled": true
		})
		const uniqueKeys = {};
		const arregloSinDuplicados = items.filter(obj => {
			if (uniqueKeys[obj.key]) {
				return false;
			} else {
				uniqueKeys[obj.key] = true;
				return true;
			}
		});
		items = arregloSinDuplicados;

		items = _.orderBy(items, ['key'], ['asc']);

		const output = {
  		"id": "10a413ae-b106-43fe-9cc5-8481250a4bfe",
  		"name": title,
  		"values": items,
  		"_postman_variable_scope": "environment"
		}

		try {
			fs.writeFileSync(target+'/'+title+'.postman_environment.json', JSON.stringify(output,null, 4));
			console.log(`Environment ${target+'/'+title+'.postman_environment.json'} was succesfully created`);
		} catch(err) {
			require('../utils/error.js')('Error writing the output: ' + target);
		}
	}
	
}()