/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('assert')

describe('parser-microcks', () => {
    
    //If the document is not openapi3, it should return false because it is not supported
    it('specifies swagger2', () => {
    
        global.definition = require('../seeds/parserMicroksInitial.json')
    
        const microcks = require('../src/parser/openapi3/microcks.js')('POST','/user')
        assert.equal(microcks, false)
    })

    //If the document is not openapi3, it should return false because it is not supported
    it('general swagger2', () => {
    
        global.definition = require('../seeds/parserMicroksInitial.json')
    
        const microcks = require('../src/parser/openapi3/microcks.js')('GET','/user/{username}')
        assert.equal(microcks, false)
    })

    //If the document is openapi3, it should return true because it is supported
    it('specifies openapi3', () => {
    
        global.definition = require('../seeds/parserMicroksinitialGood.json');
    
        const microcks = require('../src/parser/openapi3/microcks.js')('GET','/user/{username}');
        assert.equal(microcks, true);
    })

    

})
