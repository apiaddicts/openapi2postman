'use strict'

const _ = require('lodash');

global.definition = require('./src/parser/definition.js')();
const title = require('./src/parser/title.js')();
const endpointsParsed = require('./src/parser/endpoints.js')();
_.forEach(endpointsParsed, function(endpointParsed,i) {	
	endpointsParsed[i].status = require('./src/parser/status.js')(endpointParsed.verb,endpointParsed.path);
	if (endpointParsed.verb === 'POST' || endpointParsed.verb === 'PUT' || endpointParsed.verb === 'PATCH') {
		endpointsParsed[i].body = require('./src/parser/body.js')(endpointParsed.verb,endpointParsed.path);
		endpointsParsed[i].consumes = require('./src/parser/consumes.js')(endpointParsed.verb,endpointParsed.path);
	}
	endpointsParsed[i].pathParameters = require('./src/parser/pathParameters.js')(endpointParsed.verb,endpointParsed.path);
	endpointsParsed[i].bodyResponse = require('./src/parser/body.js')(endpointParsed.verb,endpointParsed.path,true);
});

const endpointsPostman = [];
const endpoints = require('./src/generator/endpoints.js')(endpointsParsed);
_.forEach(endpoints, function(endpoint,i) {	
	endpoint = require('./src/generator/testStatus.js')(endpoint);
	endpoint = require('./src/generator/testBody.js')(endpoint);
	endpoint = require('./src/generator/contentType.js')(endpoint);
	let status = _.toInteger(endpoint.aux.status);
	if (status === 400){
		addBadRequestEndpoints (endpointsPostman,endpoint,'requiredParams','',true,false);
		addBadRequestEndpoints (endpointsPostman,endpoint,'wrongParams','.wrong',false,true);
	} else if (status >= 200 && status < 300){
		endpoint = require('./src/generator/body.js')(endpoint);
		endpointsPostman.push(endpoint);
	}
});
require('./src/generator/collection.js')(title,endpointsPostman);
require('./src/generator/environment.js')(title,endpointsParsed);


function addBadRequestEndpoints (endpointsPostman,endpointBase,memoryAlreadyAdded,suffix,withoutRequired,withWrongParam) {
	global[memoryAlreadyAdded] = [];
	do {
		var initialCount = global[memoryAlreadyAdded].length;
		let endpointPostman = require('./src/generator/body.js')(endpointBase,withoutRequired,withWrongParam);
		if (global[memoryAlreadyAdded].length > initialCount || !initialCount){
			endpointPostman.name += '-'+_.last(global[memoryAlreadyAdded])+suffix ;
			endpointsPostman.push(endpointPostman);
		}
	} while (global[memoryAlreadyAdded].length > initialCount)	
}