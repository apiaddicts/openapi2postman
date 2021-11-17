/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash')

module.exports = function() {

	return function get(verb,path){
		const endpoint = global.definition.paths[path][_.toLower(verb)]
		let securityName = false
		if (endpoint.security && _.isArray(endpoint.security) && endpoint.security.length > 0){
			securityName = getTokenFromDefinition(endpoint.security[0]) + '1';
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
				require('../../utils/error.js')(xAuthType+' not implemented')
			}
  		}
		return securityName
  	}

	function getTokenFromDefinition(key){
		return _.keys(key)[0]
	}

}()