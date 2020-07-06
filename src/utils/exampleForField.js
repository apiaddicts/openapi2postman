/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

module.exports = function() {

  return function getExample(swagger,isWrong){
    if (swagger.type === 'string') {
      return getExampleForString(swagger.example,isWrong)
    } else if(swagger.type === 'boolean'){
      return getExampleForBoolean(swagger.example,isWrong)
    } else if(swagger.type === 'object'){
      return getExampleForObject()
    } else if(swagger.type === 'array'){
      return getExampleForArray()
    }
    return getExampleForNumber(swagger.example,isWrong)
  }

  function getExampleForObject() {
    return getValueFromConfigurationFile('wrong','object','badobject')
  }

  function getExampleForArray() {
    return getValueFromConfigurationFile('wrong','array','badarray')
  }

  function getExampleForString(example,isWrong) {
    if (isWrong) {
      return getValueFromConfigurationFile('wrong','string','badstring')
    }
    return typeof example !== 'undefined' ? example : getValueFromConfigurationFile('successful','string','anystring')
  }

  function getExampleForNumber(example,isWrong) {
    if (isWrong) {
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