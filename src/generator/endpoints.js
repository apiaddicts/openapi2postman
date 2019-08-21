'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(endpoints){
	const items = [];
	_.forEach(endpoints, function(endpoint){
		let path = endpoint.path;
		_.forEach(endpoint.pathParameters,function(pathParameter){
			path = _.replace(path, '{'+pathParameter.name+'}', '{{'+pathParameter.name+'}}');
			require('../utils/addVariable.js')(pathParameter.name,pathParameter.type);
		});
		_.forEach(endpoint.status,function(response){
			let queryParams = '';
			_.forEach(endpoint.queryParams,function(queryParam){
				if (queryParams.length === 0){
					queryParams += '?'+queryParam.name+'={{' + queryParam.name + '}}';
				} else {
					queryParams += '&'+queryParam.name+'={{' + queryParam.name + '}}';
				}
				require('../utils/addVariable.js')(queryParam.name,queryParam.type);
			});
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
						raw: "{{host}}{{port}}{{basePath}}"+path,
						host: [
							"{{host}}{{port}}{{basePath}}"
						],
						path: [
							path + queryParams
						]
					}
	  			}
	  		});
		});
	});
	return items;
  };

}()