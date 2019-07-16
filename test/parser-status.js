const assert = require('assert');

describe('parser-status', () => {
  
  it('good', () => {

    global.definition = require('../seeds/parserInitialGood.json');

    const status = require('../src/parser/status.js')('DELETE','/pets/{id}');
    assert.deepStrictEqual(status, [ '204', '500' ]);
  });

});