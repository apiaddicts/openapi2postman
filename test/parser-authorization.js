/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('node:assert');
const getAuthorization = require('../src/parser/authorization.js');

describe('parser-authorization', () => {

  const checkAuth = (name, seed, method, path, expected) => {
    it(name, () => {
      globalThis.definition = require(`../seeds/${seed}`);
      const authorization = getAuthorization(method, path);
      assert.deepStrictEqual(authorization, expected);
    });
  };

  checkAuth('auth good sw2', 'parserAuthorizationInitial.json', 'POST', '/apple', 'user_token');
  checkAuth('auth endpoint sw2', 'parserAuthorizationInitialEndpoint.json', 'POST', '/apple', 'OAuth2');
  checkAuth('auth general sw2', 'parserAuthorizationInitialGeneral.json', 'POST', '/apple', 'BasicAuth');

  checkAuth('auth general oa3.0','parserAuthorizationInitialOpenApi3.json', 'POST', '/pets', 'ApiKeyAuth');
  checkAuth('auth endpoint oa3.0','parserAuthorizationInitialOpenApi3.json', 'GET', '/pets', 'OAuth2');

  checkAuth('auth general oa3.1', 'parserAuthorizationInitialOpenApi3.1.json','POST', '/pets', 'ApiKeyAuth');
  checkAuth('auth endpoint oa3.1', 'parserAuthorizationInitialOpenApi3.1.json','GET', '/pets', 'OAuth2');

});