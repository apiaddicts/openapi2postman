const assert = require('assert');

describe('parser-schemaHostBasePath', () => {
  
  it('good', () => {

    global.definition = require('../seeds/parserSchemaHostBasePathInitialGood.json');

    const schemaHostBasePath = require('../src/parser/schemaHostBasePath.js')();
    assert.equal(schemaHostBasePath, 'https://myserver.com/first/second');
  });
});