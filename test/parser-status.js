const assert = require('assert');

describe('parser-status', () => {
  
  it('good', () => {

    const definition = require('../seeds/parserInitialGood.json');

    const status = require('../src/parser/status.js')(definition,'DELETE','/pets/{id}');
    assert.deepStrictEqual(status, [ '204', '500' ]);
  });

});