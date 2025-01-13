/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

'use strict'

const _ = require('lodash');

module.exports = function() {
  
    return function get(collection, validate_schema){
        const items = []
        const itemKeys = []
        for (let i in collection){
            for (let j in collection[i].item) {//folders
                if (collection[i].item[j].request) {
                    
                } else {
                    for (let k in collection[i].item[j].item){//request
                        
                        if (validate_schema === true) {
                            const params = new URLSearchParams('?' + collection[i].item[j].item[k].request.url.path[0].split('?')[1]);
                            if (params.get('$select') || params.get('$exclude')) {
                                deleteValidateSchema(collection[i].item[j].item[k].event[0].script.exec)
                            }
                        } else {
                            deleteValidateSchema(collection[i].item[j].item[k].event[0].script.exec)
                        }
                    }
                }
            }
        }
        return items
    }

    function deleteValidateSchema(execCode){
        let findEnd = false
        for (let i in execCode){
            if (execCode[i] === "var schemaIsValid = tv4.validateMultiple(json, schema, checkRecursive,banUnknownProperties);"){
                execCode[i] = "/*var schemaIsValid = tv4.validateMultiple(json, schema, checkRecursive,banUnknownProperties);"
                findEnd = true
            }
            if (findEnd && execCode[i] === "pm.expect(schemaIsValid.valid, schemaIsValid.errors).to.be.true;"){
                execCode[i] = "pm.expect(schemaIsValid.valid, schemaIsValid.errors).to.be.true;*/"
                return
            }
        }
    }

}()