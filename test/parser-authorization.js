/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('assert');

describe('parser-authorization', () => {
  
  it('authorization good swagger2', () => {

    global.definition = require('../seeds/parserAuthorizationInitial.json')
    const authorization = require('../src/parser/authorization.js')('POST','/apple')
    assert.deepStrictEqual(authorization, 'user_token')
  })

  it('authorization endpoint swagger2', () => {

    global.definition = require('../seeds/parserAuthorizationInitialEndpoint.json')
    const authorization = require('../src/parser/authorization.js')('POST','/apple')
    assert.deepStrictEqual(authorization, 'OAuth2')
  })

  it('authorization general swagger2', () => {

    global.definition = require('../seeds/parserAuthorizationInitialGeneral.json')
    const authorization = require('../src/parser/authorization.js')('POST','/apple')
    assert.deepStrictEqual(authorization, 'BasicAuth')
  })

  it('authorization general openapi3.0', () => {

    global.definition = require('../seeds/parserAuthorizationInitialOpenApi3.json')
    const authorization = require('../src/parser/authorization.js')('POST','/pets')
    assert.deepStrictEqual(authorization, 'ApiKeyAuth')
  })

  it('authorization endpoint openapi3.0', () => {

    global.definition = require('../seeds/parserAuthorizationInitialOpenApi3.json')
    const authorization = require('../src/parser/authorization.js')('GET','/pets')
    assert.deepStrictEqual(authorization, 'OAuth2')
  })

  it('authorization general openapi3.1', () => {

    global.definition = require('../seeds/parserAuthorizationInitialOpenApi3.1.json')
    const authorization = require('../src/parser/authorization.js')('POST','/pets')
    assert.deepStrictEqual(authorization, 'ApiKeyAuth')
  })

  it('authorization endpoint openapi3.1', () => {

    global.definition = require('../seeds/parserAuthorizationInitialOpenApi3.1.json')
    const authorization = require('../src/parser/authorization.js')('GET','/pets')
    assert.deepStrictEqual(authorization, 'OAuth2')
  })
})