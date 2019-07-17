'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(swagger,name,parent){

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
      case 'string':
      case 'number':
        
        if (wrongParam) {
          return ['not-'+swagger.type];
        }

        addVariable(name);
        return '{{'+name+'}}'
        break;
      default:
        require('../utils/error.js')('The type '+swagger.type+' is not implemented');
    }
  };

  function addVariable(name){
    if (!_.has(global, 'parameters')){
      global.parameters = [];
    }
    if (_.indexOf(global.parameters, name) === -1){
      global.parameters.push(name);
    }
  }

}()