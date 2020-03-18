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
            queryParams += '?'+queryParam.name+'={{' + queryParam.prefix + queryParam.name + '}}'
        } else {
            queryParams += '&'+queryParam.name+'={{' + queryParam.prefix + queryParam.name + '}}'
        }
    });
    if (error && !errorAdded){
        return false
    }
    postmanRequest.request.url.path[0] += queryParams
    return postmanRequest;
  };

}()