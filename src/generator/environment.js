'use strict'

const fs   = require('fs');
const argv = require('yargs').argv
const _ = require('lodash');

module.exports = function() {
  
  return function post(title,endpoints){
	if (! argv['target-env'] ){
		require('../utils/error.js')('target-env is required');
	}

	const items = [];
	_.forEach(endpoints, function(endpoint){
		let path = endpoint.path;
		_.forEach(endpoint.pathParameters,function(pathParameter){
			if( _.find(items, ['key', pathParameter]) ){
				return;
			}
			items.push({
	      		"description": {
	        		"content": "",
	        		"type": "text/plain"
	      		},
	      		"value": "",
	      		"key": pathParameter,
	      		"enabled": true
	    	});
		});
	});

	_.forEach(global.parameters,function(globalParameter){
		items.push({
      		"description": {
        		"content": "",
        		"type": "text/plain"
      		},
      		"value": "",
      		"key": globalParameter,
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
	  	fs.writeFileSync(argv['target-env']+'.postman_environment.json', JSON.stringify(output));
	} catch(err) {
		require('../utils/error.js')('Error writing the environment output');
	}
  };

}()