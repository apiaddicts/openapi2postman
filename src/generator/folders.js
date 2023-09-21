/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(endpointsPostman,exclude){
  	const result = []
  	_.forEach(endpointsPostman, function(endpointPostman){
  		if (!endpointPostman.authType && exclude.write && (endpointPostman.request.method !== 'GET' && endpointPostman.request.method !== 'OPTIONS')){
        return;
      } else if ((endpointPostman.authType || endpointPostman.aux.status == 401  || endpointPostman.aux.status == 403) && exclude.auth){
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
  			result.push(folderRoot)
  		}
  		let folder = _.find(folderRoot.item, ['auxName', pathName]);
  		if (!folder) {
  			folder = {
  				name : pathName,
  				item: [],
          auxName: pathName,
          auxOrder: endpointPostman.request.method
  			};
  			folderRoot.item.push(folder)
  		}
      let status = _.has(endpointPostman,'aux') && _.has(endpointPostman.aux, 'status') ? endpointPostman.aux.status : 'x';
      let suffix = _.has(endpointPostman,'aux') && _.has(endpointPostman.aux,'suffix') ? ' ' + endpointPostman.aux.suffix : ' ' ;
      endpointPostman.name = status + ' ' + pathName + suffix;
      deleteHeaderAuthorization(endpointPostman, exclude);
      folder.item.push(endpointPostman);
    });
    orderByMethod(result)
    numerate(result)
  	return result;
  };

  // Numeración de los Test Cases
  function numerate(collection){
    let countRoot = 1;
    if (collection.find(s => s.name === 'authorizations')) {
      countRoot = 0;
    }  
    for (let i in collection){
      let countItem = 1
      let numerateRoot = _.padStart(countRoot, 2, '0') + '.'
      collection[i].name = numerateRoot + collection[i].name
      for (let j in collection[i].item) {
        let numerateItem = numerateRoot + _.padStart(countItem, 2, '0') + '.'
        collection[i].item[j].name = numerateItem + collection[i].item[j].name
        if (!collection[i].item[j].aux){
          collection[i].item[j].aux = {}
        }
        collection[i].item[j].aux.numerateItem = 'TC.' + numerateItem
        // Ordenar la lista de Test Cases por status code ascendente
        if (collection[i].item[j].item) {
          collection[i].item[j].item = _.sortBy(collection[i].item[j].item, [function(item) { return item.aux.status; }]);
        }
        for (let k in collection[i].item[j].item) {
          let statusResponse = shortName(collection[i].item[j].item[k].aux.status);
          collection[i].item[j].item[k].name = _.replace(collection[i].item[j].item[k].name, collection[i].item[j].auxName, statusResponse).trim();
          collection[i].item[j].item[k].name = 'TC.' + numerateItem + collection[i].item[j].item[k].name
          collection[i].item[j].item[k].aux.numerateItem = 'TC.' + numerateItem
        }
        countItem++
      }
      countRoot++
    }
  }

  function orderByMethod(collection){
    for (let i in collection){
      collection[i].item = _.orderBy(collection[i].item, function(item){
          switch (item.auxOrder) {
            case 'POST':
              return 1
            case 'PUT':
              return 2
            case 'PATCH':
              return 3
            case 'GET':
              return 4
            case 'DELETE':
              return 5
            default:
              return 6
          }
      })
    }
  }

  function deleteHeaderAuthorization(endpointPostman,exclude){
    if (!exclude.auth){
      return
    }
    const header = _.remove(endpointPostman.request.header, function(header) {
      return _.lowerCase(header.key) !== 'authorization'
    })
    endpointPostman.request.header = header
  }

  function shortName (status) {
    switch (status) {
      case 200:
        return 'Successfull';
      case 201: 
        return 'Created';
      case 202:
        return 'Acepted';
      case 204:
        return 'No Content';
      case 206:
        return 'Partial Content';
      case 400:
        return 'Error';
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Not Found';
      case 409:
        return 'Conflict';
      default:
        return ' ';
    }
  }

}()