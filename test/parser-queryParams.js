/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('assert');

describe('parser-queryParams', () => {
  
  it('fill swagger2', () => {

    global.definition = require('../seeds/parserQueryParamsGood.json')

    const queryParams = require('../src/parser/swagger2/queryParams.js')('GET','/pets')
    assert.deepStrictEqual(queryParams, [{
            "name": "tags",
            "required": false,
            "type": "array"
         },
         {
            "name": "limit",
            "required": false,
            "type": "integer"
         } ])
  })

  it('void swagger2', () => {

    global.definition = require('../seeds/parserQueryParamsGood.json')

    const queryParams = require('../src/parser/swagger2/queryParams.js')('POST','/pets')
    assert.deepStrictEqual(queryParams, [])
  })

  it('fill openapi3', () => {

    global.definition = require('../seeds/parserInitialGoodOpenApi3Expanded.json')

    const queryParams = require('../src/parser/openapi3/queryParams.js')('GET','/pets')
    assert.deepStrictEqual(queryParams, [{
            "name": "tags",
            "required": false,
            "type": "array"
         },
         {
            "name": "limit",
            "required": true,
            "type": "integer"
         } ])
  })

  it('void openapi3', () => {

    global.definition = require('../seeds/parserInitialGoodOpenApi3Expanded.json')

    const queryParams = require('../src/parser/openapi3/queryParams.js')('POST','/pets')
    assert.deepStrictEqual(queryParams, [])
  })

})