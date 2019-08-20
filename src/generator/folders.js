'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(endpointsPostman,exclude){
  	const result = [];
  	_.forEach(endpointsPostman,function(endpointPostman){
  		if (!endpointPostman.authType && exclude.write && (endpointPostman.request.method !== 'GET' && endpointPostman.request.method !== 'OPTIONS')){
        return;
      } else if (endpointPostman.authType && exclude.auth){
        return;
      }
      let pathName = _.replace(endpointPostman.request.url.raw,'{{schema-host-basePath}}/','');
  		const folderName = pathName.split('/')[0];
  		pathName = endpointPostman.request.method + '-' + pathName;
  		let folderRoot = _.find(result, ['name', folderName]);
  		if (!folderRoot) {
  			folderRoot = {
  				name : folderName,
  				item: []
  			};
  			result.push(folderRoot);
  		}
  		let folder = _.find(folderRoot.item, ['name', pathName]);
  		if (!folder) {
  			folder = {
  				name : pathName,
  				item: []
  			};
  			folderRoot.item.push(folder);
  		}
		folder.item.push(endpointPostman);
  	});
  	return result;
  };

}()