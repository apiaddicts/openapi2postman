'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(swagger){
    switch (swagger.type) {
      case 'object':
        return require('./object.js')(swagger);
        break;
      case 'string':
        return 'anyString'
        break;
      default:
        require('../utils/error.js')('The type '+swagger.type+' is not implemented');
    }
  };

}()