/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('assert');

describe('parser-authorization', () => {
  
  it('good swagger2', () => {

    global.definition = require('../seeds/parserAuthorizationInitial.json')
    const authorization = require('../src/parser/authorization.js')('POST','/apple')
    assert.deepStrictEqual(authorization, 'user_token')
  })

  it('endpoint swagger2', () => {

    global.definition = require('../seeds/parserAuthorizationInitialEndpoint.json')
    const authorization = require('../src/parser/authorization.js')('POST','/apple')
    assert.deepStrictEqual(authorization, 'OAuth2')
  })

  it('general swagger2', () => {

    global.definition = require('../seeds/parserAuthorizationInitialGeneral.json')
    const authorization = require('../src/parser/authorization.js')('POST','/apple')
    assert.deepStrictEqual(authorization, 'BasicAuth')
  })

  it('general openapi3', () => {

    global.definition = require('../seeds/parserAuthorizationInitialOpenApi3.json')
    const authorization = require('../src/parser/authorization.js')('POST','/pets')
    assert.deepStrictEqual(authorization, 'ApiKeyAuth')
  })

  it('endpoint openapi3', () => {

    global.definition = require('../seeds/parserAuthorizationInitialOpenApi3.json')
    const authorization = require('../src/parser/authorization.js')('GET','/pets')
    assert.deepStrictEqual(authorization, 'OAuth2')
  })

})