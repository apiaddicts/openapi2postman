const assert = require('assert');

describe('parser-queryParams', () => {
  
  it('fill', () => {

    global.definition = require('../seeds/parserQueryParamsGood.json');

    const queryParams = require('../src/parser/queryParams.js')('GET','/pets');
    assert.deepStrictEqual(queryParams, [ 'tags', 'limit' ]);
  });

  it('void', () => {

    global.definition = require('../seeds/parserQueryParamsGood.json');

    const queryParams = require('../src/parser/queryParams.js')('POST','/pets');
    assert.deepStrictEqual(queryParams, []);
  });

});