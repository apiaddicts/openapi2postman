'use strict'

const _ = require('lodash');
const argv = require('yargs').argv
const fs   = require('fs');

global.definition = require('./src/parser/definition.js')();
//const title = require('./src/parser/title.js')();
const schemaHostBasePath = require('./src/parser/schemaHostBasePath.js')();
const endpointsParsed = require('./src/parser/endpoints.js')();
const authorizationTokens = [];
_.forEach(endpointsParsed, function (endpointParsed, i) {
	endpointsParsed[i].status = require('./src/parser/status.js')(endpointParsed.verb, endpointParsed.path);
	if (endpointParsed.verb === 'POST' || endpointParsed.verb === 'PUT' || endpointParsed.verb === 'PATCH') {
		endpointsParsed[i].body = require('./src/parser/body.js')(endpointParsed.verb, endpointParsed.path);
		endpointsParsed[i].consumes = require('./src/parser/consumes.js')(endpointParsed.verb, endpointParsed.path);
	}
	endpointsParsed[i].pathParameters = require('./src/parser/pathParameters.js')(endpointParsed.verb, endpointParsed.path);
	endpointsParsed[i].bodyResponse = require('./src/parser/body.js')(endpointParsed.verb, endpointParsed.path, true);
	endpointsParsed[i].authorization = require('./src/parser/authorization.js')(endpointParsed.verb, endpointParsed.path, authorizationTokens);
	endpointsParsed[i].queryParams = require('./src/parser/queryParams.js')(endpointParsed.verb, endpointParsed.path);
	endpointsParsed[i].summary = require('./src/parser/summary.js')(endpointParsed.verb, endpointParsed.path);
});

const endpointsPostman = [];

const authorizationRequests = require('./src/parser/authorizationRequests.js')(authorizationTokens);
const calculated = []
let configurationFile = JSON.parse(fs.readFileSync(argv.configuration, "utf8"));


const endpoints = require('./src/generator/endpoints.js')(endpointsParsed);
_.forEach(endpoints, function (endpoint, i) {
	endpoint = require('./src/generator/testStatus.js')(endpoint);
	endpoint = require('./src/generator/testBody.js')(endpoint);
	endpoint = require('./src/generator/contentType.js')(endpoint);
	let status = _.toInteger(endpoint.aux.status);
	if (status !== 401) {
		endpoint = require('./src/generator/authorization.js')(endpoint, true);
	} else {
		endpoint = require('./src/generator/authorization.js')(endpoint, false);
	}
	if (status === 404 && endpoint.aux.pathParameter) {
		endpoint.request.url.raw = _.replace(endpoint.request.url.raw, '{{' + endpoint.aux.pathParameter + '}}', '{{' + endpoint.aux.pathParameter + '_not_found}}')
		endpoint.request.url.path[0] = _.replace(endpoint.request.url.path[0], '{{' + endpoint.aux.pathParameter + '}}', '{{' + endpoint.aux.pathParameter + '_not_found}}')
		endpoint = require('./src/generator/body.js')(endpoint);
		endpointsPostman.push(endpoint);
		require('./src/utils/addVariable.js')(endpoint.aux.pathParameter + '_not_found', 'string');
	} else if (status === 400) {
		addBadRequestEndpoints(endpointsPostman, endpoint, 'requiredParams', '', true, false);
		addBadRequestEndpoints(endpointsPostman, endpoint, 'wrongParams', '.wrong', false, true);
	} else if ((status >= 200 && status < 300) || (status === 401 && endpoint.aux.authorization)) {
		endpoint = require('./src/generator/body.js')(endpoint);
		endpointsPostman.push(endpoint);
	}
});

let endpointsPostmanWithFolders = null;

if (argv.configuration) {
	_.forEach(configurationFile, function (environment) {
		_.forEach(environment, function (element) {
			if (element.custom_authorizations_file) {
				_.forEach(authorizationRequests.item, function (authorizationRequest) {
					authorizationRequest.authType = true
					endpointsPostman.push(authorizationRequest)
				})
				require('./src/utils/addVariable.js')("client_secret", 'string');
				require('./src/utils/addVariable.js')("client_id", 'string');
				require('./src/utils/addVariable.js')("username_token", 'string');
				require('./src/utils/addVariable.js')("password_token", 'string');
				require('./src/utils/addVariable.js')("autologin_ticket_token", 'string');
			} else {
				_.forEach(authorizationTokens, function (authorizationToken) {
					if (_.indexOf(calculated, authorizationToken.name) !== -1) {
						return
					}
					endpointsPostman.push(require('./src/parser/authorizationRequest.js')(authorizationToken, authorizationRequests));
					calculated.push(authorizationToken.name)
				});

			}
			if (element.name === "DEV") {
				endpointsPostmanWithFolders = require('./src/generator/folders.js')(endpointsPostman, {});
				require('./src/generator/collection.js')(element.target_folder, element.postman_collection_name, endpointsPostmanWithFolders);
				require('./src/generator/environment.js')(element.target_folder, element.postman_environment_name, element.host, element.port, element.host, schemaHostBasePath, endpointsParsed);

			} else if (element.name === "VAL") {
				endpointsPostmanWithFolders = require('./src/generator/folders.js')(endpointsPostman, {
					write: true
				});
				require('./src/generator/collection.js')(element.target_folder, element.postman_collection_name, endpointsPostmanWithFolders);
				require('./src/generator/environment.js')(element.target_folder, element.postman_environment_name, element.host, element.port, element.host, schemaHostBasePath, endpointsParsed);
			} else if (element.name === "PROD") {
				endpointsPostmanWithFolders = require('./src/generator/folders.js')(endpointsPostman, {
					aux: true
				});
				require('./src/generator/collection.js')(element.target_folder, element.postman_collection_name, endpointsPostmanWithFolders);
				require('./src/generator/environment.js')(element.target_folder, element.postman_environment_name, element.host, element.port, element.host, schemaHostBasePath, endpointsParsed);
			}
		});
	});
}



function addBadRequestEndpoints(endpointsPostman, endpointBase, memoryAlreadyAdded, suffix, withoutRequired, withWrongParam) {
	global[memoryAlreadyAdded] = [];
	do {
		var initialCount = global[memoryAlreadyAdded].length;
		let endpointPostman = require('./src/generator/body.js')(endpointBase, withoutRequired, withWrongParam);
		if (global[memoryAlreadyAdded].length > initialCount) {
			endpointPostman.name += '-' + _.last(global[memoryAlreadyAdded]) + suffix;
			endpointPostman.aux.suffix = _.last(global[memoryAlreadyAdded]) + suffix;
			endpointsPostman.push(endpointPostman);
		}
	} while (global[memoryAlreadyAdded].length > initialCount)
}