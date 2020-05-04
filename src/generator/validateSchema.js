'use strict'

const _ = require('lodash');

module.exports = function() {
  
    return function get(collection){
        const items = []
        const itemKeys = []
        for (let i in collection){
            for (let j in collection[i].item) {//folders
                if (collection[i].item[j].request) {
                    
                } else {
                    for (let k in collection[i].item[j].item){//request
                        deleteValidateSchema(collection[i].item[j].item[k].event[0].script.exec)
                    }
                }
            }
        }
        return items
    }

    function deleteValidateSchema(execCode){
        let findEnd = false
        for (let i in execCode){
            if (execCode[i] === "pm.test('Schema is valid', function() {"){
                execCode[i] = "/*pm.test('Schema is valid', function() {"
                findEnd = true
            }
            if (findEnd && execCode[i] === "});"){
                execCode[i] = "});*/"
                return
            }
        }
    }

}()