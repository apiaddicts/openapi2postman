'use strict'

const fs   = require('fs');
const argv = require('yargs').argv
const _ = require('lodash');

module.exports = function() {
  
  return function post(title,schemaHostBasePath,endpoints){
	if (! argv.target ){
		require('../utils/error.js')('target is required');
	}

	const items = [];

	items.push({
  		"description": {
    		"content": "",
    		"type": "text/plain"
  		},
  		"value": schemaHostBasePath,
  		"key": 'schema-host-basePath',
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
	  	fs.writeFileSync(argv.target+'/'+title+'.postman_environment.json', JSON.stringify(output));
	} catch(err) {
		require('../utils/error.js')('Error writing the environment output');
	}
  };

}()