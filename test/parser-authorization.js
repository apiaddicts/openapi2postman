const assert = require('assert');

describe('parser-authorization', () => {
  
  it('good swagger2', () => {

    global.definition = require('../seeds/parserAuthorizationInitial.json')
    const authorization = require('../src/parser/swagger2/authorization.js')('POST','/apple')
    assert.deepStrictEqual(authorization, 'user_token')
  });

  it('endpoint swagger2', () => {

    global.definition = require('../seeds/parserAuthorizationInitialEndpoint.json')
    const authorization = require('../src/parser/swagger2/authorization.js')('POST','/apple')
    assert.deepStrictEqual(authorization, 'oauth2_token')
  });

  it('general swagger2', () => {

    global.definition = require('../seeds/parserAuthorizationInitialGeneral.json')
    const authorization = require('../src/parser/swagger2/authorization.js')('POST','/apple')
    assert.deepStrictEqual(authorization, 'basic_token')
  });

});