'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(definition,verb,path){
  	if (!_.isObject(definition.paths)) {
		require('../utils/error.js')('paths is required');
	}

	const parameters = definition.paths[path][_.toLower(verb)]['parameters'];
	const body = _.find(parameters, ['in', 'body']);
	if (body){
		const schema = body.schema;
		if (!schema['$ref']){
			return schema;
		}

		const ref = _.replace(schema['$ref'], '#/definitions/', '');
		const entity = definition.definitions[ref];
		if (!entity){
			require('../utils/error.js')('ref '+ref+' is not defined');
		}
		return definition.definitions[ref];
	}
  };

}()