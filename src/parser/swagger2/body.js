/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(verb, path, bodyResponse) {
  	if (!_.isObject(global.definition.paths)) {
      require('../../utils/error.js')('paths is required');
    }

    const endpoint = global.definition.paths[path][_.toLower(verb)];
    if (!bodyResponse){
      let bodyParameter = replaceRefs(endpoint['parameters']);
      const body = _.find(bodyParameter, ['in', 'body']);
      if (!body) {
        return undefined;
      }
      const withOutRefs = replaceRefs(body.schema);
      return replaceAllOfs(withOutRefs);
    }
    const bodyResponses = {};
    _.forEach(endpoint['responses'], function(response, status) {
      if (response.schema){
        const withOutRefs = replaceRefs(response.schema);
        bodyResponses[status] = replaceAllOfs(withOutRefs);
        if (bodyResponses[status].hasOwnProperty('required')) {
          const requiredWtihoutDuplicates = bodyResponses[status].required.filter((value, index, arr) => {
            return arr.indexOf(value) === index;
          });
          bodyResponses[status].required = requiredWtihoutDuplicates; 
        }
      }
    });
    return bodyResponses;
  };

  function replaceRefs(schema){
  	let result = {};
  	for (let i in schema) {
  		if (i === '$ref'){
			const ref = _.replace(schema[i], schema[i].substring(0, schema[i].lastIndexOf('/') + 1), '');
      if (checkCircularReferences(ref, 3, 2) || checkCircularReferences(ref, 3, 3) || checkCircularReferences(ref, 3, 4)){
        return { type: 'string',
                description: 'Circular REF solved swagger2postman' 
              }
      }
			let entity = global.definition.definitions[ref];
			if (!entity){
        entity = global.definition.parameters[ref];
        if (!entity) {
          require('../../utils/error.js')('ref ' + ref + ' is not defined');
        }
			}
			entity = replaceRefs(entity, global.definition);
			result = _.merge(result, entity);
  		} else if ( _.isArray(schema[i]) && i !== 'required'){
  			const arrayResult = [];
        if (i === 'example'){
          continue;
        }
  			for (let k in schema[i]) {
  				arrayResult.push(replaceRefs(schema[i][k],global.definition));
  			}
  			result[i] = arrayResult;
  		} else if ( _.isObject(schema[i]) && i !== 'required'){
  			result[i] = replaceRefs(schema[i],global.definition);
  		} else {
  			result[i] = schema[i];
  		}
  	}
  	return result;
  }

  function replaceAllOfs(schema){
  	let result = {};
    for (let i in schema) {
  		if (i === 'allOf' && _.isArray(schema[i])){
  			let merged = {'required':[],'properties':{},'type':'object'};
  			for (let t in schema[i]) {

        if (schema[i][t]['type'] === 'string') {
          merged = schema[i][t];
        } else {
          
          for (let k in schema[i][t]) {
            if (k === 'type'){
              merged['type'] = schema[i][t][k];
            } else if (k === 'required'){
              merged['required'] = _.concat(merged['required'],schema[i][t]['required']);
            } else if (k === 'properties'){
              for (let z in schema[i][t]['properties']){
                merged['properties'][z] = replaceAllOfs(schema[i][t]['properties'][z]);
              }
            } else if (k === 'allOf'){
              let downSchema = replaceAllOfs(schema[k]);
              if (downSchema['0']) {
                downSchema = downSchema['0'];
              }
              merged['required'] = _.concat(merged['required'],downSchema['required']);
              merged['properties'] = _.merge(merged['properties'],downSchema['properties']);
              continue;
            } else if (k === 'description'){
              continue;
            } else {
              require('../../utils/error.js')('the property '+k+' of allOf is not implemented');
            }
          }

        }

  			}
  			result = _.merge(result, merged);
  		} else if ( _.isArray(schema[i]) && i !== 'required') {
  			const arrayResult = [];
  			for (let k in schema[i]) {
  				arrayResult.push(replaceAllOfs(schema[i][k]));
  			}
  			result[i] = arrayResult;
  		} else if ( _.isObject(schema[i]) && i !== 'required') {
        result[i] = _.merge(result[i],replaceAllOfs(schema[i]));
  		} else {
  			result[i] = schema[i];
  		}
  	}
  	return result;
  }

  function checkCircularReferences(reference, depthLevel, patternNumber){
    if (!global.circularTail){
      global.circularTail = []
    }
    if (! global.circularTail[patternNumber] ){
      global.circularTail[patternNumber] = [reference]
      return false
    }
    if (global.circularTail[patternNumber].length < (depthLevel * patternNumber) ){
      global.circularTail[patternNumber].push(reference)
      return false
    }

    const groups = _.chunk(global.circularTail[patternNumber], patternNumber)
    global.circularTail[patternNumber].shift()
    global.circularTail[patternNumber].push(reference)

    let areEquals = true
    let lastArray = groups[0]
    comparation:
    for (let i = 1; i < groups.length; i++) {
      for (let k in groups[i]){
        if (groups[i][k] !== groups[i - 1][k]){
          areEquals = false
          break comparation
        }
      }
    }

    if (areEquals){
      global.circularTail = []
    }

    return areEquals

  }

}()