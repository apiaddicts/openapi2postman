'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(postmanRequest,authorizationOK){
  	if (!postmanRequest.aux.authorization){
  		return postmanRequest;
  	}
    if (!authorizationOK){
      require('../utils/addVariable.js')('bad_token','string');
      postmanRequest.request.header.push({
        "key": "Authorization",
        "value": "{{bad_token}}"
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