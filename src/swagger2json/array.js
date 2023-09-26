/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function() {
  
  return function get(swagger,name,parent){
    if (!swagger.items){
    	require('../utils/error.js')('There is a array without items');
    }
    if (!swagger.items.properties){
        swagger.items.properties = _.cloneDeep(swagger.items);
    }
    if (!(swagger.items.properties.type && typeof swagger.items.properties.type === 'string')){
        let keys = _.keys(swagger.items.properties);
        if (!keys || keys.length === 0){
            require('../utils/error.js')('There are malformed items');
        }
        swagger.items.properties.properties = _.cloneDeep(swagger.items.properties);
        swagger.items.properties.type = 'object';
    }
    const array = [];
    array.push(require('./index.js')(swagger.items.properties,name,parent));
    return array;
  };

}()