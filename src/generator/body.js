'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(postmanRequest){
  	if (!postmanRequest.aux.body){
  		return postmanRequest;
  	}
  	postmanRequest.request.body = {
		mode: "raw",
		raw: JSON.stringify(require('../swagger2json/index.js')(postmanRequest.aux.body))
	};
  	return postmanRequest;
  };

}()