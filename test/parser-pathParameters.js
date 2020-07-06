/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('assert');

describe('parser-pathParameters', () => {
  
  it('good swagger2', () => {

    global.definition = require('../seeds/parserInitialGood.json')

    const pathParameters = require('../src/parser/swagger2/pathParameters.js')('DELETE','/pets/{id}')
    assert.deepStrictEqual(pathParameters, [ { name: 'id', type: 'integer', example: undefined } ])
  })

  it('good openapi3', () => {

    global.definition = require('../seeds/parserInitialGoodOpenApi3.json')

    const status = require('../src/parser/openapi3/pathParameters.js')('GET','/pets/{petId}')
    assert.deepStrictEqual(status, [ { name: 'petId', type: 'string', example: 'asdf' } ])
  })

})