const assert = require('assert');

describe('parser-responses', () => {
  
  it('good', () => {

    const definition = require('../seeds/parserResponsesInitialGood.json');

    const responses = require('../src/parser/responses.js')(definition,'DELETE','/pets/{id}');
    assert.deepStrictEqual(responses, [ '204', '500' ]);
  });

});