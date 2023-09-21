/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(endpoint) {
    if (endpoint.aux.queryParams.filter(s => s.required === true).length > 0) {
      return false;
    }

    let queryParams = '';
    let endpointPostmanRequest = _.cloneDeep(endpoint);
    _.forEach(endpointPostmanRequest.aux.queryParams, function (endpointParam) {

      if (queryParams.length === 0){
        queryParams += '?'+endpointParam.name+'={{' + endpointParam.name + '}}'
      } else {
        queryParams += '&'+endpointParam.name+'={{' + endpointParam.name + '}}'
      }
      if (typeof endpointParam.default !== 'undefined') {
        global.environmentVariables[endpoint.request.method + endpoint.request.url.path[0] + endpointParam.name] = endpointParam.default;
      }  else {
        global.environmentVariables[endpoint.request.method + endpoint.request.url.path[0] + endpointParam.name] = require('../utils/exampleForField.js')(endpointParam,false);
      }
    }) ;
    const urlWithoutParams = endpointPostmanRequest.request.url.path[0].split('?');
    endpointPostmanRequest.request.url.path[0] = urlWithoutParams[0] + queryParams;

    endpointPostmanRequest = require('./body.js')(endpointPostmanRequest)
    if (endpointPostmanRequest.aux.hasOwnProperty('suffix') && endpointPostmanRequest.aux.suffix.includes('wrong')) {
      endpointPostmanRequest.name += '.with.' + endpointPostmanRequest.aux.suffix;
      endpointPostmanRequest = require('./queryParamsRequired.js')(endpointPostmanRequest);
      endpointPostmanRequest.request.url.path[0] = _.replace(endpointPostmanRequest.request.url.path[0], '{{' +endpointPostmanRequest.aux.suffix.split(' ')[1]+ '}}', '{{' +endpointPostmanRequest.aux.suffix.split(' ')[1]+ '_wrong}}')
      return endpointPostmanRequest;
    } else {
      return false;
    }
  };

}()