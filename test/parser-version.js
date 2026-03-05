/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('assert')

describe('parser-version', () => {
  
  it('swagger2', () => {

    globalThis.definition = require('../seeds/parserInitialGood.json')

    const version = require('../src/parser/version.js')()
    assert.equal(version, 'swagger2')
  });

  it('openapi3.0', () => {

    globalThis.definition = require('../seeds/parserInitialGoodOpenApi3.json')

    const version = require('../src/parser/version.js')()
    assert.equal(version, 'openapi3')
  });

  it('openapi version 3.0.2' , () => {

      globalThis.definition = require('../seeds/parserInitialGoodOpenApi3.0.2.json')

      const version = require('../src/parser/version.js')()
      assert.equal(version, 'openapi3')
  })

  it('openapi version 3.0.3' , () => {

      globalThis.definition = require('../seeds/parserInitialGoodOpenApi3.0.3.json')

      const version = require('../src/parser/version.js')()
      assert.equal(version, 'openapi3')
  })

  it('openapi3.1', () => {

    globalThis.definition = require('../seeds/parserInitialGoodOpenApi3.1.json')

    const version = require('../src/parser/version.js')()
    assert.equal(version, 'openapi3')
  });

  it('openapi version 3.1.1' , () => {

      globalThis.definition = require('../seeds/parserInitialGoodOpenApi3.1.1.json')

      const version = require('../src/parser/version.js')()
      assert.equal(version, 'openapi3')
  })

  it('openapi version 3.1.2' , () => {

      globalThis.definition = require('../seeds/parserInitialGoodOpenApi3.1.2.json')

      const version = require('../src/parser/version.js')()
      assert.equal(version, 'openapi3')
  })
});