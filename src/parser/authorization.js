'use strict'

const _ = require('lodash')

module.exports = function() {
  
	return function get(verb,path){
  		const endpoint = global.definition.paths[path][_.toLower(verb)]
		let securityName = false
		if (endpoint.security && _.isArray(endpoint.security) && endpoint.security.length > 0){
			securityName = getTokenFromDefinition(endpoint.security[0])
		}
		if(global.definition.security && _.isArray(global.definition.security) && global.definition.security.length > 0 && securityName === false){
			securityName = getTokenFromDefinition(global.definition.security[0])
		}
		if (_.has(endpoint, 'x-auth-type') && _.lowerCase(endpoint['x-auth-type']) !== 'none' && securityName === false){
			const xAuthType = _.lowerCase(endpoint['x-auth-type'])
			if (xAuthType === 'application' || xAuthType === 'application application user'){
				securityName = 'application_token'
			} else if (xAuthType === 'application user'){
				securityName = 'user_token'
			} else {
				require('../utils/error.js')(xAuthType+' not implemented')
			}
  		}
		return securityName
  	}

	function getTokenFromDefinition(key){
		key = _.keys(key)[0]
		for(let i in global.definition.securityDefinitions){
			if (i === key && global.definition.securityDefinitions[i].type) {
				return global.definition.securityDefinitions[i].type + '_token'
			}
		}
		return false
	}

}()