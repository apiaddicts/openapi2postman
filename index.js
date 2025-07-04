#! /usr/bin/env node

'use strict'
const path = require('path');
const _ = require('lodash');
const examples = require('./src/generator/examples');
const argv = require('yargs')(process.argv.slice(2))
    .option('c', {
        alias: 'configuration',
        describe: 'Path to configuration file',
        type: 'string'
    })
	.option('f', {
        alias: 'file',
        describe: 'Path to openapi file',
        type: 'string'
    })
	.help()
	.argv
const fs   = require('fs');
const { Console } = require('console');

//PARSER-------------------------------- */
let configurationFile

try {
	if (argv.configuration) {
        configurationFile = JSON.parse(fs.readFileSync(argv.configuration, "utf8"))
    } else {
		try{
			let filename = path.basename(argv.file, path.extname(argv.file));
			configurationFile = {
				api_name: filename,
				is_inline: false,
				schema_is_inline: false,
				schema_pretty_print: true,
				generate_oneOf_anyOf:false,
  			minimal_endpoints:false,
				environments:[
					{
						name : "DEV",
						postman_collection_name: "%api_name%_DEV",
						postman_environment_name: "%api_name%_DEV",
						target_folder: "./out",
						has_scopes: false,
						microcks_headers:true,
						application_token: false,
						number_of_scopes: 0,
						application_token: false,
      			has_scopes: false,
      			read_only: false,
      			validate_schema:false,
						host_server_pattern:"%dev%",

					}
				]
			};
		}catch(err) {
			require('yargs').showHelp();
			require('./src/utils/error.js')('use arg: -f/--file. openapi file path does not exist or is not correct: ' + argv.file);
		}
		
    }
} catch(err) {
	require('yargs').showHelp();
	require('./src/utils/error.js')('use argv: -c/--configuration. configuration file path does not exist or is not correct: ' + argv.configuration);
}

global.definition = require('./src/parser/definition.js')()
const version = require('./src/parser/version.js')()
global.environmentVariables = {}
global.testParams = {}
global.configurationFile = configurationFile
require('./src/parser/'+version+'/refs.js')()

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
	endpointsParsed[i].headers = require('./src/parser/'+version+'/headers.js')(endpointParsed.verb, endpointParsed.path)
	endpointsParsed[i].summary = require('./src/parser/summary.js')(endpointParsed.verb, endpointParsed.path)
	endpointsParsed[i].microcks = require('./src/parser/openapi3/microcks.js')(endpointParsed.verb, endpointParsed.path)
});

//GENERATOR-------------------------------- */
let endpointsPostman = [];
const endpoints = require('./src/generator/endpoints.js')(endpointsParsed);

