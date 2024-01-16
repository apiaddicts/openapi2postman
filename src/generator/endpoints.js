/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function() {
  
	return function get(endpoints) {
	const items = [];
	_.forEach(endpoints, function(endpoint) {
		let path = endpoint.path;
		let pathParameterSaved = false
		_.forEach(endpoint.pathParameters, function(pathParameter) {
			pathParameterSaved = pathParameter;
			path = _.replace(path, '{'+pathParameter.name+'}', '{{'+pathParameter.name+'}}')
			global.environmentVariables[endpoint.verb+endpoint.path+pathParameter.name] =  require('../utils/exampleForField.js')(pathParameter,false)
		});
		_.forEach(endpoint.status,function(response) {
			let item = {
				name: endpoint.path + '-' + response,
				aux: {
					status:response,
					body:endpoint.body ? endpoint.body : false,
					consumes: endpoint.consumes ? endpoint.consumes : false,
					bodyResponse: endpoint.bodyResponse ? endpoint.bodyResponse : false,
					authorization: endpoint.authorization ? endpoint.authorization : false,
					summary: endpoint.summary ? endpoint.summary : false,
					queryParams: endpoint.queryParams ? endpoint.queryParams : false,
					pathParameter: pathParameterSaved.name,
          pathParameterExample: pathParameterSaved.example || ''
				},	
				response: [], 	
				request: {
					method: endpoint.verb,
					header: [],
					body: {
						mode: "raw",
						raw: ""
					},
					url: {
						raw: "{{host}}{{port}}{{basePath}}"+path,
						host: [
							"{{host}}{{port}}{{basePath}}"
						],
						path: [
							path
						]
					}
				}
			}
			items.push(item);

			// Duplicidad de los Test Case POST de /recurso/get que tengan definido $filter, indicándolo en el nombre
			if (item.aux.status >= 200 && item.aux.status < 400 && item.request.method === 'POST') {
				let nameWithoutStatus = item.name.substring(0, item.name.length - 4);
				if (nameWithoutStatus.substring(nameWithoutStatus.length - 4) === '/get' && item.aux.body.properties['$filter']) {
					let clon = _.cloneDeep(item);
					clon.aux.suffix = '$filter ';
					clon.aux.queryParams = [];
					items.push(clon);
				}
			}

			// Duplicar los endpoints para cada queryParameter
			if (item.aux.status >= 200 && item.aux.status < 400 && item.aux.queryParams.length > 0) {
				addQueryParamEndpoint(item, items);
			}
		});
	});
	return items;
  };

	// Duplica los casos de éxito por cada queryParameter opcional distinto
	function addQueryParamEndpoint(endpoint, items) {
		let requiredParams = [];
		let notRequiredParams;
		
		for (let i in endpoint.aux.queryParams) {
			if (endpoint.aux.queryParams[i].required) {
				requiredParams.push(endpoint.aux.queryParams[i]);
			}
		}
		notRequiredParams = _.difference(endpoint.aux.queryParams, requiredParams);
		for (let i in notRequiredParams) {
			let item = _.cloneDeep(endpoint);
			// Eliminar el $filter de los POST /recurso/get que se prueben con cada queryParameter
			if (item.aux.status >= 200 && item.aux.status < 400 && item.request.method === 'POST') {
				let nameWithoutStatus = item.name.substring(0, item.name.length - 4);
				if (nameWithoutStatus.substring(nameWithoutStatus.length - 4) === '/get' && item.aux.body.properties['$filter']) {
					item.aux.body = false;
				}
			}
			item.aux.queryParams = _.concat(requiredParams, notRequiredParams[i]);
			item.aux.suffix = `queryString ${notRequiredParams[i].name} `;
			const itemWrong = _.cloneDeep(item);
			const newitemWrong = addQueryParamEndpointWrong(itemWrong, notRequiredParams[i]);
			items.push(item);
			items.push(newitemWrong);
		}
	}

	function addQueryParamEndpointWrong(endpointWrong, notRequiredParam) {
		endpointWrong.aux.status = 400;
		endpointWrong.name = endpointWrong.name.substring(0, endpointWrong.name.length - 3) + endpointWrong.aux.status;
		endpointWrong.aux.suffix = `queryString ${notRequiredParam.name} wrong`;

		return endpointWrong;
	}
}()