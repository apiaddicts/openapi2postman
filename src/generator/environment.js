'use strict'

const fs   = require('fs');
const argv = require('yargs').argv
const _ = require('lodash');

module.exports = function() {
  
  return function post(target,title,host,port,schemaHostBasePath,endpoints){
	if (! argv.target ){
		argv.target = process.cwd()+'/'
	}

	const items = [];

	items.push({
  		"description": {
    		"content": "",
    		"type": "text/plain"
  		},
  		"value": host,
  		"key": 'host',
  		"enabled": true
	});

	items.push({
  		"description": {
    		"content": "",
    		"type": "text/plain"
  		},
  		"value": port,
  		"key": 'port',
  		"enabled": true
	});

	items.push({
  		"description": {
    		"content": "",
    		"type": "text/plain"
  		},
  		"value": schemaHostBasePath.basePath,
  		"key": 'basePath',
  		"enabled": true
	});

	_.forEach(global.parameters,function(globalParameter){
		let value = '';
		if (argv['environment-values'] ){
		    switch (globalParameter.type) {
		      case 'string':
		     	value = 'swagger2postman';
		        break;
		      case 'number':
		      case 'integer':
		     	value = 1;
		        break;
		      case 'boolean':
		     	value = true;
		        break;
		    }
		}

		items.push({
      		"description": {
        		"content": "",
        		"type": "text/plain"
      		},
      		"value": value,
      		"key": globalParameter.name,
      		"enabled": true
    	});
	});

	const output = {
  		"id": "10a413ae-b106-43fe-9cc5-8481250a4bfe",
  		"name": title,
  		"values": items,
  		"_postman_variable_scope": "environment"
}

	try {
		  fs.writeFileSync(target+'/'+title+'.postman_environment.json', JSON.stringify(output));
		  console.log(`Environment ${target+'/'+title+'.postman_environment.json'} was succesfully created`);
	} catch(err) {
		require('../utils/error.js')('Error writing the environment output');
	}
  };

}()