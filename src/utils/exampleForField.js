'use strict'

module.exports = function() {
  
  return function getExample(swagger,isWrong){
    if (swagger.type === 'string') {
      return getExampleForString(swagger.example,isWrong)
    } else if(swagger.type === 'boolean'){
      return getExampleForBoolean(swagger.example,isWrong)
    }
    return getExampleForNumber(swagger.example,isWrong)
  }

  function getExampleForString(example,isWrong) {
    if (isWrong) {
      return 1
    }
    return typeof example !== 'undefined' ? example : 'abc'
  }

  function getExampleForNumber(example,isWrong) {
    if (isWrong) {
      return 'iamnotanumber'
    }
    return typeof example !== 'undefined' ? example : 1
  }

  function getExampleForBoolean(example,isWrong) {
    if (isWrong) {
      return 'iamnotaboolean'
    }
    return typeof example !== 'undefined' ? example : true
  }

}()