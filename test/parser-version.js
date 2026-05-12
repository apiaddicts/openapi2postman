/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/

const assert = require('node:assert')

const openapi3Cases = [
  { name: 'openapi3.0', seed: '../seeds/parserInitialGoodOpenApi3.json'     },
  { name: 'openapi version 3.0.2', seed: '../seeds/parserInitialGoodOpenApi3.0.2.json' },
  { name: 'openapi version 3.0.3', seed: '../seeds/parserInitialGoodOpenApi3.0.3.json' },
  { name: 'openapi3.1', seed: '../seeds/parserInitialGoodOpenApi3.1.json'   },
  { name: 'openapi version 3.1.1', seed: '../seeds/parserInitialGoodOpenApi3.1.1.json' },
  { name: 'openapi version 3.1.2', seed: '../seeds/parserInitialGoodOpenApi3.1.2.json' },
  { name: 'openapi3.2', seed: '../seeds/parserInitialGoodOpenApi3.2.json'   },
  { name: 'openapi version 3.2.0', seed: '../seeds/parserInitialGoodOpenApi3.2.0.json' },
];

describe('parser-version', () => {

  it('swagger2', () => {
    globalThis.definition = require('../seeds/parserInitialGood.json');
    const version = require('../src/parser/version.js')();
    assert.equal(version, 'swagger2');
  });

  openapi3Cases.forEach(({ name, seed }) => {
    it(name, () => {
      globalThis.definition = require(seed);
      const version = require('../src/parser/version.js')();
      assert.equal(version, 'openapi3');
    });
  });
});