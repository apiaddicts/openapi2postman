'use strict'

const _ = require('lodash')

module.exports = function() {
  
  return function get(verb,path,authorizationTokens){
  	const endpoint = global.definition.paths[path][_.toLower(verb)]
  	let securityName = false
  	if (_.has(endpoint, 'x-auth-type') && _.lowerCase(endpoint['x-auth-type']) !== 'none'){
		const xAuthType = _.lowerCase(endpoint['x-auth-type'])
		if (xAuthType === 'application' || xAuthType === 'application application user'){
			securityName = 'application_token'
		} else if (xAuthType === 'application user'){
			securityName = 'user_token'
		} else {
			require('../utils/error.js')(xAuthType+' not implemented')
		}
		require('../utils/addVariable.js')(securityName,'string')
  	}
	return securityName
  };

}()