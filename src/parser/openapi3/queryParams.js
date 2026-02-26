/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function() {

  return function get(verb,path){
  	if (!_.isObject(global.definition.paths)) {
		}

		let parameters = global.definition.paths[path][_.toLower(verb)]['parameters'];
		// parameters = replaceRefs(parameters);
		let queryParams = _.filter(parameters, ['in', 'query'])
		const result = []
		_.forEach(queryParams, function(queryParam) {
			const param = queryParam.schema ? queryParam : getContentProperty(queryParam);

			const obj = {
				name: queryParam.name, 
				type: param.schema.type, 
				required : queryParam.required, 
			};

			const example = getExamples(param);

			if (example !== undefined && example !== null) {
				obj.example = example;
			}

			result.push(obj);
		});

		return result
	};

	function replaceRefs(schema){
		let result = {}
		for (let i in schema) {
			if (i === '$ref'){
				const ref = _.replace(schema[i], '#/components/parameters/', '');
				const schemaRef = _.replace(schema[i], '#/components/schemas/', '');
				let entity = global.definition.components.parameters[ref] || global.definition.components.schemas[schemaRef];
				if (!entity){
					require('../../utils/error.js')('ref '+ref+' is not defined')
				}
				entity = replaceRefs(entity,global.definition)
				result = _.merge(result, entity)
			} else if ( _.isArray(schema[i]) && i !== 'required'){
				const arrayResult = []
				if (i === 'example'){
					continue;
				}
				for (let k in schema[i]) {
					arrayResult.push(replaceRefs(schema[i][k],global.definition))
				}
				result[i] = arrayResult
			} else if ( _.isObject(schema[i]) && i !== 'required'){
				result[i] = replaceRefs(schema[i],global.definition)
			} else {
				result[i] = schema[i];
			}
		}
		return result;
	}

	function getExamples(queryParam) {
		if (!queryParam || !queryParam.schema) return undefined;

		if (queryParam.schema.type === 'array') {
				return queryParam.example;
		}

		if (queryParam.hasOwnProperty('examples')) {
			const firstKey = Object.keys(queryParam.examples)[0];
			const value = queryParam.examples[firstKey];
			if (value && value.hasOwnProperty('value')) {
				return value.value;
			}
			return value;
		}

		return queryParam.example !== undefined ? queryParam.example : queryParam.schema.example;
	}

	function getContentProperty(query){
		const queryContent = query.content;
		for (const key in queryContent) {
			return queryContent[key];
		}
	}

}()