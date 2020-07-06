/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(postmanRequest,error){
    if (error && !postmanRequest.aux.queryParams){
        return false
    }
    let queryParams = '';
    postmanRequest = _.cloneDeep(postmanRequest);
    let errorAdded = false
    _.forEach(postmanRequest.aux.queryParams,function(queryParam){
        if (error && !errorAdded && queryParam.required && !_.includes(global.queryParamsRequiredAdded, queryParam.name)){
            errorAdded = true
            global.queryParamsRequiredAdded.push(queryParam.name)
            return
        }
        if (queryParams.length === 0){
            queryParams += '?'+queryParam.name+'={{' + queryParam.name + '}}'
        } else {
            queryParams += '&'+queryParam.name+'={{' + queryParam.name + '}}'
        }
        global.environmentVariables[postmanRequest.request.method + postmanRequest.request.url.path[0] + queryParam.name] =  require('../utils/exampleForField.js')(queryParam,false)
    });
    if (error && !errorAdded){
        return false
    }
    postmanRequest.request.url.path[0] += queryParams
    return postmanRequest;
  };

}()