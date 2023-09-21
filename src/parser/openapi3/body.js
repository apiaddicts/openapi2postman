/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash')

module.exports = function() {

  const MAX_DEPTH_LEVEL = 20;

  return function get(verb, path, bodyResponse) {
  	if (!_.isObject(global.definition.paths)) {
      require('../../utils/error.js')('paths is required')
    }
    const endpoint = global.definition.paths[path][_.toLower(verb)]
    if (!bodyResponse){
      let body = endpoint['requestBody'];
      if (!body){
        return undefined;
      }
      if (body['$ref']) {
        let componentType = body['$ref'].split('/')[2]
        const ref = _.replace(body['$ref'], '#/components/'+componentType+'/', '')
        body = global.definition.components[componentType][ref]
      }
      if (!body.content['application/json']) {
        const contentsArray = Object.keys(body.content);
        let schema = undefined;
        let properContent = false;
        let index = 0;
        // Búsqueda de un content type soportado por la aplicación
        while (!properContent && index < contentsArray.length) {
          const withoutRefs = replaceRefs(body.content[contentsArray[index]].schema, 1);
          switch(contentsArray[index]) {
            case 'application/x-www-form-urlencoded':
              schema = replaceAllOfs(withoutRefs);
              properContent = true;
              break;
            case 'multipart/form-data':
              schema = replaceAllOfs(body.content[contentsArray[index]].schema);
              properContent = true;
              break;
            default:
              properContent = false;
              break;
          }
          index++;
        }

        if (!properContent) console.warn('\x1b[33m%s\x1b[0m', `Warning: cannot create body due to unknown content type (Endpoint: ${verb} ${path})`);
        return schema;
      }
      const withOutRefs = replaceRefs(body.content['application/json'].schema, 1);
      return replaceAllOfs(withOutRefs);
    }
    const bodyResponses = {}
    _.forEach(endpoint['responses'], function(response, status) {
      if (response && response.content && response.content['application/json'] && response.content['application/json'].schema) {
        const withOutRefs = replaceRefs(response.content['application/json'].schema, 1)
        bodyResponses[status] = replaceAllOfs(withOutRefs)
        if (bodyResponses[status].hasOwnProperty('required')) {
          const requiredWtihoutDuplicates = bodyResponses[status].required.filter((value, index, arr) => {
            return arr.indexOf(value) === index;
          });
          bodyResponses[status].required = requiredWtihoutDuplicates; 
        }
      }
    })
    return bodyResponses
  }

  function replaceRefs(schema, depthLevel) {
    let result = {}
    if (depthLevel < MAX_DEPTH_LEVEL) {
      for (const i in schema) {
        if (i === '$ref') {
          let componentType = schema[i].split('/')[2]
          const ref = _.replace(schema[i], '#/components/'+componentType+'/', '')
          if (checkCircularReferences(ref,3,2) || checkCircularReferences(ref,3,3) || checkCircularReferences(ref,3,4)){
            return { type: 'string',
              description: 'Circular REF solved swagger2postman' 
            }
          }
          let entity = global.definition.components[componentType][ref]
          if (!entity) {
            require('../../utils/error.js')('ref '+ref+' is not defined')
          }
          entity = replaceRefs(entity,global.definition, ++depthLevel)
          result = _.merge(result, entity)
        } else if ( _.isArray(schema[i]) && i !== 'required') {
          const arrayResult = []
          if (i === 'example'){
            continue
          }
          for (const k in schema[i]) {
            // arrayResult.push(replaceRefs(schema[i][k], global.definition, ++depthLevel))
            arrayResult.push(schema[i][k])
          }
          result[i] = arrayResult
        } else if ( _.isObject(schema[i]) && i !== 'required') {
          ++depthLevel;
          result[i] = schema[i];
          // result[i] = replaceRefs(schema[i],global.definition);
        } else {
          result[i] = schema[i];
        }
      }
    }
    return result
  }

  function replaceAllOfs(schema){
    let result = {}
    for (let i in schema) {
      if (i === 'allOf' && _.isArray(schema[i])){
        let merged = {'required':[],'properties':{},'type':'object'}
        for (let t in schema[i]) {

          if (schema[i][t]['type'] === 'string') {
            merged = schema[i][t]
          } else {
          
            for (let k in schema[i][t]) {
              if (k === 'type'){
                merged['type'] = schema[i][t][k]
              } else if (k === 'required'){
                merged['required'] = _.concat(merged['required'],schema[i][t]['required'])
              } else if (k === 'properties'){
                for (let z in schema[i][t]['properties']){
                  merged['properties'][z] = replaceAllOfs(schema[i][t]['properties'][z])
                }
              } else if (k === 'allOf'){
                let downSchema = replaceAllOfs(schema[k])
                if (downSchema['0']) {
                  downSchema = downSchema['0']
                }
                merged['required'] = _.concat(merged['required'],downSchema['required'])
                merged['properties'] = _.merge(merged['properties'],downSchema['properties'])
                continue
              } else if (k === 'description') {
                continue
              } else {
                require('../../utils/error.js')('the property '+k+' of allOf is not implemented')
              }
            }

          }

        }
        result = _.merge(result, merged)
      } else if ( _.isArray(schema[i]) && i !== 'required') {
        const arrayResult = []
        for (let k in schema[i]) {
          arrayResult.push(replaceAllOfs(schema[i][k]))
        }
        result[i] = arrayResult
      } else if ( _.isObject(schema[i]) && i !== 'required') {
        // result.type = 'object';
        result[i] = _.merge(result[i],replaceAllOfs(schema[i]))
      } else {
        result[i] = schema[i]
      }
    }
    return result
  }
  
  function checkCircularReferences(reference,depthLevel,patternNumber){
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