/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('assert');
const getAuthorization = require('../src/parser/authorization.js');

describe('parser-authorization', () => {

  const testCases = [
    { name: 'authorization good swagger2', seed: 'parserAuthorizationInitial.json', method: 'POST', path: '/apple', expected: 'user_token' },
    { name: 'authorization endpoint swagger2', seed: 'parserAuthorizationInitialEndpoint.json', method: 'POST', path: '/apple', expected: 'OAuth2' },
    { name: 'authorization general swagger2', seed: 'parserAuthorizationInitialGeneral.json', method: 'POST', path: '/apple', expected: 'BasicAuth' },
    { name: 'authorization general openapi3.0', seed: 'parserAuthorizationInitialOpenApi3.json', method: 'POST', path: '/pets', expected: 'ApiKeyAuth' },
    { name: 'authorization endpoint openapi3.0', seed: 'parserAuthorizationInitialOpenApi3.json', method: 'GET', path: '/pets', expected: 'OAuth2' },
    { name: 'authorization general openapi3.1', seed: 'parserAuthorizationInitialOpenApi3.1.json', method: 'POST', path: '/pets', expected: 'ApiKeyAuth' },
    { name: 'authorization endpoint openapi3.1', seed: 'parserAuthorizationInitialOpenApi3.1.json', method: 'GET', path: '/pets', expected: 'OAuth2' }
  ];

  testCases.forEach(({ name, seed, method, path, expected }) => {
    it(name, () => {
      globalThis.definition = require(`../seeds/${seed}`);
      const authorization = getAuthorization(method, path);
      assert.deepStrictEqual(authorization, expected);
    });
  });

});