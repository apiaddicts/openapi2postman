'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(endpoints){
	const items = [];
	_.forEach(endpoints, function(endpoint){
		let path = endpoint.path;
		let pathParameterSaved = false
		_.forEach(endpoint.pathParameters,function(pathParameter){
			pathParameterSaved = pathParameter.name
			path = _.replace(path, '{'+pathParameter.name+'}', '{{'+pathParameter.prefix+pathParameter.name+'}}')
		});
		_.forEach(endpoint.status,function(response){
			items.push({
	  			name: endpoint.path+'-'+response,
	  			aux: {
	  				status:response,
	  				body:endpoint.body ? endpoint.body : false,
	  				consumes: endpoint.consumes ? endpoint.consumes : false,
	  				bodyResponse: endpoint.bodyResponse ? endpoint.bodyResponse : false,
	  				authorization: endpoint.authorization ? endpoint.authorization : false,
					summary: endpoint.summary ? endpoint.summary : false,
					queryParams: endpoint.queryParams ? endpoint.queryParams : false,
	  				pathParameter: pathParameterSaved
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
	  		});
		});
	});
	return items;
  };

}()