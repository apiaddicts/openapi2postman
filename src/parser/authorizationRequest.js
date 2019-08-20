'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(authorizationToken,authorizationRequests){
  	const request = _.find(authorizationRequests.item, ['name', authorizationToken]);
  	if (!request) {
  		require('../utils/error.js')(authorizationToken+' not found in collection');
  	}
  	request.authType = true;
  	return request;
  };

}()