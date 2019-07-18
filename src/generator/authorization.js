'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(postmanRequest){
  	if (!postmanRequest.aux.authorization){
  		return postmanRequest;
  	}
  	postmanRequest.request.header.push({
      "key": "Authorization",
      "value": "{{"+postmanRequest.aux.authorization+"}}"
    });
  	return postmanRequest;
  };

}()