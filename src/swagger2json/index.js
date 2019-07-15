'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(swagger,name){
    switch (swagger.type) {
      case 'object':
        return require('./object.js')(swagger);
        break;
      case 'string':
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