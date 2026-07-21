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

  it('generates a token request for every oauth2 scheme oa3', () => {
    globalThis.definition = { security: [{ OauthClientCredentials: [] }] };
    const result = get({
      OauthClientCredentials: {
        type: 'oauth2',
        flows: {
          clientCredentials: { tokenUrl: 'https://auth.example.com/token', scopes: {} }
        }
      },
      OauthPassword: {
        type: 'oauth2',
        flows: {
          password: { tokenUrl: 'https://auth.example.com/token', scopes: {} }
        }
      }
    });
    assert.ok(result !== null);
    assert.strictEqual(result.item.length, 2);
    assert.ok(result.item[0].name.includes('OauthClientCredentials'));
    assert.ok(result.item[1].name.includes('OauthPassword'));
    assert.ok(result.item[0].event[0].script.exec.some((line) => line.includes('pm.environment.set("OauthClientCredentials"')));
    assert.ok(result.item[1].event[0].script.exec.some((line) => line.includes('pm.environment.set("OauthPassword"')));
  });

  it('skips oauth2 schemes without a usable tokenUrl but keeps the valid ones oa3', () => {
    globalThis.definition = { security: [{ Valid1: [] }] };
    const result = get({
      NoFlows: { type: 'oauth2' },
      EmptyFlows: { type: 'oauth2', flows: {} },
      ImplicitOnly: {
        type: 'oauth2',
        flows: {
          implicit: { authorizationUrl: 'https://auth.example.com/authorize', scopes: {} }
        }
      },
      Valid1: {
        type: 'oauth2',
        flows: {
          clientCredentials: { tokenUrl: 'https://auth.example.com/token1', scopes: {} }
        }
      },
      Valid2: {
        type: 'oauth2',
        flows: {
          password: { tokenUrl: 'https://auth.example.com/token2', scopes: {} }
        }
      }
    });
    assert.ok(result !== null);
    assert.strictEqual(result.item.length, 2);
    assert.ok(result.item[0].name.includes('Valid1'));
    assert.ok(result.item[1].name.includes('Valid2'));
  });

  it('ignores non-oauth2 schemes mixed among several oauth2 schemes oa3', () => {
    globalThis.definition = { security: [{ SchemeA: [] }] };
    const result = get({
      ApiKeyAuth: { type: 'apiKey', in: 'header', name: 'X-API-Key' },
      SchemeA: {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://auth.example.com/authorize',
            tokenUrl: 'https://auth.example.com/token-a',
            scopes: {}
          }
        }
      },
      BasicAuth: { type: 'http', scheme: 'basic' },
      SchemeB: {
        type: 'oauth2',
        flows: {
          clientCredentials: { tokenUrl: 'https://auth.example.com/token-b', scopes: {} }
        }
      },
      SchemeC: {
        type: 'oauth2',
        flows: {
          password: { tokenUrl: 'https://auth.example.com/token-c', scopes: {} }
        }
      }
    });
    assert.ok(result !== null);
    assert.strictEqual(result.item.length, 3);
    const names = result.item.map((item) => item.name);
    assert.ok(names.some((n) => n.includes('SchemeA')));
    assert.ok(names.some((n) => n.includes('SchemeB')));
    assert.ok(names.some((n) => n.includes('SchemeC')));
    assert.ok(result.item.find((i) => i.name.includes('SchemeA')).request.url.raw === 'https://auth.example.com/token-a');
    assert.ok(result.item.find((i) => i.name.includes('SchemeB')).request.url.raw === 'https://auth.example.com/token-b');
    assert.ok(result.item.find((i) => i.name.includes('SchemeC')).request.url.raw === 'https://auth.example.com/token-c');
  });

  it('returns null when securitySchemes has oauth2-looking entries with no valid tokenUrl at all oa3', () => {
    globalThis.definition = { security: [] };
    const result = get({
      NoFlows: { type: 'oauth2' },
      ImplicitOnly: {
        type: 'oauth2',
        flows: {
          implicit: { authorizationUrl: 'https://auth.example.com/authorize', scopes: {} }
        }
      }
    });
    assert.strictEqual(result, null);
  });

  it('respects FLOW_PRIORITY independently per scheme when a scheme defines multiple flows oa3', () => {
    globalThis.definition = { security: [{ MultiFlow: [] }] };
    const result = get({
      MultiFlow: {
        type: 'oauth2',
        flows: {
          implicit: { authorizationUrl: 'https://auth.example.com/authorize', scopes: {} },
          password: { tokenUrl: 'https://auth.example.com/token-password', scopes: {} },
          clientCredentials: { tokenUrl: 'https://auth.example.com/token-cc', scopes: {} }
        }
      }
    });
    assert.ok(result !== null);
    assert.strictEqual(result.item.length, 1);
    // clientCredentials has priority over password per FLOW_PRIORITY
    assert.strictEqual(result.item[0].request.url.raw, 'https://auth.example.com/token-cc');
  });

});