_.forEach(endpoints, function (endpoint, i) {
	for (let index = 0; index < endpoint.count; index++) {
		endpoint = require('./src/generator/testStatus.js')(endpoint);
		endpoint = require('./src/generator/testBody.js')(endpoint, configurationFile);
		endpoint = require('./src/generator/contentType.js')(endpoint);
		endpoint = require("./src/generator/microcks.js")(endpoint);
		endpoint = require('./src/generator/authorization.js')(endpoint, endpoint.aux.status)
		global.currentId = endpoint.request.method + endpoint.request.url.path[0]
		global.currentId = global.currentId.replace(/{{/g,'{').replace(/}}/g,'}').split('?')[0]
		if (endpoint.aux.status === 404 && endpoint.aux.pathParameter) {
			endpoint.request.url.raw = _.replace(endpoint.request.url.raw, '{{' + endpoint.aux.pathParameter + '}}', '{{' +endpoint.aux.pathParameter + '_not_found}}')
			endpoint.request.url.path[0] = _.replace(endpoint.request.url.path[0], '{{' +endpoint.aux.pathParameter + '}}', '{{' +endpoint.aux.pathParameter + '_not_found}}')
			endpoint = require('./src/generator/body.js')(endpoint,false,false,index)
			endpoint = require('./src/generator/queryParamsRequired.js')(endpoint)
			endpointsPostman.push(endpoint)
		} else if (endpoint.aux.status === 400) {
			global.queryParamsRequiredAdded = []
			let endpointPostman
			do{
				endpointPostman = require('./src/generator/queryParamsRequired.js')(endpoint,true)
				if (endpointPostman) {
					endpointPostman = require('./src/generator/body.js')(endpointPostman,false,false,index)
					if (endpointPostman.aux.hasOwnProperty('suffix') && endpointPostman.aux.suffix.includes('wrong')) {
						endpointPostman.name += '.with.' + endpointPostman.aux.suffix;
						endpointPostman = require('./src/generator/queryParamsRequired.js')(endpointPostman);
						endpointPostman.request.url.path[0] = _.replace(endpointPostman.request.url.path[0], '{{' +endpointPostman.aux.suffix.split(' ')[1]+ '}}', '{{' +endpointPostman.aux.suffix.split(' ')[1]+ '_wrong}}')
					} else {
						endpointPostman.name += '.without.' + _.last(global.queryParamsRequiredAdded);
						endpointPostman.aux.suffix = '.without.' +_.last(global.queryParamsRequiredAdded);
					}
					endpointsPostman.push(endpointPostman);
				}
			} while(endpointPostman)
			
			const endpointWithoutQueryParamsRequired = require('./src/generator/queryParamsNotRequired.js')(endpoint,index);
			if (endpointWithoutQueryParamsRequired && endpoint) {
				endpointsPostman.push(endpointWithoutQueryParamsRequired);
			}
			let hasWrongParams = global.configurationFile.minimal_endpoints ? false : true;
			addBadRequestEndpoints(endpointsPostman, endpoint, 'requiredParams', '', true, false,index);
			addBadRequestEndpoints(endpointsPostman, endpoint, 'wrongParams', '.wrong', false, hasWrongParams,index);
		} else if ((endpoint.aux.status >= 200 && endpoint.aux.status < 300) || ((endpoint.aux.status === 401 || endpoint.aux.status === 403) && endpoint.aux.authorization)) {
			endpoint = require('./src/generator/body.js')(endpoint,false,false,index);
			endpoint = require('./src/generator/queryParamsRequired.js')(endpoint);
			endpointsPostman.push(endpoint);
		}
	}
})

const uniqueArray = [];
const hashTable = {};

endpointsPostman.forEach(obj => {
  const key = JSON.stringify(obj);
  if (!hashTable[key]) {
    hashTable[key] = true;
    uniqueArray.push(obj);
  }
});
endpointsPostman = uniqueArray;
	
