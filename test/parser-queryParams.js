const assert = require('assert');

describe('parser-queryParams', () => {
  
  it('fill swagger2', () => {

    global.definition = require('../seeds/parserQueryParamsGood.json');

    const queryParams = require('../src/parser/swagger2/queryParams.js')('GET','/pets');
    assert.deepStrictEqual(queryParams, [{
            "name": "tags",
            "prefix": "",
            "required": false,
            "type": "array"
         },
         {
            "name": "limit",
            "prefix": "",
            "required": false,
            "type": "integer"
         } ]);
  });

  it('void swagger2', () => {

    global.definition = require('../seeds/parserQueryParamsGood.json');

    const queryParams = require('../src/parser/swagger2/queryParams.js')('POST','/pets');
    assert.deepStrictEqual(queryParams, []);
  });

});