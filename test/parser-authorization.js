const assert = require('assert');

describe('parser-authorization', () => {
  
  it('good', () => {

    global.definition = require('../seeds/parserAuthorizationInitial.json');
    const authorizationTokens = [];
    const authorization = require('../src/parser/authorization.js')('POST','/apple',authorizationTokens);
    assert.deepStrictEqual(authorization, 'Application User-type1');
    assert.deepStrictEqual(authorizationTokens.length, 1);
  });

  it('endpoint', () => {

    global.definition = require('../seeds/parserAuthorizationInitialEndpoint.json');
    const authorizationTokens = [];
    const authorization = require('../src/parser/authorization.js')('POST','/apple',authorizationTokens);
    assert.deepStrictEqual(authorization, 'OAuth2');
    assert.deepStrictEqual(authorizationTokens.length, 1);
  });

  it('general', () => {

    global.definition = require('../seeds/parserAuthorizationInitialGeneral.json');
    const authorizationTokens = [];
    const authorization = require('../src/parser/authorization.js')('POST','/apple',authorizationTokens);
    assert.deepStrictEqual(authorization, 'BasicAuth');
    assert.deepStrictEqual(authorizationTokens.length, 0);
  });

});