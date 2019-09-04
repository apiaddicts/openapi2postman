'use strict'

const _ = require('lodash');

global.definition = require('./src/parser/definition.js')();
const title = require('./src/parser/title.js')();
const schemaHostBasePath = require('./src/parser/schemaHostBasePath.js')();
const endpointsParsed = require('./src/parser/endpoints.js')();
const authorizationTokens = [];
_.forEach(endpointsParsed, function(endpointParsed,i) {	
	endpointsParsed[i].status = require('./src/parser/status.js')(endpointParsed.verb,endpointParsed.path);
	if (endpointParsed.verb === 'POST' || endpointParsed.verb === 'PUT' || endpointParsed.verb === 'PATCH') {
		endpointsParsed[i].body = require('./src/parser/body.js')(endpointParsed.verb,endpointParsed.path);
		endpointsParsed[i].consumes = require('./src/parser/consumes.js')(endpointParsed.verb,endpointParsed.path);
	}
	endpointsParsed[i].pathParameters = require('./src/parser/pathParameters.js')(endpointParsed.verb,endpointParsed.path);
	endpointsParsed[i].bodyResponse = require('./src/parser/body.js')(endpointParsed.verb,endpointParsed.path,true);
	endpointsParsed[i].authorization = require('./src/parser/authorization.js')(endpointParsed.verb,endpointParsed.path,authorizationTokens);
	endpointsParsed[i].queryParams = require('./src/parser/queryParams.js')(endpointParsed.verb,endpointParsed.path);
	endpointsParsed[i].summary = require('./src/parser/summary.js')(endpointParsed.verb,endpointParsed.path);
});

const endpointsPostman = [];

const authorizationRequests = require('./src/parser/authorizationRequests.js')(authorizationTokens);
const calculated = []
_.forEach(authorizationTokens, function(authorizationToken) {
	if(_.indexOf(calculated, authorizationToken.name) !== -1){
		return
	}
	endpointsPostman.push(require('./src/parser/authorizationRequest.js')(authorizationToken,authorizationRequests));
	calculated.push(authorizationToken.name)
});

const endpoints = require('./src/generator/endpoints.js')(endpointsParsed);
_.forEach(endpoints, function(endpoint,i) {	
	endpoint = require('./src/generator/testStatus.js')(endpoint);
	endpoint = require('./src/generator/testBody.js')(endpoint);
	endpoint = require('./src/generator/contentType.js')(endpoint);
	let status = _.toInteger(endpoint.aux.status);
	if (status !== 401){
		endpoint = require('./src/generator/authorization.js')(endpoint);
	}
	if (status === 400){
		addBadRequestEndpoints (endpointsPostman,endpoint,'requiredParams','',true,false);
		addBadRequestEndpoints (endpointsPostman,endpoint,'wrongParams','.wrong',false,true);
	} else if ( (status >= 200 && status < 300) || (status === 401 && endpoint.aux.authorization)){
		endpoint = require('./src/generator/body.js')(endpoint);
		endpointsPostman.push(endpoint);
	}
});

let endpointsPostmanWithFolders = require('./src/generator/folders.js')(endpointsPostman,{});
require('./src/generator/collection.js')('02_test_suite_'+title+'_pre_apim',endpointsPostmanWithFolders);

endpointsPostmanWithFolders = require('./src/generator/folders.js')(endpointsPostman,{write:true});
require('./src/generator/collection.js')('03_test_suite_'+title+'_pro_apim',endpointsPostmanWithFolders);

endpointsPostmanWithFolders = require('./src/generator/folders.js')(endpointsPostman,{auth:true});
require('./src/generator/collection.js')('01_test_suite_'+title+'_pre_backend',endpointsPostmanWithFolders);

require('./src/generator/environment.js')(title,schemaHostBasePath,endpointsParsed);


function addBadRequestEndpoints (endpointsPostman,endpointBase,memoryAlreadyAdded,suffix,withoutRequired,withWrongParam) {
	global[memoryAlreadyAdded] = [];
	do {
		var initialCount = global[memoryAlreadyAdded].length;
		let endpointPostman = require('./src/generator/body.js')(endpointBase,withoutRequired,withWrongParam);
		if (global[memoryAlreadyAdded].length > initialCount){
			endpointPostman.name += '-'+_.last(global[memoryAlreadyAdded])+suffix ;
			endpointPostman.aux.suffix = _.last(global[memoryAlreadyAdded])+suffix ;
			endpointsPostman.push(endpointPostman);
		}
	} while (global[memoryAlreadyAdded].length > initialCount)	
}