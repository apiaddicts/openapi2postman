/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('assert');

describe('parser-status', () => {
  
  it('good swagger2', () => {

    global.definition = require('../seeds/parserInitialGood.json')

    const status = require('../src/parser/status.js')('DELETE','/pets/{id}')
    assert.deepStrictEqual(status, [ 204, 500 ])
  })

  it('good openapi3', () => {

    global.definition = require('../seeds/parserInitialGoodOpenApi3.json')

    const status = require('../src/parser/status.js')('POST','/pets')
    assert.deepStrictEqual(status, [ 201, 500 ])
  })

});