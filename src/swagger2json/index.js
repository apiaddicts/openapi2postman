/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(swagger, name, parent){

    if (!swagger.type && swagger.properties){
      swagger.type = 'object';
    } else if (swagger.oneOf) {
      swagger.type = 'oneOf';
    } else if (swagger.anyOf) {
      swagger.type = 'anyOf';
    }

    let wrongParam = false;
    if (parent && global.wrongParamsCatch && _.indexOf(global.wrongParams, parent) === -1 && parent !== 'with') {
      global.wrongParams.push(parent);
      global.wrongParamsCatch = false;
      wrongParam = true;
    }

    switch (swagger.type) {
      case 'object':

        if (wrongParam) {
          global.environmentVariables[global.currentId+name+'_wrong'] = require('../utils/exampleForField.js')(swagger,true)
          return '{{'+name+'_wrong}}'
        }
      
        return require('./object.js')(swagger,parent)
      case 'array':

        if (wrongParam) {
          global.environmentVariables[global.currentId+name+'_wrong'] = require('../utils/exampleForField.js')(swagger,true)
          return '{{'+name+'_wrong}}'
        }
      
        return require('./array.js')(swagger,name,parent);
      case 'string':
      case 'number':
      case 'integer':
      case 'boolean':
        
        if (wrongParam) {
          global.environmentVariables[global.currentId+name+'_wrong'] =  require('../utils/exampleForField.js')(swagger,true)
          return '{{'+name+'_wrong}}'
        }
        global.environmentVariables[global.currentId+name] =  require('../utils/exampleForField.js')(swagger,false)
        return '{{'+name+'}}'
      case 'oneOf':
        let schemaOne = swagger.oneOf[0];
        return anyOfOneOfChoice(schemaOne, name, parent);
      case 'anyOf':
        let schemaAny = swagger.anyOf[0];
        return anyOfOneOfChoice(schemaAny, name, parent);
      default:
        require('../utils/error.js')('The type '+swagger.type+' is not implemented');
    }
  }

  function anyOfOneOfChoice(schema, name, parent) {
    switch (schema.type) {
      case 'object':
        return require('./object.js')(schema, parent);
      case 'array':
        return require('./array.js')(schema, name, parent);
      default:
        global.environmentVariables[global.currentId+name] =  require('../utils/exampleForField.js')(schema, false);
        return '{{'+name+'}}';
    }
  }

}()