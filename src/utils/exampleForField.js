/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function() {

  return function getExample(swagger,isWrong){
    if (swagger.type === 'string') {
      if (swagger.format === 'date') return getExampleForDate(swagger.example, isWrong);
      if (swagger.format === 'date-time') return getExampleForDateTime(swagger.example, isWrong);
      return getExampleForString(swagger.example, isWrong, swagger.maxLength);
    } else if(swagger.type === 'boolean'){
      return getExampleForBoolean(swagger.example,isWrong)
    } else if(swagger.type === 'object'){
      return getExampleForObject()
    } else if(swagger.type === 'array'){
      return getExampleForArray(swagger.example, isWrong)
    }
    return getExampleForNumber(swagger.example, isWrong, swagger.maximum, swagger.minimum);
  }

  function getExampleForObject() {
    return getValueFromConfigurationFile('wrong','object','badobject')
  }

  function getExampleForArray(example, isWrong) {
    if (isWrong) {
      return getValueFromConfigurationFile('wrong','array','badarray');
    }
    return typeof example !== 'undefined' ? example : getValueFromConfigurationFile('wrong','array','badarray');
  }

  function getExampleForString(example, isWrong, maxLength) {
    if (isWrong) {
      // Crear caso de error con maxLength + 1
      if (example && maxLength) {
        return _.padEnd(example, maxLength + 1, 'z');
      }
      return getValueFromConfigurationFile('wrong','string','badstring')
    }
    return typeof example !== 'undefined' ? example : getValueFromConfigurationFile('successful','string','anystring')
  }

  function getExampleForDate(example, isWrong) {
    if (isWrong) {
      // El mes con valor 50 para casos de error
      if (example) {
        let date = example.split('-');
        date[1] = '50';
        return date.join('-');
      }
      return getValueFromConfigurationFile('wrong','date','baddate');
    }
    return typeof example !== 'undefined' ? example : getValueFromConfigurationFile('successful','date','anydate');
  }

  function getExampleForDateTime(example, isWrong) {
    if (isWrong) {
      // El mes con valor 50 para casos de error
      if (example) {
        let month = example.substring(4, 7);
        return example.replace(month, '-50');
      }
      return getValueFromConfigurationFile('wrong','date_time','baddate');
    }
    return typeof example !== 'undefined' ? example : getValueFromConfigurationFile('successful','date_time','anydate');
  }
  
  function getExampleForNumber(example, isWrong, max, min) {
    if (isWrong) {
      // Devuelve max + 1 o min - 1 para casos de error, si existen
      if (typeof max !== 'undefined') return max + 1;
      if (typeof min !== 'undefined') return min - 1;
      return getValueFromConfigurationFile('wrong','number','badnumber')
    }
    return typeof example !== 'undefined' ? example : getValueFromConfigurationFile('successful','number',1)
  }

  function getExampleForBoolean(example,isWrong) {
    if (isWrong) {
      return getValueFromConfigurationFile('wrong','boolean','badboolean')
    }
    return typeof example !== 'undefined' ? example : getValueFromConfigurationFile('successful','boolean',true)
  }

  function getValueFromConfigurationFile(space,type,defaultValue){
    if (typeof global.configurationFile === 'undefined') {
      return defaultValue
    }
    if (typeof global.configurationFile.examples === 'undefined') {
      return defaultValue
    }
    if (typeof global.configurationFile.examples[space] === 'undefined') {
      return defaultValue
    }
    if (typeof global.configurationFile.examples[space][type] === 'undefined') {
      return defaultValue
    }
    return global.configurationFile.examples[space][type]
  }

}()