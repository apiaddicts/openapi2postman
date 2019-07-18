'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function addVariable(name){
    if (!_.has(global, 'parameters')){
      global.parameters = [];
    }
    if (name && _.indexOf(global.parameters, name) === -1){
      global.parameters.push(name);
    }
  };

}()

