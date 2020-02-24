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
          require('../utils/addVariable.js')(global.prefix+name+'_wrong',swagger.type);
          return '{{'+global.prefix+name+'_wrong}}';
        }
      
        return require('./object.js')(swagger,parent);
        break;
      case 'array':

        if (wrongParam) {
          require('../utils/addVariable.js')(global.prefix+name+'_wrong',swagger.type);
          return '{{'+global.prefix+name+'_wrong}}';
        }
      
        return require('./array.js')(swagger,name,parent);
        break;
      case 'string':
      case 'number':
      case 'integer':
      case 'boolean':
        
        if (wrongParam) {
          require('../utils/addVariable.js')(global.prefix+name+'_wrong',swagger.type);
          return '{{'+global.prefix+name+'_wrong}}';
        }

        require('../utils/addVariable.js')(global.prefix+name,swagger.type);
        return '{{'+global.prefix+name+'}}'
        break;
      default:
        require('../utils/error.js')('The type '+swagger.type+' is not implemented');
    }
  };

}()