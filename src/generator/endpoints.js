'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(endpoints){
	const items = [];
	_.forEach(endpoints, function(endpoint){
		let path = endpoint.path;
		_.forEach(endpoint.pathParameters,function(pathParameter){
			path = _.replace(path, '{'+pathParameter+'}', '{{'+pathParameter+'}}');
		});
		_.forEach(endpoint.status,function(response){
			items.push({
	  			name: endpoint.path+'-'+response,
	  			aux: {
	  				status:response,
	  				body:endpoint.body ? endpoint.body : false,
	  				consumes: endpoint.consumes ? endpoint.consumes : false,
	  				bodyResponse: endpoint.bodyResponse ? endpoint.bodyResponse : false,
	  				authorization: endpoint.authorization ? endpoint.authorization : false
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
						raw: "{{schema-host-basePath}}"+path,
						host: [
							"{{schema-host-basePath}}"
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