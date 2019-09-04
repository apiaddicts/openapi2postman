'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(endpointsPostman,exclude){
  	const result = [];
    let count = 1;
  	_.forEach(endpointsPostman,function(endpointPostman){
  		if (!endpointPostman.authType && exclude.write && (endpointPostman.request.method !== 'GET' && endpointPostman.request.method !== 'OPTIONS')){
        return;
      } else if (endpointPostman.authType && exclude.auth){
        return;
      } else if (endpointPostman.authType){
        let folderRoot = _.find(result, ['name', 'authorizations']);
        if (!folderRoot) {
          folderRoot = {
            name : 'authorizations',
            item: []
          };
          result.push(folderRoot);
        }
        folderRoot.item.push(endpointPostman);
        return;
      }
      let pathName = _.replace(endpointPostman.request.url.raw,'{{host}}{{port}}{{basePath}}/','');
  		const folderName = pathName.split('/')[0];
  		pathName = _.has(endpointPostman,'aux') && _.has(endpointPostman.aux,'summary') && endpointPostman.aux.summary
          ? endpointPostman.aux.summary 
          : endpointPostman.request.method + '-' + pathName;

      let folderRoot = _.find(result, ['name', folderName]);
  		if (!folderRoot) {
  			folderRoot = {
  				name : folderName,
  				item: []
  			};
  			result.push(folderRoot);
  		}
  		let folder = _.find(folderRoot.item, ['auxName', pathName]);
  		if (!folder) {
  			folder = {
  				name : 'TC.'+_.padStart(count, 3, '0') + ' ' +pathName,
  				item: [],
          auxName: pathName
  			};
  			folderRoot.item.push(folder);
        count++;
  		}
      let status = _.has(endpointPostman,'aux') && _.has(endpointPostman.aux, 'status') ? endpointPostman.aux.status : 'x';
      let suffix = _.has(endpointPostman,'aux') && _.has(endpointPostman.aux,'suffix') ? ' ' + endpointPostman.aux.suffix : ' ' ;
      endpointPostman.name = 'TC.'+_.padStart(count - 1, 3, '0') + '.' + status + ' ' + pathName + suffix;
		  folder.item.push(endpointPostman);
  	});
  	return result;
  };

}()