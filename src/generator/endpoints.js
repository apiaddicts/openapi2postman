'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(endpoints){
	const items = [];
	_.forEach(endpoints, function(endpoint){
		_.forEach(endpoint.responses,function(response){
			items.push({
	  			name: endpoint.path+'-'+response,
	  			status: response,	
	  			response: [], 	
	  			request: {
	  				method: endpoint.verb,
	  				header: [],
	  				body: {
						mode: "raw",
						raw: ""
					},
					url: {
						raw: "{{server}}"+endpoint.path,
						host: [
							"{{server}}"
						],
						path: [
							endpoint.path
						]
					}
	  			}
	  		});
		});
	});
	return items;
  };

}()