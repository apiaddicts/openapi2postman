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
    let headers = _.filter(parameters, ['in', 'header'])
    const result = []
    _.forEach(headers, function(header) {	
      result.push({ 
        key: header.name, 
        type: header.schema.type, 
        required : header.required, 
        value: getExamples(header)
      });
    });
    return result
  };

  function getExamples(header) {
		if (header.example) {
				return header.example
		}
     else {
			if (header.hasOwnProperty('examples')) {
				const value = header.examples[Object.keys(header.examples)[0]];
				return value[Object.keys(value)[0]];
			}
			return header.example;
		}	
	}

}()