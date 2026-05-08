/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('node:assert');

const openapi3Cases = [
  { version: '3.0', seed: '../seeds/parserInitialGoodOpenApi3.json', host: 'https://petstore.swagger.io',  basePath: '/v1' },
  { version: '3.1', seed: '../seeds/parserInitialGoodOpenApi3.1.json', host: 'https://petstore.swagger.io', basePath: '/v1' },
  { version: '3.2', seed: '../seeds/parserInitialGoodOpenApi3.2.json', host: 'https://petstore.swagger.io', basePath: '/v1' },
];

describe('parser-schemaHostBasePath', () => {

  it('good swagger2', () => {
    globalThis.definition = require('../seeds/parserSchemaHostBasePathInitialGood.json');
    const schemaHostBasePath = require('../src/parser/swagger2/schemaHostBasePath.js')();
    assert.deepStrictEqual(schemaHostBasePath, { host: 'https://myserver.com', basePath: '/first/second' });
  });

  openapi3Cases.forEach(({ version, seed, host, basePath }) => {
    it(`good openapi${version}`, () => {
      globalThis.definition = require(seed);
      const schemaHostBasePath = require('../src/parser/openapi3/schemaHostBasePath.js')();
      assert.deepStrictEqual(schemaHostBasePath, { host, basePath });
    });
  });
});