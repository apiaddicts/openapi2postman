/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('node:assert');

describe('generator-envVariables', () => {

  let savedConfig;
  let savedEnvVars;

  beforeEach(() => {
    savedConfig = globalThis.configurationFile;
    savedEnvVars = globalThis.environmentVariables;
    globalThis.environmentVariables = {};
  });

  afterEach(() => {
    globalThis.configurationFile = savedConfig;
    globalThis.environmentVariables = savedEnvVars;
  });

  it('204 no body schema is inline false', () => {
    globalThis.configurationFile = { schema_is_inline: false, schema_pretty_print: false, is_inline: false };

    const collection = [
      {
        name: 'pets',
        item: [
          {
            name: 'pets',
            item: [
              {
                name: '/pets/{id}-204',
                aux: {
                  numerateItem: '1',
                  status: '204',
                  bodyResponse: {
                    '500': {
                      type: 'object',
                      required: ['code', 'message'],
                      properties: {
                        code: { type: 'integer', format: 'int32' },
                        message: { type: 'string' }
                      }
                    }
                  },
                  queryParams: []
                },
                request: {
                  method: 'DELETE',
                  header: [],
                  body: { mode: 'raw', raw: '' },
                  url: {
                    raw: '{{host}}{{port}}{{basePath}}/pets/1',
                    host: ['{{host}}{{port}}{{basePath}}'],
                    path: ['/pets/1']
                  }
                },
                event: [
                  {
                    listen: 'test',
                    script: {
                      id: 'test-204-uuid',
                      type: 'text/javascript',
                      exec: [
                        'pm.test("Status code is 204", function () {',
                        '    pm.response.to.have.status(204);',
                        '});'
                      ]
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ];

    const items = require('../src/generator/environmentVariablesNames.js')(collection);
    const schemaTestItem = items.find(item => item.key?.includes('schemaTest'));
    assert.strictEqual(schemaTestItem, undefined, 'No schemaTest env variable should be created for 204 No Content');
  });

});
