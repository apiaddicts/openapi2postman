'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(postmanRequest,status){
  	if (!postmanRequest.aux.authorization){
  		return postmanRequest;
  	}
    if (status === 401){
      postmanRequest.request.header.push({
        "key": "Authorization",
        "value": "{{not_authorized_token}}"
      });
      return postmanRequest;
    } else if (status === 403){
      postmanRequest.request.header.push({
        "key": "Authorization",
        "value": "{{forbidden_token}}"
      });
      return postmanRequest;
    }
  	postmanRequest.request.header.push({
      "key": "Authorization",
      "value": "{{"+postmanRequest.aux.authorization+"}}"
    });
  	return postmanRequest;
  };

}()