/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(postmanRequest){
  	if (!postmanRequest.aux.consumes){
  		return postmanRequest;
  	}
  	postmanRequest.request.header.push({
      "key": "Content-Type",
      "value": postmanRequest.aux.consumes
    });
  	return postmanRequest;
  };

}()