/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function() {

  return function get(swagger,parent){
    if (!swagger.properties){
    	require('../utils/error.js')(`There is an object without properties: ${swagger}`);
    }
    let notInclude = false;
    if (parent && global.requiredParamsCatch && _.has(swagger, 'required')){
        _.forEach(swagger.required, function(property){
            let key = parent+'.'+property;
            if (_.indexOf(global.requiredParams, key) === -1 && global.requiredParamsCatch){
                notInclude = property;
                global.requiredParams.push(key);
                global.requiredParamsCatch = false;
            }
        })
    }
    const object = {};
    _.forEach(swagger.properties,function(property,name){
        if (notInclude === false || notInclude !== name){
            let newParent = parent ? parent+'.'+name : undefined;
            object[name] = require('./index.js')(property,name,newParent);
        }
    })
    return object;
  };

}()