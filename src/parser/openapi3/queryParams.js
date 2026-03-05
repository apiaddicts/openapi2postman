/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function() {

	return function get(verb,path){

		let parameters = globalThis.definition.paths[path][_.toLower(verb)]['parameters'];
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

	function getExamples(queryParam) {
		if (!queryParam?.schema) return undefined;

		if (queryParam.schema.type === 'array') {
				return queryParam.example;
		}

		if (queryParam.schema?.examples) {
			return queryParam.schema.examples[0];
		}

		if (queryParam.hasOwnProperty('examples')) {
			const firstKey = Object.keys(queryParam.examples)[0];
			const value = queryParam.examples[firstKey];
			if (value?.hasOwnProperty('value')) {
				return value.value;
			}
			return value;
		}

		if (queryParam.example === undefined) {
			return queryParam.schema.example;
		}

		return queryParam.example;
	}

	function getContentProperty(query){
		const queryContent = query.content;
		return queryContent ? Object.values(queryContent)[0] : undefined;
	}

}()