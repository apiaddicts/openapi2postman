const assert = require('assert');

describe('parser-authorization', () => {
  
  it('good', () => {

    global.definition = require('../seeds/parserAuthorizationInitial.json')
    const authorization = require('../src/parser/authorization.js')('POST','/apple')
    assert.deepStrictEqual(authorization, 'user_token')
  });

  it('endpoint', () => {

    global.definition = require('../seeds/parserAuthorizationInitialEndpoint.json')
    const authorization = require('../src/parser/authorization.js')('POST','/apple')
    assert.deepStrictEqual(authorization, false)
  });

  it('general', () => {

    global.definition = require('../seeds/parserAuthorizationInitialGeneral.json')
    const authorization = require('../src/parser/authorization.js')('POST','/apple')
    assert.deepStrictEqual(authorization, false)
  });

});