'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(swagger){
    if (!swagger.properties){
    	require('../utils/error.js')('There is a object without properties');
    }
    const object = {};
    _.forEach(swagger.properties,function(property,name){
    	object[name] = require('./index.js')(property);
    })
    return object;
  };

}()