//EXPORT-------------------------------- */
const apiName = argv.api_name || configurationFile.api_name;
let environments = configurationFile.environments;
_.forEach(environments, function (element) {
	const endpointsStage = _.cloneDeep(endpointsPostman)
	let exclude = {}
	let urlPath;
	if ( element.read_only ) {
		exclude.write = true
	}
	if (element.microcks_headers) {
		let actualLength = endpointsStage.length;
		for (let i = 0; i < actualLength; i++) {
		  const endpoint = endpointsStage[i];
		  const responseNameHeader = endpoint.request.header.find(
			(h) => h.key === 'X-Microcks-Response-Name'
		  );
	
		  if (!responseNameHeader) {
			if (!endpoint.request.header) {
			  endpoint.request.header = [];
			}
				const pathArray = endpoint.request.url.path;
			const path = '/' + pathArray.join('/');
			const method = endpoint.request.method;
			const status = endpoint.aux.status.toString();
	
			const exampleName = examples(path, method, status);
	
			const headerValue = exampleName || 'default';
	
			endpoint.request.header.push({
			  key: 'X-Microcks-Response-Name',
			  value: headerValue
			});
		  }
		}
	}
	
	  
	if (element.has_scopes) {
		let actualLength = endpointsStage.length;
		for (let i = 0; i < actualLength; i++) {
			if (!endpointsStage[i].aux.authorization) {
				endpointsStage[i].aux.authorization = 'user_token_with_scope1';
				endpointsStage[i].request.header.push({
					key: 'Authorization',
					value: '{{user_token_with_scope1}}'
				});
			} 
			let auth = endpointsStage[i].aux.authorization;
			let name = _.endsWith(auth, '1') ? auth.substring(0, auth.length - 1) : auth;
			if (endpointsStage[i].aux.status >= 200 && endpointsStage[i].aux.status < 400 && auth) {
				// Añadir el Test Case con application_token
				if (element.application_token) {
					endpointsStage.push(createEndpointWithScope(endpointsStage[i], 'application_token'));
				}
				
				// Añadir la cantidad indicada de Test Cases por cada scope_token
				for (let j = 2; j <= element.number_of_scopes; j++) {
					endpointsStage.push(createEndpointWithScope(endpointsStage[i], name + j));
				}

				if (typeof endpointsStage[i].aux.suffix !== 'undefined'){
					endpointsStage[i].aux.suffix += 'with.' + name;
				} else endpointsStage[i].aux.suffix = 'with.' + name;
			}
		}
	}
	if ( element.custom_authorizations_file ) {
		require('./src/parser/authorizationRequests.js')(endpointsStage,element.custom_authorizations_file)
	} else if(global.definition.components.securitySchemes){
		let securityDefinition = require('./src/parser/openapiAuthorizationDefinition.js')(global.definition.components.securitySchemes)
		if(securityDefinition){
			require('./src/parser/authorizationRequests.js')(endpointsStage,null,securityDefinition)
		} 
	} else {
		// Elimina la cabecera Authorization de las peticiones en Postman
		exclude.auth = true
	}

	if(element.host_server_pattern){
		urlPath = require('./src/generator/serverPath.js')(global.definition.servers,element.host_server_pattern)
	}

  let endpointsPostmanWithFolders = require('./src/generator/folders.js')(endpointsStage, exclude)
	// Crea el listado de variables de entorno
	let environmentVariables = require('./src/generator/environmentVariablesNames.js')(endpointsPostmanWithFolders)
	// Añadir letras a los TestCases con el mismo status code para diferenciarlos en el Runner
	for (let i = element.custom_authorizations_file ? 1 : 0; i < endpointsPostmanWithFolders.length; i++) {
		addLettersToName(endpointsPostmanWithFolders[i].item);
	}
	
	require('./src/generator/validateSchema.js')(endpointsPostmanWithFolders, element.validate_schema)
	if ( typeof apiName === "string" &&  apiName !== undefined ) {
		element.postman_collection_name = _.replace(element.postman_collection_name, '%api_name%', apiName)
		element.postman_environment_name = _.replace(element.postman_environment_name, '%api_name%', apiName)
	}
	require('./src/generator/collection.js')(element.target_folder, element.postman_collection_name, endpointsPostmanWithFolders)
	require('./src/generator/environment.js')(element.target_folder, element.postman_environment_name, element.host, element.port, schemaHostBasePath,environmentVariables,urlPath)
})
function addBadRequestEndpoints(endpointsPostman, endpointBase, memoryAlreadyAdded, suffix, withoutRequired, withWrongParam,index) {
	global[memoryAlreadyAdded] = [];
	do {
		var initialCount = global[memoryAlreadyAdded].length;
		let endpointPostman = require('./src/generator/queryParamsRequired.js')(endpointBase);
		endpointPostman = require('./src/generator/body.js')(endpointPostman, withoutRequired, withWrongParam,index);
		if (global[memoryAlreadyAdded].length > initialCount) {
			endpointPostman.name += '-' + _.last(global[memoryAlreadyAdded]) + suffix;
			endpointPostman.aux.suffix = _.last(global[memoryAlreadyAdded]) + suffix;
			endpointsPostman.push(endpointPostman);
		}
	} while (global[memoryAlreadyAdded].length > initialCount)
}

function createEndpointWithScope(endpoint, name) {
	let scopeEndpoint = _.cloneDeep(endpoint);
	let authHeader = scopeEndpoint.request.header.find(obj => { return obj.key === 'Authorization' });

	scopeEndpoint.aux.authorization = name;
	if (typeof scopeEndpoint.aux.suffix !== 'undefined'){
		scopeEndpoint.aux.suffix += 'with.' + name;
	} else scopeEndpoint.aux.suffix = 'with.' + name;
	authHeader.value = `{{${name}}}`;//_.replace(authHeader.value, endpoint.aux.authorization, name);

	return scopeEndpoint;
}

function addLettersToName(collection) {
	const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

	for (let i in collection) {
		let orderedCollection = _.groupBy(collection[i].item, function(item) { return item.aux.status });
		for (let j in orderedCollection) {
			let array = orderedCollection[j];
			if (array.length > 1) {
				// Añade una letra al nombre de cada Test Case, justo despues del status code. Ej.: 200a OK
				// Controla el exceso de Test Cases y añade dos letras en caso de ser necesario. Ej.: 200aa OK, 200ab OK
				for (let k in array) {
					array[k].name = _.replace(array[k].name, array[k].aux.status, 
						k < alphabet.length ? array[k].aux.status + alphabet[k] : array[k].aux.status + alphabet[Math.floor(k / alphabet.length) - 1] + alphabet[k % alphabet.length]);
				}
			}
		}
	}
}