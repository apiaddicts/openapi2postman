/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('assert');

describe('parser-schemaHostBasePath', () => {
  
  it('good swagger2', () => {

    global.definition = require('../seeds/parserSchemaHostBasePathInitialGood.json');

    const schemaHostBasePath = require('../src/parser/swagger2/schemaHostBasePath.js')();
    assert.deepStrictEqual(schemaHostBasePath, { host: 'https://myserver.com', basePath: '/first/second' });
  })

  it('good openapi3', () => {

    global.definition = require('../seeds/parserInitialGoodOpenApi3.json');

    const schemaHostBasePath = require('../src/parser/openapi3/schemaHostBasePath.js')();
    assert.deepStrictEqual(schemaHostBasePath, { host: 'http://petstore.swagger.io', basePath: '/v1' });
  })
});