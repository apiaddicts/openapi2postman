'use strict'

const _ = require('lodash');
const argv = require('yargs').argv
const fs   = require('fs');

//PARSER-------------------------------- */
let configurationFile
try {
	configurationFile = JSON.parse(fs.readFileSync(argv.configuration, "utf8"))
} catch(err) {
  require('./src/utils/error.js')('Configuration file not exist or not is correct: ' + argv.configuration);
}

global.definition = require('./src/parser/definition.js')()
const version = require('./src/parser/version.js')()
global.environmentVariables = {}
global.configurationFile = configurationFile

const schemaHostBasePath = require('./src/parser/'+version+'/schemaHostBasePath.js')()
const endpointsParsed = require('./src/parser/endpoints.js')()
const authorizationTokens = []
_.forEach(endpointsParsed, function (endpointParsed, i) {
	endpointsParsed[i].status = require('./src/parser/status.js')(endpointParsed.verb, endpointParsed.path)
	if (endpointParsed.verb === 'POST' || endpointParsed.verb === 'PUT' || endpointParsed.verb === 'PATCH') {
		endpointsParsed[i].body = require('./src/parser/'+version+'/body.js')(endpointParsed.verb, endpointParsed.path)
		endpointsParsed[i].consumes = require('./src/parser/'+version+'/consumes.js')(endpointParsed.verb, endpointParsed.path)
	}
	endpointsParsed[i].pathParameters = require('./src/parser/'+version+'/pathParameters.js')(endpointParsed.verb, endpointParsed.path)
	endpointsParsed[i].bodyResponse = require('./src/parser/'+version+'/body.js')(endpointParsed.verb, endpointParsed.path, true)
	endpointsParsed[i].authorization = require('./src/parser/authorization.js')(endpointParsed.verb, endpointParsed.path, authorizationTokens)
	endpointsParsed[i].queryParams = require('./src/parser/'+version+'/queryParams.js')(endpointParsed.verb, endpointParsed.path)
	endpointsParsed[i].summary = require('./src/parser/'+version+'/summary.js')(endpointParsed.verb, endpointParsed.path)
});

//GENERATOR-------------------------------- */
const endpointsPostman = [];
const endpoints = require('./src/generator/endpoints.js')(endpointsParsed);
_.forEach(endpoints, function (endpoint, i) {
	endpoint = require('./src/generator/testStatus.js')(endpoint);
	endpoint = require('./src/generator/testBody.js')(endpoint);
	endpoint = require('./src/generator/contentType.js')(endpoint);
	endpoint = require('./src/generator/authorization.js')(endpoint, endpoint.aux.status)
	global.currentId = endpoint.request.method + endpoint.request.url.path[0]
	global.currentId = global.currentId.replace(/{{/g,'{').replace(/}}/g,'}').split('?')[0]
	if (endpoint.aux.status === 404 && endpoint.aux.pathParameter) {
		endpoint.request.url.raw = _.replace(endpoint.request.url.raw, '{{' + endpoint.aux.pathParameter + '}}', '{{' +endpoint.aux.pathParameter + '_not_found}}')
		endpoint.request.url.path[0] = _.replace(endpoint.request.url.path[0], '{{' +endpoint.aux.pathParameter + '}}', '{{' +endpoint.aux.pathParameter + '_not_found}}')
		endpoint = require('./src/generator/body.js')(endpoint)
		endpoint = require('./src/generator/queryParamsRequired.js')(endpoint)
		endpointsPostman.push(endpoint)
	} else if (endpoint.aux.status === 400) {
		global.queryParamsRequiredAdded = []
		let endpointPostman
		do{
			endpointPostman = require('./src/generator/queryParamsRequired.js')(endpoint,true)
			if (endpointPostman){
				endpointPostman = require('./src/generator/body.js')(endpointPostman)
				endpointPostman.name += '.without.' + _.last(global.queryParamsRequiredAdded) ;
				endpointPostman.aux.suffix = '.without.' +_.last(global.queryParamsRequiredAdded) ;
				endpointsPostman.push(endpointPostman);
			}
		} while(endpointPostman)
		addBadRequestEndpoints(endpointsPostman, endpoint, 'requiredParams', '', true, false);
		addBadRequestEndpoints(endpointsPostman, endpoint, 'wrongParams', '.wrong', false, true);
	} else if ((endpoint.aux.status >= 200 && endpoint.aux.status < 300) || ((endpoint.aux.status === 401 || endpoint.aux.status === 403) && endpoint.aux.authorization)) {
		endpoint = require('./src/generator/body.js')(endpoint);
		endpoint = require('./src/generator/queryParamsRequired.js')(endpoint);
		endpointsPostman.push(endpoint);
	}
})

//EXPORT-------------------------------- */
let apiName = argv.api_name || configurationFile.api_name
configurationFile = configurationFile.environments
_.forEach(configurationFile, function (element) {
	const endpointsStage = _.cloneDeep(endpointsPostman)
	let exclude = {}
	if ( element.read_only ){
		exclude.write = true
	}
	if ( element.custom_authorizations_file ) {
		require('./src/parser/'+version+'/authorizationRequests.js')(endpointsStage,element.custom_authorizations_file)
	} else {
		exclude.auth = true
	}
	let endpointsPostmanWithFolders = require('./src/generator/folders.js')(endpointsStage, exclude)
	let environmentVariables = require('./src/generator/environmentVariablesNames.js')(endpointsPostmanWithFolders)
	if (element.validate_schema === false){
		require('./src/generator/validateSchema.js')(endpointsPostmanWithFolders)
	}
	if ( apiName ) {
		element.postman_collection_name = _.replace(element.postman_collection_name, '%api_name%', apiName)
		element.postman_environment_name = _.replace(element.postman_environment_name, '%api_name%', apiName)
	}
	require('./src/generator/collection.js')(element.target_folder, element.postman_collection_name, endpointsPostmanWithFolders)
	require('./src/generator/environment.js')(element.target_folder, element.postman_environment_name, element.host, element.port, schemaHostBasePath,environmentVariables)
})

function addBadRequestEndpoints(endpointsPostman, endpointBase, memoryAlreadyAdded, suffix, withoutRequired, withWrongParam) {
	global[memoryAlreadyAdded] = [];
	do {
		var initialCount = global[memoryAlreadyAdded].length;
		let endpointPostman = require('./src/generator/queryParamsRequired.js')(endpointBase);
		endpointPostman = require('./src/generator/body.js')(endpointPostman, withoutRequired, withWrongParam);
		if (global[memoryAlreadyAdded].length > initialCount) {
			endpointPostman.name += '-' + _.last(global[memoryAlreadyAdded]) + suffix;
			endpointPostman.aux.suffix = _.last(global[memoryAlreadyAdded]) + suffix;
			endpointsPostman.push(endpointPostman);
		}
	} while (global[memoryAlreadyAdded].length > initialCount)
}