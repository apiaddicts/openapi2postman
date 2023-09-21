/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(verb,path){
  	if (!_.isObject(global.definition.paths)) {
		require('../../utils/error.js')('paths is required')
	}

	let parameters = global.definition.paths[path][_.toLower(verb)]['parameters'];
	// parameters = replaceRefs(parameters);
	const queryParams = _.filter(parameters, ['in', 'query'])
	const result = []
	_.forEach(queryParams, function(queryParam) {	
		result.push({ 
			name : queryParam.name, 
			type : queryParam.type, 
			required : queryParam.required,
			example: getExamples(queryParam)
		});
	})

	return result
  };

	function replaceRefs(schema){
		let result = {};
		for (let i in schema) {
			if (i === '$ref'){
				const ref = _.replace(schema[i], '#/parameters/', '');
				let entity = global.definition.parameters[ref];
				if (!entity){
					continue;
				}
				entity = replaceRefs(entity, global.definition);
				result = _.merge(result, entity);
			} else if (_.isArray(schema[i]) && i !== 'required'){
				const arrayResult = [];
				if (i === 'example'){
					continue;
				}
				for (let k in schema[i]) {
					arrayResult.push(replaceRefs(schema[i][k],global.definition));
				}
				result[i] = arrayResult;
			} else if (_.isObject(schema[i]) && i !== 'required'){
				result[i] = replaceRefs(schema[i],global.definition);
			} else {
				result[i] = schema[i];
			}
		}
		return result;
	}

	function getExamples(queryParam) {
		if (queryParam.type === 'array') {
				return queryParam.example;
		} else {
			if (queryParam.hasOwnProperty('examples')) {
				const value = queryParam.examples[Object.keys(queryParam.examples)[0]];
				return value[Object.keys(value)[0]];
			} else if (queryParam.hasOwnProperty('default')) {
				return queryParam.default;
			} else {
				return queryParam.example !== undefined ? queryParam.example : '';
			}
		}	
	}

}()