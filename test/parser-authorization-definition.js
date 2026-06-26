/** Part of APIAddicts. See LICENSE file or full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('node:assert');
const get = require('../src/parser/openapi3/authorizationDefinition.js');

describe('parser-authorization-definition', () => {

  it('null apiKey only oa3', () => {
    globalThis.definition = { security: [{ ApiKeyAuth: [] }] };
    const result = get({ ApiKeyAuth: { type: 'apiKey', in: 'header', name: 'X-API-Key' } });
    assert.strictEqual(result, null);
  });

  it('null http only oa3', () => {
    globalThis.definition = { security: [{ BasicAuth: [] }] };
    const result = get({ BasicAuth: { type: 'http', scheme: 'basic' } });
    assert.strictEqual(result, null);
  });

  it('null empty schemes oa3', () => {
    globalThis.definition = { security: [] };
    const result = get({});
    assert.strictEqual(result, null);
  });

  it('oauth2 definition apiKey first oa3', () => {
    globalThis.definition = { security: [{ OAuth2: ['read'] }] };
    const result = get({
      ApiKeyAuth: { type: 'apiKey', in: 'header', name: 'X-API-Key' },
      OAuth2: {
        type: 'oauth2',
        flows: {
          clientCredentials: { tokenUrl: 'https://auth.example.com/token', scopes: {} }
        }
      }
    });
    assert.ok(result !== null);
    assert.ok(result.item[0].name.includes('OAuth2'));
  });

  it('oauth2 definition oauth2 first oa3', () => {
    globalThis.definition = { security: [{ OAuth2: ['read'] }] };
    const result = get({
      OAuth2: {
        type: 'oauth2',
        flows: {
          clientCredentials: { tokenUrl: 'https://auth.example.com/token', scopes: {} }
        }
      },
      ApiKeyAuth: { type: 'apiKey', in: 'header', name: 'X-API-Key' }
    });
    assert.ok(result !== null);
    assert.ok(result.item[0].name.includes('OAuth2'));
  });

  it('oauth2 definition no global security oa3', () => {
    globalThis.definition = { security: undefined };
    const result = get({
      OAuth2: {
        type: 'oauth2',
        flows: {
          password: { tokenUrl: 'https://auth.example.com/token', scopes: {} }
        }
      }
    });
    assert.ok(result !== null);
    assert.ok(result.item[0].name.includes('OAuth2'));
  });

  it('oauth2 definition only oauth2 oa3', () => {
    globalThis.definition = { security: [{ MyOAuth: [] }] };
    const result = get({
      MyOAuth: {
        type: 'oauth2',
        flows: {
          password: { tokenUrl: 'https://auth.example.com/token', scopes: {} }
        }
      }
    });
    assert.ok(result !== null);
    assert.ok(result.item[0].name.includes('MyOAuth'));
  });

});
