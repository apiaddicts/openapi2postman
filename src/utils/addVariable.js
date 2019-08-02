'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function addVariable(name,type){
    if (!_.has(global, 'parameters')){
      global.parameters = [];
    }
    if (name && !_.find(global.parameters, ['name', name])){
      global.parameters.push( { name : name , type : type} );
    }
  };

}()

