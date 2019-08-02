'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(swagger,name,parent){

    if (!swagger.type && swagger.properties){
      swagger.type = 'object';
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
          return 'not-object';
        }
      
        return require('./object.js')(swagger,parent);
        break;
      case 'array':

        if (wrongParam) {
          return 'not-array';
        }
      
        return require('./array.js')(swagger,name,parent);
        break;
      case 'string':
      case 'number':
      case 'integer':
      case 'boolean':
        
        if (wrongParam) {
          return ['not-'+swagger.type];
        }

        require('../utils/addVariable.js')(name,swagger.type);
        return '{{'+name+'}}'
        break;
      default:
        require('../utils/error.js')('The type '+swagger.type+' is not implemented');
    }
  };

}()