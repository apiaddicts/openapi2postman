/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('assert')

describe('parser-version', () => {
  
  it('swagger2', () => {

    global.definition = require('../seeds/parserInitialGood.json')

    const version = require('../src/parser/version.js')()
    assert.equal(version, 'swagger2')
  });

  it('openapi3', () => {

    global.definition = require('../seeds/parserInitialGoodOpenApi3.json')

    const version = require('../src/parser/version.js')()
    assert.equal(version, 'openapi3')
  });

  it('openapi versio 3.0.2' , () => {
      
      global.definition = require('../seeds/parserInitialGoodOpenApi3.0.2.json')
  
      const version = require('../src/parser/version.js')()
      assert.equal(version, 'openapi3')
  })

  it('openapi versio 3.0.3' , () => {
      
      global.definition = require('../seeds/parserInitialGoodOpenApi3.0.3.json')
  
      const version = require('../src/parser/version.js')()
      assert.equal(version, 'openapi3')
  })
});