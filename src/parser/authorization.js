'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(verb,path,authorizationTokens){
  	const endpoint = global.definition.paths[path][_.toLower(verb)];
  	let securityName = false;
  	if (_.has(endpoint, 'x-auth-type') && endpoint['x-auth-type'] !== 'None'){
  		securityName = _.has(endpoint, 'x-scope') ? endpoint['x-auth-type']+'-'+endpoint['x-scope'] : endpoint['x-auth-type'];
  		if (securityName && _.indexOf(authorizationTokens, securityName) === -1) {
			authorizationTokens.push(securityName);
		}
  	} else if (_.has(global.definition, 'securityDefinitions')){
  		const definitions = {};
  		_.forEach(global.definition.securityDefinitions,function(definition,i){
  			definitions[i] = definition.type === 'oauth2';
  		});
  		let security = false;
  		if (_.has(endpoint, 'security')){
  			security = endpoint.security;
  		} else if (_.has(global.definition, 'security')){
  			security = global.definition.security;
  		}

  		if (security && security.length > 0){
  			let keys = _.keys(security[0]);
  			if (keys.length > 0 && _.has(definitions, keys[0])) {
  				securityName = keys[0];
  				if (definitions[securityName] && _.indexOf(authorizationTokens, securityName) === -1) {
  					authorizationTokens.push(securityName);
  				}
  			}
  		}
  	}

  	require('../utils/addVariable.js')(securityName);
	return securityName;
  };

}()